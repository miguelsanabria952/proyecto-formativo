import { Link, useLocation } from 'react-router-dom';
import Alerta from '../components/Alerta.jsx';
import RutaCard from '../components/RutaCard.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { formatearFecha, primerNombre } from '../utils/formato.js';
import { hoyISO } from '../utils/validaciones.js';

// Prototipo 3 - Inicio del pasajero (RF003 / RF005): accesos grandes a las funciones principales,
// próximo viaje confirmado e historial de viajes.
export default function InicioPasajero() {
  usePageTitle('Inicio');
  const { usuarioActual, solicitudes, historial, obtenerRuta, obtenerUsuario } = useApp();
  const ubicacion = useLocation();
  const mensaje = ubicacion.state?.mensaje;
  const hoy = hoyISO();

  const misSolicitudes = solicitudes.filter((s) => s.id_pasajero === usuarioActual.id_usuario);
  const pendientes = misSolicitudes.filter((s) => s.estado === 'pendiente').length;

  const proximo = misSolicitudes
    .filter((s) => s.estado === 'aceptada')
    .map((s) => ({ solicitud: s, ruta: obtenerRuta(s.id_ruta) }))
    .filter((x) => x.ruta && x.ruta.fecha >= hoy)
    .sort((a, b) => (a.ruta.fecha + a.ruta.hora_salida).localeCompare(b.ruta.fecha + b.ruta.hora_salida))[0];

  const misViajes = historial.filter((h) => h.id_pasajero === usuarioActual.id_usuario);

  const columnas = [
    { clave: 'fecha', etiqueta: 'Fecha', render: (f) => formatearFecha(f.fecha) },
    { clave: 'recorrido', etiqueta: 'Recorrido', render: (f) => `${f.origen} → ${f.destino}` },
    { clave: 'conductor', etiqueta: 'Conductor' },
    { clave: 'estado', etiqueta: 'Estado', render: (f) => <EstadoBadge estado={f.estado} /> },
  ];

  return (
    <div>
      <h1>Hola, {primerNombre(usuarioActual.nombre)}</h1>

      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}

      <section aria-labelledby="titulo-acciones">
        <h2 id="titulo-acciones">¿Qué quieres hacer?</h2>
        <ul className="accesos">
          <li>
            <Link to="/rutas" className="acceso">
              <span className="acceso-icono" aria-hidden="true">
                🔎
              </span>
              <span>
                <strong>Buscar rutas</strong>
                <br />
                <small>Mira los viajes disponibles y pide tu cupo</small>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/solicitudes" className="acceso">
              <span className="acceso-icono" aria-hidden="true">
                📋
              </span>
              <span>
                <strong>Mis solicitudes</strong>
                <br />
                <small>
                  {pendientes === 0
                    ? 'No tienes solicitudes pendientes'
                    : `${pendientes} ${pendientes === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}`}
                </small>
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="titulo-proximo">
        <h2 id="titulo-proximo">Tu próximo viaje</h2>
        {proximo ? (
          <RutaCard
            ruta={proximo.ruta}
            conductor={obtenerUsuario(proximo.ruta.id_conductor)?.nombre}
            accion={
              <Link to={`/viaje/${proximo.solicitud.id_solicitud}`} className="boton boton-principal">
                Ver detalles del viaje
              </Link>
            }
          />
        ) : (
          <p className="vacio">Todavía no tienes viajes confirmados. Busca una ruta y solicita tu cupo.</p>
        )}
      </section>

      <section aria-labelledby="titulo-historial">
        <h2 id="titulo-historial">Historial de viajes</h2>
        <TablaDatos
          titulo="Viajes realizados"
          columnas={columnas}
          filas={misViajes}
          claveFila="id_viaje"
          vacio="Aún no has realizado viajes."
        />
      </section>
    </div>
  );
}
