import { formatearFecha, formatearHora } from '../utils/formato.js';

// Tarjeta de ruta (Prototipo 4): muestra solo los datos necesarios y deja visible el número de cupos.
// `accion` es un nodo opcional (botón o enlace) que se dibuja al pie de la tarjeta.
export default function RutaCard({ ruta, conductor, accion }) {
  const hayCupos = ruta.cupos_disponibles > 0;

  return (
    <article className="tarjeta">
      <h3 className="tarjeta-titulo">
        {ruta.origen} <span aria-hidden="true">→</span>
        <span className="solo-lectores"> a </span> {ruta.destino}
      </h3>
      <dl className="datos">
        <div>
          <dt>Fecha</dt>
          <dd>{formatearFecha(ruta.fecha)}</dd>
        </div>
        <div>
          <dt>Hora de salida</dt>
          <dd>{formatearHora(ruta.hora_salida)}</dd>
        </div>
        {ruta.paradas && (
          <div>
            <dt>Paradas</dt>
            <dd>{ruta.paradas}</dd>
          </div>
        )}
        {conductor && (
          <div>
            <dt>Conductor</dt>
            <dd>{conductor}</dd>
          </div>
        )}
        <div>
          <dt>Cupos</dt>
          <dd className={hayCupos ? 'cupos-ok' : 'cupos-cero'}>
            <span aria-hidden="true">{hayCupos ? '✔ ' : '✖ '}</span>
            {hayCupos
              ? `${ruta.cupos_disponibles} ${ruta.cupos_disponibles === 1 ? 'cupo disponible' : 'cupos disponibles'}`
              : 'Sin cupos'}
          </dd>
        </div>
      </dl>
      {accion && <div className="tarjeta-accion">{accion}</div>}
    </article>
  );
}
