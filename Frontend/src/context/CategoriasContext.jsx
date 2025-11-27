import React from "react";
import { createContext, useContext, useState } from "react";

const CategoriasContext = createContext();

export const useCategorias = () => {
    const context = useContext(CategoriasContext);
    if (!context) {
        throw new Error("useCategorias must be used within a CategoriasProvider");
    }
    return context;
};

export function CategoriasProvider({ children }) {
    const [categorias, setCategorias] = useState([
    {
      id: 1,
      name: 'Poderes Mentales'
    },
    {
      id: 2,
      name: 'Control Elemental'
    },
    {
      id: 3,
      name: '⁠Mejoras Físicas'
    },
    {
      id: 4,
      name: '⁠Sigilo e Invisibilidad'
    },
    {
      id: 5,
      name: '⁠Manipulación Espaciotemporal'
    },
    {
      id: 6,
      name: '⁠Curación y Regeneración'
    }
]);

    const createCategoria = (categoria) => {
        setCategorias([...categorias, { ...categoria, id: Date.now() }]);
    };

    const deleteCategoria = (categoriaId) => {
        setCategorias(categorias.filter((categoria) => categoria.id !== categoriaId));
    };

    return (
        <CategoriasContext.Provider value={{
            categorias,
            createCategoria,
            deleteCategoria
            }}>
            {children}
        </CategoriasContext.Provider>
    );
}