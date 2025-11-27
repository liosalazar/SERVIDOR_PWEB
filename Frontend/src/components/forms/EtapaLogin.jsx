// src/components/forms/EtapaLogin.jsx
import React from "react";

export default function EtapaLogin({ dato, setDato, contra, setContra }) {
  return (
    <>
      <label>Nombre o correo:</label>
      <input
        type="text"
        placeholder="Ingresa tu nombre o correo"
        value={dato}
        onChange={(e) => setDato(e.target.value)}
        required
      />

      <label>Contraseña:</label>
      <input
        type="password"
        placeholder="Ingresa tu contraseña"
        value={contra}
        onChange={(e) => setContra(e.target.value)}
        required
      />

      <button type="submit">Entrar</button>
    </>
  );
}
