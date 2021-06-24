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
  prefix: string,
  digits = 4
) => {
  const parts = reference.split('-');
  const reference_no = parts[1];
  if (reference_no && !isNaN(Number(reference_no))) {
    const reference_no_digits = reference_no.split('');
    let pointer = reference_no.length - 1;
    while (pointer >= 0 && Number(reference_no_digits[pointer]) >= 9) {
      reference_no_digits[pointer] = '0';
      pointer--;
    }
    if (pointer < 0) return '1' + reference_no;

    reference_no_digits[pointer] = String(
      Number(reference_no_digits[pointer]) + 1
    );
    return reference_no_digits.join('');
  }
  return prefix + '-' + '0'.repeat(digits);
};
