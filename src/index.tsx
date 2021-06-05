import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'proxy-polyfill';
import ReactDOM from 'react-dom';

import dataProviderFactory from './dataProvider';
import fakeServerFactory from './fakeServer';
import App from './App';

// TODO: remove comment
const prepareDataProvider = async () => {
  const restoreFetch = await fakeServerFactory(
    // process.env.REACT_APP_DATA_PROVIDER || ''
    'rest'
  );
  const dataProvider = await dataProviderFactory(
    // process.env.REACT_APP_DATA_PROVIDER || ''
    'rest'
  );

  return { dataProvider, restoreFetch };
};

prepareDataProvider().then(({ dataProvider, restoreFetch }) => {
  ReactDOM.render(
    <App dataProvider={dataProvider} onUnmount={restoreFetch} />,
    document.getElementById('root')
  );
});
