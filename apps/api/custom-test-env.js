// const { TestEnvironment } = require('jest-environment-node');

// // Override the global WebSocket before the environment loads
// if (typeof globalThis.WebSocket !== 'undefined') {
//   delete globalThis.WebSocket;
// }

// class CustomTestEnvironment extends TestEnvironment {
//   constructor(config, context) {
//     // Ensure no WebSocket exists before constructor runs
//     if (typeof globalThis.WebSocket !== 'undefined') {
//       delete globalThis.WebSocket;
//     }
//     super(config, context);
//   }

//   async setup() {
//     await super.setup();
    
//     // Mock localStorage
//     this.global.localStorage = {
//       getItem: () => null,
//       setItem: () => {},
//       removeItem: () => {},
//       clear: () => {},
//     };
//   }
// }

// module.exports = CustomTestEnvironment;