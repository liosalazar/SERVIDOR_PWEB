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
        <Link to="/" className={styles.navbarLogo}>
          <img src="/logo.png" alt="Logo HeroMarket" className={styles.logoImage} />
        </Link>

        <form onSubmit={handleSearch} className={styles.navbarSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Buscar</button>
        </form>

        <nav className={styles.navbarLinks}>
          {user ? (
            <>
              <span className={styles.welcome}>¡Bienvenido, {user.nombre}!</span>

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

              <Link to="/carrito" className={styles.cartLink}>
                🛒 Carrito
              </Link>

              <button onClick={handleLogout} className={styles.logoutButton}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/iniciar-sesion">Iniciar Sesión</Link>
              <Link to="/registro">Registrarse</Link>

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