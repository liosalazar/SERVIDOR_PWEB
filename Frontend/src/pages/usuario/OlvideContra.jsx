import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Formulario.css";
import EtapaCorreo from "../../components/forms/EtapaCorreo";
import EtapaCodigo from "../../components/forms/EtapaCodigo";
import EtapaNuevaContra from "../../components/forms/EtapaNuevaContra";
import Mensaje from "../../components/ui/Mensaje";

// 🎯 1. DEFINIR LA BASE DE LA API USANDO LA VARIABLE DE ENTORNO
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function OlvideContra() {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContra, setNuevaContra] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState("");
  const [etapa, setEtapa] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const handleCorreo = async (e) => {
    e.preventDefault();

    if (email.trim() === "") {
      setMensaje("Por favor, ingresa un correo válido.");
      return;
    }

    try {
      // 🛑 2. CORRECCIÓN DE LA URL
      const response = await fetch(`${API_BASE}/users/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Código enviado al correo.");
        setEtapa(2);
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      setMensaje("Error al enviar el correo.");
    }
  };

  const handleCodigo = async (e) => {
    e.preventDefault();

    try {
      // 🛑 2. CORRECCIÓN DE LA URL
      const response = await fetch(`${API_BASE}/users/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: codigo }),
      });

      const data = await response.json();

      if (response.ok) {
        setEtapa(3);
        setMensaje("");
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      setMensaje("Error al verificar el código.");
    }
  };

  const handleCambioContra = async (e) => {
    e.preventDefault();

    if (nuevaContra.length < 4) {
      setMensaje("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    try {
      // 🛑 2. CORRECCIÓN DE LA URL
      const response = await fetch(`${API_BASE}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: nuevaContra }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Contraseña actualizada con éxito.");
        setEtapa(1);
        setEmail("");
        setCodigo("");
        setNuevaContra("");
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      setMensaje("Error al cambiar la contraseña.");
    }
  };

  return (
    <div className="form-container">
      <form
        onSubmit={
          etapa === 1 ? handleCorreo :
          etapa === 2 ? handleCodigo :
          handleCambioContra
        }
      >
        <h2>Recuperar contraseña</h2>

        {etapa === 1 && <EtapaCorreo email={email} setEmail={setEmail} />}
        {etapa === 2 && <EtapaCodigo codigo={codigo} setCodigo={setCodigo} />}
        {etapa === 3 && <EtapaNuevaContra nuevaContra={nuevaContra} setNuevaContra={setNuevaContra} />}

        <Mensaje texto={mensaje} />

        <p>
          <Link to="/iniciar-sesion">Volver al inicio de sesión</Link>
        </p>
      </form>
    </div>
  );
}