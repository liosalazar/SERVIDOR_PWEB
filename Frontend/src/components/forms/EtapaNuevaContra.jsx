export default function EtapaNuevaContra({ nuevaContra, setNuevaContra }) {
  return (
    <>
      <label>Nueva contraseña</label>
      <input
        type="password"
        placeholder="Escribe tu nueva contraseña"
        value={nuevaContra}
        onChange={(e) => setNuevaContra(e.target.value)}
        required
      />
      <button type="submit">Guardar nueva contraseña</button>
    </>
  );
}
