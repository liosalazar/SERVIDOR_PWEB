import React from "react";
import styles from "./usuarios.module.css";

export default function UsuarioDetalle({ usuario, onClose, onToggle }) {
  if (!usuario) return null;

  return (
    <div className={styles.detalle}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {usuario.imagen ? (
          <img
            src={usuario.imagen}
            alt={usuario.nombre}
            style={{
              width: 96,
              height: 96,
              borderRadius: "8px",
              objectFit: "cover",
              border: "2px solid #e5e7eb",
            }}
          />
        ) : (
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 8,
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontWeight: 600,
            }}
          >
            SIN IMG
          </div>
        )}

        <div style={{ textAlign: "left" }}>
          <h3 style={{ margin: 0 }}>{usuario.nombre}</h3>
          <p style={{ margin: "6px 0" }}>
            <strong>Correo:</strong> {usuario.correo}
          </p>
          {usuario.pais && <p style={{ margin: "6px 0" }}><strong>País:</strong> {usuario.pais}</p>}
          {usuario.celular && <p style={{ margin: "6px 0" }}><strong>Celular:</strong> {usuario.celular}</p>}
          <p style={{ margin: "6px 0" }}>
            <strong>Estado:</strong>{" "}
            <span className={usuario.activo ? styles.activo : styles.inactivo}>
              {usuario.activo ? "Activo" : "Inactivo"}
            </span>
          </p>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          onClick={() => onToggle && onToggle(usuario.id)}
          style={{
            padding: "0.5rem 0.9rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: usuario.activo ? "#ef4444" : "#10b981",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {usuario.activo ? "Desactivar" : "Activar"}
        </button>

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
