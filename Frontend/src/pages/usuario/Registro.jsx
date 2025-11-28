import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Formulario.css";

// 🛑 Importar el hook de autenticación
import { useAuth } from "../../context/AuthContext"; // AJUSTA ESTA RUTA si es necesario

import EtapaPersonal from "../../components/forms/EtapaPersonal";
import EtapaContra from "../../components/forms/EtapaContra";
import Mensaje from "../../components/ui/Mensaje";

function Registro() {
    // 🛑 Obtener la NUEVA función 'setAuthData' del contexto
    const { setAuthData } = useAuth(); 
    
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [pais, setPais] = useState("");
    const [celular, setCelular] = useState("");
    const [contra, setContra] = useState("");
    const [confirmarContra, setConfirmarContra] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();
    // const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // Eliminado por no usarse

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !correo || !pais || !celular || !contra || !confirmarContra) {
            setMensaje("Por favor, completa todos los campos ❌");
            return;
        }

        if (contra !== confirmarContra) {
            setMensaje("Las contraseñas no coinciden ❌");
            return;
        }

        try {
            const response = await fetch(`api/users/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, correo, pais, celular, contra }),
            });

            const data = await response.json();

            if (response.ok) {
                // El backend devuelve { token, user: { ... } }
                setMensaje(`Registro exitoso ✅ Bienvenido ${data.user.nombre}`);
                
                // 🛑 SOLUCIÓN: Usar setAuthData para iniciar sesión en el estado global
                setAuthData(data.token, data.user); 
                
                // localStorage.setItem("usuarioActivo", JSON.stringify(data)); // Eliminado
                
                setTimeout(() => navigate("/usuario"), 1000);
            } else {
                setMensaje(data.message || "Error desconocido durante el registro.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMensaje("Hubo un error al registrar el usuario.");
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Crear cuenta</h2>

                <EtapaPersonal
                    nombre={nombre}
                    setNombre={setNombre}
                    correo={correo}
                    setCorreo={setCorreo}
                    pais={pais}
                    setPais={setPais}
                    celular={celular}
                    setCelular={setCelular}
                />

                <EtapaContra
                    contra={contra}
                    setContra={setContra}
                    confirmarContra={confirmarContra}
                    setConfirmarContra={setConfirmarContra}
                />

                <button type="submit">Registrarse</button>

                <Mensaje texto={mensaje} />

                <p>
                    ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
}

export default Registro;