// Datos de prueba (mock). Los nombres de los campos siguen el modelo relacional
// de la base de datos (Evidencia 1 y 2) para que, cuando se conecte el backend,
// los componentes no tengan que cambiar: id_usuario, id_ruta, cupos_disponibles, etc.
// OJO: son datos ficticios solo para esta etapa sin servidor.

function fechaEnDias(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export const usuariosIniciales = [
  {
    id_usuario: 1,
    nombre: 'Laura Gómez',
    identificacion: '1094000001',
    telefono: '3101234567',
    correo: 'pasajero@demo.com',
    contrasena: 'Demo1234',
    rol: 'pasajero',
  },
  {
    id_usuario: 2,
    nombre: 'Andrés Rojas',
    identificacion: '1094000002',
    telefono: '3207654321',
    correo: 'conductor@demo.com',
    contrasena: 'Demo1234',
    rol: 'conductor',
    licencia: 'LIC-0001',
    placa: 'ABC123',
  },
  {
    id_usuario: 3,
    nombre: 'Marta Ocampo',
    identificacion: '1094000003',
    telefono: '3153334455',
    correo: 'marta@demo.com',
    contrasena: 'Demo1234',
    rol: 'conductor',
    licencia: 'LIC-0002',
    placa: 'XYZ98B',
  },
];

export const rutasIniciales = [
  {
    id_ruta: 1,
    id_conductor: 2,
    origen: 'Vereda El Caimo',
    destino: 'Armenia (Terminal)',
    paradas: 'Tienda La Esperanza, Escuela rural',
    fecha: fechaEnDias(1),
    hora_salida: '06:30',
    cupos_disponibles: 3,
    estado: 'activa',
  },
  {
    id_ruta: 2,
    id_conductor: 3,
    origen: 'Vereda La Julia',
    destino: 'Calarcá',
    paradas: 'Puente del río',
    fecha: fechaEnDias(2),
    hora_salida: '07:15',
    cupos_disponibles: 4,
    estado: 'activa',
  },
  {
    id_ruta: 3,
    id_conductor: 2,
    origen: 'Vereda Barcelona',
    destino: 'Armenia (Centro de salud)',
    paradas: '',
    fecha: fechaEnDias(3),
    hora_salida: '13:00',
    cupos_disponibles: 2,
    estado: 'activa',
  },
  {
    id_ruta: 4,
    id_conductor: 3,
    origen: 'Vereda El Placer',
    destino: 'Armenia (Terminal)',
    paradas: 'Parque principal',
    fecha: fechaEnDias(4),
    hora_salida: '05:45',
    cupos_disponibles: 1,
    estado: 'activa',
  },
];

export const solicitudesIniciales = [
  {
    id_solicitud: 1,
    id_ruta: 2,
    id_pasajero: 1,
    fecha_solicitud: new Date().toISOString(),
    estado: 'aceptada',
  },
  {
    id_solicitud: 2,
    id_ruta: 3,
    id_pasajero: 1,
    fecha_solicitud: new Date().toISOString(),
    estado: 'pendiente',
  },
];

// RF005 - Historial de viajes (viajes ya realizados). estado: 'completado' (CHECK chk_viaje_estado)
export const historialInicial = [
  {
    id_viaje: 1,
    id_pasajero: 1,
    fecha: fechaEnDias(-5),
    origen: 'Vereda El Caimo',
    destino: 'Armenia (Terminal)',
    conductor: 'Andrés Rojas',
    estado: 'completado',
  },
  {
    id_viaje: 2,
    id_pasajero: 1,
    fecha: fechaEnDias(-12),
    origen: 'Vereda La Julia',
    destino: 'Calarcá',
    conductor: 'Marta Ocampo',
    estado: 'completado',
  },
];
