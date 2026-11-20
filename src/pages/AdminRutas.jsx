import { useState } from 'react';
import Alerta from '../components/Alerta.jsx';
import Boton from '../components/Boton.jsx';
import CampoSelect from '../components/CampoSelect.jsx';
import EstadoBadge from '../components/EstadoBadge.jsx';
import FormularioRuta from '../components/FormularioRuta.jsx';
import TablaDatos from '../components/TablaDatos.jsx';
import useFormulario from '../hooks/useFormulario.js';
import usePageTitle from '../hooks/usePageTitle.js';
import { useApp } from '../context/AppContext.jsx';
import { formatearFecha, formatearHora } from '../utils/formato.js';
import { validarRutaAdmin } from '../utils/validaciones.js';

const INICIAL = {
  id_conductor: '',
  origen: '',
  destino: '',
  paradas: '',
  fecha: '',
  hora_salida: '',
  cupos_disponibles: '',
};

// Módulo 2 - Rutas (RF002). El administrador registra rutas a nombre de un conductor y las ve
// en una tabla que se actualiza al agregar o eliminar (datos en memoria).
export default function AdminRutas() {
  usePageTitle('Rutas');
  const { usuarios, rutas, publicarRuta, eliminarRuta } = useApp();
  const [mensaje, setMensaje] = useState(null);
  const { valores, manejarCambio, manejarBlur, errorDe, enviar, reiniciar } = useFormulario(
    INICIAL,
    validarRutaAdmin
  );

  const conductores = usuarios.filter((u) => u.rol === 'conductor');
  const nombreConductor = (id) => usuarios.find((u) => u.id_usuario === id)?.nombre ?? 'Sin conductor';

  const guardar = (datos) => {
    const ruta = publicarRuta(datos, Number(datos.id_conductor));
    setMensaje({ tipo: 'exito', texto: `Ruta ${ruta.origen} → ${ruta.destino} registrada correctamente.` });
    reiniciar();
  };

  const quitar = (r) => {
    if (!window.confirm(`¿Eliminar la ruta ${r.origen} → ${r.destino}?`)) return;
    eliminarRuta(r.id_ruta);
    setMensaje({ tipo: 'exito', texto: 'Ruta eliminada.' });
  };

  const columnas = [
    { clave: 'ruta', etiqueta: 'Ruta', render: (r) => `${r.origen} → ${r.destino}` },
    { clave: 'conductor', etiqueta: 'Conductor', render: (r) => nombreConductor(r.id_conductor) },
    {
      clave: 'salida',
      etiqueta: 'Salida',
      render: (r) => `${formatearFecha(r.fecha)}, ${formatearHora(r.hora_salida)}`,
    },
    { clave: 'cupos_disponibles', etiqueta: 'Cupos' },
    { clave: 'estado', etiqueta: 'Estado', render: (r) => <EstadoBadge estado={r.estado} /> },
    {
      clave: 'accion',
      etiqueta: 'Acción',
      render: (r) => (
        <Boton
          variante="peligro"
          tamano="pequeno"
          onClick={() => quitar(r)}
          aria-label={`Eliminar la ruta de ${r.origen} a ${r.destino}`}
        >
          Eliminar
        </Boton>
      ),
    },
  ];

  return (
    <div>
      <h1>Rutas</h1>

      {mensaje && <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>}

      <section className="panel panel-angosto" aria-label="Formulario para registrar una ruta">
        <p className="ayuda">Los campos con * son obligatorios.</p>
        <form onSubmit={enviar(guardar)} noValidate>
          <FormularioRuta
            valores={valores}
            manejarCambio={manejarCambio}
            manejarBlur={manejarBlur}
            errorDe={errorDe}
            antes={
              <CampoSelect
                id="id_conductor"
                etiqueta="Conductor"
                valor={valores.id_conductor}
                onChange={manejarCambio}
                onBlur={manejarBlur}
                error={errorDe('id_conductor')}
                opciones={conductores.map((c) => ({ valor: c.id_usuario, texto: `${c.nombre} (${c.placa})` }))}
                textoVacio="Elige un conductor"
                obligatorio
              />
            }
          />
          <Boton type="submit" ancho>
            Guardar ruta
          </Boton>
        </form>
      </section>

      <section aria-labelledby="titulo-lista-rutas">
        <h2 id="titulo-lista-rutas">Rutas registradas ({rutas.length})</h2>
        <TablaDatos
          titulo="Rutas registradas"
          columnas={columnas}
          filas={rutas}
          claveFila="id_ruta"
          vacio="Todavía no hay rutas registradas."
        />
      </section>
    </div>
  );
}
