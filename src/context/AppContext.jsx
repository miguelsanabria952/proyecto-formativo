import { createContext, useContext, useState } from 'react';
import {
  usuariosIniciales,
  rutasIniciales,
  solicitudesIniciales,
  historialInicial,
} from '../data/datosIniciales.js';
import { siguienteId } from '../utils/ids.js';
import * as rutasService from '../services/rutasService.js';
import * as usuariosService from '../services/usuariosService.js';

// Estado global de la app SIN servidor: todo vive en memoria y se reinicia al recargar la página.
// Cuando se conecte el backend, las funciones de este archivo (login, registrar, publicarRuta,
// solicitarCupo, responderSolicitud) se reemplazan por llamadas a la API y los componentes no cambian.
// Nota de seguridad: la contraseña se compara aquí solo porque es una simulación; en el sistema real
// la verificación la hace el servidor con la contraseña cifrada (RNF001/RNF002).

const AppContext = createContext(null);

// La lógica de negocio (reglas, unicidad, eliminación en cascada) vive en src/services/; este archivo
// solo guarda el estado de React y llama a esos servicios.

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

  // Registro público (RF001): crea el usuario y abre su sesión.
  const registrar = (datos) => {
    const resultado = usuariosService.crearUsuario(usuarios, datos);
    if (!resultado.ok) return resultado;
    setUsuarios(resultado.usuarios);
    setUsuarioActual(resultado.usuario);
    return resultado;
  };

  // Alta de usuario hecha por el administrador: no cambia la sesión actual.
  const crearUsuario = (datos) => {
    const resultado = usuariosService.crearUsuario(usuarios, datos);
    if (resultado.ok) setUsuarios(resultado.usuarios);
    return resultado;
  };

  const eliminarUsuario = (idUsuario) => {
    const resultado = usuariosService.eliminarUsuario(
      { usuarios, rutas, solicitudes },
      idUsuario,
      usuarioActual?.id_usuario
    );
    if (resultado.ok) {
      setUsuarios(resultado.usuarios);
      setRutas(resultado.rutas);
      setSolicitudes(resultado.solicitudes);
    }
    return resultado;
  };

  // `idConductor` solo lo envía el administrador; el conductor publica a su nombre.
  const publicarRuta = (datos, idConductor = usuarioActual.id_usuario) => {
    const resultado = rutasService.crearRuta(rutas, datos, idConductor);
    setRutas(resultado.rutas);
    return resultado.ruta;
  };

  const eliminarRuta = (idRuta) => {
    const resultado = rutasService.eliminarRuta(rutas, solicitudes, idRuta);
    setRutas(resultado.rutas);
    setSolicitudes(resultado.solicitudes);
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
    usuarios,
    registrar,
    crearUsuario,
    eliminarUsuario,
    publicarRuta,
    eliminarRuta,
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
