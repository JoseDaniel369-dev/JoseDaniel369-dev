// Datos estructurados (JSON-LD) del portfolio, por idioma y por página. Lo usa scripts/prerender.mjs.
// Se escribe en .mjs plano (sin TypeScript) para poder ejecutarlo con Node a secas.

const github = 'https://github.com/JoseDaniel369-dev'
// Añade aquí tu LinkedIn cuando lo tengas: mejora el panel de conocimiento de Google.
const sameAs = [github]

// Misma URL que profile.se7en.siteUrl (aquí no se puede importar porque profile.ts usa import.meta.env).
// Al lanzar la web de Se7en con su dominio definitivo, cámbiala en los dos sitios.
const se7enUrl = 'https://se7enmartialartsgymweb.josedanielgarcialeon4.workers.dev/'

const spain = { '@type': 'Country', name: 'España' }
const address = { '@type': 'PostalAddress', addressLocality: 'Málaga', addressRegion: 'Andalucía', addressCountry: 'ES' }

const copy = {
  es: {
    siteName: 'Jose Daniel García León',
    jobTitle: 'Desarrollador web y de software independiente',
    description:
      'Desarrollador independiente en Málaga. Webs corporativas y landing pages, apps y software a medida, y automatizaciones e integraciones con IA para pymes y agencias.',
    knowsAbout: ['Desarrollo web', 'Landing pages', 'SEO técnico', 'SEO local', 'Software a medida', 'Aplicaciones móviles', 'Automatización', 'Integraciones con IA', 'React', 'TypeScript', 'JavaScript', 'React Native', 'Expo', 'Astro', 'Node.js', 'PHP', 'MySQL', 'SQLite', 'Apps offline-first'],
    catalog: 'Servicios',
    services: [
      ['Desarrollo web', 'Webs corporativas y landing pages a medida, rápidas y pensadas primero para el móvil, con SEO técnico y local.'],
      ['Apps y software a medida', 'Aplicaciones web y móviles, paneles internos y APIs a medida, con React, React Native, Node.js, PHP y bases de datos.'],
      ['Automatización e integraciones con IA', 'Integraciones entre herramientas y automatización de tareas repetitivas, con IA aplicada y revisión humana.'],
      ['Mantenimiento y optimización web', 'Cambios de contenido, actualizaciones y mejoras de velocidad y SEO de webs ya publicadas.'],
    ],
    se7en: 'Web de un centro de artes marciales de Antequera, creada y con su marketing web llevado por Jose Daniel García León.',
    jfood: 'Contador de nutrición gratuito y offline-first para Android, con reconocimiento de comida por IA. Sin anuncios, sin suscripción y sin cuenta.',
    caseSe7en: 'Caso de estudio de la web de Se7en Antequera: diseño, desarrollo, SEO técnico y puesta en marcha.',
    caseJfood: 'Caso de estudio de JfooD: una app offline-first con API e IA, diseñada y publicada por una sola persona.',
    crumbs: { home: 'Inicio', projects: 'Proyectos' },
    legal: 'Aviso legal y privacidad',
  },
  en: {
    siteName: 'Jose Daniel García León',
    jobTitle: 'Independent web and software developer',
    description:
      'Independent developer in Málaga, Spain. Corporate websites and landing pages, custom apps and software, and automation and AI integrations for small businesses and agencies.',
    knowsAbout: ['Web development', 'Landing pages', 'Technical SEO', 'Local SEO', 'Custom software', 'Mobile apps', 'Automation', 'AI integrations', 'React', 'TypeScript', 'JavaScript', 'React Native', 'Expo', 'Astro', 'Node.js', 'PHP', 'MySQL', 'SQLite', 'Offline-first apps'],
    catalog: 'Services',
    services: [
      ['Web development', 'Custom corporate websites and landing pages, fast and mobile-first, with technical and local SEO.'],
      ['Apps and custom software', 'Custom web and mobile applications, internal dashboards and APIs, with React, React Native, Node.js, PHP and databases.'],
      ['Automation and AI integrations', 'Integrations between tools and automation of repetitive tasks, with applied AI and human review.'],
      ['Website maintenance and optimization', 'Content changes, updates, and speed and SEO improvements for websites that are already live.'],
    ],
    se7en: 'Website of a martial arts center in Antequera, built, and its web marketing run, by Jose Daniel García León.',
    jfood: 'Free, offline-first nutrition tracker for Android with AI food recognition. No ads, no subscription and no account.',
    caseSe7en: 'Case study of the Se7en Antequera website: design, development, technical SEO and launch.',
    caseJfood: 'Case study of JfooD: an offline-first app with an API and AI, designed and shipped by one person.',
    crumbs: { home: 'Home', projects: 'Projects' },
    legal: 'Legal notice and privacy',
  },
}

