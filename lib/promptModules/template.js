module.exports = cli => {
  cli.onPromptComplete((answers, options) => {
    if (answers.template === "vue") {
      options.modules["vue"] = true;
      options.modules["core-js"] = true;
      options.plugins["vue-template-compiler"] = true;
    }
    if (answers.template === "react") {
      options.modules["react"] = true;
      options.modules["react-dom"] = true;
      options.modules["react-app-polyfill"] = true;
    }
  });
};
