import { Link } from 'react-router-dom';
import CategoriasItem from '../../../components/dashboardComponents/CategoriasItem.jsx';
import { useCategorias } from '../../../context/CategoriasContext';

function gestionCategorias() {
  const { categorias } = useCategorias(); 

  return (
    <div>
      <h1>Categoria</h1>
        <Link to="/dashboard/categorias/crear">
          <button id="agregar-btn">Crear Categoria</button>
        </Link>
      <ul id="lista-PC">
        {categorias.map(categoria => (
            <CategoriasItem key={categoria.id} categoria={categoria}
            />
          ))
        }
      </ul>
    </div>
  );
}

export default gestionCategorias;