// Lógica de negocio de USUARIOS, separada de las vistas (funciones puras, sin React).
// Replica las restricciones UNIQUE de la base de datos (correo, identificacion y placa).
// Con el backend, este archivo se reemplaza por llamadas a la API (/api/v1/auth y /usuarios).
import { siguienteId } from '../utils/ids.js';
import { eliminarRuta } from './rutasService.js';

export function validarUnicos(usuarios, datos) {
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
  return errores;
}

export function crearUsuario(usuarios, datos) {
  const errores = validarUnicos(usuarios, datos);
  if (Object.keys(errores).length > 0) return { ok: false, errores };

  const usuario = {
    id_usuario: siguienteId(usuarios, 'id_usuario'),
    nombre: datos.nombre.trim(),
    identificacion: datos.identificacion.trim(),
    telefono: datos.telefono.trim(),
    correo: datos.correo.trim().toLowerCase(),
    contrasena: datos.contrasena,
    rol: datos.rol,
    ...(datos.rol === 'conductor'
      ? { licencia: datos.licencia.trim(), placa: datos.placa.trim().toUpperCase() }
      : {}),
  };
  return { ok: true, usuario, usuarios: [...usuarios, usuario] };
}

// Elimina un usuario y lo que depende de él: sus solicitudes y, si es conductor, sus rutas
// (con las solicitudes de esas rutas). Nadie puede eliminar la cuenta con la que ingresó.
export function eliminarUsuario({ usuarios, rutas, solicitudes }, idUsuario, idUsuarioActual) {
  if (idUsuario === idUsuarioActual) {
    return { ok: false, error: 'No puedes eliminar la cuenta con la que ingresaste.' };
  }
  let estado = {
    rutas,
    solicitudes: solicitudes.filter((s) => s.id_pasajero !== idUsuario),
  };
  rutas
    .filter((r) => r.id_conductor === idUsuario)
    .forEach((r) => {
      estado = eliminarRuta(estado.rutas, estado.solicitudes, r.id_ruta);
    });
  return {
    ok: true,
    usuarios: usuarios.filter((u) => u.id_usuario !== idUsuario),
    rutas: estado.rutas,
    solicitudes: estado.solicitudes,
  };
}
