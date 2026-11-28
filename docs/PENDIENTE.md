# Pendiente de la web

Estado a **26 de noviembre de 2026**. La web está publicada en
<https://josedaniel369-dev.github.io/JoseDaniel369-dev/> (y `/en/` en inglés). Tras el rediseño comercial tiene
**8 páginas indexables** (portada, caso de Se7en, caso de JfooD y aviso legal, cada una en ES y EN) y una 404.

Lighthouse móvil en local (mediana de 3 ejecuciones, con la configuración de `lighthouserc.json`): rendimiento 90–94,
accesibilidad 100, buenas prácticas 100 y SEO 100 en todas las páginas indexables, con CLS 0,000. Son cifras de
laboratorio: las reales saldrán de Search Console cuando haya visitas.

Lo de esta lista no se puede hacer sin ti (datos, permisos o cuentas). Todo lo demás ya está hecho. Va ordenado por
impacto comercial: lo primero es lo que más confianza da a una empresa.

## 1. Dominio y email profesional (lo que más pesa para confianza y SEO)

Hoy el email es de Gmail y la web cuelga de una subruta de `github.io`. Una empresa o una agencia lo nota. Además,
`robots.txt` solo lo lee Google en la raíz de un dominio: en la subruta no sirve.

- [ ] Compra el dominio (p. ej. `josedanielgarcia.dev`) y crea un correo `hola@tu-dominio` (Cloudflare Email Routing es
  gratis y reenvía a tu Gmail; o Zoho Mail).
- [ ] En el repo: *Settings → Pages → Custom domain* y activa HTTPS. Añade los registros DNS que indique GitHub.
- [ ] En `.github/workflows/deploy.yml`: `BASE: /` y `SITE_URL: https://tu-dominio`.
- [ ] Cambia el email en los sitios donde aparece escrito: `src/data/profile.ts` (`email`), `scripts/seo-data.mjs`,
  `index.html` (el `<noscript>`), y los textos de `contact.privacy` y `legal` en `src/i18n/es.ts` y `en.ts`.
- [ ] Vuelve a desplegar y comprueba que todas las páginas tienen canonical y `hreflang` con el dominio nuevo
  (`curl https://tu-dominio/en/projects/se7en/`) y que `https://tu-dominio/sitemap.xml` lista las 8 URL.
- [ ] `ci.yml` ya usa `SITE_URL: https://josedanielgarcia.dev`; cámbialo si compras otro dominio.

## 2. Revisar los textos con compromisos (los redacté yo, tú decides si los cumples)

Quedan en `src/i18n/es.ts` y `en.ts`. Si alguno no es verdad para ti, cámbialo o quítalo: **no inventes nada**.

- [ ] **«Respuesta en 24 h laborables»** (`hero.response`, `contact.lead`, `contact.reply`, `contact.bubbles`).
- [ ] **«Disponible para nuevos proyectos»** (`hero.available`). Quítalo cuando no lo estés.
- [ ] **Valoración inicial de unos 30 minutos, sin compromiso, y propuesta por escrito con alcance, plazos y precio**
  (`services.assessment`, `faq`). Es la oferta gratuita de la web: confirma que quieres ofrecerla así.
- [ ] **Entrega del código y los accesos** (`services.lead`, `services.items[].includes`, `faq`): «el código y la web son
  tuyos». Si cobras la cesión o hay licencias, ajústalo.
- [ ] **Trabajo en marca blanca, diseños de Figma y colaboración en el equipo de la empresa**
  (`clients.items`, `faq`).
- [ ] **Soporte tras la entrega y mantenimiento** (`services.maintenance`, `process.steps`, `faq`).
- [ ] **Plazos:** «una landing o una web corporativa suele ser cuestión de semanas» (`faq`).
- [ ] **Entregables de cada servicio** (`services.items[].includes`): revisa que cada punto lo ofreces de verdad,
  sobre todo en «Automatización e integraciones con IA», que es el servicio con menos pruebas.
- [ ] **Sección «¿Por qué una web?»** (`why` en `es.ts`/`en.ts`, componente `WhyWeb`): los textos los redacté yo. Lee los
  seis motivos y las cuatro dudas típicas y confirma que te representan. No lleva cifras ni estadísticas; si quieres
  añadir alguna, que sea con su fuente. Sirve de ejemplo real el caso de Se7en.
- [x] **Rangos de presupuesto del formulario:** eliminados (el formulario ya no pide presupuesto).
- [ ] **«Málaga · en remoto para toda España»** (`hero.place`, `footer.place`, JSON-LD en `scripts/seo-data.mjs`).
- [ ] **Sobre mí** (`about.bio`) y las cinco tarjetas (`about.items`): no incluyen años de experiencia ni títulos.
- [ ] **FAQ** (6 preguntas) y los textos del caso de Se7en (`se7en.challenge`, `se7en.decisions`, sacados del README de
  su repo).

## 3. Material que tienes que aportar

La web funciona sin esto: cada bloque simplemente no aparece hasta que exista.

