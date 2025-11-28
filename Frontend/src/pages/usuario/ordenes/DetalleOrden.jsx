import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/DetalleOrden.css"; // Asegúrate de crear este archivo CSS

export default function DetalleOrden() {
  const { id } = useParams(); // Obtiene el ID de la orden de la URL
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 1. Cargar todas las órdenes desde localStorage
    const todasLasOrdenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    
    // 2. Buscar la orden específica por ID
    const ordenEncontrada = todasLasOrdenes.find(
      (o) => o.id === parseInt(id) || o.id === id // Soporte para ID numérico o string
    );

    if (ordenEncontrada) {
      // 3. Calcular el total si aún no está calculado (o asegurar que el total sea correcto)
      const productosConSubtotal = ordenEncontrada.productos.map(p => ({
        ...p,
        subtotal: p.precio * p.cantidad
      }));
      
      const totalCalculado = productosConSubtotal.reduce(
        (acc, p) => acc + p.subtotal,
        0
      );

      setOrden({
        ...ordenEncontrada,
        productos: productosConSubtotal,
        total: totalCalculado 
      });

    } else {
      // Si la orden no se encuentra, redirige o muestra un error
      alert("Orden no encontrada.");
      navigate("/usuario/ordenes");
    }

    setCargando(false);
  }, [id, navigate]);

  if (cargando) {
    return <div className="detalleorden-container">Cargando detalles de la orden...</div>;
  }

  if (!orden) {
    return null; // Ya redirigimos, pero evitamos renderizar si no hay orden
  }

  // Helper para el estado (similar al que tienes en MisOrdenes.jsx)
  const getEstadoClase = (estado) => {
    if (estado === "Completada") return "orden-completada";
    if (estado === "Pendiente") return "orden-pendiente";
    if (estado === "Cancelada") return "orden-cancelada";
    return "";
  };

  return (
    <div className="detalleorden-container">
      <div className="detalleorden-box">
        <h2 className="detalleorden-title">Detalle de la Orden #{orden.id}</h2>
        <div className="detalleorden-header">
          <p>
            <strong>Fecha de Pedido:</strong> {orden.fecha}
          </p>
          <p>
            <strong>Estado:</strong> 
            <span className={getEstadoClase(orden.estado)} style={{ marginLeft: '10px', padding: '5px 10px', borderRadius: '5px' }}>
              {orden.estado}
            </span>
          </p>
          <p>
            <strong>Dirección de Envío:</strong> {orden.direccion || "No especificada"}
          </p>
        </div>

        <hr />

        {/* TABLA DE PRODUCTOS DE LA ORDEN */}
        <h3 className="detalleorden-subtitle">Productos Incluidos</h3>
        <table className="detalleorden-productos-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario (S/)</th>
              <th>Subtotal (S/)</th>
            </tr>
          </thead>
          <tbody>
            {orden.productos.map((producto, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                </td>
                <td>{producto.cantidad}</td>
                <td>S/ {producto.precio.toFixed(2)}</td>
                <td>S/ {producto.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* RESUMEN DEL TOTAL */}
        <div className="detalleorden-resumen">
          <p>
            <strong>Total de la Orden:</strong>{" "}
            <span className="detalleorden-total">
              S/ {orden.total.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="detalleorden-back">
          <Link to="/usuario/ordenes">← Volver a Mis Órdenes</Link>
        </div>
      </div>
    </div>
  );
}