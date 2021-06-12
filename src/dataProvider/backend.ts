import { DataProvider, UpdateParams } from 'ra-core';
import { fetchUtils } from 'react-admin';
import drfProvider from 'ra-data-django-rest-framework';
import { baseURL } from '../apis/backend';
import { UserProfile } from '../types';

export const apiUrl = `${baseURL}/api`;
// FIXME: fix any
// TODO: use axios
export const httpClient = (url: string, options: any = {}) => {
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
    // FIXME: fix any
    for (const [key, value] of Object.entries<any>(params.data)) {
      formData.set(
        key,
        key === 'image' || key === 'thumbnail' ? value.rawFile : value
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
    // FIXME: fix any
    for (const [key, value] of Object.entries<any>(params.data)) {
      if (key === 'image' || key === 'thumbnail') {
        const rawFile = value.rawFile;
        if (rawFile) formData.set(key, rawFile);
      } else {
        formData.set(key, value ? value : '');
      }
    }

    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: 'PATCH',
      body: formData,
    });
    return {
      data: json,
    };
  },

  getUserProfile: async () => {
    const data: UserProfile = await Promise.resolve(
      httpClient(`${apiUrl}/user/me/`).then((response) => {
        return response.json;
      })
    );
    return {
      data: data,
    };
  },

  updateUserProfile: async (params: UpdateParams) => {
    const formData = new FormData();
    // FIXME: fix any
    for (const [key, value] of Object.entries<any>(params.data)) {
      if (key === 'image' || key === 'thumbnail') {
        const rawFile = value.rawFile;
        if (rawFile) formData.set(key, rawFile);
      } else {
        // TODO: fix django rest unable to parse null
        formData.set(key, value ? value : '');
      }
    }

    const { json } = await httpClient(`${apiUrl}/user/me/`, {
      method: 'PATCH',
      body: formData,
    });
    return {
      data: json,
    };
  },
};

export default customDataProvider;
