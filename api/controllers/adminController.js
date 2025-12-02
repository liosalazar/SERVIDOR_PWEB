import { Pool } from 'pg'; 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


const getAdminUsers = async (req, res) => {
        const { page = 1, size = 10, filter = '', status = 'all' } = req.query;
        const offset = (page - 1) * size;
        let whereClause = '';
        const params = [size, offset];
        
        if (filter) {
                params.push(`%${filter}%`);
                whereClause += ` WHERE (nombre ILIKE $${params.length} OR correo ILIKE $${params.length})`;
        }
        
        if (status !== 'all') {
                const statusValue = status === 'active';
                whereClause += whereClause ? ` AND activo = $${params.length + 1}` : ` WHERE activo = $${params.length + 1}`;
                params.push(statusValue);
        }
        
        try {
                const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
                const countResult = await pool.query(countQuery, params.slice(2));
                const totalItems = parseInt(countResult.rows[0].count, 10);

                const dataQuery = `
                        SELECT id, nombre, apellido, correo, rol, activo 
                        FROM users 
                        ${whereClause} 
                        ORDER BY id DESC 
                        LIMIT $1 OFFSET $2`;
                
                const dataResult = await pool.query(dataQuery, params);

                res.status(200).json({
                        users: dataResult.rows,
                        totalItems,
                        totalPages: Math.ceil(totalItems / size),
                        currentPage: parseInt(page, 10),
                });
        } catch (err) {
                console.error("Error al obtener usuarios admin:", err);
                res.status(500).json({ message: 'Error al obtener la lista de usuarios' });
        }
};

const toggleUserStatus = async (req, res) => {
        const { id } = req.params;
        const { activo } = req.body; 

        if (typeof activo !== 'boolean') {
                return res.status(400).json({ message: 'El estado debe ser un valor booleano.' });
        }

        try {
                const result = await pool.query(
                        'UPDATE users SET activo = $1 WHERE id = $2 RETURNING id, activo',
                        [activo, id]
                );

                if (result.rows.length === 0) {
                        return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                res.status(200).json({ message: 'Estado del usuario actualizado', user: result.rows[0] });
        } catch (err) {
                console.error("Error al actualizar estado del usuario:", err);
                res.status(500).json({ message: 'Error al actualizar el estado' });
        }
};

const getAdminUserDetail = async (req, res) => {
        const { id } = req.params;

        try {
                const userResult = await pool.query(
                        'SELECT id, nombre, apellido, correo, rol, activo, pais, celular, imagen_url FROM users WHERE id = $1', 
                        [id]
                );
                if (userResult.rows.length === 0) {
                        return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                const user = userResult.rows[0];

                const ordersResult = await pool.query(
                        `SELECT id, fecha_orden, total, estado 
                         FROM orders 
                         WHERE "userId" = $1 
                         ORDER BY fecha_orden DESC 
                         LIMIT 10`, 
                        [id]
                );
                
                res.status(200).json({
                        ...user,
                        orders: ordersResult.rows,
                });
        } catch (err) {
                console.error("Error al obtener detalle del usuario admin:", err);
                res.status(500).json({ message: 'Error al obtener el detalle del usuario' });
        }
};

const getAdminOrders = async (req, res) => {
        const { page = 1, size = 10, filter = '' } = req.query;
        const offset = (page - 1) * size;
        
        let whereClause = '';
        const params = [size, offset];
        
        if (filter) {
                params.push(`%${filter}%`);
                whereClause += ` 
                        WHERE (o.id::text ILIKE $${params.length} 
                        OR u.nombre ILIKE $${params.length} 
                        OR u.apellido ILIKE $${params.length})`;
        }

        try {
                const countQuery = `SELECT COUNT(o.id) FROM orders o JOIN users u ON o."userId" = u.id ${whereClause}`;
                const countResult = await pool.query(countQuery, params.slice(2)); 
                const totalItems = parseInt(countResult.rows[0].count, 10);

                const dataQuery = `
                        SELECT 
                                o.id, 
                                o.fecha_orden, 
                                o.total, 
                                o.estado,
                                u.nombre as user_nombre,
                                u.apellido as user_apellido,
                                u.correo as user_correo
                        FROM orders o
                        JOIN users u ON o."userId" = u.id
                        ${whereClause} 
                        ORDER BY o.fecha_orden DESC 
                        LIMIT $1 OFFSET $2`;
                
                const dataResult = await pool.query(dataQuery, params);

                res.status(200).json({
                        orders: dataResult.rows,
                        totalItems,
                        totalPages: Math.ceil(totalItems / size),
                        currentPage: parseInt(page, 10),
                });
        } catch (err) {
                console.error("Error al obtener órdenes admin:", err);
                res.status(500).json({ message: 'Error al obtener la lista de órdenes' });
        }
};

const getAdminOrderDetail = async (req, res) => {
        const { id } = req.params;

        try {
                const orderResult = await pool.query(
                        `SELECT 
                                o.id, o.fecha_orden, o.total, o.estado, o.direccion_envio, o.metodo_pago,
                                u.nombre as user_nombre, u.apellido as user_apellido, u.correo as user_correo
                        FROM orders o
                        JOIN users u ON o."userId" = u.id
                        WHERE o.id = $1`, 
                        [id]
                );
                if (orderResult.rows.length === 0) {
                        return res.status(404).json({ message: 'Orden no encontrada' });
                }
                const order = orderResult.rows[0];

                const itemsResult = await pool.query(
                        'SELECT nombre_producto, precio_unitario, cantidad, "productId" FROM order_details WHERE "orderId" = $1', 
                        [id]
                );
                
                res.status(200).json({
                        ...order,
                        items: itemsResult.rows,
                });
        } catch (err) {
                console.error("Error al obtener detalle de la orden admin:", err);
                res.status(500).json({ message: 'Error al obtener el detalle de la orden' });
        }
};

const cancelOrder = async (req, res) => {
        const { id } = req.params;

        try {
                const result = await pool.query(
                        'UPDATE orders SET estado = $1 WHERE id = $2 AND estado != $1 RETURNING id, estado',
                        ['Cancelada', id]
                );

                if (result.rows.length === 0) {
                        const checkOrder = await pool.query('SELECT estado FROM orders WHERE id = $1', [id]);
                        if (checkOrder.rows.length === 0) {
                                return res.status(404).json({ message: 'Orden no encontrada' });
                        }
                        if (checkOrder.rows[0].estado === 'Cancelada') {
                                 return res.status(409).json({ message: 'La orden ya está cancelada' });
                        }
                        if (checkOrder.rows[0].estado === 'Completada') {
                                 return res.status(409).json({ message: 'No se puede cancelar una orden completada' });
                        }
                }
                
                res.status(200).json({ message: 'Orden cancelada correctamente', order: result.rows[0] });
        } catch (err) {
                console.error("Error al cancelar la orden:", err);
                res.status(500).json({ message: 'Error al cancelar la orden' });
        }
};

export default { 
        getAdminUsers, 
        toggleUserStatus,
        getAdminUserDetail,
        getAdminOrders,
        getAdminOrderDetail,
        cancelOrder 
};
