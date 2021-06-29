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

export function toFixedNumber(num: any, digits = 2, base = 10) {
  const pow = Math.pow(base, digits);
  // Math.round() function returns the value of a number rounded to the nearest integer
  return Math.round(Number(num) * pow) / pow;
}

export const incrementReference = (
  reference: string,
  defaultPrefix: string,
  defaultDigits = 4
): string => {
  const parts = reference.split('-');
  const prefix = parts[0];
  const reference_no = parts[1];

  if (parts.length > 1 && !isNaN(+reference_no)) {
    const digits = reference_no.split('');
    let pointer = reference_no.length - 1;

    while (pointer >= 0 && +digits[pointer] >= 9) {
      digits[pointer] = '0';
      pointer--;
    }

    if (pointer < 0) return `${prefix}-1${digits.join('')}`;

    digits[pointer] = String(+digits[pointer] + 1);
    return `${prefix}-${digits.join('')}`;
  }

  return `${defaultPrefix}-${'0'.repeat(defaultDigits)}`;
};

export const dateParser = (date: string) => {
  // FIXME: fix parse not converting this to null
  // fix parse doesn't parse on render default input
  return date || null;
};

export function refreshLocalStorage(data: { [key: string]: any }) {
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, value);
  }
}

const getAxiosErrorMessage = (error: any) => {
  const {
    response: { data, status, statusText },
  } = error;

  return status === 400
    ? `${Object.keys(data)[0]}: ${Object.values(data)[0]}`
    : statusText;
};

export const getErrorMessage = (error: any) => {
  // TODO: extend this to get all errors instead of one
  const { isAxiosError, body, status, message } = error;

  if (isAxiosError) return getAxiosErrorMessage(error);

  return status === 400
    ? `${Object.keys(body)[0]}: ${Object.values(body)[0]}`
    : message;
};
