# Pendiente de la web

Estado a **26 de noviembre de 2026**: la web está publicada en
<https://josedaniel369-dev.github.io/JoseDaniel369-dev/> (y `/en/` en inglés). La CI (lint, build, pruebas con
axe y Lighthouse CI) y el despliegue están en verde. Lighthouse móvil en local: rendimiento 97, accesibilidad 100,
buenas prácticas 100 y SEO 100.

Lo de esta lista no se puede hacer sin ti (datos, permisos o cuentas). Todo lo demás ya está hecho.

## 1. Comprobar lo que no he podido verificar

- [ ] **Formulario de contacto.** Escribe un mensaje de prueba en la web publicada, con tu email, y comprueba que
  llega al correo con el que registraste la clave de Web3Forms (mira spam la primera vez). Mis pruebas automáticas
  no pasan la protección de Cloudflare de Web3Forms, así que el envío real no está verificado.
  - Si sale «No se pudo enviar»: F12 → pestaña Network → petición a `api.web3forms.com` → estado y respuesta.
  - La clave está en la variable de GitHub `WEB3FORMS_KEY` (Settings → Secrets and variables → Actions →
    **Variables**) y en `.env.local` para builds en el PC (no se sube).
- [ ] **Leer la web en el móvil.** Revisa y aprueba (o cambia) estos textos, que redactó Claude con lo que sabía de ti:
  - «Sobre mí»: `approach.about` en `src/i18n/es.ts` y `en.ts`.
  - FAQ (4 preguntas): `faq` en `es.ts` y `en.ts`. La respuesta de «negocios de toda España» sale de tu decisión de
    posicionar sin ciudad.
  - «El reto y las decisiones» de Se7en: `se7en.challenge` y `se7en.decisions`, sacados del README de su repo.

## 2. Material que tienes que aportar

La web funciona sin esto: cada bloque simplemente no aparece hasta que exista.

- [ ] **Foto.** Guárdala como `public/foto.jpg` (recomendado: 640 px de ancho y menos de 80 KB) y en
  `src/data/profile.ts` cambia `photo: ''` por `` photo: `${import.meta.env.BASE_URL}foto.jpg` ``.
  Hoy se ve el monograma «JD».
- [ ] **CV en PDF.** Guárdalo como `public/cv-jose-daniel-garcia-leon.pdf` y en `profile.ts` pon
  `` cv: `${import.meta.env.BASE_URL}cv-jose-daniel-garcia-leon.pdf` ``. Aparece el botón «Descargar CV» en Contacto
  y en «Sobre mí», y en la paleta ⌘K.
- [ ] **Cita del dueño de Se7en** (con su permiso). Añádela a `src/data/testimonials.ts`:
  ```ts
  { quote: { es: '…', en: '…' }, name: 'Nombre Apellido', role: 'Cargo, Se7en Antequera', project: 'se7en' }
  ```
  Sin ninguna cita aprobada no se muestra el bloque.
- [ ] **LinkedIn.** Pon la URL en `profile.linkedin` (`src/data/profile.ts`) y añádela a `sameAs` en
  `scripts/seo-data.mjs`.

## 3. Dominio propio (lo que más pesa para SEO y marca)

Hoy el canonical apunta a una subruta de `github.io`. Cuando compres `josedanielgarcia.dev`:

- [ ] Compra el dominio en un registrador.
- [ ] En el repo: *Settings → Pages → Custom domain* y activa HTTPS. Añade los registros DNS que indique GitHub.
- [ ] En `.github/workflows/deploy.yml`: `BASE: /` y `SITE_URL: https://josedanielgarcia.dev`.
- [ ] Vuelve a desplegar y comprueba que `/` y `/en/` tienen canonical y `hreflang` con el dominio nuevo
  (`curl https://josedanielgarcia.dev/en/`).
- [ ] `ci.yml` ya usa `SITE_URL: https://josedanielgarcia.dev`; no hay que tocarlo.

