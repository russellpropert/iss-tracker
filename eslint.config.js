import js from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default [
  // Don't lint dependencies or the gitignored local files
  {
    ignores: ['node_modules/**', 'dist/**']
  },

  // ESLint's recommended rules (real-bug catches: unused vars, undefined names, etc.)
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,   // fetch, setTimeout, console, Promise, document, ...
      },
    },
    plugins: {
      "@stylistic": stylistic,
    },
    rules: {
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/keyword-spacing": "error",
      "@stylistic/space-infix-ops": "error",
      "@stylistic/semi": ["error", "always"],
    }
  }
];
