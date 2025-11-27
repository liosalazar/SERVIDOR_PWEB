import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MisOrdenes.css";

export default function MisOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 3;

  // Cargar las órdenes desde localStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem("ordenes")) || [];
    setOrdenes(datos);
  }, []);

  const totalPaginas = Math.ceil(ordenes.length / ordenesPorPagina);

  const getEstadoClase = (estado) => {
    if (estado === "Completada") return "orden-completada";
    if (estado === "Pendiente") return "orden-pendiente";
    if (estado === "Cancelada") return "orden-cancelada";
    return "";
  };

  const ordenesPaginadas = ordenes.slice(
    (paginaActual - 1) * ordenesPorPagina,
    paginaActual * ordenesPorPagina
  );

  return (
    <div className="misordenes-container">
      <div className="misordenes-box">
        <h2 className="misordenes-title">Mis Órdenes</h2>

        {ordenes.length === 0 ? (
          <p className="misordenes-empty">Aún no tienes órdenes registradas.</p>
        ) : (
          <>
            <table className="misordenes-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Total (S/)</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {ordenesPaginadas.map((orden) => (
                  <tr key={orden.id}>
                    <td>{orden.id}</td>
                    <td>{orden.fecha}</td>
                    <td>S/ {orden.total.toFixed(2)}</td>
                    <td className={getEstadoClase(orden.estado)}>{orden.estado}</td>
                    <td>
                      <Link
                        to={`/usuario/ordenes/${orden.id}`}
                        className="misordenes-link"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="misordenes-paginacion">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  className={paginaActual === i + 1 ? "activo" : ""}
                  onClick={() => setPaginaActual(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="misordenes-back">
          <Link to="/usuario">← Volver al panel de usuario</Link>
        </div>
      </div>
    </div>
  );
}
