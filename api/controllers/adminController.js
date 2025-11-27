// api/controllers/adminController.js

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- FUNCIONALIDADES DE USUARIO (ALUMNO 5) ---

// 15. Obtener Lista de Usuarios (Con Filtro y Paginación)
const getAdminUsers = async (req, res) => {
    // Implementación de Paginación y Filtrado en SQL
    const { page = 1, size = 10, filter = '', status = 'all' } = req.query;
    const offset = (page - 1) * size;
    let whereClause = '';
    const params = [size, offset];
    
    // Filtrado por Nombre/Email
    if (filter) {
        params.push(`%${filter}%`);
        whereClause += ` WHERE (nombre ILIKE $${params.length} OR correo ILIKE $${params.length})`;
    }
    
    // Filtrado por estado (activo)
    if (status !== 'all') {
        const statusValue = status === 'active';
        whereClause += whereClause ? ` AND activo = $${params.length + 1}` : ` WHERE activo = $${params.length + 1}`;
        params.push(statusValue);
    }
    
    try {
        // Consulta para obtener el total de registros (para la paginación)
        const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
        const countResult = await pool.query(countQuery, params.slice(2)); // No incluir size y offset en el count
        const totalItems = parseInt(countResult.rows[0].count, 10);

        // Consulta para obtener los usuarios paginados y filtrados
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

// 15. Activar/Desactivar Usuario
const toggleUserStatus = async (req, res) => {
    const { id } = req.params;
    const { activo } = req.body; // El cliente enviará { activo: true/false }

    // Validación básica de tipo de dato
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

// 16. Detalle del Usuario y sus Órdenes Recientes
const getAdminUserDetail = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Obtener datos del usuario
        const userResult = await pool.query(
            'SELECT id, nombre, apellido, correo, rol, activo, pais, celular, imagen_url FROM users WHERE id = $1', 
            [id]
        );
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const user = userResult.rows[0];

        // 2. Obtener las últimas 10 órdenes del usuario (Punto 16)
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

// --- FUNCIONALIDADES DE ORDEN (ALUMNO 5) ---

// 20. Obtener Lista de Órdenes (Con Filtro y Paginación)
const getAdminOrders = async (req, res) => {
    // Implementación de Paginación y Filtrado
    const { page = 1, size = 10, filter = '' } = req.query;
    const offset = (page - 1) * size;
    
    // Aquí implementamos el filtro por Nombre/Apellido o ID de Orden (Punto 20)
    // Esto requiere un JOIN a la tabla de usuarios
    let whereClause = '';
    const params = [size, offset];
    
    if (filter) {
        params.push(`%${filter}%`);
        // Intentar filtrar por ID de orden (si es un número) o por nombre/apellido de usuario
        whereClause += ` 
            WHERE (o.id::text ILIKE $${params.length} 
            OR u.nombre ILIKE $${params.length} 
            OR u.apellido ILIKE $${params.length})`;
    }

    try {
        // Consulta para obtener el total de registros
        const countQuery = `SELECT COUNT(o.id) FROM orders o JOIN users u ON o."userId" = u.id ${whereClause}`;
        const countResult = await pool.query(countQuery, params.slice(2)); 
        const totalItems = parseInt(countResult.rows[0].count, 10);

        // Consulta para obtener las órdenes paginadas
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

// 21. Detalle de la Orden
const getAdminOrderDetail = async (req, res) => {
    const { id } = req.params;

    try {
        // 1. Obtener detalles de la orden (incluyendo datos del usuario)
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

        // 2. Obtener los productos de la orden
        const itemsResult = await pool.query(
            'SELECT nombre_producto, precio_unitario, cantidad FROM order_details WHERE "orderId" = $1', 
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

// 21. Cancelar Orden
const cancelOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'UPDATE orders SET estado = $1 WHERE id = $2 AND estado != $1 RETURNING id, estado',
            ['Cancelada', id]
        );

        if (result.rows.length === 0) {
            // Podría ser 404 o 409 (Conflicto si ya estaba cancelada/completada)
            const checkOrder = await pool.query('SELECT estado FROM orders WHERE id = $1', [id]);
            if (checkOrder.rows.length === 0) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }
            if (checkOrder.rows[0].estado === 'Cancelada') {
                 return res.status(409).json({ message: 'La orden ya está cancelada' });
            }
            // Si el estado es Completada, no la actualizamos y devolvemos 409.
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

module.exports = { 
    getAdminUsers, 
    toggleUserStatus,
    getAdminUserDetail,
    getAdminOrders,
    getAdminOrderDetail,
    cancelOrder 
};