// Setup file for Jest - runs before test environment is initialized
// This removes global objects that Node.js v25+ provides but Jest doesn't support

// Delete global storage objects that cause issues with Jest
delete globalThis.localStorage;
delete globalThis.sessionStorage;

// Now mock them properly
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};

globalThis.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};