## 4. Medir y dar de alta (tú vendes SEO y analítica, tu web debería tenerlos)

- [ ] Alta en **Google Search Console** y envío de `sitemap.xml` (ya lista `/` y `/en/` con alternates).
- [ ] **Analítica sin cookies** (Cloudflare Web Analytics o Plausible). Mantiene el «0 cookies de seguimiento».
- [ ] Cuando haya datos reales, revisar Core Web Vitals en Search Console: mis cifras son de laboratorio.

## 5. Cuando Se7en lance con dominio propio

Hoy es un prototipo con `noindex` en `https://se7enmartialartsgymweb.josedanielgarcialeon4.workers.dev/`.

- [ ] `src/data/profile.ts`: cambia `se7en.siteUrl` por el dominio definitivo y pon `launched: true`.
- [ ] `scripts/seo-data.mjs`: cambia `se7enUrl` por la misma URL.
- [ ] Repasa las cifras del caso de estudio (94 / 100 / 100 de Lighthouse, 16 páginas, 140 pruebas, 0 cookies)
  contra el README actual del repo de Se7en y actualízalas si han cambiado
  (`src/components/Se7enNumbers.tsx`, `src/components/Projects.tsx` y `hero.proof` en `es.ts`/`en.ts`).
- [ ] El repo de Se7en es **privado**: solo se enlaza la web, nunca el código.

## 6. Revisión legal

- [ ] El aviso «Cómo uso tus datos» del formulario (`contact.privacy` en `es.ts`/`en.ts`) es un texto base, no
  asesoría legal. Conviene que lo revise alguien. Si cambias de servicio de formularios, actualízalo.

## 7. Ideas opcionales (no prometidas)

- Mover el hosting a Cloudflare Pages (como Se7en): cabeceras de caché y seguridad, Brotli y previews.
- Reducir el peso de la fuente Bricolage (131 KB en el subconjunto latino) quitando el eje `opsz`: ~50 KB menos,
  a costa de cambiar un poco el aspecto de los titulares grandes.
- Una prueba automática del envío del formulario contra el servicio real (hoy solo está cubierta la validación y la
  cola offline).

---

## Cómo retomar (notas técnicas)

- **Comprobar todo:** `npm run check` (lint + build con prerender + pruebas). Para la prueba de `hreflang`:
  `SITE_URL=https://josedanielgarcia.dev npm run check`.
- **Probar en local:** `npm run build` y `npx vite preview`. En desarrollo, `npm run dev`; el modo avión se fuerza con
  `?offline=1` y el tema con `?theme=dark|light`.
- **Añadir un proyecto:** una entrada en `src/data/projects.ts` y sus textos en `projects.items` de `es.ts`/`en.ts`.
- **Idioma:** la web se prerenderiza en `/` (ES) y `/en/` (EN); el selector es un enlace, no un estado.
- **Subir a GitHub:** el código vive en la raíz de `JoseDaniel369-dev/JoseDaniel369-dev` (tu repo de perfil).
  Trabajar desde un clon en una carpeta temporal, copiar los ficheros del proyecto **sin** `node_modules`, `dist`,
  `.env.local` ni el `README.md` del repo (es la portada de tu perfil), usar el autor `josedanielgarcialeon4@gmail.com`
  y empujar con `https://JoseDaniel369-dev@github.com/...` (la credencial por defecto de este PC es la del instituto
  y da 403). Sin línea `Co-Authored-By` en los commits.
- **Linter:** ESLint con el parser de Babel porque `typescript-eslint` aún no soporta TypeScript 7. oxlint está
  bloqueado en este PC por Windows Application Control; no intentar saltárselo.
- **Windows / Git Bash:** al pasar `BASE=/algo/` anteponer `MSYS_NO_PATHCONV=1`, o Git Bash lo convierte en una ruta
  de Windows.
