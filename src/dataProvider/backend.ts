import { fetchUtils } from 'react-admin';
import drfProvider from 'ra-data-django-rest-framework';
import { baseURL } from '../apis/backend';

// TODO: fix options: any
const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({});
  }

  const { token } = JSON.parse(localStorage.getItem('auth') || '{}');
  options.headers.set('Authorization', `Token ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const restProvider = drfProvider(`${baseURL}/api`, httpClient);

export default restProvider;
