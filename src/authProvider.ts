import { AuthProvider } from 'react-admin';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request('/api/user/create', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application' }),
    });

    const response = await fetch(request);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(response.statusText);
    }
    return await response.json();
  },
  logout: () => {
    localStorage.removeItem('auth');
    return Promise.resolve();
  },
  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
  getPermissions: () => {
    // https://stackoverflow.com/questions/54715260/typescript-json-parse-error-type-null-is-not-assignable-to-type-string
    const { permissions } = JSON.parse(localStorage.getItem('auth') || '{}');
    return permissions ? Promise.resolve(permissions) : Promise.reject();
  },
  getIdentity: () => {
    const { id, name, avatar } = JSON.parse(
      localStorage.getItem('auth') || '{}'
    );
    return Promise.resolve({ id, name, avatar });
  },
};

export default authProvider;
