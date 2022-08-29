export const enumerate = <T extends string>(keys: T[]) => {
  const obj = keys.reduce<{ [k in T]: T }>((acc, curr) => {
    acc[curr] = curr;
    return acc;
  }, {} as { [k in T]: T });
  return Object.freeze(obj!);
};
