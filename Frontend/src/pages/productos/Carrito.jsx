import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Carrito.css";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("cart")) || [];
    setCarrito(datos);
  }, []);

  const eliminarItem = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
  };

  const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="contenedor-carrito">
      <h2>Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <p className="mensaje-carrito">No hay productos en el carrito actualmente</p>
      ) : (
        <>
          {carrito.map(item => (
            <div key={item.id} className="carrito-item">
              <h4>{item.name}</h4>
              <p>Cantidad: {item.quantity}</p>
              <p>Subtotal: S/ {(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => eliminarItem(item.id)}>Eliminar</button>
            </div>
          ))}

          <div className="carrito-total">
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>

          <button className="finalizar-compra" onClick={() => navigate("/checkout")}>
            Finalizar compra
          </button>
        </>
      )}
    </div>
  );
}
