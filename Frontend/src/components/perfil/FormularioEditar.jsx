import React from "react";

export default function FormularioEditar({ nombre, setNombre, email, setEmail, celular, setCelular, imagen, setImagen, handleSubmit }) {
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagen(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit({ nombre, correo: email, celular, imagen });
  };

  return (
    <form className="editarperfil-form" onSubmit={onSubmit}>
      <div className="editarperfil-imagen">
        {imagen ? (
          <img src={imagen} alt="Foto de perfil" className="perfil-img" />
        ) : (
          <p className="perfil-no-img">No has seleccionado una foto</p>
        )}
        <input type="file" accept="image/*" onChange={handleImagenChange} />
      </div>

      <label>Nombre completo</label>
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

      <label>Correo electrónico</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      <label>Celular</label>
      <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} />
      <button type="submit">Guardar cambios</button>
    </form>
  );
}