- [ ] **Foto.** Guárdala como `public/foto.jpg` (recomendado: 640 px de ancho y menos de 80 KB) y en
  `src/data/profile.ts` cambia `photo: ''` por `` photo: `${import.meta.env.BASE_URL}foto.jpg` ``.
  Hoy se ve el monograma «JD». Una foto real es lo que más «humaniza» la portada y «Sobre mí».
- [x] **LinkedIn.** Hecho: URL en `profile.linkedin` (`src/data/profile.ts`) y en `sameAs` de
  `scripts/seo-data.mjs`.
- [ ] **Enlace para reservar una llamada** (Cal.com o Calendly, gratis) en `profile.booking`. Aparece el botón
  «Reservar una llamada» en Contacto. Sin enlace, no se muestra.
- [ ] **NIF** en `profile.legal.nif`, si facturas como autónomo. Aparece en el aviso legal.
- [ ] **CV en PDF** (descartado a propósito: la web está orientada a captar clientes, no empleo; solo si cambia el
  objetivo). Guárdalo como `public/cv-jose-daniel-garcia-leon.pdf` y en `profile.ts` pon
  `` cv: `${import.meta.env.BASE_URL}cv-jose-daniel-garcia-leon.pdf` ``. Aparece el botón «Descargar CV» en Contacto
  y en «Sobre mí», y en la paleta ⌘K.
- [ ] **Cita del dueño de Se7en** (con su permiso). Añádela a `src/data/testimonials.ts`:
  ```ts
  { quote: { es: '…', en: '…' }, name: 'Nombre Apellido', role: 'Cargo, Se7en Antequera', project: 'se7en' }
  ```
  Sin ninguna cita aprobada no se muestra el bloque.
- [ ] **Permiso del gimnasio por escrito** para enseñar las capturas de su web (salen personas). Hoy lo tienes de
  palabra; un mensaje de WhatsApp o un correo basta. Está mencionado en el aviso legal y en el pie de la galería.
- [ ] **Capturas reales de JfooD.** Hoy se ve una maqueta dibujada, etiquetada como «maqueta ilustrativa». Haz capturas
  de la app (móvil Android), guárdalas en `public/shots/jfood/` y amplía `Shot` (`src/components/Shot.tsx`) para aceptar
  `project: 'jfood'`. Luego sustituye la maqueta de `Projects.tsx` y de `JfoodStory.tsx`.

## 4. Medir y dar de alta (tú vendes SEO y analítica, tu web debería tenerlos)

- [ ] Alta en **Google Search Console** y envío de `sitemap.xml` (ya lista las 8 páginas con alternates).
- [ ] **Analítica sin cookies** con Cloudflare Web Analytics: crea el sitio, copia el token y guárdalo como variable de
  GitHub `CF_BEACON_TOKEN` (*Settings → Secrets and variables → Actions → Variables*). El build ya lo inyecta si existe
  (`VITE_CF_BEACON_TOKEN`) y el aviso legal ya dice que la analítica no usa cookies. Mantiene el «0 cookies».
- [ ] Cuando haya datos reales, revisar Core Web Vitals en Search Console: mis cifras son de laboratorio.

## 5. Comprobar lo que no he podido verificar

- [ ] **Formulario de contacto, envío real.** Escribe un mensaje de prueba en la web publicada, con tu email, y comprueba
  que llega al correo con el que registraste la clave de Web3Forms (mira spam la primera vez). Ahora el formulario
  envía también empresa, tipo de proyecto, presupuesto e intención: comprueba que se ven bien en el correo.
  Mis pruebas automáticas **simulan** la respuesta de Web3Forms (comprueban lo que sale del navegador y cómo reacciona la
  web), pero no pasan la protección de Cloudflare de Web3Forms, así que el envío real no está verificado.
  - Si sale «No se pudo enviar»: F12 → pestaña Network → petición a `api.web3forms.com` → estado y respuesta.
  - La clave está en la variable de GitHub `WEB3FORMS_KEY` (Settings → Secrets and variables → Actions →
    **Variables**) y en `.env.local` para builds en el PC (no se sube).
- [ ] **Leer la web en el móvil** y en inglés, de arriba abajo, como lo haría un cliente.

## 6. Se7en ya tiene dominio propio

Lanzada en `https://se7enresilienceteam.com/`. Hecho: `siteUrl` y `launched: true` en `src/data/profile.ts`, `se7enUrl`
en `scripts/seo-data.mjs`, `index.html`, capturas y imagen para compartir regeneradas, textos de «versión previa»
actualizados.

- [ ] Repasa las cifras del caso de estudio (96 / 100 / 100 de Lighthouse, 16 páginas, 140 pruebas, 0 cookies)
  contra el README actual del repo de Se7en y actualízalas si han cambiado
  (`src/components/Se7enNumbers.tsx`, `src/components/Projects.tsx`, `hero.proof` y `projects` en `es.ts`/`en.ts`).
- [ ] El repo de Se7en es **privado**: solo se enlaza la web, nunca el código.

## 7. Revisión legal

