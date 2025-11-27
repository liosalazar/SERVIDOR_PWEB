import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoriasForm({ onSubmit, initialCategoria = { name: ''} }) {
  const [categoria, setCategoria] = useState(initialCategoria);
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoria(prevCategoria => ({ ...prevCategoria, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (categoria.name.trim() === '') {
      alert('La categoría debe tener un nombre.');
      return;
    }
    onSubmit(categoria);
    navigate('/dashboard/categorias');
  };

  return (
    <form onSubmit={handleSubmit} className="form-Categorias">
      <input
        type="text"
        name="name"
        value={categoria.name}
        onChange={handleChange}
        placeholder="Nombre de la categoría"
        required
      />
      <div className="form-acciones">
        <button type="submit" id="agregar-btn">Guardar</button>
        <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>Cancelar</button>
      </div>
    </form>
  );
}

export default CategoriasForm;