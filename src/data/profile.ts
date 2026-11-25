// Todos los datos personales y enlaces viven aquí. Cambia solo este archivo.
export const profile = {
  name: 'Jose Daniel García León',
  email: 'josedanielgarcialeon4@gmail.com',

  // Pon tu foto en public/foto.jpg. Si no existe, se muestra el monograma "JD".
  photo: `${import.meta.env.BASE_URL}foto.jpg`,

  github: {
    main: 'https://github.com/JoseDaniel369-dev',
    school: 'https://github.com/JoseDanielDAW',
  },

  // Pega aquí la URL de tu perfil, p. ej. 'https://www.linkedin.com/in/tu-usuario'.
  // Mientras esté vacío, el acceso a LinkedIn no se muestra.
  linkedin: '',

  jfood: {
    owner: 'JoseDaniel369-dev',
    repo: 'JfooD',
    repoUrl: 'https://github.com/JoseDaniel369-dev/JfooD',
    releaseUrl: 'https://github.com/JoseDaniel369-dev/JfooD/releases/latest',
    fallbackVersion: '0.2.0',
  },
} as const
