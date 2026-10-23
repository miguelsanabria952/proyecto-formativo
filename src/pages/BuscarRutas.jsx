import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alerta from '../components/Alerta.jsx';
import CampoFormulario from '../components/CampoFormulario.jsx';
import RutaCard from '../components/RutaCard.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { hoyISO } from '../utils/validaciones.js';

// Prototipo 4 - Buscar y solicitar cupo (RF002 / caso de uso "Solicitar Cupo").
// Las rutas se muestran en tarjetas, con el número de cupos visible y una acción principal clara.
export default function BuscarRutas() {
  usePageTitle('Buscar rutas');
  const { rutas, solicitudes, usuarioActual, obtenerUsuario, solicitarCupo } = useApp();
  const [filtros, setFiltros] = useState({ origen: '', destino: '' });
  const [mensaje, setMensaje] = useState(null);
  const hoy = hoyISO();

  const coincide = (texto, filtro) => texto.toLowerCase().includes(filtro.trim().toLowerCase());

  const visibles = rutas
    .filter(
      (r) =>
        r.estado === 'activa' &&
        r.fecha >= hoy &&
        coincide(r.origen, filtros.origen) &&
        coincide(r.destino, filtros.destino)
    )
    .sort((a, b) => (a.fecha + a.hora_salida).localeCompare(b.fecha + b.hora_salida));

  const cambiarFiltro = (e) => setFiltros((previos) => ({ ...previos, [e.target.name]: e.target.value }));

  const yaSolicitada = (idRuta) =>
    solicitudes.some(
      (s) =>
        s.id_ruta === idRuta && s.id_pasajero === usuarioActual.id_usuario && s.estado !== 'rechazada'
    );

  const solicitar = (ruta) => {
    const resultado = solicitarCupo(ruta.id_ruta);
    if (resultado.ok) {
      setMensaje({
        tipo: 'exito',
        texto: `Enviaste tu solicitud para la ruta ${ruta.origen} → ${ruta.destino}. El conductor responderá pronto.`,
      });
    } else {
      setMensaje({ tipo: 'error', texto: resultado.error });
    }
  };

  const botonDe = (ruta) => {
    if (yaSolicitada(ruta.id_ruta)) {
      return (
        <button type="button" className="boton boton-secundario boton-ancho" disabled>
          ✔ Solicitud enviada
        </button>
      );
    }
    if (ruta.cupos_disponibles < 1) {
      return (
        <button type="button" className="boton boton-secundario boton-ancho" disabled>
          Sin cupos
        </button>
      );
    }
    return (
      <button
        type="button"
        className="boton boton-principal boton-ancho"
        onClick={() => solicitar(ruta)}
        aria-label={`Solicitar cupo en la ruta de ${ruta.origen} a ${ruta.destino}`}
      >
        Solicitar cupo
      </button>
    );
  };

  return (
    <div>
      <h1>Buscar rutas</h1>

      <form className="filtros" role="search" aria-label="Filtrar rutas" onSubmit={(e) => e.preventDefault()}>
        <CampoFormulario
          id="origen"
          etiqueta="¿Desde dónde sales?"
          tipo="search"
          valor={filtros.origen}
          onChange={cambiarFiltro}
          maxLength={150}
        />
        <CampoFormulario
          id="destino"
          etiqueta="¿A dónde vas?"
          tipo="search"
          valor={filtros.destino}
          onChange={cambiarFiltro}
          maxLength={150}
        />
        <button
          type="button"
          className="boton boton-secundario"
          onClick={() => setFiltros({ origen: '', destino: '' })}
        >
          Limpiar búsqueda
        </button>
      </form>

      {mensaje && (
        <Alerta tipo={mensaje.tipo}>
          {mensaje.texto}{' '}
          {mensaje.tipo === 'exito' && <Link to="/solicitudes">Ver mis solicitudes</Link>}
        </Alerta>
      )}

      <p className="contador" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? 'ruta encontrada' : 'rutas encontradas'}
      </p>

      {visibles.length === 0 ? (
        <p className="vacio">No hay rutas con esos datos. Prueba con otro lugar o limpia la búsqueda.</p>
      ) : (
        <ul className="lista-tarjetas">
          {visibles.map((ruta) => (
            <li key={ruta.id_ruta}>
              <RutaCard
                ruta={ruta}
                conductor={obtenerUsuario(ruta.id_conductor)?.nombre}
                accion={botonDe(ruta)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
