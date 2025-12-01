// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
    // 1. Estado de usuario y token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(false);

    // 🛑 FUNCIÓN AUXILIAR: Establece el token y el usuario en el estado y localStorage
    const setAuthData = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
    };

    // 2. Función de LOGIN (Llama a tu API de Azure)
    const login = async (correo, contra) => {
        
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/users/iniciar-sesion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contra }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Fallo en la autenticación.');
            }

            const data = await response.json();
            
            // 🛑 Usamos la nueva función para centralizar el establecimiento de estado
            setAuthData(data.token, data.user); 
            
            setIsLoading(false);
            return data.user;

        } catch (error) {
            setIsLoading(false);
            console.error("Login Error:", error);
            throw error; // Propagar el error a IniciarSesion.jsx
        }
    };

    // 3. Función de LOGOUT
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };
    
    // 4. Función de verificación de usuario (usando /api/users/me)
    useEffect(() => {
        const verifyUser = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_BASE}/users/me`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); // Establece el user si el token es válido
                } else {
                    logout(); // Token inválido o expirado
                }
            } catch (error) {
                console.error("Verification Error:", error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        verifyUser();
    }, [token]);

    return (
        // 🛑 Incluimos setAuthData en el valor del contexto
        <AuthContext.Provider value={{ user, token, isLoading, login, logout, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);