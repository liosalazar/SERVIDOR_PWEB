import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategorias } from '../../context/CategoriasContext';

function ProductosForm({ onSubmit, initialProducto = { nombre: '', categoriaId: '', descripcion: '', precio: '', imagen_url: '', stock: ''} }) {
  const [producto, setProducto] = useState(initialProducto);
  const navigate = useNavigate();
  const { categorias } = useCategorias();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prevProducto => ({ ...prevProducto, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (producto.nombre.trim() === '' || producto.descripcion.trim() === '' || producto.categoriaId === '' || producto.precio === '') {
      alert('Por favor rellenar todos los campos necesario.');
      return;
    }
    onSubmit({
        ...producto,
        precio: parseFloat(producto.precio),
        stock: parseInt(producto.stock) || 0
    });
    navigate('/dashboard/listaProductos');
  };

  return (
    <form onSubmit={handleSubmit} className="form-productos">
      <input
        type="text"
        name="nombre"
        value={producto.nombre}
        onChange={handleChange}
        placeholder="Nombre del Producto"
        required
      />
      <select
        name="categoriaId"
        value={producto.categoriaId}
        onChange={handleChange}
        required
      >
        <option value="">-- Seleccione una categoría --</option>
        {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
                {categoria.name}
            </option>
        ))}
      </select>

      <input
        type="text"
        name="descripcion"
        value={producto.descripcion}
        onChange={handleChange}
        placeholder="Descripción del producto"
        required
      />
      <label>Precio:
      <input
        type="number"
        name="precio"
        step="0.01"
        value={producto.precio}
        onChange={handleChange}
        required
      />
      </label>
      <input
        type="url"
        name="imagen_url"
        value={producto.imagen_url}
        onChange={handleChange}
        placeholder="URL de una imagen referencial"
      />
      <label>Stock del producto:
      <input
        type="number"
        name="stock"
        value={producto.stock}
        onChange={handleChange}
      />
      </label>
      <div className="form-acciones">
        <button type="submit" id="agregar-btn">Guardar</button>
        <button type="button" className="btn-cancelar" onClick={() => navigate(-1)}>Cancelar</button>
      </div>
    </form>
  );
}

export default ProductosForm;