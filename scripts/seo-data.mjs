// Datos estructurados (JSON-LD) del portfolio, por idioma. Lo usa scripts/prerender.mjs.
// Se escribe en .mjs plano (sin TypeScript) para poder ejecutarlo con Node a secas.

const github = 'https://github.com/JoseDaniel369-dev'
// Añade aquí tu LinkedIn cuando lo tengas: mejora el panel de conocimiento de Google.
const sameAs = [github]

// Misma URL que profile.se7en.siteUrl (aquí no se puede importar porque profile.ts usa import.meta.env).
// Al lanzar la web de Se7en con su dominio definitivo, cámbiala en los dos sitios.
const se7enUrl = 'https://se7enmartialartsgymweb.josedanielgarcialeon4.workers.dev/'

// Sin ciudad: el portfolio se posiciona para toda España.
const spain = { '@type': 'Country', name: 'España' }

const copy = {
  es: {
    jobTitle: 'Desarrollador web y de apps',
    description:
      'Desarrollador web y de apps. Hago webs rápidas y optimizadas para Google, apps móviles con React Native y TypeScript, y llevo el marketing web de negocios: SEO, ficha de Google y analítica.',
    knowsAbout: ['Desarrollo web', 'Astro', 'SEO técnico', 'SEO local', 'Google Business Profile', 'Google Search Console', 'Marketing web', 'React Native', 'TypeScript', 'Node.js', 'Expo', 'Fastify', 'SQLite', 'Apps offline-first', 'Diseño de APIs'],
    catalog: 'Servicios',
    services: [
      ['Desarrollo de webs para negocios', 'Diseño y desarrollo de la web de un negocio: a medida, rápida y pensada primero para el móvil.'],
      ['SEO y marketing web', 'SEO técnico y local, ficha de Google Business Profile, Search Console, analítica, redes y contenido.'],
      ['Desarrollo de apps móviles', 'Apps móviles con React Native, TypeScript y Node.js, de la base de datos a la publicación.'],
    ],
    se7en: 'Web de un centro de artes marciales de Antequera, creada y con su marketing web llevado por Jose Daniel García León.',
    jfood: 'Contador de nutrición gratuito y offline-first para Android, con reconocimiento de comida por IA. Sin anuncios, sin suscripción y sin cuenta.',
  },
  en: {
    jobTitle: 'Web and app developer',
    description:
      'Web and app developer. I build fast websites optimized for Google, mobile apps with React Native and TypeScript, and run the web marketing for businesses: SEO, Google profile and analytics.',
    knowsAbout: ['Web development', 'Astro', 'Technical SEO', 'Local SEO', 'Google Business Profile', 'Google Search Console', 'Web marketing', 'React Native', 'TypeScript', 'Node.js', 'Expo', 'Fastify', 'SQLite', 'Offline-first apps', 'API design'],
    catalog: 'Services',
    services: [
      ['Websites for businesses', 'Design and development of a business website: custom, fast and mobile-first.'],
      ['SEO and web marketing', 'Technical and local SEO, Google Business Profile, Search Console, analytics, social media and content.'],
      ['Mobile app development', 'Mobile apps with React Native, TypeScript and Node.js, from the database to release.'],
    ],
    se7en: 'Website of a martial arts center in Antequera, built, and its web marketing run, by Jose Daniel García León.',
    jfood: 'Free, offline-first nutrition tracker for Android with AI food recognition. No ads, no subscription and no account.',
  },
}

export function buildGraph(site, lang) {
  const c = copy[lang]
  const person = `${site}/#person`
  return [
    {
      '@type': 'Person',
      '@id': person,
      name: 'Jose Daniel García León',
      jobTitle: c.jobTitle,
      description: c.description,
      knowsAbout: c.knowsAbout,
      sameAs,
      email: 'josedanielgarcialeon4@gmail.com',
      telephone: '+34684180746',
      ...(site && { url: `${site}/` }),
      makesOffer: {
        '@type': 'OfferCatalog',
        name: c.catalog,
        itemListElement: c.services.map(([name, description]) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name, description, areaServed: spain, provider: { '@id': person } },
        })),
      },
    },
    // La web de un cliente que construyo y cuyo marketing llevo.
    {
      '@type': 'WebSite',
      name: 'Se7en Antequera',
      url: se7enUrl,
      description: c.se7en,
      inLanguage: 'es',
      creator: { '@id': person },
    },
    // Cada app que publiques puede tener su propio bloque SoftwareApplication como este.
    {
      '@type': 'SoftwareApplication',
      name: 'JfooD',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Android',
      description: c.jfood,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      license: 'https://opensource.org/licenses/MIT',
      downloadUrl: 'https://github.com/JoseDaniel369-dev/JfooD/releases/latest',
      author: { '@id': person },
    },
  ]
}
