/* eslint-disable import/no-anonymous-default-export */
export default (type: string) => {
  switch (type) {
    default:
      return import('./rest').then((provider) => provider.default);
  }
};
