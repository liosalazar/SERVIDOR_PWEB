import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const linkClasses = ({ isActive }) =>
    `block py-2 px-4 rounded-lg transition ${
      isActive ? "bg-gray-200 text-gray-900" : "text-gray-400 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside className="sidebar">
      <h2 className="administrador">Nombre-del-administrador</h2> 

      <nav className="nav">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard/ventas" className={linkClasses}>Resumen de ventas</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/ordenes" className={linkClasses}>Órdenes procesadas</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/listaProductos" className={linkClasses}>Gestionar Productos</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/categorias" className={linkClasses}>Gestionar Categorias</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/usuarios" className={linkClasses}>Usuarios Registrados</NavLink>
          </li>
        </ul>
      </nav>

      <button className="btn-logout" onClick={() => navigate('/productos')}>
        Log out
      </button> 
      <br>
      </br>
      <br>
      </br>
    </aside>
  );
};

export default Sidebar;