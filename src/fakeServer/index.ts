export default async (type: string) => {
  switch (type) {
    case 'json':
      return await import('./json').then((factory) => factory.default());
    default:
      return await import('./rest').then((factory) => factory.default());
  }
};
