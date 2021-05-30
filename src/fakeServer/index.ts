export default async (type: string) => {
  switch (type) {
    default:
      const factory = await import('./rest');
      return factory.default();
  }
};
