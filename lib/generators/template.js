const { runRender } = require('./index')

module.exports = (setting, api) => {
  const { template } = setting

  let fileTree
  if (template === 'vue') {
    fileTree = {
      public: ['favicon.ico', 'index.html'],
      src: {
        assets: 'logo.png',
        components: 'HelloWorld.vue',
        '.': ['App.vue', 'main.js']
      },
      '.': '__gitignore'
    }
  }

  if (template === 'react') {
    fileTree = {
      public: [
        'favicon.ico',
        'index.html',
        'logo192.png',
        'logo512.png',
        'manifest.json',
        'robots.txt'
      ],
      src: ['App.css', 'App.jsx', 'index.css', 'index.jsx', 'logo.svg', 'serviceWorker.js'],
      '.': '__gitignore'
    }
  }

  runRender(fileTree, template, api)
}
