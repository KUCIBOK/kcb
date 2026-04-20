import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // Règles stables react-hooks (v4 behavior — on n'utilise pas le React Compiler)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Règles React Compiler ajoutées en v7 — désactivées (projet sans React Compiler)
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/component-hook-factories': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-empty': 'warn',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    files: ['src/test/**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
        global: 'writable',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'api/'],
  },
]
