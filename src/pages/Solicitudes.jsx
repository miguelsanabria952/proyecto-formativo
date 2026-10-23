import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { formatearFecha, formatearHora } from '../utils/formato.js';

// Lista de solicitudes del pasajero. Desde aquí se llega a la confirmación del viaje (Prototipo 6).
// Los botones "Demo" simulan la respuesta del conductor porque todavía no hay backend.
export default function Solicitudes() {
  usePageTitle('Mis solicitudes');
  const { usuarioActual, solicitudes, obtenerRuta, responderSolicitud } = useApp();

  const mias = solicitudes
    .filter((s) => s.id_pasajero === usuarioActual.id_usuario)
    .map((s) => ({ ...s, ruta: obtenerRuta(s.id_ruta) }))
    .filter((s) => s.ruta);

  const columnas = [
    {
      clave: 'ruta',
      etiqueta: 'Ruta',
      render: (s) => `${s.ruta.origen} → ${s.ruta.destino}`,
    },
    {
      clave: 'salida',
      etiqueta: 'Salida',
      render: (s) => `${formatearFecha(s.ruta.fecha)}, ${formatearHora(s.ruta.hora_salida)}`,
    },
    { clave: 'estado', etiqueta: 'Estado', render: (s) => <EstadoBadge estado={s.estado} /> },
    {
      clave: 'accion',
      etiqueta: 'Acción',
      render: (s) => {
        const nombreRuta = `${s.ruta.origen} a ${s.ruta.destino}`;
        if (s.estado === 'aceptada') {
          return (
            <Link to={`/viaje/${s.id_solicitud}`} className="boton boton-principal boton-pequeno">
              Ver viaje
            </Link>
          );
        }
        if (s.estado === 'rechazada') {
          return (
            <Link to="/rutas" className="boton boton-secundario boton-pequeno">
              Buscar otra ruta
            </Link>
          );
        }
        return (
          <span className="grupo-botones">
            <button
              type="button"
              className="boton boton-secundario boton-pequeno"
              onClick={() => responderSolicitud(s.id_solicitud, true)}
              aria-label={`Demo: simular que el conductor acepta la solicitud de ${nombreRuta}`}
            >
              Demo: aceptar
            </button>
            <button
              type="button"
              className="boton boton-secundario boton-pequeno"
              onClick={() => responderSolicitud(s.id_solicitud, false)}
              aria-label={`Demo: simular que el conductor rechaza la solicitud de ${nombreRuta}`}
            >
              Demo: rechazar
            </button>
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Mis solicitudes</h1>

      <Alerta tipo="info">
        Todavía no hay conexión con el servidor. Los botones «Demo» simulan la respuesta del conductor para
        poder ver todas las pantallas.
      </Alerta>

      <TablaDatos
        titulo="Solicitudes de cupo"
        columnas={columnas}
        filas={mias}
        claveFila="id_solicitud"
        vacio="Todavía no has pedido ningún cupo."
      />

      <p>
        <Link to="/rutas" className="boton boton-secundario">
          Buscar más rutas
        </Link>
      </p>
    </div>
  );
}
