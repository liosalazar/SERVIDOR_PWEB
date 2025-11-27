import React from "react";

export default function AccionesPerfil({ irACambiarContra, volver }) {
  return (
    <div className="editarperfil-actions">
      <button type="button" onClick={irACambiarContra}>Cambiar Contraseña</button>
      <button type="button" onClick={volver}>Volver al Panel</button>
    </div>
  );
}
