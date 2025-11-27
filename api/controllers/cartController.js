const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


const createOrder = async (req, res) => {
    const { cartItems, total, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId; // Obtenido del JWT por el middleware

    if (!cartItems || cartItems.length === 0 || !total || !shippingAddress || !paymentMethod) {
        return res.status(400).json({ message: 'Datos de la orden incompletos.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Iniciar transacción

     
        const orderQuery = `
            INSERT INTO orders ("userId", total, direccion_envio, metodo_pago, estado)
            VALUES ($1, $2, $3, $4, 'Pendiente') 
            RETURNING id, fecha_orden, total, estado
        `;
        const orderResult = await client.query(orderQuery, [userId, total, shippingAddress, paymentMethod]);
        const newOrder = orderResult.rows[0];

        const detailQueries = cartItems.map(item => {
            return client.query(
                `INSERT INTO order_details ("orderId", "productId", nombre_producto, precio_unitario, cantidad)
                 VALUES ($1, $2, $3, $4, $5)`,
                [newOrder.id, item.id, item.name, item.price, item.quantity]
            );
        });
        
        await Promise.all(detailQueries);

        await client.query('COMMIT'); // Confirmar transacción

       
        res.status(201).json({ 
            message: 'Orden creada con éxito', 
            orderId: newOrder.id,
            order: newOrder
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Revertir si hay error
        console.error('Error al crear la orden:', error);
        res.status(500).json({ message: 'Error en el servidor al procesar la orden' });
    } finally {
        client.release();
    }
};

module.exports = { createOrder };