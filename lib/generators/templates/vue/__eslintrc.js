module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    <%_ if (renderOptions.linter === 'standard') { _%>
    '@vue/standard'<%_ if (renderOptions.plugins.typescript) { _%>,
    '@vue/typescript/recommended'
      <%_ } _%>
    <%_ } else if (renderOptions.linter === 'prettier') { _%>
    'eslint:recommended',
      <%_ if (renderOptions.plugins.typescript) { _%>
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
      <%_ } else { _%>
    '@vue/prettier'
      <%_ } _%>
    <%_ } else { _%>
    'eslint:recommended'<%_ if (renderOptions.plugins.typescript) { _%>,
    '@vue/typescript/recommended'
      <%_ } _%>
    <%_ } %>
  ],
  parserOptions: {
    <%_ if (renderOptions.babel && !renderOptions.plugins.typescript) { _%>
    parser: 'babel-eslint'
    <%_ } else { _%>
    ecmaVersion: 2020
    <%_ } _%>
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
