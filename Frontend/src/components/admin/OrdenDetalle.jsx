import React from "react";
import styles from "./ordenes.module.css";

export default function OrdenDetalle({ orden, onClose, onCancel }) {
  if (!orden) return null;

  return (
    <div className={styles.detalle}>
      <h3 style={{ marginTop: 0 }}>Detalle de Orden #{orden.id}</h3>

      <p><strong>Fecha:</strong> {orden.fecha}</p>
      <p><strong>Total:</strong> S/ {Number(orden.total).toFixed(2)}</p>
      <p><strong>Estado:</strong> {orden.estado}</p>
      {orden.direccion && <p><strong>Dirección:</strong> {orden.direccion}</p>}
      {orden.metodoPago && <p><strong>Método de pago:</strong> {orden.metodoPago}</p>}

      <div style={{ marginTop: 12 }}>
        <h4 style={{ marginBottom: 8 }}>Productos</h4>
        <ul style={{ paddingLeft: 16, marginTop: 0 }}>
          {orden.productos && orden.productos.length > 0 ? (
            orden.productos.map((p, i) => (
              <li key={i}>
                {p.nombre} — {p.cantidad} × S/ {Number(p.precio).toFixed(2)}
              </li>
            ))
          ) : (
            <li>No hay productos registrados</li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        {orden.estado !== "Cancelada" && (
          <button
            onClick={() => onCancel && onCancel(orden.id)}
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Cancelar Orden
          </button>
        )}

        <button
          onClick={() => onClose && onClose()}
          style={{
            padding: "0.5rem 0.9rem",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
