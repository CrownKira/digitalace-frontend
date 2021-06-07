import simpleRestProvider from 'ra-data-simple-rest';
import { baseURL } from '../apis/backend';

// TODO: add env var for host
const restProvider = simpleRestProvider(`${baseURL}/api`);

export default restProvider;
