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

  // Perfil de LinkedIn. Si lo dejas vacío, el acceso a LinkedIn no se muestra.
  // Misma URL que `linkedin` en scripts/seo-data.mjs (aquí no se puede importar desde allí).
  linkedin: 'https://www.linkedin.com/in/jos%C3%A9-daniel-garc%C3%ADa-le%C3%B3n-05897b40a/',

  // Enlace para reservar una llamada (Cal.com, Calendly…), p. ej. 'https://cal.com/tu-usuario/30min'.
  // Mientras esté vacío, el botón «Reservar una llamada» no se muestra.
  booking: '',

  // Datos del titular para el aviso legal. Mientras estén vacíos, no se muestran.
  legal: {
    // NIF o DNI, si facturas como autónomo.
    nif: '',
  },

  // Repositorio de esta web (público).
  portfolio: {
    repoUrl: 'https://github.com/JoseDaniel369-dev/JoseDaniel369-dev',
  },

  // Web de Se7en Antequera (proyecto para un cliente; el repositorio es privado).
  // Misma URL que `se7enUrl` en scripts/seo-data.mjs (aquí no se puede importar desde allí).
  se7en: {
    siteUrl: 'https://se7enresilienceteam.com/',
    launched: true,
  },

  jfood: {
    owner: 'JoseDaniel369-dev',
    repo: 'JfooD',
    repoUrl: 'https://github.com/JoseDaniel369-dev/JfooD',
    releaseUrl: 'https://github.com/JoseDaniel369-dev/JfooD/releases/latest',
    fallbackVersion: '0.2.0',
  },
} as const
