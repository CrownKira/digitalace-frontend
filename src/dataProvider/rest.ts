import simpleRestProvider from 'ra-data-simple-rest';

const restProvider = simpleRestProvider('http://localhost:4000');

export default restProvider;

// TODO: review this
/*
const delayedDataProvider = new Proxy(restProvider, {
  get: (target, name, self) =>
    // as we await for the dataProvider, JS calls then on it.
    // We must trap that call or else the dataProvider will be called with the then method
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
*/
