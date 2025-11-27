import React from "react";

export default function EtapaContraseña({ contra, setContra, confirmarContra, setConfirmarContra }) {
  return (
    <>
      <label>Contraseña:</label>
      <input type="password" value={contra} onChange={(e) => setContra(e.target.value)} required />

      <label>Confirmar contraseña:</label>
      <input type="password" value={confirmarContra} onChange={(e) => setConfirmarContra(e.target.value)} required />
    </>
  );
}
