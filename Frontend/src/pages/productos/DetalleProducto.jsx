
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  const productoEjemplo = {
    id: id,
    nombre: "Invisibilidad",
    precio: 100,
    descripcion: "Invisibilidad por un año.",
    imagen: "",
  };

  const agregarAlCarrito = () => {
    
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const nuevoItem = { ...productoEjemplo, cantidad: cantidad };
    carrito.push(nuevoItem);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    alert("¡Producto correctamente agregado al carrito!");
    navigate("/carrito");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{productoEjemplo.nombre}</h2>
      <img src={productoEjemplo.imagen} alt={productoEjemplo.nombre} width="150" />
      <p>{productoEjemplo.descripcion}</p>
      <p>Precio: S/ {productoEjemplo.precio}</p>

      <div>
        <label>Cantidad: </label>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          min="1"
        />
      </div>

      <button onClick={agregarAlCarrito}>Agregar al carrito</button>
    </div>
  );
}

export default DetalleProducto;
