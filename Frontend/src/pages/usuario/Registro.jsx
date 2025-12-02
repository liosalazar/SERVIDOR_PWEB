import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Formulario.css";

import { useAuth } from "../../context/AuthContext"; 

import EtapaPersonal from "../../components/forms/EtapaPersonal";
import EtapaContra from "../../components/forms/EtapaContra";
import Mensaje from "../../components/ui/Mensaje";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Registro() {
    const { setAuthData } = useAuth(); 
    
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [pais, setPais] = useState("");
    const [celular, setCelular] = useState("");
    const [contra, setContra] = useState("");
    const [confirmarContra, setConfirmarContra] = useState("");
    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate();

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
            const response = await fetch(`${API_BASE}/users/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, correo, pais, celular, contra }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ 
                    message: 'Error de conexión o Ruta de Azure no encontrada (404). Revisar logs del servidor.' 
                }));
                setMensaje(errorData.message || "Error desconocido durante el registro.");
                return;
            }

            const data = await response.json();

            setMensaje(`Registro exitoso ✅ Bienvenido ${data.user.nombre}`);
            
            setAuthData(data.token, data.user); 
            
            setTimeout(() => navigate("/usuario"), 1000);
            
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMensaje("Hubo un error de red al contactar al servidor de Azure.");
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
