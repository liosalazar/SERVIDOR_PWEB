export default function EtapaCodigo({ codigo, setCodigo }) {
  return (
    <>
      <label>Ingresa el código de verificación</label>
      <input
        type="text"
        placeholder="Código de verificación"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        required
      />
      <button type="submit">Verificar código</button>
    </>
  );
}
