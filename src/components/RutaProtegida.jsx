import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { rutaInicioDe } from '../utils/formato.js';

// Protege las pantallas que requieren sesión. Si se indica `rol`, solo ese rol puede entrar;
// los demás se envían a su pantalla de inicio.
export default function RutaProtegida({ rol, children }) {
  const { usuarioActual } = useApp();
  const ubicacion = useLocation();

  if (!usuarioActual) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }
  if (rol && usuarioActual.rol !== rol) {
    return <Navigate to={rutaInicioDe(usuarioActual.rol)} replace />;
  }
  return children;
}
