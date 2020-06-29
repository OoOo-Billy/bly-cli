const path = require('path')
const { templatePath } = require('./index')

module.exports = (setting, api) => {
	const { template, targetDir } = setting
	let fileTree
	if (template === 'vue') {
		fileTree = {
			public: ['favicon.ico', 'index.html'],
			src: {
				assets: 'logo.png',
				components: 'HelloWorld.vue',
				'.': ['App.vue', 'main.js'],
			},
		}
	}
	if (template === 'react') {
	}

	const filePathList = api.parseFileTree(fileTree)
	api.render(
		filePathList,
		path.relative(process.cwd(), path.resolve(__dirname, templatePath)) +
			'/' +
			template,
		targetDir
	)
}
