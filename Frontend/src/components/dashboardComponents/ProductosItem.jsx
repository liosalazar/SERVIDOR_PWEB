import { Link } from 'react-router-dom';
import { useProductos } from '../../context/ProductosContext';
import { useCategorias } from '../../context/CategoriasContext';

function ProductosItem({ producto }) {
  const { deleteProducto } = useProductos();
  const { categorias } = useCategorias();
  const categoria = categorias.find(c => c.id === producto.categoriaId )

  return (
    <li>
      <div className="body">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <h4>{categoria ? categoria.name : "Sin categoría"}</h4>
      </div>
      <img src={producto.imagen_url} alt={producto.descripcion} />
      <div className="actions">
        <Link to={`/dashboard/listaProductos/${producto.id}/edit`}>
          <button className="btn-editar">Editar</button>
        </Link>
        <button className="btn-eliminar" onClick={() => deleteProducto(producto.id)}>Eliminar</button>
      </div>
    </li>
  );
}

export default ProductosItem;