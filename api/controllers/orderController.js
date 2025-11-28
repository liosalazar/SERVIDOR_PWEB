// api/controllers/orderController.js
import pool from '../db.js';

// @desc    Obtener todas las órdenes del usuario autenticado
// @route   GET /api/users/orders
// @access  Private (Requiere token)
const getUserOrders = async (req, res) => {
    // El ID del usuario se obtiene de req.user, que fue adjuntado por verifyToken
    const userId = req.user.id; 

    try {
        // Consulta SQL: Obtener órdenes y agrupar los ítems de cada orden en un JSON
        const query = `
            SELECT 
                o.id, 
                o.fecha_creacion AS fecha, 
                o.total_orden AS total, 
                o.estado,
                o.direccion_envio AS direccion, 
                json_agg(
                    json_build_object(
                        'producto_id', io.producto_id,
                        'nombre', p.nombre,
                        'precio', io.precio_unitario,
                        'cantidad', io.cantidad
                    )
                ) AS productos
            FROM 
                ordenes o
            JOIN 
                items_orden io ON o.id = io.orden_id
            JOIN 
                productos p ON io.producto_id = p.id
            WHERE 
                o.usuario_id = $1
            GROUP BY 
                o.id, o.fecha_creacion, o.total_orden, o.estado, o.direccion_envio
            ORDER BY 
                o.fecha_creacion DESC;
        `;
        
        const result = await pool.query(query, [userId]);

        // Si no hay órdenes, devuelve un array vacío (200 OK)
        res.status(200).json(result.rows); 

    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ message: 'Error del servidor al obtener las órdenes.' });
    }
};

// @desc    Obtener una orden específica por ID
// @route   GET /api/users/orders/:id
// @access  Private (Requiere token)
const getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    try {
        // Usamos la misma consulta, pero filtramos por ID de orden
        const query = `
            SELECT 
                o.id, 
                o.fecha_creacion AS fecha, 
                o.total_orden AS total, 
                o.estado,
                o.direccion_envio AS direccion, 
                json_agg(
                    json_build_object(
                        'producto_id', io.producto_id,
                        'nombre', p.nombre,
                        'precio', io.precio_unitario,
                        'cantidad', io.cantidad
                    )
                ) AS productos
            FROM 
                ordenes o
            JOIN 
                items_orden io ON o.id = io.orden_id
            JOIN 
                productos p ON io.producto_id = p.id
            WHERE 
                o.id = $1 AND o.usuario_id = $2
            GROUP BY 
                o.id, o.fecha_creacion, o.total_orden, o.estado, o.direccion_envio;
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

export { getUserOrders, getOrderById };