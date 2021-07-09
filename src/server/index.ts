export const serverFactory = async (type: string) => {
  switch (type) {
    default:
      return await import('./main').then((factory) => factory.main());
  }
};
