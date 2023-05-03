const { resolve } = require('node:path')

const restricted = [
  'vue',
  '@vue/composition-api',
  '..',
  '../..',
]
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@antfu'],
  rules: {
    'vue/no-deprecated-functional-template': 'off',
    'vue/one-component-per-file': 'off',
    'vue/no-template-shadow': 'off',
    'vue/require-prop-types': 'off',
    'spaced-comment': ['error', 'always', { exceptions: ['#__PURE__'] }],
    'no-restricted-imports': [
      'error',
      {
        paths: restricted,
      },
    ],
    'no-console': 'off',
    'node/no-callback-literal': 'off',
    'import/namespace': 'off',
    'import/default': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    '@typescript-eslint/brace-style': 'off',
    'antfu/top-level-function': 'off',
  },
  overrides: [
    {
      files: ['packages/shared/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [...restricted, '@vueuse/shared'],
          },
        ],
      },
    },
    {
      files: [
        '**/*.md',
        '**/*.md/*.*',
        'demo.vue',
        'demo.client.vue',
        'scripts/*.ts',
        '*.test.ts',
      ],
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-restricted-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-redeclare': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['packages/docs/.vitepress/**/*.*', 'playgrounds/**/*.*'],
      rules: {
        'no-restricted-imports': 'off',
      },
    },
  ],
}
