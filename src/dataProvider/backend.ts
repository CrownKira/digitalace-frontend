import simpleRestProvider from 'ra-data-simple-rest';

// TODO: add env var for host
const restProvider = simpleRestProvider('http://localhost:3000/api/');

export default restProvider;
