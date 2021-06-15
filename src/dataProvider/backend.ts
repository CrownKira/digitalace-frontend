import { DataProvider, UpdateParams } from 'ra-core';
import { fetchUtils } from 'react-admin';
import drfProvider from 'ra-data-django-rest-framework';
import HttpMethodsEnum from 'http-methods-enum';

import { baseURL } from '../apis/backend';
import { UserProfile } from '../types';

export const apiUrl = `${baseURL}/api`;
const fileLabels = ['image', 'thumbnail', 'resume'];

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

// FIXME: fix any
function getFormData(data: any, method = HttpMethodsEnum.PATCH) {
  const formData = new FormData();
  // FIXME: fix any
  for (const [key, value] of Object.entries<any>(data)) {
    if (fileLabels.includes(key) && value) {
      // TODO: check for null or ""?
      // if undefined, do not include in formData
      if (
        method === HttpMethodsEnum.POST ||
        typeof value.rawFile !== 'undefined'
      )
        formData.append(key, value.rawFile);
    } else {
      // TODO: better fix for array multipart?
      // fix for django rest can't parse empty array properly
      // eg. [] is parsed into [''], causing validator to think
      // it's array of empty string
      // file can go here if it is null
      if (!Array.isArray(value) || value.length) formData.append(key, value);
    }
  }
  return formData;
}

const customDataProvider: DataProvider = {
  ...restProvider,
  create: async (resource, params) => {
    if (fileLabels.every((x) => !params.data.hasOwnProperty(x))) {
      return restProvider.create(resource, params);
    }

    const { json } = await httpClient(`${apiUrl}/${resource}/`, {
      method: HttpMethodsEnum.POST,
      body: getFormData(params.data, HttpMethodsEnum.POST),
    });
    return {
      data: { ...params.data, id: json.id },
    };
  },
  update: async (resource, params) => {
    if (fileLabels.every((x) => !params.data.hasOwnProperty(x))) {
      return restProvider.create(resource, params);
    }
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: HttpMethodsEnum.PATCH,
      // content-type defaults to multipart/form-data when FormData is passed to body
      body: getFormData(params.data),
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
    const { json } = await httpClient(`${apiUrl}/user/me/`, {
      method: HttpMethodsEnum.PATCH,
      body: getFormData(params.data),
    });
    return {
      data: json,
    };
  },
};

export default customDataProvider;
