import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Las fronteras entre dominios (ver AGENTS.md) no se saltan con rutas relativas.
const crossDomain = {
  group: ['../../*', '../app/*', '../content/*', '../reading/*', '../scene/*', '../shared/*', '../story/*'],
  message: 'Entre dominios, usa el alias @/.',
}

export default [
  { ignores: ['dist/', 'node_modules/', 'public/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    files: ['scripts/**', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      'no-restricted-imports': ['error', { patterns: [crossDomain] }],
      'vue/no-v-html': 'error',
    },
  },
  {
    // Three.js solo entra por el motor de la escena.
    files: ['src/**'],
    ignores: ['src/scene/engine/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'three', message: 'Three.js solo se importa desde src/scene/engine.' }],
          patterns: [crossDomain],
        },
      ],
    },
  },
  // Prettier decide el formato: se desactivan las reglas de estilo que chocarían con él.
  prettier,
]
