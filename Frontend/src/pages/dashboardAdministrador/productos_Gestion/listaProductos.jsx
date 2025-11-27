import { Link } from 'react-router-dom';
import ProductosItem from '../../../components/dashboardComponents/ProductosItem';
import { useProductos } from '../../../context/ProductosContext';

function listaProductos() {
  const { productos } = useProductos();

  return (
    <div>
      <h1>Lista de Productos: </h1>
        <Link to="/dashboard/listaProductos/agregarProducto">
          <button id="agregar-btn">Agregar Producto</button>
        </Link>
      <ul id="lista-PC">
        {productos.map(producto => (
            <ProductosItem key={producto.id} producto={producto}
            />
        ))}
      </ul>
    </div>
  );
}

export default listaProductos;