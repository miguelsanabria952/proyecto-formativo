// Validaciones básicas de los formularios (obligatoriedad, formato y longitud).
// Cada función recibe los valores del formulario y devuelve un objeto con los
// errores: { nombreCampo: 'mensaje' }. Si el objeto está vacío, el formulario es válido.
// Las longitudes máximas coinciden con las columnas VARCHAR del modelo de datos.

export const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const REGEX_TELEFONO = /^3\d{9}$/; // celular colombiano: 10 dígitos, empieza por 3
export const REGEX_IDENTIFICACION = /^\d{6,12}$/;
export const REGEX_PLACA = /^([A-Z]{3}\d{3}|[A-Z]{3}\d{2}[A-Z])$/; // carro: ABC123 / moto: ABC12D
export const REGEX_CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

const vacio = (valor) => String(valor ?? '').trim() === '';

export function hoyISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function horaActual() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function errorIdentificador(valor) {
  if (vacio(valor)) return 'Escribe tu correo o tu número de celular.';
  const v = valor.trim();
  if (v.includes('@')) {
    return REGEX_CORREO.test(v) ? '' : 'El correo no tiene un formato válido. Ejemplo: nombre@correo.com';
  }
  return REGEX_TELEFONO.test(v)
    ? ''
    : 'El celular debe tener 10 números y empezar por 3. Ejemplo: 3101234567';
}

export function validarLogin(v) {
  const errores = {};
  const e = errorIdentificador(v.identificador);
  if (e) errores.identificador = e;
  if (vacio(v.contrasena)) errores.contrasena = 'Escribe tu contraseña.';
  return errores;
}

export function validarRecuperacion(v) {
  const errores = {};
  const e = errorIdentificador(v.identificador);
  if (e) errores.identificador = e;
  return errores;
}

export function validarRegistro(v) {
  const errores = {};

  if (v.rol !== 'pasajero' && v.rol !== 'conductor') {
    errores.rol = 'Elige si te registras como pasajero o como conductor.';
  }

  if (vacio(v.nombre)) errores.nombre = 'Escribe tu nombre completo.';
  else if (v.nombre.trim().length < 3) errores.nombre = 'El nombre debe tener al menos 3 letras.';
  else if (v.nombre.trim().length > 100) errores.nombre = 'El nombre puede tener máximo 100 caracteres.';

  if (vacio(v.identificacion)) errores.identificacion = 'Escribe tu número de identificación.';
  else if (!REGEX_IDENTIFICACION.test(v.identificacion.trim())) {
    errores.identificacion = 'La identificación debe tener solo números (entre 6 y 12).';
  }

  if (vacio(v.telefono)) errores.telefono = 'Escribe tu número de celular.';
  else if (!REGEX_TELEFONO.test(v.telefono.trim())) {
    errores.telefono = 'El celular debe tener 10 números y empezar por 3. Ejemplo: 3101234567';
  }

  if (vacio(v.correo)) errores.correo = 'Escribe tu correo electrónico.';
  else if (!REGEX_CORREO.test(v.correo.trim())) {
    errores.correo = 'El correo no tiene un formato válido. Ejemplo: nombre@correo.com';
  } else if (v.correo.trim().length > 100) errores.correo = 'El correo puede tener máximo 100 caracteres.';

  if (vacio(v.contrasena)) errores.contrasena = 'Crea una contraseña.';
  else if (!REGEX_CONTRASENA.test(v.contrasena)) {
    errores.contrasena = 'La contraseña debe tener entre 8 y 64 caracteres, con al menos una letra y un número.';
  }

  if (vacio(v.confirmar)) errores.confirmar = 'Repite la contraseña.';
  else if (v.confirmar !== v.contrasena) errores.confirmar = 'Las contraseñas no coinciden.';

  if (v.rol === 'conductor') {
    if (vacio(v.licencia)) errores.licencia = 'Escribe el número de tu licencia de conducción.';
    else if (v.licencia.trim().length > 50) errores.licencia = 'La licencia puede tener máximo 50 caracteres.';

    if (vacio(v.placa)) errores.placa = 'Escribe la placa de tu vehículo.';
    else if (!REGEX_PLACA.test(v.placa.trim().toUpperCase())) {
      errores.placa = 'La placa no es válida. Ejemplos: ABC123 (carro) o ABC12D (moto).';
    }
  }

  return errores;
}

export function validarRuta(v) {
  const errores = {};

  if (vacio(v.origen)) errores.origen = 'Escribe el lugar de salida.';
  else if (v.origen.trim().length < 3) errores.origen = 'El origen debe tener al menos 3 letras.';
  else if (v.origen.trim().length > 150) errores.origen = 'El origen puede tener máximo 150 caracteres.';

  if (vacio(v.destino)) errores.destino = 'Escribe el lugar de llegada.';
  else if (v.destino.trim().length < 3) errores.destino = 'El destino debe tener al menos 3 letras.';
  else if (v.destino.trim().length > 150) errores.destino = 'El destino puede tener máximo 150 caracteres.';
  else if (v.destino.trim().toLowerCase() === v.origen.trim().toLowerCase()) {
    errores.destino = 'El destino debe ser distinto del origen.';
  }

  if (v.paradas.trim().length > 255) errores.paradas = 'Las paradas pueden tener máximo 255 caracteres.';

  if (vacio(v.fecha)) errores.fecha = 'Elige la fecha del viaje.';
  else if (v.fecha < hoyISO()) errores.fecha = 'La fecha no puede ser anterior a hoy.';

  if (vacio(v.hora_salida)) errores.hora_salida = 'Elige la hora de salida.';
  else if (!errores.fecha && v.fecha === hoyISO() && v.hora_salida <= horaActual()) {
    errores.hora_salida = 'La hora de salida debe ser posterior a la hora actual.';
  }

  if (vacio(v.cupos_disponibles)) errores.cupos_disponibles = 'Indica cuántos cupos ofreces.';
  else {
    const n = Number(v.cupos_disponibles);
    if (!Number.isInteger(n) || n < 1 || n > 8) {
      errores.cupos_disponibles = 'Los cupos deben ser un número entero entre 1 y 8.';
    }
  }

  return errores;
}
