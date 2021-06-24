import { DataProvider, UpdateParams } from 'ra-core';
import { fetchUtils } from 'react-admin';
import drfProvider from 'ra-data-django-rest-framework';
import HttpMethodsEnum from 'http-methods-enum';

import { baseURL } from '../apis/backend';
import { UserProfile, UserConfig } from '../types';

export const apiUrl = `${baseURL}/api`;

/*
 * includes() slightly faster than has()
 * console.time("iterationTime");
 * a = new Set([1,2,3])
 * a.has(2)
 * console.timeEnd("iterationTime");
 * VM251:4 iterationTime: 0.013671875 ms
 * undefined
 * console.time("iterationTime");
 * a = [1,2,3]
 * a.includes(2)
 * console.timeEnd("iterationTime");
 * VM255:4 iterationTime: 0.012939453125 ms
 */

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
  const jsonData = {} as any;
  // FIXME: fix any
  for (const [key, value] of Object.entries<any>(data)) {
    if (fileLabels.includes(key) && value) {
      if (
        method === HttpMethodsEnum.POST ||
        typeof value.rawFile !== 'undefined' // no new image upload if undefined
      )
        formData.append(key, value.rawFile);
    } else {
      jsonData[key] = value;
    }
  }
  formData.append('data', JSON.stringify(jsonData));
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
      // content-type defaults to multipart/form-data for FormData
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
  getUserConfig: async () => {
    const data: UserConfig = await Promise.resolve(
      httpClient(`${apiUrl}/user/config/`).then((response) => {
        return response.json;
      })
    );
    return {
      data: data,
    };
  },
  updateUserConfig: async (params: UpdateParams) => {
    const { json } = await httpClient(`${apiUrl}/user/config/`, {
      method: HttpMethodsEnum.PATCH,
      body: getFormData(params.data),
    });
    return {
      data: json,
    };
  },
};

export default customDataProvider;
