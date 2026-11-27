export default [
  {
    ignores: ['dist/', 'node_modules/', '*.config.*', '*.md'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.main.json', './tsconfig.renderer.json', './tsconfig.preload.json', './tsconfig.shared.json'],
        tsconfigRootDir: __dirname,
      },
      globals: {
        browser: true,
        node: true,
        es2022: true,
      },
    },
    settings: {
      react: {
        version: '18.3',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
      ...require('eslint-plugin-react').configs.recommended.rules,
      ...require('eslint-plugin-react-hooks').configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];