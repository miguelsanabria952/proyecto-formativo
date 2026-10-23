// Tabla reutilizable. `columnas` = [{ clave, etiqueta, render? }]. Cada celda lleva data-label
// para que en pantallas pequeñas la tabla se vea como una lista de tarjetas (ver index.css).
export default function TablaDatos({ titulo, columnas, filas, claveFila, vacio = 'No hay información para mostrar.' }) {
  if (filas.length === 0) return <p className="vacio">{vacio}</p>;

  return (
    <table className="tabla">
      <caption>{titulo}</caption>
      <thead>
        <tr>
          {columnas.map((c) => (
            <th key={c.clave} scope="col">
              {c.etiqueta}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila) => (
          <tr key={fila[claveFila]}>
            {columnas.map((c) => (
              <td key={c.clave} data-label={c.etiqueta}>
                {c.render ? c.render(fila) : fila[c.clave]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
