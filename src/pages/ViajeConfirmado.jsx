import { Link, useParams } from 'react-router-dom';
import EstadoBadge from '../components/EstadoBadge.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { formatearFecha, formatearHora } from '../utils/formato.js';

// Prototipo 6 - Confirmación del viaje (RF007): el estado se muestra de inmediato, con símbolo y texto.
const MENSAJES = {
  aceptada: {
    simbolo: '✔',
    titulo: '¡Viaje confirmado!',
    texto: 'El conductor aceptó tu solicitud. Estos son los datos de tu viaje.',
    clase: 'exito',
  },
  pendiente: {
    simbolo: '⏳',
    titulo: 'Esperando respuesta',
    texto: 'El conductor aún no responde tu solicitud. Te avisaremos cuando lo haga.',
    clase: 'aviso',
  },
  rechazada: {
    simbolo: '✖',
    titulo: 'Solicitud rechazada',
    texto: 'El conductor no pudo aceptar tu solicitud. Puedes buscar otra ruta.',
    clase: 'error',
  },
};

export default function ViajeConfirmado() {
  usePageTitle('Detalle del viaje');
  const { id } = useParams();
  const { usuarioActual, solicitudes, obtenerRuta, obtenerUsuario } = useApp();

  const solicitud = solicitudes.find(
    (s) => s.id_solicitud === Number(id) && s.id_pasajero === usuarioActual.id_usuario
  );
  const ruta = solicitud ? obtenerRuta(solicitud.id_ruta) : null;

  if (!solicitud || !ruta) {
    return (
      <section className="panel panel-angosto">
        <h1>Viaje no encontrado</h1>
        <p>No encontramos ese viaje en tu cuenta.</p>
        <Link to="/solicitudes" className="boton boton-principal boton-ancho">
          Ir a mis solicitudes
        </Link>
      </section>
    );
  }

  const conductor = obtenerUsuario(ruta.id_conductor);
  const msg = MENSAJES[solicitud.estado] || MENSAJES.pendiente;
  const confirmado = solicitud.estado === 'aceptada';

  return (
    <section className="panel panel-angosto" aria-labelledby="titulo-viaje">
      <div className={`resultado resultado-${msg.clase}`} role="status">
        <p className="resultado-simbolo" aria-hidden="true">
          {msg.simbolo}
        </p>
        <h1 id="titulo-viaje">{msg.titulo}</h1>
        <p>{msg.texto}</p>
      </div>

      <dl className="datos datos-grandes">
        <div>
          <dt>Estado</dt>
          <dd>
            <EstadoBadge estado={solicitud.estado} />
          </dd>
        </div>
        <div>
          <dt>Ruta</dt>
          <dd>
            {ruta.origen} → {ruta.destino}
          </dd>
        </div>
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
        <div>
          <dt>Conductor</dt>
          <dd>{conductor?.nombre}</dd>
        </div>
        {confirmado && conductor && (
          <>
            <div>
              <dt>Celular del conductor</dt>
              <dd>{conductor.telefono}</dd>
            </div>
            <div>
              <dt>Placa del vehículo</dt>
              <dd>{conductor.placa}</dd>
            </div>
          </>
        )}
      </dl>

      <Link to="/inicio" className="boton boton-principal boton-ancho">
        Volver al inicio
      </Link>
      <Link to="/solicitudes" className="boton boton-secundario boton-ancho">
        Ver mis solicitudes
      </Link>
    </section>
  );
}
