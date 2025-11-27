import { useParams, useNavigate } from 'react-router-dom';
import ProductosForm from '../../../components/dashboardComponents/ProductosForm';
import { useProductos } from '../../../context/ProductosContext';

function TaskEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, updateProducto } = useProductos();
  const productoEditar = productos.find(t => t.id === parseInt(id));

  if (!productoEditar) {
    navigate('/404', { replace: true });
    return null;
  }

  const handleUpdate = (updatedProducto) => {
    updateProducto({ ...updatedProducto, id: productoEditar.id });
  };

  return (
    <div>
      <h2>Editar Producto</h2>
      <ProductosForm onSubmit={handleUpdate} initialProducto={productoEditar} />
    </div>
  );
}

export default TaskEdit;