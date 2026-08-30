# Planificación Compra e Inventario V1.md

## 0. Control documental

| Campo | Contenido |
|---|---|
| Proyecto | Gestor de Compra e Inventario Doméstico |
| Documento | Planificación del proyecto |
| Versión | V1 |
| Estado | Vigente |
| Fecha | 30 de agosto de 2026 |
| Sustituye a | Primera versión |
| Fuentes revisadas | Definición inicial y respuestas al cuestionario de requisitos (6 preguntas) |

---

## 1. Cambios respecto a la versión anterior

Primera versión de la planificación.

---

## 2. Resumen del proyecto

Aplicación móvil/PWA diseñada para simplificar las compras domésticas y el control de despensa. Combina la agilidad de una lista de la compra tipo *checklist* (Google Keep) con la potencia de un inventario automático: cada producto comprado en un supermercado específico alimenta el inventario doméstico, registra el precio pagado y descuenta existencias según se consumen en casa, notificando cuando se alcanza el stock mínimo.

---

## 3. Objetivos y criterios de éxito

### Objetivos
1. Reducir el tiempo necesario para confeccionar la lista de la compra y registrar existencias.
2. Operar con total fluidez en zonas con baja o nula cobertura móvil (sótanos de supermercados).
3. Mantener un histórico fiable de precios por establecimiento para facilitar el ahorro doméstico.
4. Evitar roturas de stock en el hogar mediante alertas de reposición automáticas.

### Criterios de éxito
- Registrar un producto comprado con su precio en menos de 3 clics o 5 segundos en tienda.
- Funcionamiento 100% operativo sin conexión a internet durante el acto de compra.
- Conciliación automática e inmediata entre la compra finalizada y el inventario.

---

## 4. Usuarios y roles

### Roles
- **Usuario Principal (Administrador del hogar):** Configura el catálogo de productos, define supermercados, umbrales de stock mínimo, gestiona compras y ajusta el inventario.
- **Usuario Colaborador (Pareja / Miembro del hogar - *Fase 2*):** Visualiza y tacha elementos de la lista en tiempo real, añade productos a la lista y actualiza consumos de inventario.

---

## 5. Alcance del MVP

El Producto Mínimo Viable (MVP) se centrará en el ciclo completo local:

1. **Catálogo Maestro de Productos:** Creación y mantenimiento de productos con nombre, categoría y umbral de stock mínimo.
2. **Gestión de Supermercados:** Registro básico de establecimientos habituales.
3. **Lista de la Compra Activa (Estilo Keep):**
   - Marcar/desmarcar con un toque.
   - Selector de supermercado activo en la cabecera.
   - Entrada rápida de precio unitario/cantidad al marcar.
   - Bloque de "Completados" colapsable.
4. **Cierre y Registro de Compra (Ticket):**
   - Generación automática de sesión de compra al finalizar.
   - Traspaso automático de cantidades compradas al stock del inventario.
5. **Inventario Doméstico:**
   - Vista de existencias actuales.
   - Botones rápidos de incremento/decremento (-1 / +1) para registrar consumo.
   - Indicador visual de productos por debajo del stock mínimo.
   - Botón directo "Añadir a la lista" desde el inventario.
6. **Historial de Tickets y Edición a Posteriori:** Modificación de precios, cantidades o establecimiento de compras pasadas.
7. **Modo Offline Total:** Almacenamiento local mediante IndexedDB / PWA Service Workers.

---

## 6. Funcionalidades posteriores

- **Sincronización multiusuario en la nube:** Compartición de lista e inventario en tiempo real entre miembros del hogar.
- **Empaquetado nativo Android (APK):** Distribución vía APK/Play Store mediante Capacitor.
- **Sugerencias de reposición inteligentes:** Generación de la lista con un solo clic basada en productos bajo stock mínimo o frecuencia de consumo.
- **Métricas y analítica de gasto:** Gráficas de evolución de precios por supermercado y distribución de gasto mensual por categorías.
- **Control de caducidades:** Registro opcional de fecha de consumo preferente.
- **Escáner de código de barras:** Lectura mediante cámara para búsqueda y alta rápida de productos.

---

## 7. Requisitos funcionales

### RF-01: Gestión de Catálogo y Supermercados
- **Actor:** Usuario.
- **Acción:** Crear, editar y eliminar productos (nombre, categoría, stock mínimo por defecto) y supermercados (nombre, color identificativo).
- **Validación:** No permitir nombres de productos duplicados.

