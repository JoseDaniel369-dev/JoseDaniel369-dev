// Todos los datos personales y enlaces viven aquí. Cambia solo este archivo.
export const profile = {
  name: 'Jose Daniel García León',
  email: 'josedanielgarcialeon4@gmail.com',

  // Teléfono de contacto: `phone` es el texto que se ve y `phoneHref` el enlace para llamar.
  phone: '+34 684 18 07 46',
  phoneHref: 'tel:+34684180746',
  // Mismo número, en formato internacional sin '+' para wa.me.
  whatsapp: '34684180746',

  // CV en PDF: cuando lo tengas, ponlo en public/cv-jose-daniel-garcia-leon.pdf y cambia esto por
  // `${import.meta.env.BASE_URL}cv-jose-daniel-garcia-leon.pdf`. Vacío = el botón no se muestra.
  cv: '',

  // Cuando tengas la foto, ponla en public/foto.jpg y cambia esto por `${import.meta.env.BASE_URL}foto.jpg`.
  // Vacío = se muestra el monograma "JD" sin pedir ningún archivo (evita un 404 en cada carga).
  photo: '',

  github: 'https://github.com/JoseDaniel369-dev',

  // Pega aquí la URL de tu perfil, p. ej. 'https://www.linkedin.com/in/tu-usuario'.
  // Mientras esté vacío, el acceso a LinkedIn no se muestra.
  linkedin: '',

  // Web de Se7en Antequera (proyecto para un cliente; el repositorio es privado).
  // Al lanzar la definitiva: cambia siteUrl por el dominio propio, pon launched en true
  // y actualiza la misma URL en vite.config.ts (bloque WebSite).
  se7en: {
    siteUrl: 'https://se7enmartialartsgymweb.josedanielgarcialeon4.workers.dev/',
    launched: false,
  },

  jfood: {
    owner: 'JoseDaniel369-dev',
    repo: 'JfooD',
    repoUrl: 'https://github.com/JoseDaniel369-dev/JfooD',
    releaseUrl: 'https://github.com/JoseDaniel369-dev/JfooD/releases/latest',
    fallbackVersion: '0.2.0',
  },
} as const
