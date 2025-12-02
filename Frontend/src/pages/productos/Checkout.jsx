import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import styles from "./Checkout.module.css";

// Obtener la URL base del entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Checkout() {
  const { token } = useAuth(); 
  const [carrito, setCarrito] = useState([]);
  // Estados para el formulario (mantienen la simulación de ingreso)
  const [nombre, setNombre] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [fecha, setFecha] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  // Cargar carrito desde localStorage y verificar autenticación
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const datos = JSON.parse(localStorage.getItem("cart")) || [];
    setCarrito(datos);
  }, [token, navigate]);

  const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceder = async () => {
    setError("");

    // 1. Validaciones
    if (carrito.length === 0) {
      setError("No hay productos en el carrito.");
      return;
    }
    // ... (Otras validaciones de tarjeta correctas) ...
    if (!nombre || !tarjeta || !cvv || !fecha) {
      setError("Completa todos los campos de la tarjeta.");
      return;
    }
    if (!/^\d{16}$/.test(tarjeta.replace(/\s+/g, ""))) {
      setError("Número de tarjeta inválido (16 dígitos).");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setError("CVV inválido (3 dígitos).");
      return;
    }

    setLoading(true);

    // 2. Crear objeto de orden (Payload CORREGIDO)
    const orderPayload = {
      total: total,
      items: carrito.map(item => ({
        productId: parseInt(item.id, 10),       
        nombre_producto: item.name,    
        cantidad: parseInt(item.quantity, 10),    
        precio_unitario: parseFloat(item.price),   
    })),
      direccionEnvio: "Av. Ejemplo 123", 
      metodoPago: "Tarjeta de Crédito (Simulado)",
    };

    try {
      // 3. Enviar la orden al Backend (POST /orders)
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🎯 Enviar el token
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar la orden.");
      }
      
      // 4. Éxito: Limpiar carrito local y redirigir
      localStorage.removeItem("cart");

      // La ruta de confirmación puede necesitar el ID de la orden
      navigate(`/pedido-completo/${data.orderId || data.id}`); 

    } catch (err) {
      console.error("Error en el checkout:", err);
      setError(err.message || "Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return <p style={{ padding: "20px" }}>No hay productos para procesar</p>;
  }

  return (
    <div className={styles.checkoutContainer}>
      <h2>Checkout</h2>

      <div className={styles.cartItems}>
        {/* Mapeo del carrito */}
        {carrito.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <span>{item.name}</span>
            <span>{item.quantity} × S/ {item.price.toFixed(2)}</span>
            <span>Subtotal: S/ {(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <h3>Total: S/ {total.toFixed(2)}</h3>

      <h3>Datos de pago (Simulación)</h3> 
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.cardForm}>
        {/* Campos de tarjeta */}
        <input type="text" placeholder="Nombre del titular" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="text" placeholder="Número de tarjeta (16 dígitos)" value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} />
        <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
        <input type="text" placeholder="MM/AA" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      <button className={styles.procederButton} onClick={handleProceder} disabled={loading}>
        {loading ? 'Procesando Pago...' : 'Proceder al Pago'}
      </button>
    </div>
  );
}

export default Checkout;