import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Páginas públicas
import HomePage from "./pages/shop/HomePage";
import ProductDetail from "./pages/shop/ProductDetail";
import SearchResults from "./pages/shop/SearchResults";

// Páginas de usuario
import IniciarSesion from "./pages/usuario/IniciarSesion";
import Registro from "./pages/usuario/Registro";
import OlvideContra from "./pages/usuario/OlvideContra";
import PanelUsuario from "./pages/usuario/PanelUsuario";

// Páginas de perfil
import EditarPerfil from "./pages/usuario/perfil/EditarPerfil";
import CambiarContra from "./pages/usuario/perfil/CambiarContra";

// Páginas de órdenes
import MisOrdenes from "./pages/usuario/ordenes/MisOrdenes";
import DetalleOrden from "./pages/usuario/ordenes/DetalleOrden";

// Páginas del dashboard
import ListaUsuarios from "./pages/dashboardAdministrador/listaUsuarios";
import ResumenOrdenes from "./pages/dashboardAdministrador/resumenOrdenes";
import ResumenVentas from "./pages/dashboardAdministrador/resumenVentas";
import ListaProductos from "./pages/dashboardAdministrador/productos_Gestion/listaProductos";
import AgregarProducto from "./pages/dashboardAdministrador/productos_Gestion/agregarProducto";
import EditarProducto from "./pages/dashboardAdministrador/productos_Gestion/editarProducto";
import CrearCategorias from "./pages/dashboardAdministrador/categorias_Gestion/crearCategorias";
import GestionCategorias from "./pages/dashboardAdministrador/categorias_Gestion/gestionCategorias";
import DashboardLayout from "./pages/dashboardAdministrador/dashboardLayout";

// Páginas de productos
import Carrito from "./pages/productos/Carrito";
import Checkout from "./pages/productos/Checkout";
import PedidoCompleto from "./pages/productos/PedidoCompleto";

// Página no encontrada
import NotFound from "./pages/notfound/NotFound";

// === Admin ===
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsuariosList from "./components/admin/UsuariosList";
import UsuarioDetalle from "./components/admin/UsuarioDetalle";
import OrdenesList from "./components/admin/OrdenesList";
import OrdenDetalle from "./components/admin/OrdenDetalle";

// Contextos
import { ProductosProvider } from "./context/ProductosContext";
import { CategoriasProvider } from "./context/CategoriasContext";

function App() {
  // Simulamos un usuario logueado o no
  const user = { name: "Usuario" };

  return (
    <CategoriasProvider>
      <ProductosProvider>
        <Router>
          <Navbar user={user} />
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResults />} />

            {/* Páginas públicas */}
            <Route path="/iniciar-sesion" element={<IniciarSesion />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/usuario/olvide-contra" element={<OlvideContra />} />

            {/* Páginas de usuario */}
            <Route path="/usuario" element={<PanelUsuario />} />

            {/* Páginas de perfil */}
            <Route path="/usuario/perfil/editar" element={<EditarPerfil />} />
            <Route path="/usuario/perfil/cambiar-contra" element={<CambiarContra />} />

            {/* Páginas de órdenes */}
            <Route path="/usuario/ordenes" element={<MisOrdenes />} />
            <Route path="/usuario/ordenes/:id" element={<DetalleOrden />} />

            {/* === Admin === */}
            <Route path="/admin" element={<AdminDashboard user={user} />} />
            <Route path="/admin/usuarios" element={<UsuariosList />} />
            <Route path="/admin/usuarios/:id" element={<UsuarioDetalle />} />
            <Route path="/admin/ordenes" element={<OrdenesList />} />
            <Route path="/admin/ordenes/:id" element={<OrdenDetalle />} />

            {/* Páginas de productos */}
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido-completo" element={<PedidoCompleto />} />

            {/* Página no encontrada */}
            <Route path="*" element={<NotFound />} />

            {/* Dashboard del administrador */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="/dashboard/ventas" element={<ResumenVentas />} />
              <Route path="/dashboard/ordenes" element={<ResumenOrdenes />} />
              <Route path="/dashboard/listaProductos" element={<ListaProductos />} />
              <Route
                path="/dashboard/listaProductos/agregarProducto"
                element={<AgregarProducto />}
              />
              <Route
                path="/dashboard/listaProductos/:id/edit"
                element={<EditarProducto />}
              />
              <Route path="/dashboard/categorias" element={<GestionCategorias />} />
              <Route path="/dashboard/categorias/crear" element={<CrearCategorias />} />
              <Route path="/dashboard/usuarios" element={<ListaUsuarios />} />
            </Route>
          </Routes>

          <Footer />
        </Router>
      </ProductosProvider>
    </CategoriasProvider>
  );
}

export default App;
