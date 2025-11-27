export default function Mensaje({ texto }) {
  if (!texto) return null;
  return (
    <p
      style={{
        color: texto.includes("éxito") || texto.includes("✅") ? "green" : "red",
        textAlign: "center",
        marginTop: "1rem",
      }}
    >
      {texto}
    </p>
  );
}
