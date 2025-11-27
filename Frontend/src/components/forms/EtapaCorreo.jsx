export default function EtapaCorreo({ email, setEmail }) {
  return (
    <>
      <label>Correo electrónico</label>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Enviar</button>
    </>
  );
}