/**
 * Grafo JSON-LD de una página. `url(page)` devuelve la URL absoluta de una página en el idioma actual
 * (vacía si el build no tiene SITE_URL: entonces se omiten los campos que necesitan URL).
 */
export function buildGraph(site, lang, page, url) {
  const c = copy[lang]
  const person = `${site}/#person`
  const home = url('home')

  const personNode = {
    '@type': 'Person',
    '@id': person,
    name: 'Jose Daniel García León',
    jobTitle: c.jobTitle,
    description: c.description,
    knowsAbout: c.knowsAbout,
    sameAs,
    email: 'josedanielgarcialeon4@gmail.com',
    telephone: '+34684180746',
    address,
    areaServed: spain,
    ...(home && { url: home }),
    makesOffer: c.services.map(([name, description]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, description, areaServed: spain, provider: { '@id': person } },
    })),
  }

  const se7enSite = {
    '@type': 'WebSite',
    name: 'Se7en Antequera',
    url: se7enUrl,
    description: c.se7en,
    inLanguage: 'es',
    creator: { '@id': person },
  }

  const jfoodApp = {
    '@type': 'SoftwareApplication',
    name: 'JfooD',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Android',
    description: c.jfood,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    license: 'https://opensource.org/licenses/MIT',
    downloadUrl: 'https://github.com/JoseDaniel369-dev/JfooD/releases/latest',
    author: { '@id': person },
  }

  /** Migas de pan: Inicio > Proyectos > (caso). Sin URL absoluta no se puede declarar el enlace. */
  const crumbs = (last) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: c.crumbs.home, ...(home && { item: home }) },
      { '@type': 'ListItem', position: 2, name: c.crumbs.projects, ...(home && { item: `${home}#proyectos` }) },
      { '@type': 'ListItem', position: 3, name: last.name, ...(last.url && { item: last.url }) },
    ],
  })

  if (page === 'home') {
    return [
      personNode,
      {
        '@type': 'WebSite',
        '@id': `${site}/#website`,
        name: c.siteName,
        ...(home && { url: home }),
        description: c.description,
        inLanguage: lang,
        publisher: { '@id': person },
      },
      // Los trabajos que enseña la portada: la web de un cliente y una app propia.
      se7enSite,
      jfoodApp,
    ]
  }

  if (page === 'se7en') {
    return [
      personNode,
      crumbs({ name: 'Se7en Antequera', url: url('se7en') }),
      {
        '@type': 'CreativeWork',
        name: 'Se7en Antequera',
        description: c.caseSe7en,
        inLanguage: lang,
        creator: { '@id': person },
        about: { '@id': se7enUrl },
        ...(url('se7en') && { url: url('se7en') }),
      },
      { ...se7enSite, '@id': se7enUrl },
    ]
  }

  if (page === 'jfood') {
    return [
      personNode,
      crumbs({ name: 'JfooD', url: url('jfood') }),
      {
        '@type': 'CreativeWork',
        name: 'JfooD',
        description: c.caseJfood,
        inLanguage: lang,
        creator: { '@id': person },
        ...(url('jfood') && { url: url('jfood') }),
      },
      jfoodApp,
    ]
  }

  // legal
  return [
    {
      '@type': 'WebPage',
      name: c.legal,
      inLanguage: lang,
      ...(url('legal') && { url: url('legal') }),
      isPartOf: { '@id': `${site}/#website` },
      about: { '@id': person },
    },
  ]
}
