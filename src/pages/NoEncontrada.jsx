import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.js';

export default function NoEncontrada() {
  usePageTitle('Página no encontrada');
  return (
    <section className="panel panel-angosto">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/login" className="boton boton-principal boton-ancho">
        Ir al inicio
      </Link>
    </section>
  );
}
