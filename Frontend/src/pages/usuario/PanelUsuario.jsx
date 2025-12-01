// src/pages/usuario/PanelUsuario.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; 

// 1. Obtén la URL base del entorno (Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PanelUsuario = () => {
    // 2. Usar el hook useAuth para obtener el token y la función setAuthData
    const { token, logout, setAuthData } = useAuth(); // 🎯 Agregamos setAuthData
    
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({}); // Estado para el formulario editable
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateMessage, setUpdateMessage] = useState(null); // Mensaje de éxito/error de actualización

    // Función para manejar cambios en el formulario
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 3. Cargar datos del perfil (Usando /me)
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
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setProfileData(data.user); 
                      // 🎯 Inicializar el formulario con los datos recibidos
                      setFormData(data.user);
                    setError(null);
                } else if (response.status === 403 || response.status === 401) {
                    setError("Sesión expirada o token inválido. Por favor, vuelve a iniciar sesión.");
                    logout(); 
                } else {
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

    // 4. Función para enviar la actualización al servidor
    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateMessage(null); // Limpiar mensajes anteriores
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                // 🎯 Actualizar el estado global de AuthContext
                // Aunque no recibimos un token nuevo, actualizamos el objeto user en el estado
                setAuthData(token, data.user); 
                
                // Actualizar el estado local para reflejar los cambios en el formulario
                setProfileData(data.user);
                setFormData(data.user);

                setUpdateMessage("✅ ¡Perfil actualizado con éxito!");
            } else {
                setUpdateMessage(`❌ Error al actualizar: ${data.message || 'Error desconocido'}`);
            }
        } catch (err) {
            setLoading(false);
            setUpdateMessage("❌ Error de red al intentar actualizar.");
        }
    };

    // 5. Renderizar la interfaz
    if (loading && !profileData) {
        return <h2>Cargando datos del perfil...</h2>;
    }

    if (error) {
        return <h2 style={{ color: 'red' }}>Error: {error}</h2>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>👋 Bienvenido a tu Panel, {profileData?.nombre || profileData?.correo}</h1>
            <p>Edita la información de tu cuenta.</p>
            
            {updateMessage && (
                <div style={{ padding: '10px', margin: '15px 0', borderRadius: '5px', backgroundColor: updateMessage.startsWith('✅') ? '#e6ffe6' : '#ffe6e6', color: updateMessage.startsWith('✅') ? '#006400' : '#cc0000' }}>
                    {updateMessage}
                </div>
            )}
            
            <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre || ''}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="pais">País:</label>
                    <input
                        type="text"
                        name="pais"
                        value={formData.pais || ''}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="celular">Celular:</label>
                    <input
                        type="text"
                        name="celular"
                        value={formData.celular || ''}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label htmlFor="imagen_url">URL de Imagen (Perfil):</label>
                    <input
                        type="url"
                        name="imagen_url"
                        value={formData.imagen_url || ''}
                        onChange={handleChange}
                        placeholder="http://..."
                    />
                </div>

                <button type="submit" disabled={loading} style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>

            <hr style={{ margin: '20px 0' }}/>
            
            <h3>Otros datos (No editables aquí)</h3>
            <ul>
                <li><strong>Correo:</strong> {profileData?.correo}</li>
                <li><strong>Rol:</strong> **{profileData?.rol}**</li>
            </ul>
        </div>
    );
};

export default PanelUsuario;