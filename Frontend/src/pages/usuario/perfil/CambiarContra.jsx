import React, { useState } from 'react';
import '../styles/CambiarContra.css';

export default function CambiarContrasena() {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // "success" o "error"

  const manejarCambio = (e) => {
    e.preventDefault();

    if (!actual || !nueva || !confirmar) {
      setMensaje('Por favor completa todos los campos.');
      setTipoMensaje('error');
      return;
    }

    if (nueva !== confirmar) {
      setMensaje('Las contraseñas nuevas no coinciden.');
      setTipoMensaje('error');
      return;
    }

    setMensaje('Contraseña cambiada exitosamente ✅');
    setTipoMensaje('success');
    setActual('');
    setNueva('');
    setConfirmar('');
  };

  return (
    <div className="contenedor-cambiar">
      <h2>Cambiar Contraseña</h2>

      <form onSubmit={manejarCambio}>
        <div>
          <label>Contraseña actual:</label>
          <input type="password" value={actual} onChange={(e) => setActual(e.target.value)} />
        </div>

        <div>
          <label>Nueva contraseña:</label>
          <input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
        </div>

        <div>
          <label>Confirmar nueva contraseña:</label>
          <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} />
        </div>

        <button type="submit">Guardar cambios</button>
      </form>

      {mensaje && (
        <p className={tipoMensaje === 'error' ? 'error' : ''}>{mensaje}</p>
      )}
    </div>
  );
}
