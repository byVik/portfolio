import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import vue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Domain boundaries (see AGENTS.md) cannot be bypassed with relative paths.
const crossDomain = {
  group: ['../../*', '../app/*', '../content/*', '../reading/*', '../scene/*', '../shared/*', '../story/*'],
  message: 'Across domains, use the @/ alias.',
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
    // Three.js only comes in through the scene engine.
    files: ['src/**'],
    ignores: ['src/scene/engine/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'three', message: 'Three.js may only be imported from src/scene/engine.' }],
          patterns: [crossDomain],
        },
      ],
    },
  },
  // Prettier owns formatting: style rules that would clash with it are turned off.
  prettier,
]
