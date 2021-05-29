import ReactDOM from 'react-dom';

import dataProviderFactory from './dataProvider';
import fakeServerFactory from './fakeServer';
import App from './App';

const prepareDataProvider = async () => {
  const restoreFetch = await fakeServerFactory(
    process.env.REACT_APP_DATA_PROVIDER || ''
  );
  const dataProvider = await dataProviderFactory(
    process.env.REACT_APP_DATA_PROVIDER || ''
  );
  return { dataProvider, restoreFetch };
};

prepareDataProvider().then(({ dataProvider, restoreFetch }) => {
  ReactDOM.render(
    <App dataProvider={dataProvider} onUnmount={restoreFetch} />,
    document.getElementById('root')
  );
});
