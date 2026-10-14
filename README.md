# Integrall

Sitio de gestión patrimonial inmobiliaria, alojado en Cloudflare Workers con Static Assets.

## Desarrollo

```sh
npm ci
npm run build
npm run dev
npm test
npm run deploy
```

Contenido y plantillas: `scripts/build.mjs`. Estilos y comportamiento: `public/`. Endpoint del formulario: `src/worker.js`.

## Publicación

Worker `integrall`, cuenta Cloudflare de Integrall. Producción: https://integrall.cl. `www` redirige a la raíz. El despliegue se realiza con Wrangler autenticado, sin credenciales en el repositorio. Los cambios en GitHub no se publican automáticamente en Cloudflare.

Cloudflare sirve todos los recursos mediante rutas `integrall.cl/*` y `www.integrall.cl/*`. El registro A raíz es `192.0.2.1`, proxied, una dirección reservada que no se utiliza como servidor de origen: el Worker responde con Static Assets. `www` es un CNAME proxied hacia la raíz. No desactivar el proxy ni las rutas sin reemplazar primero el hosting.

Correo Google Workspace: MX raíz `1 smtp.google.com` y SPF/DKIM de Google se mantienen. Solo `notificaciones.integrall.cl` usa Email Routing de Cloudflare para entregar el formulario al destinatario verificado `gcarrasco@integrall.cl`. El binding EMAIL restringe el envío a esa dirección.

## Formulario

Validación de entrada del lado servidor, comprobación de origen, honeypot, tiempo mínimo y límite Cloudflare de 5 solicitudes por minuto por IP. No guarda consultas en base de datos. Solo muestra éxito después de que el proveedor acepte el envío; en caso de fallo ofrece correo/WhatsApp. No incluye datos personales en los logs.

## Alcance

La web pública está implementada. `/portal/` informa que el acceso privado está en preparación; no representa una intranet operativa. No hay cuentas de clientes, documentos ni información de pagos publicada. Supabase no se creó. La intranet deberá incorporar autenticación, permisos por propietario y almacenamiento privado antes de cargar datos reales.

## Imágenes

Fotos proporcionadas por el cliente y retocadas con Imagegen conservando identidad y aspecto natural. WebP optimizados en `public/assets`. Los originales de alta resolución quedan fuera del repositorio en la carpeta local `integrall-fotos-retocadas`.

## Dirección de arte y video

Paleta carbón `#101318`, marfil `#F3F0E9` y champagne `#C6A15B`, inspirada en la referencia https://bertorello.netlify.app/ facilitada por el cliente. Tipografías Marcellus y Manrope. Los retratos mantienen la proporción completa y tienen marcos finos.

Video decorativo de portada: https://bertorello.netlify.app/hero.mp4, reutilizado por solicitud expresa del cliente y servido localmente como `public/assets/propiedades.mp4` (H.264, 1600×900, 11,6 s, 2 MB, sin audio). Poster extraído del mismo video. No representa un inmueble ofrecido por Integrall. Reproducción en bucle, pausa accesible y carga diferida; no inicia automáticamente con movimiento reducido o ahorro de datos.

WhatsApp `+56 9 3877 9278`: tomado de las capturas 26–28 de la web anterior compartidas por el cliente vía iCloud. Contacto muestra los correos de Gabriela y Kerly; el formulario se entrega a Gabriela.
