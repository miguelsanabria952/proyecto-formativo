// Lista desplegable reutilizable con la misma estructura accesible de CampoFormulario:
// etiqueta visible, ayuda opcional y mensaje de error con símbolo y texto.
// `opciones` = [{ valor, texto }].
export default function CampoSelect({
  id,
  etiqueta,
  valor,
  onChange,
  onBlur,
  opciones,
  error = '',
  ayuda = '',
  obligatorio = false,
  textoVacio = 'Elige una opción',
}) {
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;
  const describedBy = [ayuda ? idAyuda : null, error ? idError : null].filter(Boolean).join(' ');

  return (
    <div className="campo">
      <label htmlFor={id}>
        {etiqueta}
        {obligatorio && (
          <span className="marca-obligatorio" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {ayuda && (
        <p id={idAyuda} className="ayuda">
          {ayuda}
        </p>
      )}
      <select
        id={id}
        name={id}
        value={valor}
        onChange={onChange}
        onBlur={onBlur}
        required={obligatorio}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy || undefined}
        className={error ? 'invalido' : undefined}
      >
        <option value="">{textoVacio}</option>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
      {error && (
        <p id={idError} className="error">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}
