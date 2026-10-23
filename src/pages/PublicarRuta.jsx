import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alerta from '../components/Alerta.jsx';
import CampoFormulario from '../components/CampoFormulario.jsx';
import RutaCard from '../components/RutaCard.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { hoyISO, validarRuta } from '../utils/validaciones.js';

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
  const { usuarioActual, rutas, publicarRuta } = useApp();
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
          <button type="button" className="boton boton-principal boton-ancho" onClick={publicarOtra}>
            Publicar otra ruta
          </button>
        </section>
      ) : (
        <section className="panel panel-angosto" aria-label="Formulario para publicar una ruta">
          <p className="ayuda">Los campos con * son obligatorios.</p>
          <form onSubmit={enviar(alPublicar)} noValidate>
            <fieldset>
              <legend>Trayecto</legend>
              <CampoFormulario
                id="origen"
                etiqueta="Origen"
                ayuda="Lugar de donde sales. Ejemplo: Vereda El Caimo"
                valor={valores.origen}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('origen')}
                obligatorio
                maxLength={150}
              />
              <CampoFormulario
                id="destino"
                etiqueta="Destino"
                ayuda="Lugar a donde llegas. Ejemplo: Armenia (Terminal)"
                valor={valores.destino}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('destino')}
                obligatorio
                maxLength={150}
              />
              <CampoFormulario
                id="paradas"
                etiqueta="Paradas intermedias (opcional)"
                ayuda="Sepáralas con comas."
                valor={valores.paradas}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('paradas')}
                maxLength={255}
              />
            </fieldset>

            <fieldset>
              <legend>Horario</legend>
              <CampoFormulario
                id="fecha"
                etiqueta="Fecha del viaje"
                tipo="date"
                valor={valores.fecha}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('fecha')}
                obligatorio
                min={hoyISO()}
              />
              <CampoFormulario
                id="hora_salida"
                etiqueta="Hora de salida"
                tipo="time"
                valor={valores.hora_salida}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('hora_salida')}
                obligatorio
              />
            </fieldset>

            <fieldset>
              <legend>Cupos</legend>
              <CampoFormulario
                id="cupos_disponibles"
                etiqueta="Cupos disponibles"
                ayuda="Cuántos pasajeros puedes llevar (de 1 a 8)."
                tipo="number"
                valor={valores.cupos_disponibles}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('cupos_disponibles')}
                obligatorio
                min={1}
                max={8}
                inputMode="numeric"
              />
            </fieldset>

            <button type="submit" className="boton boton-principal boton-ancho">
              Publicar ruta
            </button>
          </form>
        </section>
      )}

      <section aria-labelledby="titulo-mis-rutas">
        <h2 id="titulo-mis-rutas">Mis rutas publicadas</h2>
        {mias.length === 0 ? (
          <p className="vacio">Todavía no has publicado rutas.</p>
        ) : (
          <ul className="lista-tarjetas">
            {mias.map((ruta) => (
              <li key={ruta.id_ruta}>
                <RutaCard ruta={ruta} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
