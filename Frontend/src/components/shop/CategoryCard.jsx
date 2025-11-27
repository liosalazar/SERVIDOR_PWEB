import { Link } from "react-router-dom"
import styles from "./shop.module.css"

const CategoryCard = ({ category }) => {
    return (
        <div className={styles.categoryCard}>
            <img
                src={category.image}
                alt={category.name}
                className={styles.categoryImage}
            />

            <div className={styles.categoryContent}>
                <h3 className={styles.categoryTitle}>{category.name}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>

                <Link
                    to={`/search?query=${category.name}`}
                    className={styles.categoryButton}
                >
                    Explorar
                </Link>
            </div>
        </div>
    );
};

export default CategoryCard;