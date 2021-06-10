import { DataProvider } from 'ra-core';
import { fetchUtils } from 'react-admin';
import drfProvider from 'ra-data-django-rest-framework';
import { baseURL } from '../apis/backend';

const apiUrl = `${baseURL}/api`;
// TODO: fix any
// TODO use axios
const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({});
  }

  const { token } = JSON.parse(localStorage.getItem('auth') || '{}');
  options.headers.set('Authorization', `Token ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const restProvider = drfProvider(apiUrl, httpClient);

const customDataProvider: DataProvider = {
  ...restProvider,
  create: async (resource, params) => {
    if (!params.data.image && !params.data.thumbnail) {
      return restProvider.create(resource, params);
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(params.data)) {
      formData.append(
        key,
        // TODO: fix any
        key === 'image' || key === 'thumbnail' ? (value as any).rawFile : value
      );
    }

    const { json } = await httpClient(`${apiUrl}/${resource}/`, {
      method: 'POST',
      body: formData,
    });
    return {
      data: { ...params.data, id: json.id },
    };
  },
  update: async (resource, params) => {
    if (!params.data.image && !params.data.thumbnail) {
      return restProvider.create(resource, params);
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(params.data)) {
      if (key === 'image' || key === 'thumbnail') {
        // TODO: fix any
        const rawFile = (value as any).rawFile;
        if (rawFile) formData.append(key, rawFile);
      } else {
        // TODO: fix any
        formData.append(key, value as any);
      }
    }

    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: 'PATCH',
      body: formData,
    });
    console.log('data is:', json);
    return {
      data: json,
    };
  },
};

export default customDataProvider;
