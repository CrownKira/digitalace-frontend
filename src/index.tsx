import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'proxy-polyfill';
import ReactDOM from 'react-dom';

import dataProviderFactory from './dataProvider';
import fakeServerFactory from './fakeServer';
import App from './App';

const prepareDataProvider = async () => {
  const restoreFetch = await fakeServerFactory(
    // process.env.REACT_APP_DATA_PROVIDER || ''
    'json'
  );
  const dataProvider = await dataProviderFactory(
    // process.env.REACT_APP_DATA_PROVIDER || ''
    'json'
  );

  return { dataProvider, restoreFetch };
};

prepareDataProvider().then(({ dataProvider, restoreFetch }) => {
  ReactDOM.render(
    <App dataProvider={dataProvider} onUnmount={restoreFetch} />,
    document.getElementById('root')
  );
});
