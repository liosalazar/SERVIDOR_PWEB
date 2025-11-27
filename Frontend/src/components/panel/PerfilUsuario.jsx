import React from "react";

export default function PerfilUsuario({ usuario }) {
  return (
    <div className="panel-box">
      <h1 className="panel-title">Bienvenido, {usuario.nombre} 👋</h1>
      <p className="panel-text">
        Desde aquí puedes ver la información de tu cuenta.
      </p>

      <div className="perfil-section">
        {usuario.imagen ? (
          <img
            src={usuario.imagen}
            alt="Foto de perfil"
            className="perfil-img"
          />
        ) : (
          <p className="perfil-no-img">No has subido una foto de perfil</p>
        )}
      </div>

      <div className="perfil-datos">
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
        <p><strong>País:</strong> {usuario.pais}</p>
        <p><strong>Celular:</strong> {usuario.celular}</p>
      </div>
    </div>
  );
}
