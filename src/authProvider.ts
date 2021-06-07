import { AuthProvider } from 'react-admin';
import backend from './apis/backend';

const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await backend.post('/api/user/token/', {
        email,
        password,
      });
      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }
      const auth = response.data;
      localStorage.setItem('auth', JSON.stringify(auth));
    } catch (error) {
      // TODO: remove this catch?
      throw new Error('ra.auth.sign_in_error');
    }
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
    return localStorage.getItem('auth')
      ? Promise.resolve()
      : Promise.reject({
          redirectTo: '/login',
          message: 'ra.auth.auth_check_error',
        });
  },
  getPermissions: () => {
    // https://stackoverflow.com/questions/54715260/typescript-json-parse-error-type-null-is-not-assignable-to-type-string
    const { permissions } = JSON.parse(localStorage.getItem('auth') || '{}');
    return permissions ? Promise.resolve(permissions) : Promise.reject();
  },
  getIdentity: () => {
    const { id, fullName, avatar } = JSON.parse(
      localStorage.getItem('auth') || '{}'
    );
    return Promise.resolve({ id, fullName, avatar });
  },
};

export default authProvider;
