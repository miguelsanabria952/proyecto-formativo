// Mensaje de retroalimentación (éxito, error o información).
// Siempre lleva un símbolo además del color. Los errores usan role="alert" para que los lectores
// de pantalla los anuncien de inmediato; los demás usan role="status".
const ICONOS = { exito: '✔', error: '⚠', info: 'ℹ' };

export default function Alerta({ tipo = 'info', children }) {
  return (
    <div className={`alerta alerta-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <span className="alerta-icono" aria-hidden="true">
        {ICONOS[tipo]}
      </span>
      <div>{children}</div>
    </div>
  );
}
