module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  /**
   * 'plugin:prettier/recommended'作用：
   * 启用eslint-config-prettier配置（作用是将eslint和prettier冲突的rule设置成off）
   * 启用eslint-plugin-prettier插件（插件作用是让eslint --fix命令可以走prettier设置的rule），并设置插件初始参数
   */
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
    // 'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    indent: ['warn', 2, {
      SwitchCase: 1,
      flatTernaryExpressions: true
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always'
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      'registeredComponentsOnly': false
    }]
  }
};
