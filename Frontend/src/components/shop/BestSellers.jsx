import ProductCard from "./ProductCard";
import products from "../../data/products";
import styles from "./shop.module.css";
const BestSellers = ({ onCartClick }) => {
    const topProducts = [...products].sort((a,b) => b.sales - a.sales).slice(0,12);

    return (
        <section className={styles.bestSellers}>
            <h2 className={styles.sectionTitle}>Más vendidos del mes</h2>
            <div className={styles.productGrid}>
                {topProducts.map(product => (
                    <ProductCard key={product.id} product={product} onCartClick={onCartClick} />
                ))}
            </div>
        </section>
    );
};

export default BestSellers;