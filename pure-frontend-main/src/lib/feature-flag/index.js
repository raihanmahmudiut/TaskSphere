const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', '..', 'feature-flags.json');

const getEnv = () => {
  const env = process.env.ENV;
  if (env === 'local') return 'local';
  if (env === 'staging') return 'staging';

  // Important: make sure the default case returns the
  // production environment. This is to make sure that if
  // someone forgets to add the environment variable, only
  // the most tested feature flags will be enabled.
  return 'production';
};

//try parsing the flags config from the json file
//if file not found or fails to parse
//then silently ignore the error
//and set an empty object
let flags = {};
try {
  const file = fs.readFileSync(filePath);
  flags = JSON.parse(file) || {};
  // eslint-disable-next-line no-empty
} catch {}

//parse the flags as boolean based on the application environment
const parsedFlagsToBoolean = Object.keys(flags).reduce((acc, key) => {
  acc[key] = flags[key].includes(getEnv());

  return acc;
}, {});

const featureFlag = {
  __FEATURE_FLAGS__: parsedFlagsToBoolean,
};

module.exports = {
  flags,
  featureFlag,
};
