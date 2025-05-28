declare global {
  type Anything = any;

  type AsyncFunction = (...args: Anything[]) => Promise<Anything>;

  type valueof<T> = T[keyof T];

  type AliasedKey<Type, Mapper extends Partial<Record<keyof Type, string>>> = {
    [K in keyof Type as K extends keyof Mapper ? Mapper[K] : K]: Type[K];
  };

  type ObjectWithoutKey<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
  };
}

export {};
