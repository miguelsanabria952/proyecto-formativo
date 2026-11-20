// Botón reutilizable. variante: 'principal' | 'secundario' | 'peligro'. tamano: 'pequeno' | undefined.
// Todos los botones de la app usan este componente para mantener el mismo aspecto y tamaño táctil.
export default function Boton({
  variante = 'principal',
  tamano,
  ancho = false,
  type = 'button',
  children,
  ...resto
}) {
  const clases = ['boton', `boton-${variante}`];
  if (tamano === 'pequeno') clases.push('boton-pequeno');
  if (ancho) clases.push('boton-ancho');
  return (
    <button type={type} className={clases.join(' ')} {...resto}>
      {children}
    </button>
  );
}
