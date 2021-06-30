import { AuthProvider } from 'react-admin';
import backend from './apis/backend';
import { httpClient, apiUrl } from './dataProvider/backend';

const isPublicUrl = (url: string) => {
  return ['#/register/'].includes(url);
};

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await backend.post('/api/user/token/', {
      email,
      password,
    });

    // if (response.status < 200 || response.status >= 300) throw new Error();

    const auth = response.data;
    localStorage.setItem('auth', JSON.stringify(auth));
  },
  logout: () => {
    localStorage.removeItem('auth');
    return Promise.resolve('/login');
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    if (isPublicUrl(window.location.hash)) {
      return Promise.resolve();
    }
    return localStorage.getItem('auth')
      ? Promise.resolve()
      : Promise.reject({
          redirectTo: '/login',
          message: 'ra.auth.auth_check_error',
        });
  },
  getPermissions: async () => {
    if (isPublicUrl(window.location.hash)) {
      // for some reason getPermission is invoked in custom routes
      // https://github.com/marmelab/react-admin/issues/4821
      // here we resolve the promise with an object to be destructured
      // FIXME: find a better fix
      return Promise.resolve([]);
    }
    // https://stackoverflow.com/questions/54715260/typescript-json-parse-error-type-null-is-not-assignable-to-type-string
    const { permissions } = await Promise.resolve(
      httpClient(`${apiUrl}/user/me/`).then((response) => {
        return response.json;
      })
    );
    return Promise.resolve(permissions);
  },
  getIdentity: async () => {
    const {
      id,
      name: fullName,
      image,
      is_staff,
    } = await Promise.resolve(
      httpClient(`${apiUrl}/user/me/`).then((response) => {
        return response.json;
      })
    );
    const avatar = image?.src;
    return Promise.resolve({ id, fullName, avatar, is_staff });
  },
};

export default authProvider;
