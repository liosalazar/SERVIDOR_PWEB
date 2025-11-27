import React, { useState } from "react";
import styles from "./usuarios.module.css";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: "Daniel Daza", correo: "daniel@hero.com", activo: true },
    { id: 2, nombre: "Farid Tello", correo: "farid@hero.com", activo: false },
    { id: 3, nombre: "Julio Salazar", correo: "julio@hero.com", activo: true },
  ]);

  const toggleEstado = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, activo: !u.activo } : u
      )
    );
  };

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  return (
    <div className={styles.container}>
      <h2>Gestión de Usuarios</h2>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>
                <span className={u.activo ? styles.activo : styles.inactivo}>
                  {u.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <button onClick={() => setUsuarioSeleccionado(u)}>Ver</button>
                <button onClick={() => toggleEstado(u.id)}>
                  {u.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarioSeleccionado && (
        <div className={styles.detalle}>
          <h3>Detalle de usuario</h3>
          <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</p>
          <p><strong>Correo:</strong> {usuarioSeleccionado.correo}</p>
          <p><strong>Estado:</strong> {usuarioSeleccionado.activo ? "Activo" : "Inactivo"}</p>
          <button onClick={() => setUsuarioSeleccionado(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
