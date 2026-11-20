import CampoFormulario from './CampoFormulario.jsx';
import { hoyISO } from '../utils/validaciones.js';

// Campos del formulario de ruta (tabla RUTA), compartidos por «Publicar ruta» (conductor)
// y «Rutas» (administrador) para no repetir el mismo código en dos módulos.
// `antes` permite agregar campos extra al inicio (por ejemplo, el conductor).
export default function FormularioRuta({ valores, manejarCambio, manejarBlur, errorDe, antes = null }) {
  const props = (id) => ({
    id,
    valor: valores[id],
    onChange: manejarCambio,
    onBlur: manejarBlur,
    error: errorDe(id),
  });

  return (
    <>
      {antes}
      <fieldset>
        <legend>Trayecto</legend>
        <CampoFormulario
          {...props('origen')}
          etiqueta="Origen"
          ayuda="Lugar de donde sales. Ejemplo: Vereda El Caimo"
          obligatorio
          maxLength={150}
        />
        <CampoFormulario
          {...props('destino')}
          etiqueta="Destino"
          ayuda="Lugar a donde llegas. Ejemplo: Armenia (Terminal)"
          obligatorio
          maxLength={150}
        />
        <CampoFormulario
          {...props('paradas')}
          etiqueta="Paradas intermedias (opcional)"
          ayuda="Sepáralas con comas."
          maxLength={255}
        />
      </fieldset>

      <fieldset>
        <legend>Horario</legend>
        <CampoFormulario
          {...props('fecha')}
          etiqueta="Fecha del viaje"
          tipo="date"
          obligatorio
          min={hoyISO()}
        />
        <CampoFormulario
          {...props('hora_salida')}
          etiqueta="Hora de salida"
          tipo="time"
          obligatorio
        />
      </fieldset>

      <fieldset>
        <legend>Cupos</legend>
        <CampoFormulario
          {...props('cupos_disponibles')}
          etiqueta="Cupos disponibles"
          ayuda="Cuántos pasajeros puede llevar (de 1 a 8)."
          tipo="number"
          obligatorio
          min={1}
          max={8}
          inputMode="numeric"
        />
      </fieldset>
    </>
  );
}
