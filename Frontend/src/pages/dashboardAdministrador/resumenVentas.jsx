import GraficoBarras from '@components/dashboardComponents/GraficoBarras';

const resumenVentas = () => {
    return(
        <div>
            <h2>Usuarios Totales Registrados: </h2>
            <br></br>
            <h4><b>20</b></h4>
            <br></br>
            <h2><b>Estadística de ventas por mes:</b></h2>
            <GraficoBarras />
        </div>
    );
};

export default resumenVentas;