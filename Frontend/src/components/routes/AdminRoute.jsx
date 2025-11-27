// src/components/routes/AdminRoute.jsx - CÓDIGO CORREGIDO

import React from 'react';
// import express from 'express'; ⬅️ ¡ELIMINA ESTA LÍNEA!
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asumiendo esta ruta

// Este es el componente que envuelve las rutas del Dashboard
const AdminRoute = ({ children }) => {
    // Obtenemos el estado de autenticación global
    const { user, isLoading } = useAuth();
    
    // 1. Mostrar un estado de carga mientras se verifica el token
    if (isLoading) {
        // Asegúrate de que el return esté así de limpio (sin líneas vacías entre return y <div>)
        return <div>Cargando la sesión...</div>; 
    }

    // 2. Verificar las condiciones de acceso
    const isAuthenticated = !!user;
    const isAdmin = user && user.rol === 'admin';

    // Si no está autenticado O si no es admin, redirigir.
    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    // Si el usuario es 'admin', renderizar los componentes hijos
    return children;
};

export default AdminRoute;