// Lógica de negocio de RUTAS, separada de las vistas. Son funciones puras: reciben las listas
// actuales y devuelven listas nuevas (no modifican las originales ni usan React).
// Con el backend, este archivo se reemplaza por llamadas a la API (/api/v1/rutas).
import { siguienteId } from '../utils/ids.js';

export function crearRuta(rutas, datos, idConductor) {
  const ruta = {
    id_ruta: siguienteId(rutas, 'id_ruta'),
    id_conductor: Number(idConductor),
    origen: datos.origen.trim(),
    destino: datos.destino.trim(),
    paradas: datos.paradas.trim(),
    fecha: datos.fecha,
    hora_salida: datos.hora_salida,
    cupos_disponibles: Number(datos.cupos_disponibles),
    estado: 'activa',
  };
  return { ruta, rutas: [...rutas, ruta] };
}

// Eliminar una ruta también elimina las solicitudes que pedían cupo en ella.
export function eliminarRuta(rutas, solicitudes, idRuta) {
  return {
    rutas: rutas.filter((r) => r.id_ruta !== idRuta),
    solicitudes: solicitudes.filter((s) => s.id_ruta !== idRuta),
  };
}

export const rutasDeConductor = (rutas, idConductor) =>
  rutas.filter((r) => r.id_conductor === idConductor);
