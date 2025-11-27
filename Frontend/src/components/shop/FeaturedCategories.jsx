import CategoryCard from "./CategoryCard";
import categories from "../../data/categories"
import styles from "./shop.module.css"

const FeaturedCategories = () => {
    const featured = categories.filter(cat =>
        [1, 2, 3].includes(cat.id)
    );

    return (
        <section className={styles.featuredCategories}>
            <h2 className={styles.sectionTitle}>Categorías destacadas</h2>

            <div className={styles.categoryGrid}>
                {featured.map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                ))}
            </div>
        </section>
    );
};

export default FeaturedCategories;