import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

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
      // Las fronteras entre dominios (ver AGENTS.md) no se saltan con rutas relativas.
      'no-restricted-imports': [
        'error',
        { patterns: [{ group: ['../../*'], message: 'Entre dominios, usa el alias @/.' }] },
      ],
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
          patterns: [{ group: ['../../*'], message: 'Entre dominios, usa el alias @/.' }],
        },
      ],
    },
  },
  // Prettier decide el formato: se desactivan las reglas de estilo que chocarían con él.
  prettier,
]
