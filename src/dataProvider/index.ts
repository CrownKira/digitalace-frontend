export default (type: string) => {
  switch (type) {
    default:
      return import('./rest').then((provider) => provider.default);
  }
};
