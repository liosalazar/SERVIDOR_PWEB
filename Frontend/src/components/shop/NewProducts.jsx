import ProductCard from "./ProductCard";
import products from "../../data/products";
import styles from "./shop.module.css"

const NewProducts = ({ onCartClick }) => {
    const newProducts = products.filter((product) => product.isNew);

    return (
        <section className={styles.newProducts}>
            <h2 className={styles.sectionTitle}>Productos nuevos</h2>

            <div className={styles.newProductGrid}>
                {newProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onCartClick={onCartClick}  
                    />
                ))}
            </div>
        </section>
    );
};

export default NewProducts;