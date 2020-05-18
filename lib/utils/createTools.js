exports.getPromptModules = () => {
  return [
    "template",
    "babel",
    "typescript",
    // "pwa",
    // "router",
    // "vuex",
    // "cssPreprocessors",
    // "linter",
    // "unit",
    // "e2e"
  ].map(file => require(`../promptModules/${file}`));
};