// .eslintrc.cjs
module.exports = {
   root: true,
   env: {
      node: true,
      browser: true,
      es2021: true,
   },
   parser: 'vue-eslint-parser',
   parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 12, // Equivalent to ES2021
      sourceType: 'module',
   },
   extends: ['plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
   plugins: ['vue', '@typescript-eslint', 'prettier'],
   rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'off', // Disable the rule globally
      // Add or override other rules here
   },
   overrides: [
      {
         files: ['*.d.ts'], // Target type declaration files
         rules: {
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unsafe-any': 'off',
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
         },
      },
   ],
};
