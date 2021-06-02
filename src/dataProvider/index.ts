export default async (type: string) => {
  switch (type) {
    case 'json':
      return await import('./json').then((provider) => provider.default);
    default:
      return await import('./rest').then((provider) => provider.default);
  }
};
