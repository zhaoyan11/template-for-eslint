module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  plugins: ['vue', '@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-undef': 'off',
    semi: [2, 'always'],
    // indent: [
    //   'error',
    //   2,
    //   {
    //     SwitchCase: 1,
    //     flatTernaryExpressions: true
    //   }
    // ],
    indent: ['error', 2],
    // 函数括号前的有空格
    'space-before-function-paren': ['off'],

    // 不能用any
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    'no-unused-expressions': 0,
    'vue/no-mutating-props': [0, { propProps: false }],
    // {
    //     allowExpressions: true
    // }
    'vue/no-setup-props-destructure': [0],
    'no-case-declarations': [0],
    // require相关
    '@typescript-eslint/no-var-requires': 0,
    'vue/multi-word-component-names': 'off'
  }
};
