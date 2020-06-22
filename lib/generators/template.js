module.exports = (setting, api) => {
	const { template } = setting
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

	api.parseFileTree(fileTree)
}
