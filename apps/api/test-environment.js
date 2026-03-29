const NodeEnvironment = require('jest-environment-node').TestEnvironment;

class CustomNodeEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // Mock localStorage
    this.global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    };
  }
}

module.exports = CustomNodeEnvironment;