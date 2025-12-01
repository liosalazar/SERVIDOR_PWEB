// src/pages/usuario/PanelUsuario.jsx (Simplificado para usar el contexto y redirigir)
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import PerfilUsuario from '../../components/panel/PerfilUsuario.jsx'; 
import './styles/PanelUsuario.css';


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

    const irAEditarPerfil = () => navigate("/usuario/perfil/editar");
    const irACambiarContra = () => navigate("/usuario/perfil/cambiar-contra");

   return (
        // Aplicar las clases usando el objeto 'styles' si usas módulos
        // Si no usas módulos, puedes dejar las clases como strings ("page-wrapper")
        <div className={styles['page-wrapper']}> 
            <div className={styles['panel-container']}>
                
                <div className={styles['panel-perfil-data']}>
                    <PerfilUsuario usuario={user} /> 
                </div>

                <div className={styles['panel-acciones-sidebar']}>
                    <div className={styles['panel-actions-box']}> 
                        <p className={styles['panel-subtitle']}>Opciones de Cuenta</p>
                        <div className={styles['panel-actions']}>
                            {/* ... botones ... */}
                            <a onClick={irAEditarPerfil} className={`${styles['panel-link']} ${styles['panel-link-edit']}`}>
                                Editar Perfil
                            </a>
                            {/* ... otros botones y Cerrar Sesión ... */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PanelUsuario;