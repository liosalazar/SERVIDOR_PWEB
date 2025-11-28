import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Contextos
import { ProductosProvider } from "./context/ProductosContext";
import { CategoriasProvider } from "./context/CategoriasContext";
import { AuthProvider } from "./context/AuthContext"; // Ya está importado correctamente

// Componentes y Páginas (Imports omitidos para brevedad, pero asegúrate de que existen)
// Importar AdminRoute (Asegúrate de que la ruta sea correcta)
import AdminRoute from './components/routes/AdminRoute'; 
import DashboardLayout from "./pages/dashboardAdministrador/dashboardLayout";

// Páginas de Dashboard
import ListaUsuarios from "./pages/dashboardAdministrador/listaUsuarios";
import ResumenOrdenes from "./pages/dashboardAdministrador/resumenOrdenes";
import ResumenVentas from "./pages/dashboardAdministrador/resumenVentas";
import ListaProductos from "./pages/dashboardAdministrador/productos_Gestion/listaProductos";
import AgregarProducto from "./pages/dashboardAdministrador/productos_Gestion/agregarProducto";
import EditarProducto from "./pages/dashboardAdministrador/productos_Gestion/editarProducto";
import GestionCategorias from "./pages/dashboardAdministrador/categorias_Gestion/gestionCategorias";
import CrearCategorias from "./pages/dashboardAdministrador/categorias_Gestion/crearCategorias";

// ...
import HomePage from "./pages/shop/HomePage";
import SearchResults from "./pages/shop/SearchResults"; 
import IniciarSesion from "./pages/usuario/IniciarSesion"; 
// ...
import Registro from "./pages/usuario/Registro";
import OlvideContra from "./pages/usuario/OlvideContra";
import ProductDetail from "./pages/shop/ProductDetail";
import Carrito from "./pages/productos/Carrito";
import Checkout from "./pages/productos/Checkout";
import PedidoCompleto from "./pages/productos/PedidoCompleto";
import NotFound from "./pages/notfound/NotFound"; // Para la ruta path="*"

import PanelUsuario from "./pages/usuario/PanelUsuario";
import EditarPerfil from "./pages/usuario/perfil/EditarPerfil";
import CambiarContra from "./pages/usuario/perfil/CambiarContra";
import MisOrdenes from "./pages/usuario/ordenes/MisOrdenes";
import DetalleOrden from "./pages/usuario/ordenes/DetalleOrden";

function App() {
  // REMOVER: Ya no se simula el usuario. Se usará el AuthContext.
  // const user = { name: "Usuario" }; 

  return (
    <CategoriasProvider>
      <ProductosProvider>
        {/* Paso 1: AuthProvider debe envolver al Router para que funcione useAuth() en el Navbar */}
        <AuthProvider> 
          <Router>
            {/* El Navbar ahora lee el usuario del AuthContext, así que user={user} se quita */}
            <Navbar /> 
            
            <Routes>
              {/* Páginas Públicas y de Productos */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/iniciar-sesion" element={<IniciarSesion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/usuario/olvide-contra" element={<OlvideContra />} />
              <Route path="/productos/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-completo" element={<PedidoCompleto />} />

              {/* Páginas de Usuario (Pueden ser protegidas por un UserRoute, pero las dejamos abiertas por ahora) */}
              <Route path="/usuario" element={<PanelUsuario />} />
              <Route path="/usuario/perfil/editar" element={<EditarPerfil />} />
              <Route path="/usuario/perfil/cambiar-contra" element={<CambiarContra />} />
              <Route path="/usuario/ordenes" element={<MisOrdenes />} />
              <Route path="/usuario/ordenes/:id" element={<DetalleOrden />} />
              
              {/* Rutas de Admin/Dashboard (La estructura original de AdminDashboard está duplicada, la quitamos) */}
              {/* <Route path="/admin" element={<AdminDashboard user={user} />} /> // Se recomienda usar la ruta /dashboard */}

              {/*
                Paso 2: RUTA PROTEGIDA DEL DASHBOARD
                El elemento DashboardLayout se renderiza solo si el usuario es Admin.
                El asterisco (*) permite rutas anidadas.
              */}
              <Route 
                path="/dashboard/*" 
                element={
                  <AdminRoute>
                    <DashboardLayout />
                  </AdminRoute>
                } 
              >
                {/* Paso 3: RUTAS ANIDADAS DENTRO DEL DASHBOARD
                  Estas rutas se renderizarán DENTRO del <Outlet /> de DashboardLayout.
                  *No necesitan el prefijo "/dashboard" si están anidadas.
                */}
                <Route index element={<Navigate to="ventas" replace />} /> {/* Ruta por defecto /dashboard */}
                <Route path="ventas" element={<ResumenVentas />} />
                <Route path="ordenes" element={<ResumenOrdenes />} />
                <Route path="listaProductos" element={<ListaProductos />} />
                <Route path="listaProductos/agregarProducto" element={<AgregarProducto />} />
                <Route path="listaProductos/:id/edit" element={<EditarProducto />} />
                <Route path="categorias" element={<GestionCategorias />} />
                <Route path="categorias/crear" element={<CrearCategorias />} />
                <Route path="usuarios" element={<ListaUsuarios />} />
              </Route>
              
              {/* Página no encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
          </Router>
        </AuthProvider>
      </ProductosProvider>
    </CategoriasProvider>
  );
}

export default App;