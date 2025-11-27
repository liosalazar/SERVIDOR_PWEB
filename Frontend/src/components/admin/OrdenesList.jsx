import React, { useState } from "react";
import styles from "./ordenes.module.css";

export default function OrdenesList() {
  const [ordenes, setOrdenes] = useState([
    { id: 101, usuario: "Daniel Daza", total: 89.90, estado: "Completada" },
    { id: 102, usuario: "Farid Tello", total: 45.50, estado: "Pendiente" },
    { id: 103, usuario: "Julio Salazar", total: 120.00, estado: "Cancelada" },
  ]);

  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [detalle, setDetalle] = useState(null);

  const ordenesFiltradas =
    filtro === "Todos"
      ? ordenes
      : ordenes.filter((o) => o.estado === filtro);

  const cancelarOrden = (id) => {
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, estado: "Cancelada" } : o
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2>Gestión de Órdenes</h2>

      <div className={styles.filtros}>
        <label>Filtrar por estado:</label>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option>Todos</option>
          <option>Pendiente</option>
          <option>Completada</option>
          <option>Cancelada</option>
        </select>
      </div>

      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total (S/.)</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenesFiltradas.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.usuario}</td>
              <td>{o.total.toFixed(2)}</td>
              <td>{o.estado}</td>
              <td>
                <button onClick={() => setDetalle(o)}>Ver</button>
                {o.estado !== "Cancelada" && (
                  <button onClick={() => cancelarOrden(o.id)}>Cancelar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {detalle && (
        <div className={styles.detalle}>
          <h3>Detalle de Orden #{detalle.id}</h3>
          <p><strong>Cliente:</strong> {detalle.usuario}</p>
          <p><strong>Total:</strong> S/ {detalle.total.toFixed(2)}</p>
          <p><strong>Estado:</strong> {detalle.estado}</p>
          <button onClick={() => setDetalle(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
