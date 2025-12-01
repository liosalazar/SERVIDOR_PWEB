import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// IMPORTANTE: Si usas Axios, debes importarlo
// import axios from 'axios'; 
import "../styles/MisOrdenes.css";

// Función para simular la obtención del token del usuario actual
// Reemplázala con tu lógica real de AuthContext o localStorage
const getAuthToken = () => localStorage.getItem('token'); 

export default function MisOrdenes() {
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(true); // Nuevo estado de carga
    const [error, setError] = useState(null);       // Nuevo estado de error
    const [paginaActual, setPaginaActual] = useState(1);
    const ordenesPorPagina = 3;

    // --- CARGAR LAS ÓRDENES DESDE LA API (POSTGRESQL) ---
    useEffect(() => {
        const fetchOrdenes = async () => {
            const token = getAuthToken();
            if (!token) {
                setError("Usuario no autenticado.");
                setCargando(false);
                return;
            }

            try {
                // Endpoint que vamos a crear en Express
                const response = await fetch('/api/users/orders', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Envía el token
                    },
                });

                if (!response.ok) {
                    // Si la respuesta no es 200 (ej. 401, 404, 500)
                    throw new Error(`${response.status}: No se pudieron cargar las órdenes.`);
                }

                const datos = await response.json();
                setOrdenes(datos); // Establece las órdenes desde el servidor
                setError(null);

            } catch (err) {
                console.error("Error al obtener las órdenes:", err);
                setError(err.message || "Fallo en la conexión al servidor.");
            } finally {
                setCargando(false);
            }
        };
        
        fetchOrdenes();
    }, []); // Se ejecuta solo al montar el componente

    // ... (El resto de tu lógica de paginación y getEstadoClase es la misma) ...
    const totalPaginas = Math.ceil(ordenes.length / ordenesPorPagina);
    // ...

    const ordenesPaginadas = ordenes.slice(
        (paginaActual - 1) * ordenesPorPagina,
        paginaActual * ordenesPorPagina
    );

    return (
        <div className="misordenes-container">
            <div className="misordenes-box">
                <h2 className="misordenes-title">Mis Órdenes</h2>

                {/* MANEJO DE ESTADOS DE CARGA Y ERROR */}
                {cargando && <p className="misordenes-loading">Cargando órdenes...</p>}
                {error && <p className="misordenes-error">❌ Error: {error}</p>}
                
                {!cargando && !error && ordenes.length === 0 ? (
                    <p className="misordenes-empty">Aún no tienes órdenes registradas.</p>
                ) : (
                    // ... (El resto del JSX es el mismo) ...
                    <>
                        {/* Tu tabla va aquí */}
                        <table className="misordenes-table">
                            {/* ... (Tu thead) ... */}
                            <tbody>
                                {/* Usas ordenesPaginadas que ya viene del estado */}
                                {ordenesPaginadas.map((orden) => (
                                    <tr key={orden.id}>
                                        <td>{orden.id}</td>
                                        <td>{new Date(orden.fecha).toLocaleDateString()}</td> 
                                        {/* Nota: Asegúrate que la fecha sea formateada */}
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
                        {/* Tu paginación va aquí */}
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