import { useState } from 'react';

// Hook para formularios controlados.
// - valores: estado de todos los campos (cada input lee su valor de aquí).
// - errores: se calculan en cada render con la función `validar`.
// - un error solo se MUESTRA cuando el campo ya fue tocado o se intentó enviar,
//   para no llenar la pantalla de mensajes antes de que la persona escriba.
export default function useFormulario(inicial, validar) {
  const [valores, setValores] = useState(inicial);
  const [tocados, setTocados] = useState({});
  const [intento, setIntento] = useState(false);

  const errores = validar(valores);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setValores((previos) => ({ ...previos, [name]: value }));
  };

  const manejarBlur = (e) => {
    const { name } = e.target;
    setTocados((previos) => ({ ...previos, [name]: true }));
  };

  const errorDe = (nombre) => (intento || tocados[nombre] ? errores[nombre] || '' : '');

  // Devuelve el manejador del onSubmit. Si hay errores, enfoca el primer campo inválido.
  const enviar = (accion) => (e) => {
    e.preventDefault();
    setIntento(true);
    const campos = Object.keys(errores);
    if (campos.length > 0) {
      const primero = e.currentTarget.querySelector(`[name="${campos[0]}"]`);
      if (primero) primero.focus();
      return;
    }
    accion(valores);
  };

  const reiniciar = () => {
    setValores(inicial);
    setTocados({});
    setIntento(false);
  };

  return { valores, errores, manejarCambio, manejarBlur, errorDe, enviar, reiniciar };
}
