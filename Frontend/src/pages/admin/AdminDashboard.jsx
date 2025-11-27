import { useNavigate } from "react-router-dom";
import styles from "./admin.module.css";

const AdminDashboard = ({ user }) => {
    const navigate = useNavigate();

    // Simulamos un control de acceso simple
    if (!user || user.role !== "admin") {
        return (
            <div className={styles.notAllowed}>
                <h2>Acceso restringido 🚫</h2>
                <p>No tienes permiso para ver esta sección.</p>
            </div>
        );
    }

    return (
        <section className={styles.dashboard}>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>Gestiona las secciones internas del sistema.</p>

            <div className={styles.buttonsContainer}>
                <button onClick={() => navigate("/admin/usuarios")} className={styles.adminButton}>
                    👥 Ver Usuarios
                </button>
                <button onClick={() => navigate("/admin/ordenes")} className={styles.adminButton}>
                    📦 Ver Órdenes
                </button>
            </div>
        </section>
    );
};

export default AdminDashboard;
