import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import "proxy-polyfill";
import ReactDOM from "react-dom";

import dataProviderFactory from "./dataProvider";
import fakeServerFactory from "./fakeServer";
import App from "./App";
import { defaultServer } from "./configs";

// TODO: remove fakeServer
const prepareDataProvider = async () => {
  const restoreFetch = await fakeServerFactory(defaultServer);
  const dataProvider = await dataProviderFactory(defaultServer);

  return { dataProvider, restoreFetch };
};

prepareDataProvider().then(({ dataProvider, restoreFetch }) => {
  ReactDOM.render(
    <App dataProvider={dataProvider} onUnmount={restoreFetch} />,
    document.getElementById("root")
  );
});
