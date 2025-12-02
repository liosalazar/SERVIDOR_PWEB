import pool from '../db.js';

const getUserOrders = async (req, res) => {
    const userId = req.user.id; 
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
                        'producto_id', io.producto_id,
                        'nombre', p.nombre,
                        'precio', io.precio_unitario,
                        'cantidad', io.cantidad
                    )
                ) AS productos
            FROM 
                orders o
            JOIN 
                items_orden io ON o.id = io.orden_id
            JOIN 
                productos p ON io.producto_id = p.id
             
                WHERE "userId" = $1
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
                        'producto_id', io.producto_id,
                        'nombre', p.nombre,
                        'precio', io.precio_unitario,
                        'cantidad', io.cantidad
                    )
                ) AS productos
            FROM 
                orders o
            JOIN 
                items_orden io ON o.id = io.orden_id
            JOIN 
                productos p ON io.producto_id = p.id
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
        items.forEach(item => {
            itemValues.push(orderId, item.productoId, item.cantidad, item.precioUnitario);
        });

        const placeholderString = items.map((_, i) => 
            `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
        ).join(', ');
        
        const itemInsertQuery = `
            INSERT INTO items_orden (orden_id, producto_id, cantidad, precio_unitario)
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
