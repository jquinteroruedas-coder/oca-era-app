# Instrucciones para instalar la APP

## Paso 1 - Poner los archivos en la nube (una sola vez, tarda 1 minuto)

La APP funciona como una pagina web pero se instala en el celular como una APP real.

### Opcion A - Netlify Drop (GRATIS, 1 minuto):
1. Abrir https://app.netlify.com/drop desde un navegador
2. Arrastrar la carpeta `REPORTE PRODUCCION` completa a la pagina
3. Netlify dara una URL como `https://xxxxx.netlify.app`
4. Esa URL es la APP - se la compartes a los operarios

### Opcion B - GitHub Pages (gratis, permanente):
1. Crear repo en github.com con los archivos
2. Activar Pages en Settings - Pages
3. URL sera `https://usuario.github.io/repo/Reporte_Produccion.html`

## Paso 2 - Instalar en el celular del operario

### En Android (Chrome):
1. Abrir la URL en Chrome
2. Tocar el menu (3 puntos) arriba a la derecha
3. Tocar **"Agregar a pantalla de inicio"** o **"Instalar App"**
4. Listo - aparece un icono en el celular

### En iPhone (Safari):
1. Abrir la URL en Safari
2. Tocar el boton compartir (cuadrado con flecha)
3. Bajar y tocar **"Agregar a pantalla de inicio"**
4. Listo - aparece un icono en el celular

## Paso 3 - Configurar Google Sheets (para subir a la nube)

1. Abrir Google Drive (con la cuenta `jquinteroruedas@gmail.com`)
2. Crear una hoja nueva llamada **Reportes Produccion**
3. Menu Extensiones - Apps Script
4. Borrar todo el codigo y pegar el contenido de `apps_script.gs`
5. Guardar el proyecto (nombralo "Reportes La Ocanera")
6. Arriba a la derecha tocar **Implementar - Nueva implementacion**
7. Engranaje - tipo: **Aplicacion web**
8. Quien tiene acceso: **"Cualquier usuario"** (IMPORTANTE)
9. Tocar **Implementar** - copiar la URL que termina en `/exec`
10. Abrir `Reporte_Produccion.html` con un editor de texto (NotePad o similar)
11. Buscar la linea `const CLOUD_URL = "";` y pegar la URL entre comillas:
    `const CLOUD_URL = "https://script.google.com/macros/s/AKfycb.../exec";`
12. Guardar y volver a subir el archivo a Netlify
13. Listo - el boton "Subir a la nube" ya funciona

## Como funciona para el operario

1. Toca el icono en la pantalla de inicio
2. Selecciona CASONA o FABRICA
3. Escribe nombre, revisa fecha y lote
4. Agrega productos y escribe cantidades
5. Agrega traslados, insumos dañados o defectos si aplica
6. Toca **"Enviar por WhatsApp"** o **"Subir a la nube"**

## Archivos en esta carpeta

| Archivo | Descripcion |
|---------|-------------|
| Reporte_Produccion.html | La APP principal |
| manifest.json | Configuracion de la APP |
| service-worker.js | Permite usar sin internet |
| icon-192.png, icon-512.png | Iconos de la APP |
| apps_script.gs | Codigo para pegar en Google Sheets |
| INSTALAR_APP.md | Este archivo |

## Si algo no funciona

- La URL debe empezar con `https://` (no http)
- Tiene que tener internet para subir a la nube y para WhatsApp
- Si el boton "Subir a la nube" no responde, revisa que hayas pegado la URL del paso 3 punto 11
