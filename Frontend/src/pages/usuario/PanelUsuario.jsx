// src/pages/usuario/PanelUsuario.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Asume que la ruta es correcta

// 1. Obtén la URL base del entorno (Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PanelUsuario = () => {
    // 2. Usar el hook useAuth para obtener el token y la función logout
    const { token, logout } = useAuth();
    
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setError("No hay token de sesión. Debes iniciar sesión.");
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    method: 'GET',
                    headers: {
                        // 3. Establecer el header de AUTORIZACIÓN
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    // 4. Éxito: Guardar los datos del perfil
                    setProfileData(data.user); 
                    setError(null);
                } else if (response.status === 403 || response.status === 401) {
                    // Token expirado o inválido: Cerrar sesión
                    setError("Sesión expirada o token inválido. Por favor, vuelve a iniciar sesión.");
                    logout(); 
                } else {
                    // Otro error del servidor
                    setError(data.message || "Error al cargar el perfil.");
                }

            } catch (err) {
                console.error("Error de red al cargar perfil:", err);
                setError("Error de red. Verifica la URL de la API.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token, logout]); // Dependencias

    // 5. Renderizar la interfaz
    if (loading) {
        return <h2>Cargando datos del perfil...</h2>;
    }

    if (error) {
        return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
    }

    if (!profileData) {
        return <h2>No se pudieron cargar los datos del usuario.</h2>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>👋 Bienvenido a tu Panel, {profileData.nombre || profileData.correo}</h1>
            <p>Aquí tienes los datos recibidos de tu API de Azure:</p>
            <ul>
                <li><strong>ID:</strong> {profileData.id}</li>
                <li><strong>Correo:</strong> {profileData.correo}</li>
                <li><strong>Rol:</strong> **{profileData.rol}**</li>
                {/* Asegúrate de que los campos coincidan con lo que devuelve tu JWT */}
            </ul>
        </div>
    );
};

export default PanelUsuario;