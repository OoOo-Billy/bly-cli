const { getTemplateGenerators } = require("./utils/createTools");
const GeneratorAPI = require("./GeneratorAPI");

module.exports = function(preset) {
  const templateGenerators = getTemplateGenerators();
  const genAPI = new GeneratorAPI(preset);

  for (const gen of templateGenerators) {
    gen(preset, genAPI);
  }
}