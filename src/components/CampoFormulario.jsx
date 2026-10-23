// Campo de formulario reutilizable: etiqueta visible + ayuda + input + mensaje de error.
// Accesibilidad: label asociado con htmlFor, aria-invalid y aria-describedby apuntan a la ayuda y al error,
// y el error lleva un símbolo y texto (no depende solo del color).
export default function CampoFormulario({
  id,
  etiqueta,
  tipo = 'text',
  valor,
  onChange,
  onBlur,
  error = '',
  ayuda = '',
  obligatorio = false,
  ...resto
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
      <input
        id={id}
        name={id}
        type={tipo}
        value={valor}
        onChange={onChange}
        onBlur={onBlur}
        required={obligatorio}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy || undefined}
        className={error ? 'invalido' : undefined}
        {...resto}
      />
      {error && (
        <p id={idError} className="error">
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}
