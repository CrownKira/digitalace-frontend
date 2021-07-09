import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'proxy-polyfill';
import ReactDOM from 'react-dom';

import { dataProviderFactory } from './dataProvider';
import serverFactory from './server';
import { App } from './App';
import { defaultServer } from './configs';

const prepareDataProvider = async () => {
  const restoreFetch = await serverFactory(defaultServer);
  const dataProvider = await dataProviderFactory(defaultServer);

  return { dataProvider, restoreFetch };
};

prepareDataProvider().then(({ dataProvider, restoreFetch }) => {
  ReactDOM.render(
    <App dataProvider={dataProvider} onUnmount={restoreFetch} />,
    document.getElementById('root')
  );
});
