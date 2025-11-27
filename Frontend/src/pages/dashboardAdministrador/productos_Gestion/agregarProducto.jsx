import ProductosForm from "../../../components/dashboardComponents/ProductosForm";
import { useProductos } from "../../../context/ProductosContext";

function agregarProducto() {
  const { addProducto } = useProductos();

  return (
    <div>
      <h2>Agregar Nuevo Producto</h2>
      <ProductosForm onSubmit={addProducto} />
    </div>
  );
}

export default agregarProducto;