import { fetchUtils, Record, DataProvider, UpdateParams } from "react-admin";
import drfProvider from "ra-data-django-rest-framework";
import HttpMethodsEnum from "http-methods-enum";

import { baseURL } from "../apis/main";
import { UserProfile, UserConfig } from "../types";

export const apiUrl = `${baseURL}/api`;
export interface CreateManyParams {
  data: any[];
}

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
const fileLabels = ["image", "thumbnail", "resume"];

// TODO: use axios
export const httpClient = (
  url: string,
  options: { [key: string]: any } = {}
) => {
  if (!options.headers) {
    options.headers = new Headers({});
  }

  const { token } = JSON.parse(localStorage.getItem("auth") || "{}");
  options.headers.set("Authorization", `Token ${token}`);
  return fetchUtils.fetchJson(url, options);
};
const restProvider = drfProvider(apiUrl, httpClient);

function getFormData(data: Record, method = HttpMethodsEnum.PATCH) {
  const formData = new FormData();
  const jsonData = {} as { [key: string]: any };

  for (const [key, value] of Object.entries(data)) {
    if (fileLabels.includes(key) && value) {
      if (
        method === HttpMethodsEnum.POST ||
        value.rawFile !== undefined // no new image upload if undefined
      )
        formData.append(key, value.rawFile);
    } else {
      jsonData[key] = value;
    }
  }
  formData.append("data", JSON.stringify(jsonData));
  return formData;
}

export const customDataProvider: DataProvider = {
  ...restProvider,
  createMany: async (resource: string, params: CreateManyParams) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/`, {
      method: HttpMethodsEnum.POST,
      body: JSON.stringify(params.data),
    });
    return {
      data: json,
    };
  },
  updateMany: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/`, {
      method: HttpMethodsEnum.PATCH,
      body: JSON.stringify(params.data),
    });
    return {
      data: json,
    };
  },
  create: async (resource, params) => {
    if (
      fileLabels.every(
        (x) => !Object.prototype.hasOwnProperty.call(params.data, x)
      )
    ) {
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
    if (
      fileLabels.every(
        (x) => !Object.prototype.hasOwnProperty.call(params.data, x)
      )
    ) {
      return restProvider.update(resource, params);
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
