import FakeRest from 'fakerest';
import fetchMock from 'fetch-mock';
import generateData from '../fakeData';

export default () => {
  const data = generateData({ serializeDate: true });
  const restServer = new FakeRest.FetchServer('http://localhost:4000');
  if (window) {
    window.restServer = restServer;
  }
  restServer.init(data);
  restServer.toggleLogging();

  fetchMock.mock('begin:http://localhost:4000', restServer.getHandler());
  return () => fetchMock.restore();
};
