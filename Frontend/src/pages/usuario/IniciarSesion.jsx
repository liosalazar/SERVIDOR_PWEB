import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Formulario.css";
// 🛑 Importar el hook de autenticación
import { useAuth } from "../../context/AuthContext"; 

function IniciarSesion() {
    // Obtener la función login y el estado de carga
    const { login, isLoading } = useAuth(); 
    const [dato, setDato] = useState("");
    const [contra, setContra] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMensajeError(""); // Limpiar errores

        try {
            const user = await login(dato, contra); 
            
            alert("Inicio de sesión exitoso ✅");
            
            // Redirigir según el rol
            if (user.rol === "admin") {
                navigate("/dashboard");
            } else {
                navigate("/usuario");
            }

        } catch (error) {
            const errorMessage = error.message.includes('autenticación') 
                ? "Correo o contraseña incorrectos ❌" 
                : error.message;

            setMensajeError(errorMessage);
            alert(errorMessage);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleLogin}>
                <h2>Iniciar sesión</h2>
                
                {mensajeError && (
                    <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
                        {mensajeError}
                    </p>
                )} 
                
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