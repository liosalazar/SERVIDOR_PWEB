import React, { useState } from 'react';
import '../styles/CambiarContra.css';

export default function CambiarContrasena() {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // "success" o "error"

  const manejarCambio = async (e) => { // ⬅️ Hacemos la función ASÍNCRONA
    e.preventDefault();
    setMensaje(''); // Limpiar mensajes al inicio

    // 1. Validaciones en el lado del cliente
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

    if (nueva.length < 6) { // Validación de longitud mínima
        setMensaje('La nueva contraseña debe tener al menos 6 caracteres.');
        setTipoMensaje('error');
        return;
    }


    // 2. Comunicación con el Backend
    try {
        // ⚠️ Asegúrate de que esta URL sea correcta para tu servidor
        const API_URL = '/api/auth/cambiar-contrasena'; 
        const token = localStorage.getItem('token'); 

        if (!token) {
            setMensaje('No estás autenticado. Por favor, inicia sesión de nuevo.');
            setTipoMensaje('error');
            return;
        }

        const response = await fetch(API_URL, {
            method: 'PUT', // Generalmente se usa PUT para actualizar
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envía el token de autenticación
            },
            body: JSON.stringify({
                actual: actual,
                nueva: nueva
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 3. Éxito
            setMensaje('Contraseña cambiada exitosamente ✅');
            setTipoMensaje('success');
            // Limpiar los campos solo si fue exitoso
            setActual('');
            setNueva('');
            setConfirmar('');
        } else {
            // 4. Error del servidor (ej: Contraseña actual incorrecta)
            setMensaje(data.message || 'Error al cambiar la contraseña. Verifica la contraseña actual.');
            setTipoMensaje('error');
        }

    } catch (error) {
        console.error('Error al intentar cambiar la contraseña:', error);
        setMensaje('Error de conexión o del servidor.');
        setTipoMensaje('error');
    }
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
        <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>
      )}
    </div>
  );
}