import React from "react";
import { Link } from "react-router-dom";
import styles from "./PedidoCompleto.module.css";

function PedidoCompleto() {
  return (
    <div className={styles.pedidoContainer}>
      <h2>🎉 Compra realizada con éxito 🎉</h2>
      <p>Gracias por tu compra. ¡Tu pedido está siendo procesado!</p>
      <Link to="/">Volver a la tienda</Link>
    </div>
  );
}

export default PedidoCompleto;
