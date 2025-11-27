import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/MisOrdenes.css";

export default function DetalleOrden() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];

    // Convertimos ambos ids a string para evitar problemas de comparación
    const encontrada = ordenes.find(o => String(o.id) === String(id));

    if (encontrada) setOrden(encontrada);
    else setOrden(null);
  }, [id]);

  const cancelarOrden = () => {
    if (!orden) return;

    const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    const actualizadas = ordenes.map(o =>
      String(o.id) === String(orden.id) ? { ...o, estado: "Cancelada" } : o
    );
    localStorage.setItem("ordenes", JSON.stringify(actualizadas));

    setOrden({ ...orden, estado: "Cancelada" });
    setMensaje("La orden ha sido cancelada correctamente.");
  };

  if (!orden) return <p className="cargando">No se encontró la orden...</p>;

  return (
    <div className="detalleorden-container">
      <div className="detalleorden-box">
        <h2>Detalle de Orden #{orden.id}</h2>
        <p><strong>Fecha:</strong> {orden.fecha}</p>
        <p><strong>Total:</strong> S/ {orden.total.toFixed(2)}</p>
        <p><strong>Estado:</strong> {orden.estado}</p>

        {orden.direccion && <p><strong>Dirección:</strong> {orden.direccion}</p>}
        {orden.metodoPago && <p><strong>Método de pago:</strong> {orden.metodoPago}</p>}

        <h3>Productos:</h3>
        <ul>
          {orden.items.map((prod, i) => (
            <li key={i}>
              {prod.name} - {prod.quantity} x S/ {prod.price.toFixed(2)}
            </li>
          ))}
        </ul>

        {mensaje && <p className="mensaje-exito">{mensaje}</p>}

        {orden.estado === "Pendiente" && (
          <button className="btn-cancelar" onClick={cancelarOrden}>
            Cancelar orden
          </button>
        )}

        <div className="detalleorden-back">
          <button onClick={() => navigate("/usuario/ordenes")}>
            ← Volver a mis órdenes
          </button>
        </div>
      </div>
    </div>
  );
}
