import QuickFilter from './QuickFilter';
export { QuickFilter };

// https://github.com/marmelab/react-admin/issues/2077
export function formatImage(value: any) {
  if (!value || typeof value === 'string') {
    // Value is null or the url string from the backend,
    // wrap it in an object so the form input can handle it
    return { src: value };
  } else {
    // Else a new image is selected which results in a value
    // object already having a preview link under the url key
    return value;
  }
}
