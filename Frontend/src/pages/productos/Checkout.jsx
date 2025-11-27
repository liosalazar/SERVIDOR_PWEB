import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";

function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [nombre, setNombre] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar carrito desde localStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("cart")) || [];
    setCarrito(datos);
  }, []);

  const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceder = () => {
    // Validaciones
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

    setError("");

    if (carrito.length === 0) {
      setError("No hay productos en el carrito.");
      return;
    }

    // Crear nueva orden
    const nuevaOrden = {
      id: Date.now(), // ID único
      fecha: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      total: total,
      estado: "Pendiente", // <- importante para DetalleOrden
      items: carrito,       // <- debe coincidir con DetalleOrden
      direccion: "Av. Ejemplo 123", 
      metodoPago: "Tarjeta"
    };

    // Guardar orden en localStorage
    const ordenesExistentes = JSON.parse(localStorage.getItem("ordenes")) || [];
    localStorage.setItem("ordenes", JSON.stringify([...ordenesExistentes, nuevaOrden]));

    // Limpiar carrito
    localStorage.removeItem("cart");

    // Redirigir a confirmación
    navigate("/pedido-completo");
  };

  if (carrito.length === 0) {
    return <p style={{ padding: "20px" }}>No hay productos para procesar</p>;
  }

  return (
    <div className={styles.checkoutContainer}>
      <h2>Checkout</h2>

      <div className={styles.cartItems}>
        {carrito.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <span>{item.name}</span>
            <span>{item.quantity} × S/ {item.price.toFixed(2)}</span>
            <span>Subtotal: S/ {(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <h3>Total: S/ {total.toFixed(2)}</h3>

      <h3>Datos de tarjeta</h3>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.cardForm}>
        <input
          type="text"
          placeholder="Nombre del titular"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Número de tarjeta (16 dígitos)"
          value={tarjeta}
          onChange={(e) => setTarjeta(e.target.value)}
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
        />
        <input
          type="text"
          placeholder="MM/AA"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <button className={styles.procederButton} onClick={handleProceder}>
        Proceder
      </button>
    </div>
  );
}

export default Checkout;
