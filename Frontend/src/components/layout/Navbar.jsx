import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; 
import styles from "./Navbar.module.css";
import React from "react";
import { useAuth } from "../../context/AuthContext"; 

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const [query, setQuery] = useState("");
  const navigate = useNavigate();


  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${query}`);
      setQuery("");
    }
  };

  const handleLogout = () => {
    logout(); 
    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo a la izquierda */}
        <Link to="/" className={styles.navbarLogo}>
          <img src="/logo.png" alt="Logo HeroMarket" className={styles.logoImage} />
        </Link>

        {/* Barra de búsqueda en el centro */}
        <form onSubmit={handleSearch} className={styles.navbarSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        {/* Links y botones a la derecha */}
        <nav className={styles.navbarLinks}>
          {user ? (
            <>
              <span className={styles.welcome}>¡Bienvenido, {user.nombre}!</span>

              {/* 🛑 CORRECCIÓN DE RUTAS: Usamos /dashboard/ */}
              {user.rol === "admin" ? (
                <>
                  <Link to="/dashboard/usuarios">Usuarios</Link>
                  <Link to="/dashboard/ordenes">Órdenes</Link>
                </>
              ) : (
                <>
                  <Link to="/usuario">Mi Perfil</Link>
                  <Link to="/usuario/ordenes">Mis Órdenes</Link>
                </>
              )}

              {/* Carrito siempre visible */}
              <Link to="/carrito" className={styles.cartLink}>
                🛒 Carrito
              </Link>

              {/* Botón de cerrar sesión */}
              <button onClick={handleLogout} className={styles.logoutButton}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/iniciar-sesion">Iniciar Sesión</Link>
              <Link to="/registro">Registrarse</Link>

              {/* Carrito aunque no esté logueado */}
              <Link to="/carrito" className={styles.cartLink}>
                🛒 Carrito
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;