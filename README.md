# TransRural App – Frontend (primera versión)

Evidencia 3. Diseño e implementación inicial del frontend (GA6-220501096-AA3/AA4-EV01).
Interfaz en React de TransRural App, basada en los 6 prototipos de la evidencia
«Elaboración de interfaz gráfica y mapa de navegación» (GA5-220501095-AA1-EV03).
Todavía **no** se conecta al backend ni a la base de datos: los datos son de prueba y viven en memoria.

## Cómo ejecutarlo

1. Instala [Node.js](https://nodejs.org) (versión LTS).
2. En la carpeta del proyecto:

```bash
npm install
npm run dev
```

3. Abre la dirección que muestra la terminal (normalmente http://localhost:5173).

Otros comandos: `npm run build` (genera la carpeta `dist`) y `npm run preview` (prueba el build).

## Cuentas de prueba

| Rol       | Correo               | Contraseña |
| --------- | -------------------- | ---------- |
| Pasajero  | pasajero@demo.com    | Demo1234   |
| Conductor | conductor@demo.com   | Demo1234   |

También puedes crear una cuenta nueva desde «Crear cuenta». Al recargar la página los datos se reinician.

## Pantallas (prototipo → ruta)

| Prototipo | Pantalla                    | Ruta           | Rol       |
| --------- | --------------------------- | -------------- | --------- |
| 1         | Inicio de sesión            | `/login`       | Público   |
| 2         | Registro de usuario         | `/registro`    | Público   |
| 3         | Inicio del pasajero         | `/inicio`      | Pasajero  |
| 4         | Buscar y solicitar cupo     | `/rutas`       | Pasajero  |
| 5         | Publicar ruta               | `/publicar`    | Conductor |
| 6         | Confirmación del viaje      | `/viaje/:id`   | Pasajero  |
| —         | Mis solicitudes (apoyo)     | `/solicitudes` | Pasajero  |
| —         | Recuperar contraseña (apoyo)| `/recuperar`   | Público   |

Flujo del pasajero: Login → Inicio → Buscar rutas → Mis solicitudes → Viaje confirmado.
Flujo del conductor: Login → Publicar ruta.

En «Mis solicitudes» los botones **Demo: aceptar / rechazar** simulan la respuesta del conductor
(porque aún no hay servidor), para poder ver la pantalla de confirmación.

## Estructura

```
src/
├── main.jsx              Punto de entrada (Router + estado global)
├── App.jsx               Componente raíz y definición de rutas
├── index.css             Estilos (responsive, accesibles)
├── components/           Componentes reutilizables
│   ├── Header.jsx          Encabezado y menú por rol
│   ├── CampoFormulario.jsx Campo con etiqueta, ayuda y error
│   ├── Alerta.jsx          Mensajes de éxito, error e información
│   ├── EstadoBadge.jsx     Estado con símbolo + texto
│   ├── RutaCard.jsx        Tarjeta de ruta
│   ├── TablaDatos.jsx      Tabla reutilizable
│   └── RutaProtegida.jsx   Control de acceso por rol
├── pages/                Una pantalla por archivo
├── context/AppContext.jsx Estado global simulado (reemplazable por la API)
├── hooks/                useFormulario (formularios controlados), usePageTitle
├── utils/                validaciones.js, formato.js
└── data/datosIniciales.js Datos de prueba (campos iguales a la base de datos)
```

## Formularios y validaciones

Formularios controlados (cada campo lee su valor del estado de React). Validan obligatoriedad, formato y longitud:

- **Correo** con formato válido (máx. 100) · **Celular** de 10 dígitos que empieza por 3 ·
  **Identificación** solo números (6–12) · **Contraseña** de 8–64 con letra y número · **Placa** válida (carro o moto).
- **Ruta**: origen y destino (3–150, distintos), fecha no anterior a hoy, hora futura si es hoy, cupos enteros de 1 a 8.
- Las longitudes máximas no superan las de las columnas VARCHAR de la base de datos (script transrural_app).
- Los estados usados (ruta, solicitud y viaje) coinciden con las restricciones CHECK de la base de datos.
- Los errores aparecen al salir del campo o al intentar enviar, con símbolo y texto (no solo color).

## Accesibilidad y diseño responsivo

- Etiquetas asociadas a cada campo, `aria-invalid` y `aria-describedby` para errores y ayudas.
- Enlace «Saltar al contenido», foco visible, navegación completa por teclado y foco al cambiar de pantalla.
- Contraste alto, letra de 18 px, botones de mínimo 48 px, símbolos junto al color en estados y cupos.
- Diseño mobile first: 1 columna en celular, 2 en tablet y 3 en computador; las tablas se vuelven tarjetas en celular.
- Sin animaciones ni fuentes externas (baja conectividad).

## Pendiente para próximas etapas

- Conectar con el backend (reemplazar las funciones de `AppContext.jsx` por llamadas a la API).
- Gestión del perfil (RF003), validación de conductores (RF004), panel de administración (RF008) y notificaciones reales (RF006/RF007).

## Entrega

Comprime la carpeta **sin** `node_modules` ni `dist`.
