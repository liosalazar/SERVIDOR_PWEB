// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
    // 1. Estado de usuario y token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isLoading, setIsLoading] = useState(false);

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
            
            // Guardar token en localStorage y estado
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user); 
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
    // Se ejecuta al cargar la aplicación para verificar si el token es válido
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
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);