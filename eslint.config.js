// ESLint con el parser de Babel: el proyecto usa TypeScript 7 y typescript-eslint aún no lo soporta.
// Los tipos y las variables sin usar los vigila `tsc --noEmit` (npm run build); ESLint se centra en
// reglas de hooks, accesibilidad JSX y errores de lógica.
import js from '@eslint/js'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const babel = {
  parser: babelParser,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { presets: [['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'] },
  },
}

export default [
  { ignores: ['dist', 'node_modules', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { ...babel, globals: globals.browser },
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // tsc ya comprueba esto con tipos; en Babel daría falsos positivos con interfaces y tipos.
      'no-unused-vars': 'off',
      'no-undef': 'off',
      // Los diálogos y listbox propios gestionan su teclado; las reglas básicas no los reconocen.
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs', 'vite.config.ts', 'playwright.config.ts', 'tests/**/*.ts', 'eslint.config.js'],
    languageOptions: { ...babel, globals: { ...globals.node } },
    rules: { 'no-unused-vars': 'off', 'no-undef': 'off' },
  },
]
