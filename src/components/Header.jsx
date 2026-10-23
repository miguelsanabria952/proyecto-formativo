import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { rutaInicioDe } from '../utils/formato.js';

// Encabezado con el menú principal. El menú cambia según el rol (navegación consistente en todas las pantallas).
// NavLink agrega aria-current="page" al enlace activo.
export default function Header() {
  const { usuarioActual, logout } = useApp();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/login');
  };

  let enlaces;
  if (!usuarioActual) {
    enlaces = [
      { a: '/login', texto: 'Ingresar' },
      { a: '/registro', texto: 'Crear cuenta' },
    ];
  } else if (usuarioActual.rol === 'conductor') {
    enlaces = [{ a: '/publicar', texto: 'Publicar ruta' }];
  } else {
    enlaces = [
      { a: '/inicio', texto: 'Inicio' },
      { a: '/rutas', texto: 'Buscar rutas' },
      { a: '/solicitudes', texto: 'Mis solicitudes' },
    ];
  }

  return (
    <header className="encabezado">
      <div className="encabezado-interno">
        <Link to={usuarioActual ? rutaInicioDe(usuarioActual.rol) : '/login'} className="logo">
          <span aria-hidden="true">🚐</span> TransRural
        </Link>
        <nav aria-label="Menú principal">
          <ul className="menu">
            {enlaces.map((e) => (
              <li key={e.a}>
                <NavLink to={e.a} className="enlace-menu">
                  {e.texto}
                </NavLink>
              </li>
            ))}
            {usuarioActual && (
              <li>
                <button type="button" className="enlace-menu boton-salir" onClick={salir}>
                  Salir
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