- [ ] La página **Aviso legal y privacidad** (`legal` en `es.ts`/`en.ts`, y el resumen del formulario en
  `contact.privacy`) es un texto base, no asesoría legal. Conviene que lo revise alguien. Hay un dato que he fijado yo:
  **conservación de 12 meses** desde el último contacto. Confírmalo o cámbialo. Si cambias de servicio de formularios,
  de hosting o activas otra analítica, actualízalo.

## 8. Ideas opcionales (no prometidas)

- Mover el hosting a Cloudflare Pages (como Se7en): cabeceras de caché y seguridad, Brotli y previews.
- Una imagen para compartir distinta por página (hoy hay una en español y otra en inglés, iguales para todas).
- Reducir el peso de la fuente Bricolage (131 KB en el subconjunto latino) quitando el eje `opsz`: ~50 KB menos,
  a costa de cambiar un poco el aspecto de los titulares grandes.
- Dividir el JavaScript por página (hoy es un solo paquete de ~165 KB comprimido que sirve las 8 páginas).
- Una prueba automática del envío del formulario contra el servicio real (hoy se simula).

---

## Cómo retomar (notas técnicas)

- **Comprobar todo:** `npm run check` (lint + build con prerender + pruebas). Ejecuta además unas pruebas que **solo
  corren con variables de entorno al construir** (canonical, hreflang, sitemap y el envío simulado del formulario):
  ```bash
  MSYS_NO_PATHCONV=1 SITE_URL=https://josedanielgarcia.dev VITE_WEB3FORMS_KEY=lo-que-sea npm run check
  ```
  (`MSYS_NO_PATHCONV=1` es necesario en Git Bash; la clave puede ser falsa, las pruebas interceptan la petición.)
  La integración continua ya lo hace así (`.github/workflows/ci.yml`).
- **Probar en local:** `npm run build` y `npx vite preview`. En desarrollo, `npm run dev`; el modo avión se fuerza con
  `?offline=1` y el tema con `?theme=dark|light`. Para probar la subruta de GitHub Pages:
  `BASE=/JoseDaniel369-dev/ npm run build && BASE=/JoseDaniel369-dev/ npx vite preview`.
- **Páginas y rutas:** `src/routes.ts` es la única fuente de URLs. El prerender (`scripts/prerender.mjs`) recorre
  `paths` y escribe una página por ruta e idioma, más `404.html`, `sitemap.xml` y `robots.txt`. Cada página es un
  componente de `src/pages/` que `src/App.tsx` monta según la URL.
- **Añadir un proyecto a la portada:** una entrada en `src/data/projects.ts` y sus textos en `projects.items` de
  `es.ts`/`en.ts`. Si quieres su caso de estudio: página nueva en `src/pages/`, entrada en `paths` de `src/routes.ts`,
  un caso en `buildGraph` de `scripts/seo-data.mjs`, su `meta` en los diccionarios, su URL en `lighthouserc.json` y
  en `sitePages` de `tests/helpers.ts`.
- **Textos:** `es.ts` define la forma y `en.ts` está tipado contra ella: si falta una clave en un idioma, `tsc` falla.
- **Formulario:** `src/components/ContactChat.tsx` y `src/lib/contact.ts` (envío) / `src/lib/brief.ts` (tipos,
  intenciones y presupuestos). Los botones de «Pedir presupuesto» usan `QuoteLink` para dejarlo preparado.
- **Imágenes (scripts puntuales, no forman parte del build):** `node scripts/capture-se7en.mjs` (capturas de Se7en, WebP)
  y `node scripts/og-image.mjs` (imagen para compartir en ES y EN). Necesitan Chrome instalado.
- **Lighthouse CI:** `lighthouserc.json` lista las URL una a una (el descubrimiento automático solo encuentra 5).
  La 404 solo exige accesibilidad: lleva `noindex` a propósito.
- **Pruebas de accesibilidad:** en la medición de contraste se oculta el botón fijo del móvil y se desactiva
  `content-visibility`, que falsean el fondo que ve axe; el botón fijo se mide aparte (`tests/site.spec.ts`).
- **Subir a GitHub:** el código vive en la raíz de `JoseDaniel369-dev/JoseDaniel369-dev` (tu repo de perfil).
  Trabajar desde un clon en una carpeta temporal, copiar los ficheros del proyecto **sin** `node_modules`, `dist`,
  `.env.local` ni el `README.md` del repo (es la portada de tu perfil), usar el autor `josedanielgarcialeon4@gmail.com`
  y empujar con `https://JoseDaniel369-dev@github.com/...` (la credencial por defecto de este PC es la del instituto
  y da 403). Sin línea `Co-Authored-By` en los commits.
- **Linter:** ESLint con el parser de Babel porque `typescript-eslint` aún no soporta TypeScript 7. oxlint está
  bloqueado en este PC por Windows Application Control; no intentar saltárselo.
- **Windows / Git Bash:** al pasar `BASE=/algo/` o rutas que empiecen por `/` anteponer `MSYS_NO_PATHCONV=1`, o Git Bash
  las convierte en rutas de Windows. Varios ficheros tienen saltos de línea CRLF: al editarlos con scripts,
  normaliza a LF y vuelve a CRLF al guardar.
