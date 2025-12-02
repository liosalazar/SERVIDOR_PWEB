import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import { ProductosProvider } from "./context/ProductosContext";
import { CategoriasProvider } from "./context/CategoriasContext";
import { AuthProvider } from "./context/AuthContext";

import AdminRoute from './components/routes/AdminRoute'; 
import DashboardLayout from "./pages/dashboardAdministrador/dashboardLayout";

import ListaUsuarios from "./pages/dashboardAdministrador/listaUsuarios";
import ResumenOrdenes from "./pages/dashboardAdministrador/resumenOrdenes";
import ResumenVentas from "./pages/dashboardAdministrador/resumenVentas";
import ListaProductos from "./pages/dashboardAdministrador/productos_Gestion/listaProductos";
import AgregarProducto from "./pages/dashboardAdministrador/productos_Gestion/agregarProducto";
import EditarProducto from "./pages/dashboardAdministrador/productos_Gestion/editarProducto";
import GestionCategorias from "./pages/dashboardAdministrador/categorias_Gestion/gestionCategorias";
import CrearCategorias from "./pages/dashboardAdministrador/categorias_Gestion/crearCategorias";

import HomePage from "./pages/shop/HomePage";
import SearchResults from "./pages/shop/SearchResults"; 
import IniciarSesion from "./pages/usuario/IniciarSesion"; 
import Registro from "./pages/usuario/Registro";
import OlvideContra from "./pages/usuario/OlvideContra";
import ProductDetail from "./pages/shop/ProductDetail";
import Carrito from "./pages/productos/Carrito";
import Checkout from "./pages/productos/Checkout";
import PedidoCompleto from "./pages/productos/PedidoCompleto";
import NotFound from "./pages/notfound/NotFound";

import PanelUsuario from "./pages/usuario/PanelUsuario";
import EditarPerfil from "./pages/usuario/perfil/EditarPerfil";
import CambiarContra from "./pages/usuario/perfil/CambiarContra";
import MisOrdenes from "./pages/usuario/ordenes/MisOrdenes";
import DetalleOrden from "./pages/usuario/ordenes/DetalleOrden";

function App() {
  return (
    <CategoriasProvider>
      <ProductosProvider>
        <AuthProvider> 
          <Router>
            <Navbar /> 
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/iniciar-sesion" element={<IniciarSesion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/usuario/olvide-contra" element={<OlvideContra />} />
              <Route path="/productos/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-completo" element={<PedidoCompleto />} />

              <Route path="/usuario" element={<PanelUsuario />} />
              <Route path="/usuario/perfil/editar" element={<EditarPerfil />} />
              <Route path="/usuario/perfil/cambiar-contra" element={<CambiarContra />} />
              <Route path="/usuario/ordenes" element={<MisOrdenes />} />
              <Route path="/usuario/ordenes/:id" element={<DetalleOrden />} />
              
              <Route 
                path="/dashboard/*" 
                element={
                  <AdminRoute>
                    <DashboardLayout />
                  </AdminRoute>
                } 
              >
                <Route index element={<Navigate to="ventas" replace />} />
                <Route path="ventas" element={<ResumenVentas />} />
                <Route path="ordenes" element={<ResumenOrdenes />} />
                <Route path="listaProductos" element={<ListaProductos />} />
                <Route path="listaProductos/agregarProducto" element={<AgregarProducto />} />
                <Route path="listaProductos/:id/edit" element={<EditarProducto />} />
                <Route path="categorias" element={<GestionCategorias />} />
                <Route path="categorias/crear" element={<CrearCategorias />} />
                <Route path="usuarios" element={<ListaUsuarios />} />
              </Route>
              
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
