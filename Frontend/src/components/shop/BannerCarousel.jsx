import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./shop.module.css";

const banners = [
    {
        id: 1,
        image: "/images/banners/halloween-sale.jpg",
        title: "Este Halloween complementa tu disfraz con el mejor superpoder.",
        subtitle: "¡Usa el código HALLOWEEN10 para obtener 10% de descuento en todos los superpoderes hasta fin de mes!",
        buttonText: "Ver Productos",
        link: "/search"
    },
    {
        id: 2,
        image: "/images/banners/invisible-banner.jpg",
        title: "Si ya eres invisible para los demás... selo literalmente.",
        subtitle: "El superpoder de invisibilidad de siempre, ahora de nuevo en stock.",
        buttonText: "Cómpralo ya",
        link: "/product/25"
    },
    {
        id: 3,
        image: "/images/banners/mental-powers-banner.jpg",
        title: "¿Camino a jalar un curso?",
        subtitle: "Tranquilo, tenemos la solución. Porque si no eres el más inteligente, al menos le puedes leer la mente.",
        buttonText: "¡Necesito aprobar!",
        link: "/product/2"
    }
];

const BannerCarousel = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    // Avanzar automáticamente cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const nextBanner = () => {
        setCurrent((prev) => (prev + 1) % banners.length);
    }

    const prevBanner = () => {
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    }

    const { image, title, subtitle, buttonText } = banners[current];

    return (
        <section className={styles.bannerCarousel}>
            <img
                src={image}
                alt={title}
                className={styles.bannerImage}
            />

            <div className={styles.bannerContent}>
                <h1 className={styles.bannerTitle}>{title}</h1>
                <p className={styles.bannerSubtitle}>{subtitle}</p>
                <button
                    className={styles.bannerButton}
                    onClick={() => navigate(banners[current].link)}
                >
                    {buttonText}
                </button>
            </div>

            {/* Navegación por flechas */}
            <button onClick={prevBanner} className={`${styles.navButton} ${styles.leftArrow}`}>
                ‹
            </button>
            <button onClick={nextBanner} className={`${styles.navButton} ${styles.rightArrow}`}>
                ›
            </button>

            {/* Indicadores de posición */}
            <div className={styles.dotsContainer}>
                {banners.map((_, i) => (
                    <span
                        key={i}
                        className={`${styles.dot} ${i == current ? styles.activeDot : ""}`}
                        onClick={() => setCurrent(i)}
                    ></span>
                ))}
            </div>
        </section>
    );
};

export default BannerCarousel;