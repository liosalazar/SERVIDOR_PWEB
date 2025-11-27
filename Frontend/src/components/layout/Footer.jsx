import { Link } from "react-router-dom";
import styles from "./Footer.module.css"

import facebookIcon from "../../assets/icons/facebook.svg"
import instagramIcon from "../../assets/icons/instagram.svg"
import tiktokIcon from "../../assets/icons/tiktok.svg"

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* === Información de la empresa === */}
                <div className={styles.footerSection}>
                    {/* Si alcanza tiempo, colocar todo como enlaces*/}
                    <h4>Sobre Nosotros</h4>
                    <p>
                        Un gran poder conlleva una gran resposabilidad.
                        Somos una empresa líder en ecommerce de superpoderes.
                        Más de veinte años de historia trabajando junto a los mejores héroes y villanos del mundo.
                        No nos responsabilizamos del uso que se le dé a los productos.
                        Consulte la legalidad en su país.
                    </p>
                </div>

                {/* === Enlaces internos === */}
                <div className={styles.footerSection}>
                    <h4>Explorar</h4>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/search">Buscar Productos</Link></li>
                    </ul>
                </div>

                {/* === Redes Sociales === */}
                <div className={styles.footerSection}>
                    <h4>Síguenos</h4>
                    <div className={styles.socialLinks}>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <img src={facebookIcon} alt="Facebook" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <img src={instagramIcon} alt="Instagram" />
                        </a>
                        <a
                            href="https://tiktok.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                        >
                            <img src={tiktokIcon} alt="TikTok" />
                        </a>
                    </div>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <p>© 2025 HeroMarket. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;