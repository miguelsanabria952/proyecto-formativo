import { useState } from 'react';
import { Link } from 'react-router-dom';
import CampoFormulario from '../components/CampoFormulario.jsx';
import Alerta from '../components/Alerta.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { validarRecuperacion } from '../utils/validaciones.js';

// Opción "¿Olvidaste tu contraseña?" del Prototipo 1. Por ahora solo valida el dato:
// el envío real del código (SMS o correo) se hará cuando exista el backend.
export default function RecuperarContrasena() {
  usePageTitle('Recuperar contraseña');
  const [enviado, setEnviado] = useState(false);
  const { valores, manejarCambio, manejarBlur, errorDe, enviar } = useFormulario(
    { identificador: '' },
    validarRecuperacion
  );

  return (
    <section className="panel panel-angosto" aria-labelledby="titulo-recuperar">
      <h1 id="titulo-recuperar">Recuperar contraseña</h1>
      <p>Escribe tu correo o tu celular y te ayudaremos a crear una contraseña nueva.</p>

      {enviado && (
        <Alerta tipo="info">
          Dato recibido. Cuando la app esté conectada al servidor, te enviaremos un código para crear tu
          nueva contraseña.
        </Alerta>
      )}

      <form onSubmit={enviar(() => setEnviado(true))} noValidate>
        <CampoFormulario
          id="identificador"
          etiqueta="Correo o número de celular"
          valor={valores.identificador}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          error={errorDe('identificador')}
          obligatorio
          autoComplete="username"
          maxLength={100}
        />
        <button type="submit" className="boton boton-principal boton-ancho">
          Enviar
        </button>
      </form>

      <p className="enlaces-ayuda">
        <Link to="/login">Volver a iniciar sesión</Link>
      </p>
    </section>
  );
}
