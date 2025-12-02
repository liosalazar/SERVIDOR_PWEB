// src/pages/usuario/PanelUsuario.jsx

import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import PerfilUsuario from '../../components/panel/PerfilUsuario.jsx'; 
import './styles/PanelUsuario.css';

const PanelUsuario = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/iniciar-sesion'); 
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return <div style={{padding: '20px'}}>Cargando datos del perfil...</div>;
    }

    const irAEditarPerfil = () => navigate("/usuario/perfil/editar");
    const irACambiarContra = () => navigate("/usuario/perfil/cambiar-contra");

    return (

        <div className="page-wrapper"> 
            <div className="panel-container">
                
                <div className="panel-perfil-data">
                    <PerfilUsuario usuario={user} /> 
                </div>

                <div className="panel-acciones-sidebar">
                    <div className="panel-actions-box"> 
                        <p className="panel-subtitle">Opciones de Cuenta</p>
                        <div className="panel-actions">
                            
                            <a 
                                onClick={irAEditarPerfil} 
                                className="panel-link panel-link-edit" 
                            >
                                Editar Perfil
                            </a>
                            
                            <a 
                                onClick={irACambiarContra} 
                                className="panel-link panel-link-orders"
                            > 
                                Cambiar Contraseña
                            </a>
                            
                            <button 
                                onClick={logout} 
                                className="logout-button panel-link-logout"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelUsuario;