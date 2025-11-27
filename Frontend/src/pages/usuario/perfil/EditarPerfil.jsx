import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditarPerfil.css";

import FormularioEditar from "../../../components/perfil/FormularioEditar.jsx";
import AccionesPerfil from "../../../components/perfil/AccionesPerfil.jsx";

export default function EditarPerfil() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Estado para manejar errores
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (usuarioActivo) {
      setNombre(usuarioActivo.nombre || "");
      setEmail(usuarioActivo.correo || "");
      setCelular(usuarioActivo.celular || "");
      setImagen(usuarioActivo.imagen || null);
    }
  }, []);

  const handleSubmit = async (usuarioActualizado) => {
    setLoading(true); // Iniciar carga
    setError(""); // Limpiar errores anteriores

    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    const token = usuarioActivo?.token; // Obtener el token del usuario actual

    if (!token) {
      setError("No se pudo obtener el token de autenticación.");
      setLoading(false);
      return;
    }

    try {
      // Realizar la actualización en el backend
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT", // Usamos PUT para actualizar los datos
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Enviar el token de autorización
        },
        body: JSON.stringify({
          nombre: usuarioActualizado.nombre,
          correo: usuarioActualizado.email,
          celular: usuarioActualizado.celular,
          imagen: usuarioActualizado.imagen,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const data = await response.json();

      // Si la actualización es exitosa, actualizamos localStorage
      localStorage.setItem("usuarioActivo", JSON.stringify({ ...data, token }));
      setLoading(false); // Detener carga
      console.log("Perfil actualizado:", data);
      navigate("/usuario"); // Redirigir al perfil del usuario

    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setLoading(false); // Detener carga
      setError("Hubo un error al actualizar tu perfil. Inténtalo nuevamente.");
    }
  };

  const irACambiarContra = () => navigate("/usuario/perfil/cambiar-contra");

  return (
    <div className="editarperfil-container">
      <div className="editarperfil-box">
        <h2 className="editarperfil-title">Editar Perfil</h2>
        {error && <div className="error-message">{error}</div>} {/* Mostrar errores si ocurren */}
        {loading && <div className="loading-message">Cargando...</div>} {/* Mostrar carga */}
        
        <FormularioEditar
          nombre={nombre}
          setNombre={setNombre}
          email={email}
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
