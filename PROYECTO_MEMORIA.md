# PROYECTO — APP REPORTE DE PRODUCCION
## Conservas La Ocañera S.A.S.

**Propietario:** Jonnatan Quintero Rueda
**Email:** jquinteroruedas@gmail.com
**WhatsApp dueño:** +57 315 242 4221
**Empresa:** Conservas La Ocañera S.A.S. — Ocaña, Norte de Santander, Colombia

---

## 1. Proposito de la APP

Los operarios de La Ocañera reportan, desde el celular, la producción y movimientos diarios en las dos bodegas:

- **CASONA** (producción / envasado + recepción de materia prima)
- **FABRICA** (sellado / etiquetado / despacho)

El dueño recibe los reportes por WhatsApp, Excel y Google Sheets.

---

## 2. Estado actual (v3 — 2026-04-19)

### Pantallas
1. **Splash** — Logo grande de La Ocañera con botón "Comenzar".
2. **Seleccion de bodega** — Botones CASONA (verde) / FABRICA (rojo).
3. **Formulario** — Datos del operario + productos + materia prima (solo Casona) + observaciones.
4. **Revisión** — Resumen antes de enviar + botones WhatsApp, Nube, Excel, Correo.

### Columnas por bodega

| Bodega | Columnas |
|---|---|
| **CASONA** | Producido / Enviado a Fábrica |
| **FABRICA** | Recibido / Etiquetado-Armado / Despachado |

### Materia prima (solo CASONA)
- Durazno en fruta — kg + $/kg
- Jalapeño verde en fruta — kg + $/kg
- Jalapeño rojo en fruta — kg + $/kg
- Cebolla roja en fruta — kg + $/kg

### Catálogo de productos
121 productos con SKU + grupo + unds/caja, cargados desde el catálogo de productos La Ocañera.

### Identidad visual
Paleta oficial (extraída del PDF GAMA CROMATICA):
- Rojo primario `#BC3440`
- Verde Casona `#54A07F`
- Verde brillante `#9CC74C`
- Crema fondo `#F5F2DF`
- Dorado `#F7C93C`
- Navy `#375090`

Body theme classes: `body.s-casona` (verde), `body.s-fabrica` (rojo).

### UX modal cantidades
- Pestañas con valor (PROD / ENV o REC / ETIQ / DESP)
- Display gigante (78px) con bordes dorados
- Teclado numérico 3×4 (1-9, 0, BORRAR, retroceso)

---

## 3. Arquitectura técnica

### Archivo maestro
`C:\Users\LENOVO\AppData\Roaming\Claude\local-agent-mode-sessions\...\outputs\build_app_diario.py`

Al ejecutarlo genera:
- `Reporte_Produccion.html` (app completa single-file)
- `manifest.json` (PWA)
- `service-worker.js` (cache offline, versión `ocanera-v3`)
- `INSTALAR_APP.md`
- `apps_script.gs` (Google Apps Script para Sheets)
- `icon-192.png`, `icon-512.png`, `logo-header.png`, `laocanera_logo.png`

Salida: `C:\Users\LENOVO\OneDrive\Desktop\CONSERVAS LA OCANERA\REPORTE PRODUCCION\`

### Configuración en el HTML
```js
const CLOUD_URL = "";              // Pegar URL Apps Script cuando esté listo
const WHATSAPP_PHONE = "573152424221";
const EMAIL_TO = "jquinteroruedas@gmail.com";
```

### Distribución
- Netlify Drop: **dreamy-axolotl-8a2fd0.netlify.app**
- Se arrastra la carpeta REPORTE PRODUCCION completa
- En celular: abrir URL en Chrome/Safari → "Añadir a pantalla de inicio"

### Google Sheets (opcional)
Pegar `apps_script.gs` en Extensiones → Apps Script → Implementar como App Web. Crea 3 hojas: **Resumen**, **Detalle_CASONA** / **Detalle_FABRICA**, **Materia_Prima**.

---

## 4. Cómo iterar

### Cuando el usuario pida cambios:
1. Editar `build_app_diario.py` (HTML_TEMPLATE, APPS_SCRIPT, MANIFEST, etc.)
2. Ejecutar `python3 build_app_diario.py`
3. Validar JS con `node --check`
4. El usuario sube de nuevo la carpeta a Netlify Drop
5. Incrementar `CACHE = "ocanera-vX"` para forzar refresh en celulares

### Cuidados importantes (aprendido):
- Las ediciones grandes con `Edit` truncan el archivo. Usar heredoc de bash para append de bloques grandes.
- Nunca olvidar cerrar triple-strings en Python.
- Siempre validar Python con `python3 -c "import build_app_diario"` o ejecutándolo.
- El archivo está en OneDrive y algunos ops de `mv` / `rm` fallan por permisos — usar `cp` y dejar temp files.
- Incrementar versión del Service Worker cada release o el celular queda con caché vieja.

---

## 5. Roadmap / ideas pendientes

Cosas que el dueño puede pedir a futuro:
- [ ] Conectar Google Sheets (pegar URL en CLOUD_URL)
- [ ] Agregar más materias primas (ajo, tomate, vinagre, etc.)
- [ ] Reporte semanal / mensual consolidado
- [ ] Alertas de mínimos de inventario
- [ ] Foto adjunta de lotes dañados / novedades
- [ ] Firma digital del operario
- [ ] Login simple (lista de operarios autorizados)
- [ ] Exportar PDF con membrete
- [ ] Dashboard para el dueño (ver reportes históricos sin abrir Sheets)
- [ ] Multi-idioma (si contratan operarios que no leen bien español)

---

## 6. Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| v1 | 2026-04 | Primera versión con catálogo de productos |
| v2 | 2026-04 | Multi-sede Casona/Fábrica, teclado de cantidades, logos La Ocañera |
| v3 | 2026-04-19 | Splash, materia prima en Casona (4 insumos con kg + precio) |

---

## 7. Notas de marca

- Nombre corto: **La Ocañera**
- Eslogan implicito: "Conservas tradicionales de Ocaña"
- Registro sanitario: varía por producto (consultar ficha técnica)
- NIT: 901.XXX.XXX-X (pendiente completar)
- Web: en desarrollo

Este archivo es la memoria del proyecto. Claude debe leerlo al inicio de cada sesión para continuar donde quedó.
