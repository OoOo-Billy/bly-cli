module.exports = function PromptModuleAPI(
  featurePrompt,
  injectedPrompts,
  promptCompleteCbs
) {
  this.injectFeature = feature => {
    featurePrompt.choices.push(feature)
  }

  this.injectPrompt = prompt => {
    injectedPrompts.push(prompt)
  }

  this.onPromptComplete = cb => {
    promptCompleteCbs.push(cb)
  }
}
