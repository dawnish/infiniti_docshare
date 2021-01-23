export = index;
declare function index(reactotron: any, ...args: any[]): any;
declare namespace index {
  // Circular reference from index
  const createReactotronStoreEnhancer: any;
  function createReplacementReducer(rootReducer: any, ...args: any[]): any;
  function reactotronRedux(...args: any[]): any;
}
