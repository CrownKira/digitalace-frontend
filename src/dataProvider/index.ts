export const dataProviderFactory = async (type: string) => {
  switch (type) {
    default:
      return await import("./main").then(
        (provider) => provider.customDataProvider
      );
  }
};
