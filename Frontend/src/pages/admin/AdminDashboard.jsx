
import { useNavigate } from "react-router-dom";
import styles from "./admin.module.css"; 

const AdminIndexPage = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.dashboard}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>Gestiona las secciones internas del sistema.</p>

            <div className={styles.buttonsContainer}>
                <button onClick={() => navigate("/dashboard/usuarios")} className={styles.adminButton}>
                    👥 Ver Usuarios
                </button>
                <button onClick={() => navigate("/dashboard/ordenes")} className={styles.adminButton}>
                    📦 Ver Órdenes
                </button>
            </div>
        </section>
    );
};

export default AdminDashboard;