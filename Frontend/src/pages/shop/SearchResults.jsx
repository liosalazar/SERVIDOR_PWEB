import { useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/shop/ProductCard";
import categories from "../../data/categories";
import products from "../../data/products";
import styles from "./SearchResults.module.css";

const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query")?.toLowerCase() || "";

    const [selectedCategory, setSelectedCategory] = useState("todos");
    const [sortBy, setSortBy] = useState("nombre");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Filtrado
    const filteredProducts = products.filter(product => {
        if (selectedCategory != "todos" && product.categoryId != parseInt(selectedCategory)) {
            return false;
        }

        if (searchQuery) {
            const category = categories.find(cat => cat.id == product.categoryId);
            const matchesName = product.name.toLowerCase().includes(searchQuery);
            const matchesCategory = category?.name.toLowerCase().includes(searchQuery);

            return matchesName || matchesCategory;
        }

        return true;
    });

    // Ordenamiento
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "nombre") {
            return sortOrder === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else {
            return sortOrder === "asc"
                ? a.price - b.price
                : b.price - a.price;
        }
    });

    // Paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    return (
        <div className={styles.searchResults}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <h3>Categorías</h3>
                <ul>
                    <li
                        className={selectedCategory === "todos" ? styles.active : ""}
                        onClick={() => {
                            setSelectedCategory("todos");
                            setCurrentPage(1);
                        }}
                    >
                        Todas
                    </li>
                    {categories.map(cat => (
                        <li
                            key={cat.id}
                            className={selectedCategory === String(cat.id) ? styles.active : ""}
                            onClick={() => {
                                setSelectedCategory(String(cat.id));
                                setCurrentPage(1);
                            }}
                        >
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Contenido principal */}
            <main className={styles.resultsMain}>
                <div className={styles.resultsHeader}>
                    <h2>
                        {searchQuery ? `Resultados para: "${searchQuery}"` : "Todos los productos"}{" "}
                        <span>({filteredProducts.length})</span>
                    </h2>

                    <div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="nombre">Nombre</option>
                            <option value="precio">Precio</option>
                        </select>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">Ascendente</option>
                            <option value="desc">Descendente</option>
                        </select>
                    </div>
                </div>

                {currentProducts.length > 0 ? (
                    <>
                        <div className={styles.productsGrid}>
                            {currentProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                >
                                    ←
                                </button>
                                <span>Página {currentPage} de {totalPages}</span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className={styles.noResults}>No se encontraron productos</p>
                )}
            </main>
        </div>
    );

};

export default SearchResults;