import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./shop.module.css";

const ProductCard = ({ product }) => {
  const [mensajeVisible, setMensajeVisible] = useState(false);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // ✅ Mostrar mensaje durante 2 segundos
    setMensajeVisible(true);
    setTimeout(() => setMensajeVisible(false), 2000);
  };

  return (
    <div className={styles.productCard}>
      <img
        src={product.image}
        alt={product.name}
        className={styles.productImage}
      />

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productCategory}>{product.category}</p>
        <p className={styles.productPrice}>S/ {product.price}</p>

        <div className={styles.productActions}>
          <Link to={`/product/${product.id}`}>Ver detalles</Link>
          <button onClick={handleAddToCart}>🛒 Agregar al carrito</button>
        </div>

        {/* ✅ Mensaje temporal */}
        {mensajeVisible && (
          <div className={styles.mensajeExito}>
            ✅ ¡Producto añadido al carrito!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
