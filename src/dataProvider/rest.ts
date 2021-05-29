import simpleRestProvider from 'ra-data-simple-rest';

const restProvider = simpleRestProvider('http://localhost:4000');

const delayedDataProvider = new Proxy(restProvider, {
  get: (target, name, self) =>
    name === 'then'
      ? self
      : (resource: string, params: any) =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve(restProvider[name as string](resource, params)),
              500
            )
          ),
});

export default delayedDataProvider;
