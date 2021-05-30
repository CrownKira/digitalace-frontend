export default async (type: string) => {
  switch (type) {
    default:
      const provider = await import('./rest');
      return provider.default;
  }
};
