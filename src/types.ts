export type Remove<T, K> = {
  [P in keyof T as Exclude<P, K>]: T[P];
};

export type Select<T, K> = {
  [P in keyof T as P & K]: T[P];
};

export type Simplify<T> = T extends (...args: never) => unknown ? T : { [P in keyof T]: T[P] };

export type SetRequired<T, K> = Simplify<T & { [P in keyof T as Extract<K, P>]-?: T[P] }>;
