import CategoriasForm from "../../../components/dashboardComponents/CategoriasForm";
import { useCategorias } from "../../../context/CategoriasContext";

function CrearCategorias() {
  const { createCategoria } = useCategorias();

  return (
    <div>
      <h2>Crear Nueva Categoría: </h2>
      <CategoriasForm onSubmit={createCategoria} />
    </div>
  );
}

export default CrearCategorias;