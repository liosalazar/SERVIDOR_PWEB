import pool from '../db.js';

// --- FUNCIONES EXISTENTES (SIN CAMBIOS EN LA LÓGICA DE UNIÓN) ---

const getUserOrders = async (req, res) => {
    const userId = req.user.id; 
    if (!userId) {
        // Si sigue siendo nulo, el problema es el middleware
        return res.status(401).json({ message: 'Error de autenticación: Usuario no encontrado.' });
    }
    try {
        const query = `
            SELECT 
                o.id, 
                o.fecha_orden AS fecha, 
                o.total AS total, 
                o.estado,
                o.direccion_envio AS direccion, 
                o.metodo_pago AS "metodoPago",
                json_agg(
                    json_build_object(
                        'producto_id', io."productId",
                        'nombre', io.nombre_producto,  -- Aquí obtenemos el nombre directamente de order_details
                        'precio', io.precio_unitario,
                        'cantidad', io.cantidad
                    )
                ) AS productos
            FROM 
                orders o
            JOIN 
                order_details io ON o.id = io."orderId"
            WHERE 
                "userId" = $1
            GROUP BY 
                o.id, o.fecha_orden, o.total, o.estado, o.direccion_envio, o.metodo_pago
            ORDER BY 
                o.fecha_orden DESC;
        `;
        
        const result = await pool.query(query, [userId]);
        res.status(200).json(result.rows); 

    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ message: 'Error del servidor al obtener las órdenes.' });
    }
};

const getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    try {
        const query = `
            SELECT 
                o.id, 
                o.fecha_orden AS fecha, 
                o.total AS total, 
                o.estado,
                o.direccion_envio AS direccion, 
                o.metodo_pago AS "metodoPago",
                json_agg(
                    json_build_object(
                        'producto_id', io."productId",
                        'nombre', io.nombre_producto,  -- Obtener desde order_details
                        'precio', io.precio_unitario,
                        'cantidad', io.cantidad
                    )
                ) AS productos
            FROM 
                orders o
            JOIN 
                order_details io ON o.id = io."orderId"
            WHERE 
                o.id = $1 AND o."userId" = $2
            GROUP BY 
                o.id, o.fecha_orden, o.total, o.estado, o.direccion_envio, o.metodo_pago;
        `;
        const result = await pool.query(query, [orderId, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Orden no encontrada o no pertenece a este usuario.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el detalle de la orden:', error);
        res.status(500).json({ message: 'Error del servidor al obtener el detalle de la orden.' });
    }
};

// --- FUNCIÓN CORREGIDA ---

const createOrder = async (req, res) => {
    const userId = req.user.id; 
    const { total, items, direccionEnvio, metodoPago } = req.body;

    if (!items || items.length === 0 || !total) {
        return res.status(400).json({ message: 'La orden debe contener productos y el total debe ser especificado.' });
    }
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const orderQuery = `
            INSERT INTO orders ("userId", total, estado, direccion_envio, metodo_pago)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, total;
        `;
        const orderResult = await client.query(orderQuery, [
            userId, 
            total, 
            'Pendiente', 
            direccionEnvio || 'No especificada',
            metodoPago || 'Tarjeta'
        ]);

        const orderId = orderResult.rows[0].id;
        const itemValues = [];
        
        // CORRECCIÓN CLAVE: 5 VALORES por ITEM: orderId, productId, quantity, price, nombre_producto
        items.forEach(item => {
            itemValues.push(orderId, item.id, item.quantity, item.price, item.name); // Asumimos item.name
        });

        const placeholderString = items.map((_, i) => 
            `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})` // 5 placeholders
        ).join(', ');
        
        const itemInsertQuery = `
            INSERT INTO order_details ("orderId", "productId", cantidad, precio_unitario, nombre_producto)
            VALUES ${placeholderString}
        `;
        
        await client.query(itemInsertQuery, itemValues);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Orden creada exitosamente',
            orderId: orderId,
            total: orderResult.rows[0].total,
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear la orden y sus items:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la orden.' });
    } finally {
        client.release();
    }
};

export { 
    getUserOrders, 
    getOrderById, 
    createOrder 
};
