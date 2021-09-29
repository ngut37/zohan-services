export const enumerate = <T extends string>(keys: T[]) => {
  const obj = keys.reduce<Partial<{ [k in T]: T }>>((acc, curr) => {
    acc[curr] = curr;
    return acc;
  }, {});
  return Object.freeze(obj);
};
