# Lista de chequeo – Desarrollo de componentes frontend

Proyecto: TransRural App · Evidencia: Desarrollo de componentes frontend (Guía 2 ajustada / Guía 6)
Aprendiz: Miguel Ángel Sanabria · Ficha 3336057

**Cómo se usa:** ejecuta `npm run dev`, prueba cada punto en el navegador y marca la casilla solo si lo
viste funcionar. Anota en «Observaciones» lo que encuentres.

Cuentas de prueba (contraseña `Demo1234`): `admin@demo.com` (módulos Usuarios y Rutas),
`conductor@demo.com` (Publicar ruta) y `pasajero@demo.com`.

## 1. Alcance y datos de prueba

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 1.1 | Hay al menos 2 módulos funcionales | Usuarios (`/admin/usuarios`) y Rutas (`/admin/rutas`) | ☑ | |
| 1.2 | Cada módulo tiene datos de prueba iniciales | `src/data/datosIniciales.js` (4 usuarios, 4 rutas) | ☑ | |
| 1.3 | Los datos se pueden agregar y eliminar en memoria | Formularios + botón «Eliminar» de cada tabla | ☑ | |

## 2. Componentes reutilizables

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 2.1 | Botón reutilizable | `components/Boton.jsx` (usado en Usuarios, Rutas y Publicar ruta) | ☑ | |
| 2.2 | Campo de entrada con etiqueta | `components/CampoFormulario.jsx` (y `CampoSelect.jsx`) | ☑ | |
| 2.3 | Tabla dinámica | `components/TablaDatos.jsx` (Usuarios, Rutas, Solicitudes) | ☑ | |
| 2.4 | Los mismos componentes se usan en más de un módulo, sin duplicar código | `FormularioRuta.jsx` lo usan Publicar ruta y Rutas | ☑ | |

## 3. Formularios y validaciones

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 3.1 | Campos obligatorios muestran mensaje | Todos los formularios | ☑ | |
| 3.2 | Formato de correo | Usuarios: `correo` | ☑ | |
| 3.3 | Valores numéricos mayores que cero | Rutas: cupos de 1 a 8 | ☑ | |
| 3.4 | Longitud de caracteres | Nombre 3–100, origen/destino 3–150, contraseña 8–64 | ☑ | |
| 3.5 | Los mensajes dicen cómo corregir el dato | Ejemplos en cada mensaje de error | ☑ | |
| 3.6 | No guarda si hay errores | `useFormulario.enviar` | ☑ | |
| 3.7 | Evita duplicados (correo, identificación, placa) | `services/usuariosService.js` | ☑ | |

## 4. Navegación

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 4.1 | Menú para moverse entre módulos | `components/Header.jsx` | ☑ | |
| 4.2 | Rutas definidas en un solo archivo | `App.jsx` | ☑ | |
| 4.3 | Cambia de módulo sin recargar la página | React Router | ☑ | |
| 4.4 | Cada rol solo entra a sus pantallas | `components/RutaProtegida.jsx` | ☑ | |

## 5. Gestión de estado

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 5.1 | Estado global compartido | `context/AppContext.jsx` | ☑ | |
| 5.2 | La tabla se actualiza al agregar | Usuarios y Rutas | ☑ | |
| 5.3 | La tabla se actualiza al eliminar | Usuarios y Rutas | ☑ | |
| 5.4 | Un cambio en un módulo se ve en el otro (eliminar un conductor quita sus rutas) | `eliminarUsuario` | ☑ | |

## 6. Separación de responsabilidades

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 6.1 | Validaciones fuera de los componentes visuales | `utils/validaciones.js` | ☑ | |
| 6.2 | Reglas de negocio fuera de las vistas | `services/usuariosService.js`, `services/rutasService.js` | ☑ | |
| 6.3 | Las vistas solo muestran y llaman funciones | `pages/` | ☑ | |

## 7. Repositorio y entrega

| # | Punto a verificar | Dónde está | Cumple | Observaciones |
|---|-------------------|------------|:------:|---------------|
| 7.1 | Proyecto sincronizado con GitHub | `miguelsanabria952/proyecto-formativo` | ☐ | |
| 7.2 | Commits con mensajes claros, por rama y pull request | Historial del repositorio | ☐ | |
| 7.3 | No se sube `node_modules` ni `.env` | `.gitignore` | ☐ | |
| 7.4 | Video corto con la fecha visible del computador | Ver `GUION_VIDEO.md` | ☐ | |

## Hallazgos encontrados y corregidos

| # | Hallazgo | Corrección |
|---|----------|------------|
| 1 | No había forma de eliminar registros; las rutas se mostraban como tarjetas | Se agregó el botón «Eliminar» y las rutas ahora se listan en `TablaDatos` |
| 2 | Las reglas de negocio (unicidad, creación de registros) estaban dentro de `AppContext.jsx`, mezcladas con el estado | Se movieron a `src/services/`; el contexto solo guarda el estado y llama a los servicios |
| 3 | El formulario de ruta solo existía dentro de `PublicarRuta.jsx` | Se extrajo a `components/FormularioRuta.jsx` para reutilizarlo en el módulo Rutas |
| 4 | Los botones repetían clases CSS en cada página | Se creó el componente `Boton.jsx` |
| 5 | Solo había módulos separados por rol, sin dos módulos de gestión visibles en el mismo menú | Se agregó el rol administrador con el menú Usuarios · Rutas |
