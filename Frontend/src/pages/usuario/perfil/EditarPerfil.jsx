// src/pages/usuario/EditarPerfil.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 🎯 IMPORTAMOS EL CONTEXTO DE AUTENTICACIÓN
import { useAuth } from "../../../context/AuthContext.jsx";
import "../styles/EditarPerfil.css";

import FormularioEditar from "../../../components/perfil/FormularioEditar.jsx";
import AccionesPerfil from "../../../components/perfil/AccionesPerfil.jsx";

// 1. Obtener la URL base del entorno (Vite)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditarPerfil() {
  // 🎯 2. USAR useAuth PARA OBTENER LOS DATOS Y LA FUNCIÓN DE ACTUALIZACIÓN
  const { user, token, setAuthData } = useAuth(); 
  
  // El estado local reflejará el estado global (user) y permitirá la edición
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState(""); // El email no debería ser editable en el frontend a menos que tengas un endpoint específico para ello
  const [celular, setCelular] = useState("");
  const [imagen, setImagen] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  // 3. Inicializar el estado local con los datos del contexto (user)
  useEffect(() => {
    // Si el usuario existe en el contexto, cargamos sus datos
    if (user) {
      setNombre(user.nombre || "");
      setEmail(user.correo || ""); // Usamos user.correo
      setCelular(user.celular || "");
      setImagen(user.imagen_url || null); // Usamos user.imagen_url
    } else {
        // Opcional: Redirigir si no hay usuario logueado (aunque AuthContext ya lo maneja)
        // navigate("/iniciar-sesion"); 
    }
  }, [user]); // 🎯 Depende del objeto user del contexto

  const handleSubmit = async (usuarioActualizado) => {
    setLoading(true); 
    setError(""); 

    if (!token) {
      setError("No se pudo obtener el token de autenticación. Inicie sesión.");
      setLoading(false);
      return;
    }

    try {
      // 🎯 4. USAR LA RUTA CORRECTA (PATCH /users/profile)
      const response = await fetch(`${API_BASE_URL}/users/profile`, { 
        method: "PATCH", // 🎯 USAR PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          nombre: usuarioActualizado.nombre,
          // El correo (email) no se debe actualizar aquí a menos que el backend lo permita
          celular: usuarioActualizado.celular,
          imagen_url: usuarioActualizado.imagen, // 🎯 Usar imagen_url para que coincida con la BD
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil");
      }

      const data = await response.json();

      // 🎯 5. ACTUALIZAR EL ESTADO GLOBAL (AuthContext) con la respuesta
      // setAuthData(newToken, newUserData)
      setAuthData(token, data.user); 
      
      setLoading(false); 
      console.log("Perfil actualizado:", data.user);
      navigate("/usuario"); 

    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setLoading(false); 
      setError(err.message || "Hubo un error al actualizar tu perfil. Inténtalo nuevamente.");
    }
  };

  const irACambiarContra = () => navigate("/usuario/perfil/cambiar-contra");

  return (
    <div className="editarperfil-container">
      <div className="editarperfil-box">
        <h2 className="editarperfil-title">Editar Perfil</h2>
        {error && <div className="error-message">{error}</div>} 
        {loading && <div className="loading-message">Cargando...</div>} 
        
        <FormularioEditar
          nombre={nombre}
          setNombre={setNombre}
          email={email} // Se mantiene, aunque el backend no lo actualiza
          setEmail={setEmail}
          celular={celular}
          setCelular={setCelular}
          imagen={imagen}
          setImagen={setImagen}
          handleSubmit={handleSubmit}
        />
        <AccionesPerfil
          irACambiarContra={irACambiarContra}
          volver={() => navigate("/usuario")}
          usuario={{ nombre, email, celular, imagen }}
        />
      </div>
    </div>
  );
}