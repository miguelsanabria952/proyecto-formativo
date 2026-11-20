# Guion del video demostrativo (3 a 4 minutos)

**Antes de grabar**
- Ejecuta `npm run dev` y abre http://localhost:5173.
- Haz que se vea la **fecha y hora de tu computador** durante todo el video (barra de tareas visible,
  o abre un reloj/terminal con `date`). El instructor la pidió para validar que es tu trabajo.
- Ten abierta la terminal con el proyecto y el repositorio en GitHub en otra pestaña.
- Prepara una grabación de pantalla con micrófono (Xbox Game Bar con Win+G, o OBS).

**1. Presentación (15 s)**
«Soy Miguel Ángel Sanabria, ficha 3336057. Este es TransRural App: muestro los dos módulos Usuarios y Rutas
con componentes reutilizables, validaciones, navegación y estado.»

**2. Navegación (30 s)**
- Ingresa con `admin@demo.com` / `Demo1234`.
- Cambia entre **Usuarios** y **Rutas** con el menú. Di que la página no se recarga.

**3. Módulo Usuarios – validaciones (60 s)**
- Pulsa «Guardar usuario» con el formulario vacío: se ven los mensajes de campos obligatorios.
- Escribe un correo mal (`ana@`), una identificación con letras y un celular corto: muestra cada error.
- Escribe un correo ya existente (`pasajero@demo.com`): muestra el error de duplicado.
- Llena todo bien y guarda: **la tabla se actualiza al instante**.
- Elimina el usuario nuevo: desaparece de la tabla.

**4. Módulo Rutas (60 s)**
- Intenta guardar con cupos `0` y con origen igual al destino: muestra los errores.
- Guarda una ruta correcta eligiendo un conductor: aparece en la tabla.
- Elimina una ruta.

**5. Estado compartido (20 s)**
- Elimina el conductor «Marta Ocampo» en Usuarios y vuelve a Rutas: sus rutas ya no están.

**6. Código (40 s)**
En VS Code muestra: `components/` (Boton, CampoFormulario, TablaDatos, FormularioRuta), `context/AppContext.jsx`,
`utils/validaciones.js` y `services/`. Explica que las validaciones y reglas están separadas de las vistas.

**7. Repositorio (15 s)**
Muestra el repositorio en GitHub con los últimos commits y la fecha del computador.

**Cierre:** «Esta es la entrega de la evidencia; el repositorio y la lista de chequeo van en el enlace.»
