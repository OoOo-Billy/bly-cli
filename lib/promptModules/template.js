module.exports = cli => {
	cli.onPromptComplete((answers, options) => {
		if (answers.template === 'vue') {
			options.modules['vue'] = true
			options.modules['core-js'] = true

			options.plugins['vue-template-compiler'] = true
			options.plugins['@vue/cli-service'] = true

			options.scripts['start'] = 'vue-cli-service serve'
			options.scripts['build'] = 'vue-cli-service build'
		}
		if (answers.template === 'react') {
			options.modules['react'] = true
			options.modules['react-dom'] = true
			// options.modules["react-app-polyfill"] = true;

			// "react-scripts" is temporary, manual-configuration will instead of it in the future.
			options.plugins['react-scripts'] = true

			options.scripts['start'] = 'react-scripts start'
			options.scripts['build'] = 'react-scripts build'
			options.scripts['eject'] = 'react-scripts eject'
		}
	})
}
