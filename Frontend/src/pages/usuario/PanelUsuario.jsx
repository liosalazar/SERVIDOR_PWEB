// src/pages/usuario/PanelUsuario.jsx (Simplificado para usar el contexto y redirigir)
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; // Ajustar la ruta si es necesario
import { useNavigate } from 'react-router-dom'; 

// Importa el componente de vista
import PerfilUsuario from '../../components/panel/PerfilUsuario.jsx'; 
import AccionesPerfil from '../../components/perfil/AccionesPerfil.jsx';

const PanelUsuario = () => {
    const { user, loading, logout } = useAuth(); // Usamos 'user' directamente
    const navigate = useNavigate();

    // Redirigir si no hay usuario o si los datos aún no están cargados
    useEffect(() => {
        // Asumiendo que useAuth() maneja la carga inicial del usuario al iniciar la app
        if (!loading && !user) {
            navigate('/iniciar-sesion'); 
        }
    }, [user, loading, navigate]);

    // Usamos el componente PerfilUsuario para la visualización
    if (loading || !user) {
        return <div style={{padding: '20px'}}>Cargando datos del perfil...</div>;
    }

    // Funciones de navegación para el componente AccionesPerfil
    const irAEditarPerfil = () => navigate("/usuario/perfil/editar");
    const irACambiarContra = () => navigate("/usuario/perfil/cambiar-contra");

    return (
    <div className="page-wrapper">
        <div className="panel-container">
            {/* LADO IZQUIERDO */}
            <div className="panel-perfil-data">
                <PerfilUsuario usuario={user} /> 
            </div>

            {/* LADO DERECHO: Acciones agrupadas en una sola caja */}
            <div className="panel-acciones-sidebar"> 
                <div className="panel-actions-box"> {/* Esta es la caja que envuelve los 3 botones */}
                    <p className="panel-subtitle">Opciones de Cuenta</p>
                    <div className="panel-actions">
                        {/* Botón 1: Editar Perfil */}
                        <a onClick={irAEditarPerfil} className="panel-link panel-link-edit">
                            Editar Perfil
                        </a>
                        {/* Botón 2: Cambiar Contraseña */}
                        <a onClick={irACambiarContra} className="panel-link panel-link-orders"> 
                            Cambiar Contraseña
                        </a>
                        {/* Botón 3: Cerrar Sesión (Usando el estilo de link de logout) */}
                        <button onClick={logout} className="logout-button panel-link-logout">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {/* ... */}
    </div>
);
};

export default PanelUsuario;