import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/PanelUsuario.css";

import PerfilUsuario from "../../components/panel/PerfilUsuario";
import OpcionesUsuario from "../../components/panel/OpcionesUsuario";

function PanelUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuarioActivo) {
      navigate("/iniciar-sesion");
    } else {
      // Si hay un usuario activo, hacer una solicitud al backend para obtener los datos completos
      fetch("http://localhost:3001/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuarioActivo.token}`, // Usamos el token almacenado
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsuario(data); // Guardar los datos completos del usuario
          setLoading(false); // Actualizar el estado de carga
        })
        .catch((err) => {
          console.error("Error al obtener los datos del usuario:", err);
          navigate("/iniciar-sesion"); // Redirigir si hay un error
        });
    }
  }, [navigate]);

  if (loading) return <div>Cargando...</div>; // Mostrar un mensaje de carga mientras obtenemos los datos del usuario

  if (!usuario) return null;

  return (
    <div className="panel-container">
      <PerfilUsuario usuario={usuario} />
      <OpcionesUsuario navigate={navigate} />
    </div>
  );
}

export default PanelUsuario;
