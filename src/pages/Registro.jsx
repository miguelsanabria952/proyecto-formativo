import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import CampoFormulario from '../components/CampoFormulario.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { validarRegistro } from '../utils/validaciones.js';
import { rutaInicioDe } from '../utils/formato.js';

const INICIAL = {
  rol: 'pasajero',
  nombre: '',
  identificacion: '',
  telefono: '',
  correo: '',
  contrasena: '',
  confirmar: '',
  licencia: '',
  placa: '',
};

const ROLES = [
  { valor: 'pasajero', titulo: 'Pasajero', descripcion: 'Busco transporte' },
  { valor: 'conductor', titulo: 'Conductor', descripcion: 'Ofrezco cupos en mi vehículo' },
];

// Prototipo 2 - Registro de usuario (RF001). Campos de la tabla USUARIO; si es conductor
// se piden además licencia y placa (tabla CONDUCTOR, RF004).
export default function Registro() {
  usePageTitle('Crear cuenta');
  const { registrar, usuarioActual } = useApp();
  const navigate = useNavigate();
  const [verContrasena, setVerContrasena] = useState(false);
  const [erroresServidor, setErroresServidor] = useState({});
  const { valores, manejarCambio, manejarBlur, errorDe, enviar } = useFormulario(INICIAL, validarRegistro);

  if (usuarioActual) return <Navigate to={rutaInicioDe(usuarioActual.rol)} replace />;

  const alCambiar = (e) => {
    setErroresServidor((previos) => ({ ...previos, [e.target.name]: undefined }));
    manejarCambio(e);
  };
  const errorCampo = (nombre) => errorDe(nombre) || erroresServidor[nombre] || '';

  const crearCuenta = (datos) => {
    const resultado = registrar(datos);
    if (!resultado.ok) {
      setErroresServidor(resultado.errores);
      return;
    }
    navigate(rutaInicioDe(resultado.usuario.rol), {
      state: { mensaje: 'Tu cuenta fue creada correctamente. ¡Bienvenido a TransRural!' },
    });
  };

  const esConductor = valores.rol === 'conductor';

  return (
    <section className="panel panel-angosto" aria-labelledby="titulo-registro">
      <h1 id="titulo-registro">Crear cuenta</h1>
      <p className="ayuda">Los campos con * son obligatorios.</p>

      <form onSubmit={enviar(crearCuenta)} noValidate>
        <fieldset>
          <legend>
            Quiero registrarme como <span aria-hidden="true">*</span>
          </legend>
          <div className="opciones-rol">
            {ROLES.map((op) => (
              <label
                key={op.valor}
                className={`opcion-rol ${valores.rol === op.valor ? 'seleccionada' : ''}`}
              >
                <input
                  type="radio"
                  name="rol"
                  value={op.valor}
                  checked={valores.rol === op.valor}
                  onChange={alCambiar}
                  onBlur={manejarBlur}
                />
                <span>
                  <strong>{op.titulo}</strong>
                  <br />
                  <small>{op.descripcion}</small>
                </span>
              </label>
            ))}
          </div>
          {errorCampo('rol') && (
            <p className="error">
              <span aria-hidden="true">⚠ </span>
              {errorCampo('rol')}
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend>Tus datos</legend>
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre completo"
            valor={valores.nombre}
            onChange={alCambiar}
            onBlur={manejarBlur}
            error={errorCampo('nombre')}
            obligatorio
            autoComplete="name"
            maxLength={100}
          />
          <CampoFormulario
            id="identificacion"
            etiqueta="Número de identificación"
            ayuda="Solo números, sin puntos."
            valor={valores.identificacion}
            onChange={alCambiar}
            onBlur={manejarBlur}
            error={errorCampo('identificacion')}
            obligatorio
            inputMode="numeric"
            maxLength={12}
          />
          <CampoFormulario
            id="telefono"
            etiqueta="Número de celular"
            ayuda="10 números. Ejemplo: 3101234567"
            tipo="tel"
            valor={valores.telefono}
            onChange={alCambiar}
            onBlur={manejarBlur}
            error={errorCampo('telefono')}
            obligatorio
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
          />
          <CampoFormulario
            id="correo"
            etiqueta="Correo electrónico"
            tipo="email"
            valor={valores.correo}
            onChange={alCambiar}
            onBlur={manejarBlur}
            error={errorCampo('correo')}
            obligatorio
            autoComplete="email"
            maxLength={100}
          />
        </fieldset>

        {esConductor && (
          <fieldset>
            <legend>Datos del conductor</legend>
            <CampoFormulario
              id="licencia"
              etiqueta="Número de licencia de conducción"
              valor={valores.licencia}
              onChange={alCambiar}
              onBlur={manejarBlur}
              error={errorCampo('licencia')}
              obligatorio
              maxLength={50}
            />
            <CampoFormulario
              id="placa"
              etiqueta="Placa del vehículo"
              ayuda="Ejemplos: ABC123 (carro) o ABC12D (moto)"
              valor={valores.placa}
              onChange={alCambiar}
              onBlur={manejarBlur}
              error={errorCampo('placa')}
              obligatorio
              maxLength={6}
              autoCapitalize="characters"
            />
          </fieldset>
        )}

        <fieldset>
          <legend>Tu contraseña</legend>
          <CampoFormulario
            id="contrasena"
            etiqueta="Contraseña"
            ayuda="Mínimo 8 caracteres, con al menos una letra y un número."
            tipo={verContrasena ? 'text' : 'password'}
            valor={valores.contrasena}
            onChange={alCambiar}
            onBlur={manejarBlur}
            error={errorCampo('contrasena')}
            obligatorio
            autoComplete="new-password"
            maxLength={64}
          />
          <CampoFormulario
            id="confirmar"
            etiqueta="Repite la contraseña"
            tipo={verContrasena ? 'text' : 'password'}
            valor={valores.confirmar}
            onChange={alCambiar}
            onBlur={manejarBlur}
            error={errorCampo('confirmar')}
            obligatorio
            autoComplete="new-password"
            maxLength={64}
          />
          <label className="casilla">
            <input
              type="checkbox"
              checked={verContrasena}
              onChange={(e) => setVerContrasena(e.target.checked)}
            />
            Mostrar contraseñas
          </label>
        </fieldset>

        <button type="submit" className="boton boton-principal boton-ancho">
          Crear cuenta
        </button>
      </form>

      <p className="enlaces-ayuda">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}
