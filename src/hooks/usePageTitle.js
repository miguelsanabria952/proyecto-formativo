import { useEffect } from 'react';

// Cambia el título de la pestaña en cada pantalla (ayuda a lectores de pantalla y al historial).
export default function usePageTitle(titulo) {
  useEffect(() => {
    document.title = `${titulo} · TransRural`;
  }, [titulo]);
}
