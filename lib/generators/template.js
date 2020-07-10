const { runRender } = require('./index')

module.exports = (setting, api) => {
  const { template, targetDir } = setting

  // TODO: Using judgment TS to change the rendered filename is too
  // rough and unmaintainable, requires linkage between generators.
  const useTypescript = 'typescript' in setting.plugins

  let fileTree
  if (template === 'vue') {
    fileTree = {
      public: ['favicon.ico', 'index.html'],
      src: {
        assets: 'logo.png',
        components: 'HelloWorld.vue',
        '.': ['App.vue', useTypescript ? 'main.ts' : 'main.js'],
      },
      '.': '__gitignore',
    }
  }
  // TODO
  if (template === 'react') {
  }

  const filePathList = api.parseFileTree(fileTree)

  runRender(filePathList, template, targetDir, api)
}
