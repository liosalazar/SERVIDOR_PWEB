import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Formulario.css";

function IniciarSesion() {
  const [dato, setDato] = useState("");
  const [contra, setContra] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🛑 CORRECCIÓN: La URL del endpoint DEBE ser '/api/users/iniciar-sesion'
    // Usamos ruta relativa /api/... para que funcione en producción (Azure Monolito)
    axios
      .post("/api/users/iniciar-sesion", { 
        correo: dato,
        contra: contra,
      })
      .then((response) => {
        alert("Inicio de sesión exitoso ✅");

        // Asegúrate de que tu AuthContext use esta data.
        // La data contiene: { token: '...', user: { id:..., rol:'...' } }
        localStorage.setItem("usuarioActivo", JSON.stringify(response.data));
        
        // Redirigir según el rol
        if (response.data.user.rol === "admin") {
          // Nota: Asegúrate que esta ruta sea correcta, según App.jsx
          navigate("/dashboard"); 
        } else {
          navigate("/usuario");
        }
      })
      .catch((error) => {
        // Mejorar manejo de errores para mostrar el error real si es 400
        console.error("Error de login:", error.response?.data?.message || error.message);
        alert("Correo o contraseña incorrectos ❌");
      });
  };

  return (
    // ... (El resto del return es el mismo)
    <div className="form-container">
        <form onSubmit={handleLogin}>
            <h2>Iniciar sesión</h2>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={dato}
                onChange={(e) => setDato(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={contra}
                onChange={(e) => setContra(e.target.value)}
            />
            <button type="submit">Iniciar sesión</button>
        </form>
    </div>
  );
}

export default IniciarSesion;