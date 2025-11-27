import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { mes: "Marzo", ventas: 250 },
  { mes: "Abril", ventas: 300 },
  { mes: "Mayo", ventas: 800 },
  { mes: "Junio", ventas: 550 },
  { mes: "Julio", ventas: 620 },
  { mes: "Agosto", ventas: 400 },
];

const graficoBarras = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="ventas" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default graficoBarras;