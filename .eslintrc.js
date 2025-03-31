module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier' // Runs Prettier as an ESLint rule
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true, // Enable Node.js global variables and Node.js scoping.
    es2020: true
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'prettier/prettier': 'warn', // Show Prettier issues as warnings
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about using 'any' type
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_+' }], // Warn on unused vars, except those starting with _
    'no-console': 'off' // Allow console logs (useful for Node.js services)
  }
}; 