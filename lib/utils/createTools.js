exports.getPromptModules = () => {
	return [
		'template',
		'babel',
		'typescript',
		// "pwa",
		// "router",
		// "vuex",
		// "cssPreprocessors",
		// "linter",
		// "unit",
		// "e2e"
	].map(file => require(`../promptModules/${file}`))
}

exports.getTemplateGenerators = () => {
	return ['template'].map(file => require(`../generators/${file}`))
}
