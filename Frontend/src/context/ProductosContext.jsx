import { createContext, useContext, useState } from "react";
import { useCategorias } from "./CategoriasContext";
import React from "react";

const ProductosContext = createContext();

export const useProductos = () => {
    const context = useContext(ProductosContext);
    if (!context) {
        throw new Error("useProductos must be used within a ProductosProvider");
    }
    return context;
};

export function ProductosProvider({ children }) {
    const { categorias } = useCategorias();
    const [productos, setProductos] = useState([
  {
    id: 1,
    nombre: "Vuelo",
    categoriaId: 3,
    descripcion: "Permite volar hasta Mach 0.9 con control preciso durante 24 horas.",
    precio: 199.99,
    imagen_url: "https://example.com/images/vuelo_supersonico.png",
    stock: 12
  },
  {
    id: 2,
    nombre: "Invisibilidad",
    categoriaId: 4,
    descripcion: "Hazte invisible por hasta 10 minutos; enfriamiento 48 horas.",
    precio: 79.50,
    moneda: "USD",
    imagen_url: "https://example.com/images/invisibilidad_temporal.png",
    rareza: "Raro",
    stock: 30
  },
  {
    id: 3,
    nombre: "Super Fuerza",
    categoriaId: 3,
    descripcion: "Aumenta la fuerza física 10x por 6 horas; ideal para tareas pesadas.",
    precio: 149.00,
    imagen_url: "https://example.com/images/fuerza_heroica.png",
    stock: 8
  },
  {
    id: 4,
    nombre: "Teletransportación",
    categoriaId: 5,
    descripcion: "Teleportación instantánea a lugares conocidos dentro de 50 km.",
    precio: 249.99,
    imagen_url: "https://example.com/images/teletransportacion_local.png",
    stock: 4
  },
  {
    id: 5,
    nombre: "Regeneración rápida",
    categoriaId: 6,
    descripcion: "Regenera heridas menores a moderadas en minutos; 3 usos/día.",
    precio: 129.00,
    imagen_url: "https://example.com/images/curacion_rapida.png",
    stock: 20
  },
  {
    id: 6,
    nombre: "Visión Amplificada",
    categoriaId: 3,
    descripcion: "Visión telescópica y nocturna activable por 8 horas.",
    precio: 39.99,
    imagen_url: "https://example.com/images/vision_amplificada.png",
    stock: 100
  },
  {
    id: 7,
    nombre: "Control Elemental: Fuego",
    categoriaId: 2,
    descripcion: "Genera y modera llamas a pequeña/mediana escala; uso seguro con entrenamiento.",
    precio: 179.95,
    imagen_url: "https://example.com/images/control_fuego.png",
    stock: 6
  },
  {
    id: 8,
    nombre: "Escudo Psíquico",
    categoriaId: 1,
    descripcion: "Protección mental contra intrusiones y manipulación por 12 horas.",
    precio: 159.00,
    imagen_url: "https://example.com/images/escudo_psiquico.png",
    stock: 5
  },
  {
    id: 9,
    nombre: "Eco-Comunicación",
    categoriaId: 1,
    descripcion: "Permite comunicarse con animales por 3 horas; no garantiza traducción perfecta.",
    precio: 59.00,
    imagen_url: "https://example.com/images/eco_comunicacion.png",
    stock: 25
  },
  {
    id: 10,
    nombre: "Manipulación Temporal",
    categoriaId: 5,
    descripcion: "Pequeñas ralentizaciones del tiempo (hasta 5 segundos) — uso limitado 5 veces/día.",
    precio: 349.99,
    imagen_url: "https://example.com/images/manipulacion_tiempo_micro.png",
    stock: 4
  },
  {
    id: 11,
    nombre: "Camuflaje",
    categoriaId: 4,
    descripcion: "Adapta la apariencia para mezclarse con el entorno durante 2 horas.",
    precio: 54.99,
    imagen_url: "https://example.com/images/camuflaje_ambiental.png",
    stock: 40
  },
  {
    id: 12,
    nombre: "Mente Analítica",
    categoriaId: 1,
    descripcion: "Incrementa la capacidad de procesamiento mental y razonamiento por 8 horas.",
    precio: 89.00,
    imagen_url: "https://example.com/images/mente_analitica.png",
    stock: 18
  },
  {
    id: 13,
    nombre: "Viaje en el tiempo",
    categoriaId: 5,
    descripcion: "Permite viajar al pasado o futuro conocido durante 10 minuto - Limitado a 1 vez por mes",
    precio: 599.99,
    imagen_url: "https://images.ecestaticos.com/UsQtLKl9ZunfnTymDHU2xujMTHs=/0x0:2272x1704/557x418/filters:fill(white):format(jpg)/f.elconfidencial.com%2Foriginal%2Fcee%2F8b7%2Fcf2%2Fcee8b7cf2f04a1bbb6a9943f7bb05733.jpg",
    stock: 3
  },
  {
    id: 14,
    nombre: "Control elemental: Tierra",
    categoriaId: 2,
    descripcion: "Permite mover rocas y manipular la tierra misma, requiere entrenamiento",
    precio: 299.99,
    imagen_url: "https://thumbs.dreamstime.com/b/explosi%C3%B3n-en-la-roca-de-tan-con-nube-polvo-vista-cerca-una-gran-porci%C3%B3n-tierra-o-arrojada-al-aire-creando-y-escombros-toma-380399795.jpg",
    stock: 3
  }
]);

    const addProducto = (producto) => {
        setProductos((prev) => [...prev, { ...producto, id: Date.now() }]);
    };

    const deleteProducto = (productoId) => {
        setProductos(productos.filter((producto) => producto.id !== productoId));
    };
    const updateProducto = (updatedProducto) => {
        setProductos(productos.map((producto) => (producto.id === updatedProducto.id ? updatedProducto : producto)));
    };

    return (
        <ProductosContext.Provider value={{
            productos,
            addProducto,
            deleteProducto,
            updateProducto
            }}>
            {children}
        </ProductosContext.Provider>
    );
}