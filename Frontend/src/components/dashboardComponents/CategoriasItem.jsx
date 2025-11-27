import { useCategorias } from '../../context/CategoriasContext';

function CategoriasItem({ categoria }) {
  const { deleteCategoria } = useCategorias();

  return (
    <li>
      <div className="body">
        <h3>{categoria.name}</h3>
      </div>
      <div className="actions">
        <button className="btn-eliminar" onClick={() => deleteCategoria(categoria.id)}>Eliminar</button>
      </div>
    </li>
  );
}

export default CategoriasItem;