const nodeExternals = require('webpack-node-externals');
const { resolve } = require('path');

module.exports = function (options) {
  return {
    ...options,
    externals: [
      nodeExternals({
        allowlist: [/^@tasksphere\//],
      }),
    ],
    resolve: {
      ...options.resolve,
      extensions: ['.ts', '.js', '.json'],
    },
  };
};
