import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alerta from '../components/Alerta.jsx';
import Boton from '../components/Boton.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import FormularioRuta from '../components/FormularioRuta.jsx';
import RutaCard from '../components/RutaCard.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { formatearFecha, formatearHora } from '../utils/formato.js';
import { validarRuta } from '../utils/validaciones.js';

const INICIAL = {
  origen: '',
  destino: '',
  paradas: '',
  fecha: '',
  hora_salida: '',
  cupos_disponibles: '',
};

// Prototipo 5 - Publicar ruta (RF002). Campos de la tabla RUTA, formulario dividido por información,
// validación antes de publicar y confirmación después de publicar.
export default function PublicarRuta() {
  usePageTitle('Publicar ruta');
  const { usuarioActual, rutas, publicarRuta, eliminarRuta } = useApp();
  const ubicacion = useLocation();
  const mensajeBienvenida = ubicacion.state?.mensaje;
  const [publicada, setPublicada] = useState(null);
  const tituloConfirmacion = useRef(null);
  const { valores, manejarCambio, manejarBlur, errorDe, enviar, reiniciar } = useFormulario(
    INICIAL,
    validarRuta
  );

  // Al publicar, el foco pasa al mensaje de confirmación para que lectores de pantalla lo anuncien.
  useEffect(() => {
    if (publicada && tituloConfirmacion.current) tituloConfirmacion.current.focus();
  }, [publicada]);

  const alPublicar = (datos) => setPublicada(publicarRuta(datos));

  const publicarOtra = () => {
    reiniciar();
    setPublicada(null);
  };

  const mias = rutas.filter((r) => r.id_conductor === usuarioActual.id_usuario);

  const quitar = (ruta) => {
    if (window.confirm(`¿Eliminar la ruta ${ruta.origen} → ${ruta.destino}?`)) {
      eliminarRuta(ruta.id_ruta);
    }
  };

  const columnas = [
    { clave: 'ruta', etiqueta: 'Ruta', render: (r) => `${r.origen} → ${r.destino}` },
    {
      clave: 'salida',
      etiqueta: 'Salida',
      render: (r) => `${formatearFecha(r.fecha)}, ${formatearHora(r.hora_salida)}`,
    },
    { clave: 'cupos_disponibles', etiqueta: 'Cupos' },
    { clave: 'estado', etiqueta: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    {
      clave: 'accion',
      etiqueta: 'Acción',
      render: (r) => (
        <Boton
          variante="peligro"
          tamano="pequeno"
          onClick={() => quitar(r)}
          aria-label={`Eliminar la ruta de ${r.origen} a ${r.destino}`}
        >
          Eliminar
        </Boton>
      ),
    },
  ];

  return (
    <div>
      <h1>Publicar ruta</h1>

      {mensajeBienvenida && <Alerta tipo="exito">{mensajeBienvenida}</Alerta>}

      {publicada ? (
        <section className="panel panel-angosto" aria-labelledby="titulo-publicada">
          <div className="resultado resultado-exito" role="status">
            <p className="resultado-simbolo" aria-hidden="true">
              ✔
            </p>
            <h2 id="titulo-publicada" tabIndex={-1} ref={tituloConfirmacion}>
              ¡Ruta publicada!
            </h2>
            <p>Los pasajeros ya pueden ver tu ruta y pedir un cupo.</p>
          </div>
          <RutaCard ruta={publicada} />
          <Boton ancho onClick={publicarOtra}>
            Publicar otra ruta
          </Boton>
        </section>
      ) : (
        <section className="panel panel-angosto" aria-label="Formulario para publicar una ruta">
          <p className="ayuda">Los campos con * son obligatorios.</p>
          <form onSubmit={enviar(alPublicar)} noValidate>
            <FormularioRuta
              valores={valores}
              manejarCambio={manejarCambio}
              manejarBlur={manejarBlur}
              errorDe={errorDe}
            />

            <Boton type="submit" ancho>
              Publicar ruta
            </Boton>
          </form>
        </section>
      )}

      <section aria-labelledby="titulo-mis-rutas">
        <h2 id="titulo-mis-rutas">Mis rutas publicadas</h2>
        <TablaDatos
          titulo="Rutas que has publicado"
          columnas={columnas}
          filas={mias}
          claveFila="id_ruta"
          vacio="Todavía no has publicado rutas."
        />
      </section>
    </div>
  );
}
