import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/Formulario.css";

// 🛑 Importar el hook de autenticación
import { useAuth } from "../../context/AuthContext"; 

import EtapaPersonal from "../../components/forms/EtapaPersonal";
import EtapaContra from "../../components/forms/EtapaContra";
import Mensaje from "../../components/ui/Mensaje";

// 🛑 Definir la base de la API usando la variable de entorno
// La URL es: https://test1serverapi-frchhah8crcncccu.brazilsouth-01.azurewebsites.net/api
const API_BASE = import.meta.env.VITE_API_BASE_URL; // Asegúrate de definir/importar esto

function Registro() {
    // Obtener la función 'setAuthData' del contexto
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
            // 🛑 CORRECCIÓN DE RUTA: Concatenamos API_BASE con la ruta específica del router: /users/registro
            const response = await fetch(`${API_BASE}/users/registro`, {
                        method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre, correo, pais, celular, contra }),
            });

            if (!response.ok) {
                // Intentamos leer el JSON para el mensaje de error del servidor.
                const errorData = await response.json().catch(() => ({ 
                    message: 'Error de conexión o Ruta de Azure no encontrada (404). Revisar logs del servidor.' 
                }));
                setMensaje(errorData.message || "Error desconocido durante el registro.");
                return;
            }

            const data = await response.json();

            // El backend devuelve { token, user: { ... } }
            setMensaje(`Registro exitoso ✅ Bienvenido ${data.user.nombre}`);
            
            // Usar setAuthData para iniciar sesión en el estado global
            setAuthData(data.token, data.user); 
            
            setTimeout(() => navigate("/usuario"), 1000);
            
        } catch (error) {
            console.error("Error en la solicitud:", error);
            // Esto captura errores de red (ej. CORS o servidor caído)
            setMensaje("Hubo un error de red al contactar al servidor de Azure.");
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Crear cuenta</h2>
                {/* ... (Etapas de Formulario) */}
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