### RF-02: Gestión de Lista de la Compra
- **Actor:** Usuario.
- **Acción:** Añadir elementos existentes del catálogo o crear nuevos sobre la marcha; ordenar ítems; reordenar arrastrando.
- **Precondición:** Puede haber productos precargados desde el inventario.

### RF-03: Flujo de Compra en Tienda
- **Actor:** Usuario.
- **Acción:** Seleccionar el supermercado actual; pulsar sobre un producto para marcarlo como comprado; introducir el precio y la cantidad en un modal/hoja inferior (*bottom sheet*) ágil.
- **Resultado:** El producto pasa a la sección "Comprados" y almacena temporalmente el precio registrado.

### RF-04: Cierre de Compra y Actualización de Stock
- **Actor:** Usuario.
- **Acción:** Pulsar "Finalizar compra".
- **Resultado:** Se genera un ticket de compra con fecha, hora, supermercado y detalle de artículos. Los artículos marcados incrementan el stock en el inventario y se limpian de la lista activa.

### RF-05: Ajuste y Consumo de Inventario
- **Actor:** Usuario.
- **Acción:** Reducir unidades consumidas mediante botones rápidos.
- **Validación:** El stock no puede ser negativo (mínimo 0).
- **Alerta:** Si `stock_actual <= stock_minimo`, se resalta visualmente en rojo/ámbar y se habilita un botón directo para reenviarlo a la lista de la compra.

### RF-06: Edición Histórica de Compras
- **Actor:** Usuario.
- **Acción:** Acceder a un ticket previo, modificar el precio unitario, la cantidad o el supermercado.
- **Resultado:** Recálculo del total del ticket y reajuste automático de la diferencia en el inventario si varió la cantidad.

---

## 8. Requisitos no funcionales

- **Disponibilidad Offline (RNF-01):** La aplicación debe arrancar y permitir el 100% de las operaciones del MVP sin conexión a internet.
- **Rendimiento y Latencia (RNF-02):** La interacción de marcado y entrada de datos en la lista debe responder en menos de 50 ms.
- **Diseño Responsive y Móvil (RNF-03):** Interfaz optimizada para uso con una sola mano en pantallas de 5.5" a 6.8".
- **Persistencia y Resiliencia (RNF-04):** Guardado atómico en almacenamiento local para evitar pérdidas de datos si la aplicación se cierra inesperadamente en tienda.

---

## 9. Pantallas y flujos de usuario

```
[ Navegación Inferior: 4 Pestañas ]
  ├── 1. Lista de la Compra (Pantalla Principal)
  ├── 2. Inventario / Despensa
  ├── 3. Histórico de Compras (Tickets)
  └── 4. Catálogo y Configuración
```

### Mapa de Pantallas
1. **Pantalla: Lista de la Compra**
   - Cabecera: Selector rápido de Supermercado activo + Total acumulado en la sesión.
   - Barra superior: Input rápido "Añadir a la lista..." con autocompletado de catálogo.
   - Lista "Por comprar": Elementos pendientes con checkbox, nombre, cantidad prevista y botón para editar.
   - Lista "Comprados en esta sesión": Desplegable colapsable con precio unitario visible.
   - Botón flotante inferior: "Finalizar Compra" (muestra resumen y confirma).

2. **Modal Rápido: Marcado de Producto**
   - Aparece al marcar el checkbox.
   - Inputs con teclado numérico por defecto: `Cantidad` (por defecto 1) y `Precio (€)`.
   - Botón "Confirmar" (o Intro) para cerrar en 1 segundo.

3. **Pantalla: Inventario**
   - Buscador y filtro por categorías o "Bajo stock mínimo".
   - Tarjetas de producto: Nombre, stock actual con botones `[-]` `[+]`, indicador de stock mínimo y botón `[+ Lista]`.

4. **Pantalla: Historial de Tickets**
   - Lista de compras agrupadas por fecha y supermercado.
   - Vista detalle de ticket con desglose de ítems, precio y opción "Editar Ticket".

---

## 10. Arquitectura recomendada

### Alternativas evaluadas

