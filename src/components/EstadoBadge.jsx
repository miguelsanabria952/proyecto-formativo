// Etiqueta de estado: símbolo + texto + color (el significado nunca depende solo del color).
// Los valores coinciden con las restricciones CHECK de la base de datos:
//   ruta: activa | cancelada | finalizada · solicitud: pendiente | aceptada | rechazada
//   viaje: confirmado | completado | cancelado
const ESTADOS = {
  activa: { simbolo: '●', texto: 'Activa', clase: 'info' },
  pendiente: { simbolo: '⏳', texto: 'Pendiente', clase: 'aviso' },
  aceptada: { simbolo: '✔', texto: 'Aceptada', clase: 'exito' },
  rechazada: { simbolo: '✖', texto: 'Rechazada', clase: 'error' },
  cancelada: { simbolo: '✖', texto: 'Cancelada', clase: 'error' },
  finalizada: { simbolo: '✔', texto: 'Finalizada', clase: 'exito' },
  confirmado: { simbolo: '✔', texto: 'Confirmado', clase: 'exito' },
  completado: { simbolo: '✔', texto: 'Completado', clase: 'exito' },
  cancelado: { simbolo: '✖', texto: 'Cancelado', clase: 'error' },
};

export default function EstadoBadge({ estado }) {
  const e = ESTADOS[estado] || { simbolo: '•', texto: estado, clase: 'info' };
  return (
    <span className={`insignia insignia-${e.clase}`}>
      <span aria-hidden="true">{e.simbolo}</span> {e.texto}
    </span>
  );
}
