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
        <div className="panel-container">
            {/* 1. Muestra el perfil usando el componente de vista */}
            <PerfilUsuario usuario={user} /> 

            {/* 2. Botones de acción (Editar y Cambiar Contraseña) */}
            <AccionesPerfil 
                irACambiarContra={irACambiarContra}
                irAEditarPerfil={irAEditarPerfil}
                // Ya que estás en el panel principal, no necesitas el botón 'Volver' aquí
            />

            {/* Opcional: Botón de cerrar sesión */}
            <button onClick={logout} className="logout-button">Cerrar Sesión</button>
        </div>
    );
};

export default PanelUsuario;