import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import RutaProtegida from './components/RutaProtegida.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import RecuperarContrasena from './pages/RecuperarContrasena.jsx';
import InicioPasajero from './pages/InicioPasajero.jsx';
import BuscarRutas from './pages/BuscarRutas.jsx';
import Solicitudes from './pages/Solicitudes.jsx';
import ViajeConfirmado from './pages/ViajeConfirmado.jsx';
import PublicarRuta from './pages/PublicarRuta.jsx';
import NoEncontrada from './pages/NoEncontrada.jsx';

// Componente raíz: encabezado, contenido y definición de la navegación (React Router).
//
// Flujo del prototipo:
//   Login -> (pasajero) Inicio -> Buscar rutas -> Mis solicitudes -> Viaje confirmado
//         -> (conductor) Publicar ruta
//   Login <-> Registro, Login -> Recuperar contraseña
export default function App() {
  const { pathname } = useLocation();
  const anterior = useRef(pathname);

  // Al cambiar de pantalla, el foco pasa al contenido (navegación por teclado y lectores de pantalla).
  useEffect(() => {
    if (anterior.current !== pathname) {
      anterior.current = pathname;
      window.scrollTo(0, 0);
      document.getElementById('contenido')?.focus();
    }
  }, [pathname]);

  return (
    <>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="contenedor">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/recuperar" element={<RecuperarContrasena />} />

          <Route
            path="/inicio"
            element={
              <RutaProtegida rol="pasajero">
                <InicioPasajero />
              </RutaProtegida>
            }
          />
          <Route
            path="/rutas"
            element={
              <RutaProtegida rol="pasajero">
                <BuscarRutas />
              </RutaProtegida>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <RutaProtegida rol="pasajero">
                <Solicitudes />
              </RutaProtegida>
            }
          />
          <Route
            path="/viaje/:id"
            element={
              <RutaProtegida rol="pasajero">
                <ViajeConfirmado />
              </RutaProtegida>
            }
          />
          <Route
            path="/publicar"
            element={
              <RutaProtegida rol="conductor">
                <PublicarRuta />
              </RutaProtegida>
            }
          />

          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <footer className="pie">
        <p>TransRural App · Primera versión del frontend (sin conexión al servidor)</p>
      </footer>
    </>
  );
}
