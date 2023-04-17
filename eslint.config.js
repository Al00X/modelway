const sheriff = require('eslint-config-sheriff');
const { defineFlatConfig } = require('eslint-define-config');

const sheriffOptions = {
  react: true,
  lodash: false,
  next: false,
  playwright: false,
  jest: false,
  vitest: false,
};

module.exports = defineFlatConfig([
  ...sheriff(sheriffOptions),
  {
    files: ['src/**'],
    ignores: ['electron/**'],
    rules: {
      'react/destructuring-assignment': 0,
      '@typescript-eslint/consistent-type-imports': 0,
      'func-style': 0,
      curly: 0,
      'no-implicit-coercion': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-explicit-any': 0,
      'storybook/default-exports': 0,
      'jsx-a11y/click-events-have-key-events': 0,
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-negated-condition': 0,
      'arrow-body-style': 0,
      'no-nested-ternary': 0,
      '@typescript-eslint/naming-convention': 'warn',
      'react/display-name': 0,
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@regru/prefer-early-return/prefer-early-return': 0,
      'react/jsx-props-no-spreading': 'warn',
      'unicorn/consistent-function-scoping': 0,
      '@typescript-eslint/no-use-before-define': 0,
      'no-restricted-syntax': 0,
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/require-await': 'warn',
      'react/jsx-filename-extension': 0,
      'no-console': 0,
      'unicorn/no-useless-undefined': 0,
      'no-plusplus': 0,
      'unicorn/no-array-reduce': 0,
      'unicorn/no-await-expression-member': 0,
      '@typescript-eslint/no-misused-promises': 0,
      'jsx-a11y/role-has-required-aria-props': 0,
      'no-redeclare': 0,
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 0,
      'fp/no-delete': 0,
      'jsdoc/check-param-names': 0,
      'sonarjs/no-duplicated-branches': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      'only-export-components/only-export-components': 0,
      '@typescript-eslint/no-redundant-type-constituents': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-unsafe-call': 0,
      'fp/no-class': 0,
      '@typescript-eslint/no-throw-literal': 0,
    },
  },
]);