| Criterio | Opción A: SPA Web Clásica + API REST | Opción B: Local-First PWA (Recomendada) | Opción C: App Nativa Pura (Kotlin/Swift) |
|---|---|---|---|
| **Funcionamiento sin red** | Deficiente (requiere conexión constante) | Excelente (datos en local con Service Worker e IndexedDB) | Excelente |
| **Coste y complejidad** | Media (requiere mantener servidor/BD activa) | Baja en MVP, escalable a nube con Backend as a Service | Alta (dos bases de código) |
| **Migración a Android APK** | Compleja | Muy sencilla (Capacitor / TWA) | Nativa directa |
| **Veredicto** | Descartada | **Seleccionada** | Descartada por sobredimensionamiento inicial |

### Stack Tecnológico Recomendado
- **Frontend / PWA:** React o Vue.js con Vite + Tailwind CSS (interfaz ágil, ligera y adaptable).
- **Base de Datos Local:** IndexedDB gestionado mediante **Dexie.js** (garantiza persistencia local robusta, consultas rápidas y soporte transaccional).
- **PWA Engine:** `vite-plugin-pwa` con Workbox para instalación en pantalla de inicio y caché offline total.
- **Empaquetado Android (Fase 1.5/2):** **Capacitor**, permitiendo compilar el mismo código web a una APK nativa sin rehacer la interfaz.
- **Backend / Sincronización Futura (Fase 2):** Supabase o PocketBase para sincronización multiusuario en tiempo real.

---

## 11. Modelo de datos

### Entidades Principales

```
[Producto] 1 ─────── N [ItemLista]
   1 │
   │ 1 ────────────── N [CompraDetalle] N ────── 1 [CompraTicket]
   │                                                      │ N
   │ 1 ────────────── 1 [Inventario]                      │ 1
   └─────────────────────────────────────────────── [Supermercado]
```

- **`Producto`**
  - `id`: UUID (String)
  - `nombre`: String (ej. "Leche desnatada")
  - `categoria`: String (ej. "Lácteos")
  - `stock_minimo_defecto`: Integer (ej. 2)
  - `unidad`: String (unidades, kg, litros)

- **`Supermercado`**
  - `id`: UUID (String)
  - `nombre`: String (ej. "Mercadona", "Carrefour", "Lidl")
  - `color_hex`: String

- **`ItemLista`**
  - `id`: UUID (String)
  - `producto_id`: UUID (Ref -> Producto)
  - `cantidad_prevista`: Integer / Float
  - `comprado`: Boolean
  - `precio_compra`: Float (nullable, se asigna al marcar)
  - `supermercado_id`: UUID (nullable, si se planificó para un súper concreto)

- **`CompraTicket`**
  - `id`: UUID (String)
  - `supermercado_id`: UUID (Ref -> Supermercado)
  - `fecha_hora`: ISO8601 Timestamp
  - `importe_total`: Float
  - `notas`: String (opcional)

- **`CompraDetalle`**
  - `id`: UUID (String)
  - `ticket_id`: UUID (Ref -> CompraTicket)
  - `producto_id`: UUID (Ref -> Producto)
  - `cantidad`: Float
  - `precio_unitario`: Float
  - `subtotal`: Float

- **`Inventario`**
  - `producto_id`: UUID (PK, Ref -> Producto)
  - `stock_actual`: Float
  - `stock_minimo`: Float
  - `ultima_actualizacion`: ISO8601 Timestamp

---

## 12. Integraciones

- **MVP:** No requiere integraciones externas de terceros (sistema autónomo y desacoplado).
- **Fase 2:** Integración con API de Cámara Web/Nativa para escaneo de códigos de barras (Barcode Detection API / ZXing).

---

## 13. Seguridad y privacidad

- **Almacenamiento Local Seguro:** Todos los datos del MVP residen exclusivamente en el almacenamiento interno del navegador/dispositivo del usuario.
- **Exportación y Respaldo:** Funcionalidad para exportar e importar toda la base de datos en formato JSON para copias de seguridad manuales.
- **Privacidad:** Cero rastreo de hábitos de consumo o envío de datos a servidores externos en la versión local.

---

## 14. Fases y backlog de desarrollo

### Fase 1: Arquitectura Base y Catálogo (Sprint 1)
- **Tarea 1.1:** Configurar proyecto Vite + PWA + Dexie.js (IndexedDB).
- **Tarea 1.2:** Crear esquemas de datos y servicios CRUD locales.
- **Tarea 1.3:** Crear vistas de Catálogo y Supermercados con altas/bajas/modificaciones.

