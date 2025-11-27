import React from "react";

export default function EtapaPersonal({ nombre, setNombre, correo, setCorreo, pais, setPais, celular, setCelular }) {
  const listaPaises = [
    "Perú",
    "Argentina",
    "Bolivia",
    "Brasil",
    "Chile",
    "Colombia",
    "Ecuador",
    "México",
    "Paraguay",
    "Uruguay",
    "Venezuela",
    "España",
    "Estados Unidos",
    "Canadá",
    "Alemania",
    "Francia",
    "Italia",
    "Reino Unido",
    "Japón",
    "China",
  ];

  return (
    <>
      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <label>Correo electrónico:</label>
      <input
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />

      <label>País:</label>
      <select value={pais} onChange={(e) => setPais(e.target.value)} required>
        <option value="">Seleccione un país</option>
        {listaPaises.map((p, index) => (
          <option key={index} value={p}>
            {p}
          </option>
        ))}
      </select>

      <label>Celular:</label>
      <input
        type="tel"
        value={celular}
        onChange={(e) => setCelular(e.target.value)}
        required
      />
    </>
  );
}
