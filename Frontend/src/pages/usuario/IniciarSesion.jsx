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

    // Hacer una solicitud al backend para autenticar al usuario
    axios
      .post("http://localhost:5000/api/users/login", {
        correo: dato,
        contra: contra,
      })
      .then((response) => {
        // Si la autenticación es exitosa, almacenar el token en el estado
        alert("Inicio de sesión exitoso ✅");

        // Guardar el token en el estado global o en un contexto (mejor que localStorage)
        // Aquí lo almacenamos en el contexto de estado global (ej. Redux, React Context, etc.)
        localStorage.setItem("usuarioActivo", JSON.stringify(response.data));
        
        // Redirigir según el rol
        if (response.data.user.rol === "admin") {
          navigate("/admin/usuarios");
        } else {
          navigate("/usuario");
        }
      })
      .catch((error) => {
        alert("Correo o contraseña incorrectos ❌");
      });
  };

  return (
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
