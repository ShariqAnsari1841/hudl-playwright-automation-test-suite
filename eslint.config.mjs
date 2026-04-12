import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Disable rules that conflict with Prettier
  eslintConfigPrettier,

  // Custom rules and settings
  {
    files: ['**/*.ts'],
    rules: {
      // Allow empty catch blocks (useful in isVisible checks)
      'no-empty': ['error', { allowEmptyCatch: true }],

      // Allow unused vars if prefixed with underscore
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Allow non-null assertions (useful with Playwright locators)
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Enforce consistent type imports
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // Ignore patterns
  {
    ignores: ['node_modules/', 'dist/', 'test-results/', 'playwright-report/', 'blob-report/'],
  },
];
