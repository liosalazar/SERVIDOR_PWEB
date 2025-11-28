import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Formulario.css";
// 🛑 Importar el hook de autenticación
import { useAuth } from "../../context/AuthContext"; 

function IniciarSesion() {
    // 🛑 Obtener la función login y el estado de carga
    const { login, isLoading } = useAuth(); 
    const [dato, setDato] = useState("");
    const [contra, setContra] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensajeError(""); // Limpiar errores

        try {
            // 🛑 Usar la función login del contexto (ya maneja la llamada a la API y el estado)
            const user = await login(dato, contra); 
            
            // Si la función login NO lanza un error, fue exitosa
            alert("Inicio de sesión exitoso ✅");
            
            // Redirigir según el rol
            if (user.rol === "admin") {
                navigate("/admin/usuarios");
            } else {
                navigate("/usuario");
            }

        } catch (error) {
            // Error capturado desde AuthContext
            setMensajeError(error.message || "Correo o contraseña incorrectos ❌");
            alert("Correo o contraseña incorrectos ❌");
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>
                {mensajeError && <p style={{ color: 'red', textAlign: 'center' }}>{mensajeError}</p>} 
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Cargando..." : "Iniciar sesión"}
                </button>
            </form>
        </div>
    );
}

export default IniciarSesion;