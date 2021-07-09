export default async (type: string) => {
  switch (type) {
    default:
      return await import("./main").then((factory) => factory.default());
  }
};
