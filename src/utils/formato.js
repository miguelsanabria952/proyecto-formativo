export function formatearFecha(fechaISO) {
  const f = new Date(`${fechaISO}T00:00:00`);
  return f.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatearHora(hora) {
  const [h, m] = hora.split(':').map(Number);
  return new Date(1970, 0, 1, h, m).toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const primerNombre = (nombre = '') => nombre.trim().split(/\s+/)[0] || '';

// Pantalla a la que se envía a cada rol después de ingresar.
export const rutaInicioDe = (rol) => (rol === 'conductor' ? '/publicar' : '/inicio');
