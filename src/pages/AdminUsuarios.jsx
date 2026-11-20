import { useState } from 'react';
import Alerta from '../components/Alerta.jsx';
import Boton from '../components/Boton.jsx';
import CampoFormulario from '../components/CampoFormulario.jsx';
import CampoSelect from '../components/CampoSelect.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { validarUsuarioAdmin } from '../utils/validaciones.js';

const INICIAL = {
  nombre: '',
  identificacion: '',
  telefono: '',
  correo: '',
  contrasena: '',
  rol: '',
  licencia: '',
  placa: '',
};

const ROLES = [
  { valor: 'pasajero', texto: 'Pasajero' },
  { valor: 'conductor', texto: 'Conductor' },
];

// Módulo 1 - Usuarios (RF001). El administrador registra usuarios con un formulario validado
// y los ve en una tabla que se actualiza al agregar o eliminar (datos en memoria).
export default function AdminUsuarios() {
  usePageTitle('Usuarios');
  const { usuarios, usuarioActual, crearUsuario, eliminarUsuario } = useApp();
  const [mensaje, setMensaje] = useState(null); // { tipo, texto }
  const [erroresServidor, setErroresServidor] = useState({});
  const { valores, manejarCambio, manejarBlur, errorDe, enviar, reiniciar } = useFormulario(
    INICIAL,
    validarUsuarioAdmin
  );

  const alCambiar = (e) => {
    setErroresServidor((previos) => ({ ...previos, [e.target.name]: undefined }));
    manejarCambio(e);
  };
  const props = (id) => ({
    id,
    valor: valores[id],
    onChange: alCambiar,
    onBlur: manejarBlur,
    error: errorDe(id) || erroresServidor[id] || '',
  });

  const guardar = (datos) => {
    const resultado = crearUsuario(datos);
    if (!resultado.ok) {
      setErroresServidor(resultado.errores);
      setMensaje(null);
      return;
    }
    setErroresServidor({});
    setMensaje({ tipo: 'exito', texto: `Usuario «${resultado.usuario.nombre}» registrado correctamente.` });
    reiniciar();
  };

  const quitar = (u) => {
    if (!window.confirm(`¿Eliminar a ${u.nombre}? También se eliminarán sus rutas y solicitudes.`)) return;
    const resultado = eliminarUsuario(u.id_usuario);
    setMensaje(
      resultado.ok
        ? { tipo: 'exito', texto: `Usuario «${u.nombre}» eliminado.` }
        : { tipo: 'error', texto: resultado.error }
    );
  };

  const columnas = [
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'correo', etiqueta: 'Correo' },
    { clave: 'telefono', etiqueta: 'Celular' },
    { clave: 'rol', etiqueta: 'Tipo', render: (u) => u.rol.charAt(0).toUpperCase() + u.rol.slice(1) },
    {
      clave: 'accion',
      etiqueta: 'Acción',
      render: (u) => (
        <Boton
          variante="peligro"
          tamano="pequeno"
          onClick={() => quitar(u)}
          disabled={u.id_usuario === usuarioActual.id_usuario}
          aria-label={`Eliminar al usuario ${u.nombre}`}
        >
          Eliminar
        </Boton>
      ),
    },
  ];

  return (
    <div>
      <h1>Usuarios</h1>

      {mensaje && <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>}

      <section className="panel panel-angosto" aria-label="Formulario para registrar un usuario">
        <p className="ayuda">Los campos con * son obligatorios.</p>
        <form onSubmit={enviar(guardar)} noValidate>
          <CampoFormulario {...props('nombre')} etiqueta="Nombre completo" obligatorio maxLength={100} />
          <CampoFormulario
            {...props('identificacion')}
            etiqueta="Identificación"
            ayuda="Solo números, entre 6 y 12."
            obligatorio
            inputMode="numeric"
            maxLength={12}
          />
          <CampoFormulario
            {...props('telefono')}
            etiqueta="Celular"
            ayuda="10 números, empieza por 3. Ejemplo: 3101234567"
            tipo="tel"
            obligatorio
            inputMode="numeric"
            maxLength={10}
          />
          <CampoFormulario
            {...props('correo')}
            etiqueta="Correo electrónico"
            tipo="email"
            obligatorio
            maxLength={100}
          />
          <CampoFormulario
            {...props('contrasena')}
            etiqueta="Contraseña"
            ayuda="De 8 a 64 caracteres, con al menos una letra y un número."
            tipo="password"
            obligatorio
            maxLength={64}
          />
          <CampoSelect
            {...props('rol')}
            etiqueta="Tipo de usuario"
            opciones={ROLES}
            obligatorio
          />
          {valores.rol === 'conductor' && (
            <fieldset>
              <legend>Datos del conductor</legend>
              <CampoFormulario {...props('licencia')} etiqueta="Licencia de conducción" obligatorio maxLength={50} />
              <CampoFormulario
                {...props('placa')}
                etiqueta="Placa del vehículo"
                ayuda="Carro: ABC123 · Moto: ABC12D"
                obligatorio
                maxLength={6}
              />
            </fieldset>
          )}
          <Boton type="submit" ancho>
            Guardar usuario
          </Boton>
        </form>
      </section>

      <section aria-labelledby="titulo-lista-usuarios">
        <h2 id="titulo-lista-usuarios">Usuarios registrados ({usuarios.length})</h2>
        <TablaDatos
          titulo="Usuarios registrados"
          columnas={columnas}
          filas={usuarios}
          claveFila="id_usuario"
          vacio="Todavía no hay usuarios registrados."
        />
      </section>
    </div>
  );
}
