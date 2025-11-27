import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State para manejar el producto, la categoría y los productos relacionados
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el producto por ID desde la API
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        setProduct(response.data); // Establecer el producto
        // Obtener la categoría del producto
        axios
          .get(`http://localhost:5000/api/categories/${response.data.categoryId}`)
          .then((catResponse) => {
            setCategory(catResponse.data); // Establecer la categoría
          })
          .catch((error) => console.error("Error al obtener la categoría", error));

        // Obtener productos relacionados
        axios
          .get(`http://localhost:5000/api/products?categoryId=${response.data.categoryId}`)
          .then((relatedResponse) => {
            setRelated(relatedResponse.data); // Establecer los productos relacionados
            setLoading(false); // Finalizar la carga
          })
          .catch((error) => console.error("Error al obtener productos relacionados", error));
      })
      .catch((error) => console.error("Error al obtener el producto", error));
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Producto no encontrado</h2>
        <Link to="/">Volver a la tienda</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));

    navigate("/carrito"); // Redirige a carrito
  };

  return (
    <div className={styles.productDetail}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.productImage} />
      </div>

      <div className={styles.productInfo}>
        <h1 className={styles.productName}>{product.name}</h1>
        <p className={styles.category}>Categoría: {category?.name}</p>
        <p className={styles.price}>S/ {product.price}</p>
        <p className={styles.description}>{product.description}</p>

        <button className={styles.cartButton} onClick={handleAddToCart}>
          Agregar al carrito 🛒
        </button>
      </div>

      {related.length > 0 && (
        <div className={styles.relatedSection}>
          <h2>Productos relacionados</h2>
          <div className={styles.relatedGrid}>
            {related.map((r) => (
              <Link key={r.id} to={`/productos/${r.id}`} className={styles.relatedCard}>
                <img src={r.image} alt={r.name} />
                <p>{r.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
