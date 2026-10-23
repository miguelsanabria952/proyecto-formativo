import { createContext, useContext, useState } from 'react';
import {
  usuariosIniciales,
  rutasIniciales,
  solicitudesIniciales,
  historialInicial,
} from '../data/datosIniciales.js';

// Estado global de la app SIN servidor: todo vive en memoria y se reinicia al recargar la página.
// Cuando se conecte el backend, las funciones de este archivo (login, registrar, publicarRuta,
// solicitarCupo, responderSolicitud) se reemplazan por llamadas a la API y los componentes no cambian.
// Nota de seguridad: la contraseña se compara aquí solo porque es una simulación; en el sistema real
// la verificación la hace el servidor con la contraseña cifrada (RNF001/RNF002).

const AppContext = createContext(null);

const siguienteId = (lista, campo) => lista.reduce((max, x) => Math.max(max, x[campo]), 0) + 1;

// `usuarioInicial` solo se usa en pruebas, para arrancar con una sesión ya iniciada.
export function AppProvider({ children, usuarioInicial = null }) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [rutas, setRutas] = useState(rutasIniciales);
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [historial] = useState(historialInicial);
  const [usuarioActual, setUsuarioActual] = useState(usuarioInicial);

  const obtenerUsuario = (id) => usuarios.find((u) => u.id_usuario === id);
  const obtenerRuta = (id) => rutas.find((r) => r.id_ruta === id);

  const login = (identificador, contrasena) => {
    const dato = identificador.trim().toLowerCase();
    const usuario = usuarios.find(
      (u) => (u.correo.toLowerCase() === dato || u.telefono === dato) && u.contrasena === contrasena
    );
    if (!usuario) {
      return {
        ok: false,
        error: 'El correo, el celular o la contraseña no son correctos. Revisa los datos e inténtalo de nuevo.',
      };
    }
    setUsuarioActual(usuario);
    return { ok: true, usuario };
  };

  const logout = () => setUsuarioActual(null);

  // Replica las restricciones UNIQUE de la base de datos (correo, identificacion, placa).
  const registrar = (datos) => {
    const errores = {};
    const correo = datos.correo.trim().toLowerCase();
    const identificacion = datos.identificacion.trim();
    const placa = (datos.placa || '').trim().toUpperCase();

    if (usuarios.some((u) => u.correo.toLowerCase() === correo)) {
      errores.correo = 'Este correo ya está registrado.';
    }
    if (usuarios.some((u) => u.identificacion === identificacion)) {
      errores.identificacion = 'Esta identificación ya está registrada.';
    }
    if (datos.rol === 'conductor' && usuarios.some((u) => u.placa === placa)) {
      errores.placa = 'Esta placa ya está registrada.';
    }
    if (Object.keys(errores).length > 0) return { ok: false, errores };

    const nuevo = {
      id_usuario: siguienteId(usuarios, 'id_usuario'),
      nombre: datos.nombre.trim(),
      identificacion,
      telefono: datos.telefono.trim(),
      correo,
      contrasena: datos.contrasena,
      rol: datos.rol,
      ...(datos.rol === 'conductor' ? { licencia: datos.licencia.trim(), placa } : {}),
    };
    setUsuarios((previos) => [...previos, nuevo]);
    setUsuarioActual(nuevo);
    return { ok: true, usuario: nuevo };
  };

  const publicarRuta = (datos) => {
    const nueva = {
      id_ruta: siguienteId(rutas, 'id_ruta'),
      id_conductor: usuarioActual.id_usuario,
      origen: datos.origen.trim(),
      destino: datos.destino.trim(),
      paradas: datos.paradas.trim(),
      fecha: datos.fecha,
      hora_salida: datos.hora_salida,
      cupos_disponibles: Number(datos.cupos_disponibles),
      estado: 'activa',
    };
    setRutas((previas) => [...previas, nueva]);
    return nueva;
  };

  const solicitarCupo = (idRuta) => {
    const ruta = obtenerRuta(idRuta);
    if (!ruta || ruta.estado !== 'activa') {
      return { ok: false, error: 'Esta ruta ya no está disponible.' };
    }
    if (ruta.cupos_disponibles < 1) {
      return { ok: false, error: 'Esta ruta no tiene cupos disponibles.' };
    }
    const repetida = solicitudes.some(
      (s) =>
        s.id_ruta === idRuta && s.id_pasajero === usuarioActual.id_usuario && s.estado !== 'rechazada'
    );
    if (repetida) return { ok: false, error: 'Ya enviaste una solicitud para esta ruta.' };

    const nueva = {
      id_solicitud: siguienteId(solicitudes, 'id_solicitud'),
      id_ruta: idRuta,
      id_pasajero: usuarioActual.id_usuario,
      fecha_solicitud: new Date().toISOString(),
      estado: 'pendiente',
    };
    setSolicitudes((previas) => [...previas, nueva]);
    return { ok: true, solicitud: nueva };
  };

  // Simula la respuesta del conductor (RF006/RF007). En el sistema real la hará el conductor desde su cuenta.
  const responderSolicitud = (idSolicitud, aceptar) => {
    const solicitud = solicitudes.find((s) => s.id_solicitud === idSolicitud);
    if (!solicitud || solicitud.estado !== 'pendiente') return;
    setSolicitudes((previas) =>
      previas.map((s) =>
        s.id_solicitud === idSolicitud ? { ...s, estado: aceptar ? 'aceptada' : 'rechazada' } : s
      )
    );
    if (aceptar) {
      setRutas((previas) =>
        previas.map((r) =>
          r.id_ruta === solicitud.id_ruta
            ? { ...r, cupos_disponibles: Math.max(0, r.cupos_disponibles - 1) }
            : r
        )
      );
    }
  };

  const valor = {
    usuarioActual,
    rutas,
    solicitudes,
    historial,
    obtenerUsuario,
    obtenerRuta,
    login,
    logout,
    registrar,
    publicarRuta,
    solicitarCupo,
    responderSolicitud,
  };

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useApp() {
  const contexto = useContext(AppContext);
  if (!contexto) throw new Error('useApp debe usarse dentro de <AppProvider>');
  return contexto;
}
