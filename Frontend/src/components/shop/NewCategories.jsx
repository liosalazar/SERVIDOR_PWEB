import CategoryCard from "./CategoryCard";
import categories from "../../data/categories";
import styles from "./shop.module.css";

const NewCategories = () => {
    const newCategories = categories.slice(-3);

    return (
        <section className={styles.newCategories}>
            <h2 className={styles.sectionTitle}>Categorías nuevas</h2>

            <div className={styles.categoryGrid}>
                {newCategories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
};

export default NewCategories;