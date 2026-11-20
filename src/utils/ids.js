// Siguiente identificador para una lista en memoria (simula el AUTO_INCREMENT de MySQL).
export const siguienteId = (lista, campo) => lista.reduce((max, x) => Math.max(max, x[campo]), 0) + 1;
