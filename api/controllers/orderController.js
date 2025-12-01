// api/controllers/orderController.js
import pool from '../db.js';

// @desc    Obtener todas las órdenes del usuario autenticado
// @route   GET /api/orders
// @access  Private (Requiere token)
const getUserOrders = async (req, res) => {
    // El ID del usuario se obtiene de req.user, que fue adjuntado por verifyToken (middleware)
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
                ordenes o
            JOIN 
                items_orden io ON o.id = io.orden_id
            JOIN 
                productos p ON io.producto_id = p.id
            WHERE 
                o.usuario_id = $1
            GROUP BY 
                o.id, o.fecha_creacion, o.total_orden, o.estado, o.direccion_envio, o.metodo_pago
            ORDER BY 
                o.fecha_creacion DESC;
        `;
        
        const result = await pool.query(query, [userId]);

        res.status(200).json(result.rows); 

    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ message: 'Error del servidor al obtener las órdenes.' });
    }
};

// @desc    Obtener una orden específica por ID
// @route   GET /api/orders/:id
// @access  Private (Requiere token)
const getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;

    try {
        const query = `
            SELECT 
                o.id, 
                o.fecha_creacion AS fecha, 
                o.total_orden AS total, 
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
                ordenes o
            JOIN 
                items_orden io ON o.id = io.orden_id
            JOIN 
                productos p ON io.producto_id = p.id
            WHERE 
                o.id = $1 AND o.usuario_id = $2
            GROUP BY 
                o.id, o.fecha_creacion, o.total_orden, o.estado, o.direccion_envio, o.metodo_pago;
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

// --- FUNCIÓN DE CREACIÓN DE ÓRDENES ---

// @desc    Crear una nueva orden
// @route   POST /api/orders
// @access  Private (Requiere token)
const createOrder = async (req, res) => {
    const userId = req.user.id; 
    
    // Datos recibidos desde el Frontend (Checkout.jsx)
    const { total, items, direccionEnvio, metodoPago } = req.body;

    // 1. Validaciones
    if (!items || items.length === 0 || !total) {
        return res.status(400).json({ message: 'La orden debe contener productos y el total debe ser especificado.' });
    }
    
    // 2. Usar una transacción para asegurar que la orden y sus ítems se guarden correctamente
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // 🎯 Iniciar la transacción

        // 2a. Crear la ORDEN principal
        const orderQuery = `
            INSERT INTO ordenes (usuario_id, total_orden, estado, direccion_envio, metodo_pago)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, total_orden;
        `;
        const orderResult = await client.query(orderQuery, [
            userId, 
            total, 
            'Pendiente', 
            direccionEnvio || 'No especificada', // Usar valor por defecto si no viene
            metodoPago || 'Tarjeta'
        ]);

        const orderId = orderResult.rows[0].id;

        // 2b. Preparar la inserción de ITEMS_ORDEN
        // Crear un array plano con todos los valores (orden_id, producto_id, cantidad, precio_unitario)
        const itemValues = [];
        items.forEach(item => {
            itemValues.push(orderId, item.productoId, item.cantidad, item.precioUnitario);
        });

        // Crear la cadena de placeholders dinámicamente: ($1, $2, $3, $4), ($5, $6, $7, $8), ...
        const placeholderString = items.map((_, i) => 
            `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
        ).join(', ');
        
        // La consulta de inserción masiva
        const itemInsertQuery = `
            INSERT INTO items_orden (orden_id, producto_id, cantidad, precio_unitario)
            VALUES ${placeholderString}
        `;
        
        await client.query(itemInsertQuery, itemValues); // Ejecutar la inserción

        await client.query('COMMIT'); // 🎯 Finalizar la transacción (éxito)

        res.status(201).json({
            message: 'Orden creada exitosamente',
            orderId: orderId, // Devolver el ID de la nueva orden
            total: orderResult.rows[0].total_orden,
        });

    } catch (error) {
        await client.query('ROLLBACK'); // 🎯 Deshacer si hubo error
        console.error('Error al crear la orden y sus items:', error);
        res.status(500).json({ message: 'Error interno del servidor al procesar la orden.' });
    } finally {
        client.release(); // Liberar el cliente de la pool
    }
};

// 🎯 Exportar todas las funciones, incluida la nueva
export { 
    getUserOrders, 
    getOrderById, 
    createOrder 
};