import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/CampoFormulario.jsx';
import Alerta from '../components/Alerta.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { validarLogin } from '../utils/validaciones.js';
import { rutaInicioDe } from '../utils/formato.js';

// Prototipo 1 - Inicio de sesión (RNF002)
export default function Login() {
  usePageTitle('Iniciar sesión');
  const { login, usuarioActual } = useApp();
  const navigate = useNavigate();
  const [errorGeneral, setErrorGeneral] = useState('');
  const [verContrasena, setVerContrasena] = useState(false);
  const { valores, manejarCambio, manejarBlur, errorDe, enviar } = useFormulario(
    { identificador: '', contrasena: '' },
    validarLogin
  );

  if (usuarioActual) return <Navigate to={rutaInicioDe(usuarioActual.rol)} replace />;

  const ingresar = (datos) => {
    const resultado = login(datos.identificador, datos.contrasena);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    navigate(rutaInicioDe(resultado.usuario.rol));
  };

  return (
    <section className="panel panel-angosto" aria-labelledby="titulo-login">
      <p className="logo-grande" aria-hidden="true">
        🚐 TransRural
      </p>
      <h1 id="titulo-login">Iniciar sesión</h1>

      {errorGeneral && <Alerta tipo="error">{errorGeneral}</Alerta>}

      <form onSubmit={enviar(ingresar)} noValidate>
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
        <CampoFormulario
          id="contrasena"
          etiqueta="Contraseña"
          tipo={verContrasena ? 'text' : 'password'}
          valor={valores.contrasena}
          onChange={manejarCambio}
          onBlur={manejarBlur}
          error={errorDe('contrasena')}
          obligatorio
          autoComplete="current-password"
          maxLength={64}
        />
        <label className="casilla">
          <input
            type="checkbox"
            checked={verContrasena}
            onChange={(e) => setVerContrasena(e.target.checked)}
          />
          Mostrar contraseña
        </label>

        <button type="submit" className="boton boton-principal boton-ancho">
          Ingresar
        </button>
      </form>

      <p className="enlaces-ayuda">
        <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        <br />
        <Link to="/registro">Crear una cuenta</Link>
      </p>

      <details className="cuentas-prueba">
        <summary>Cuentas de prueba (solo para esta etapa sin servidor)</summary>
        <ul>
          <li>
            Pasajero: <strong>pasajero@demo.com</strong> / <strong>Demo1234</strong>
          </li>
          <li>
            Conductor: <strong>conductor@demo.com</strong> / <strong>Demo1234</strong>
          </li>
        </ul>
      </details>
    </section>
  );
}