### Fase 2: Lista de la Compra y Cierre de Ticket (Sprint 2)
- **Tarea 2.1:** Implementar vista estilo Google Keep (listado, drag-and-drop, checks).
- **Tarea 2.2:** Modal ultrarrápido de registro de precio y cantidad al marcar ítem.
- **Tarea 2.3:** Lógica de "Finalizar Compra": generar `CompraTicket` y `CompraDetalle`.

### Fase 3: Módulo de Inventario y Conciliación (Sprint 3)
- **Tarea 3.1:** Actualización reactiva de stock al cerrar compras.
- **Tarea 3.2:** Pantalla de Inventario con controles rápidos `[-]` `[+]`.
- **Tarea 3.3:** Lógica de stock mínimo y botón directo "Reabastecer / Enviar a lista".

### Fase 4: Historial de Compras y Exportación (Sprint 4)
- **Tarea 4.1:** Listado y detalle de tickets pasados con edición retroactiva.
- **Tarea 4.2:** Respaldo completo en JSON (Exportar / Importar).
- **Tarea 4.3:** Pruebas PWA Offline en dispositivos reales y ajuste de estilos móviles.

---

## 15. Estrategia de pruebas

- **Pruebas Unitarias:**
  - Cálculo de totales de tickets y subtotales por producto.
  - Reglas de transición de stock (decremento, incremento, restricción de números negativos).
  - Comportamiento de disparadores de stock mínimo.
- **Pruebas de Integración (Offline/Storage):**
  - Verificación de persistencia de datos tras recarga en modo avión.
  - Flujo completo: Crear producto -> Añadir a lista -> Comprar con precio -> Verificar incremento en inventario -> Decrementar stock.
- **Pruebas de Usabilidad:**
  - Test de velocidad de entrada de datos con teclado numérico en móvil.

---

## 16. Despliegue y mantenimiento

- **Alojamiento Web (PWA):** Despliegue estático continuo en Vercel, Netlify o Cloudflare Pages (coste cero y alta velocidad vía CDN).
- **Actualizaciones de la PWA:** Estrategia *Stale-While-Revalidate* mediante Service Worker con aviso en pantalla ("Nueva versión disponible, toca para actualizar").
- **Mantenimiento:** Sin costes de infraestructura de servidor en el MVP.

---

## 17. Riesgos y dependencias

| Riesgo | Impacto | Mitigación |
|---|---|---|
| **Borrado accidental de datos por limpieza del navegador** | Alto | Implementar botón de respaldo JSON visible y persistencia de almacenamiento persistente (`navigator.storage.persist()`). |
| **Fricción al introducir precios en tienda** | Medio | Flujo de introducción con foco automático en teclado numérico y posibilidad de omitir el precio para rellenarlo después. |
| **Discrepancia al editar tickets antiguos** | Medio | Implementar transacciones atómicas en Dexie.js para actualizar simultáneamente el ticket y el stock ajustado. |

---

## 18. Decisiones vigentes

- La aplicación funcionará inicialmente como una PWA *Offline-First* con base de datos local en IndexedDB.
- Se prioriza la agilidad de la lista estilo Google Keep frente a formularios densos.
- La compra se estructura en sesiones/tickets asociados a un supermercado y fecha/hora.
- El catálogo base actuará como plantilla reutilizable para evitar teclear nombres repetidamente.

---

## 19. Decisiones descartadas o sustituidas

- *Descartada:* Crear una aplicación cliente-servidor tradicional que requiera login y conexión a internet obligatoria para el MVP (añadía fricción, coste y fallaría sin red en supermercados).

---

## 20. Supuestos y cuestiones pendientes

- **Supuestos:** El usuario utiliza un navegador moderno compatible con PWA (Chrome/Firefox/Safari en Android/iOS).
- **Cuestión pendiente:** Elegir proveedor BaaS (Supabase/PocketBase) cuando se decida implementar la sincronización multiusuario en tiempo real (Fase 2).

---

## 21. Próximo paso recomendado

Configurar la estructura base del proyecto frontend (Vite + React/Vue + Dexie.js + Tailwind CSS) y validar la persistencia local de los modelos de datos de Catálogo y Supermercado.

---

## 22. Historial de versiones

| Versión | Fecha | Estado | Resumen |
|---|---|---|---|
| V1 | 30/08/2026 | Vigente | Línea base inicial del proyecto tras completar el cuestionario de descubrimiento. |
