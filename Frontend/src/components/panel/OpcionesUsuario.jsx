import React from "react";

export default function OpcionesUsuario({ navigate }) {
  const handleLogout = () => {
    sessionStorage.removeItem("usuarioActivo");
    navigate("/iniciar-sesion");
  };

  return (
    <div className="panel-actions-box">
      <h2 className="panel-subtitle">Opciones</h2>
      <div className="panel-actions">
        <a href="/usuario/perfil/editar" className="panel-link panel-link-edit">
          Editar Perfil
        </a>

        <a href="/usuario/ordenes" className="panel-link panel-link-orders">
          Ver Mis Órdenes
        </a>

        <button
          onClick={handleLogout}
          className="panel-link panel-link-logout"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
