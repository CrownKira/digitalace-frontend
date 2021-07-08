import axios from 'axios';

export const baseURL = '';

const instance = axios.create({
  baseURL,
  headers: {},
});

// https://github.com/axios/axios#custom-instance-defaults
// https://stackoverflow.com/questions/39254562/csrf-with-django-reactredux-using-axios
instance.defaults.xsrfHeaderName = 'X-CSRFToken';
instance.defaults.xsrfCookieName = 'csrftoken';

export default instance;
