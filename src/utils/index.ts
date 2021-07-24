import React, { ReactNode } from "react";
import lodashMemoize from "lodash/memoize";
import { Record } from "react-admin";

import { customDataProvider } from "../dataProvider/main";
import { Memoize } from "../types";
import { QuickFilter } from "./components/QuickFilter";
import { permissions } from "../permissions/data";

export { QuickFilter };

// https://github.com/marmelab/react-admin/issues/2077
export function formatImage(value: any) {
  if (!value || typeof value === "string") {
    // Value is null or the url string from the main,
    // wrap it in an object so the form input can handle it
    return { src: value };
  }
  // Else a new image is selected which results in a value
  // object already having a preview link under the url key
  return value;
}

export function toFixedNumber(num: any, digits = 2, base = 10) {
  if (isNaN(num)) {
    return 0;
  }
  const pow = base ** digits;
  // Math.round() function returns the value of a number rounded to the nearest integer
  return Math.round(Number(num) * pow) / pow;
}

export const getNextReference = (
  reference: string,
  defaultPrefix: string,
  defaultDigits = 4
): string => {
  const parts = reference.split("-");
  const prefix = parts[0];
  const reference_no = parts[1];

  if (parts.length > 1 && !isNaN(+reference_no)) {
    const digits = reference_no.split("");
    let pointer = reference_no.length - 1;

    while (pointer >= 0 && +digits[pointer] >= 9) {
      digits[pointer] = "0";
      pointer -= 1;
    }

    if (pointer < 0) return `${prefix}-1${digits.join("")}`;

    digits[pointer] = String(+digits[pointer] + 1);
    return `${prefix}-${digits.join("")}`;
  }

  return `${defaultPrefix}-${"0".repeat(defaultDigits)}`;
};

export const dateFormatter = (v: Date) => {
  // https://stackoverflow.com/questions/64714107/can-use-react-admin-dateinput-to-change-the-format-like-dd-mm-yyyy-to-mm-dd-yyyy
  // v is a `Date` object
  // if (!(v instanceof Date) || isNaN(v)) return;
  const pad = "00";
  const yy = v.getFullYear().toString();
  const mm = (v.getMonth() + 1).toString();
  const dd = v.getDate().toString();
  return `${yy}-${(pad + mm).slice(-2)}-${(pad + dd).slice(-2)}`;
};

export const dateParser = (date: any) => {
  // for some reason, RA might not format payment_date
  if (date instanceof Date) return dateFormatter(date);
  // FIXME: fix parse not converting this to null
  // fix parse doesn't parse on render default input
  return date || null;
};

export function refreshLocalStorage(data: { [key: string]: any }) {
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, value);
  }
}

export const getValidationErrorMessage = (
  error?:
    | string
    | {
        message: string;
        args: any;
      }
) => {
  return error === undefined
    ? ""
    : typeof error === "string"
    ? error
    : error.message;
};

// TODO: display error in the field helper instead?
// https://marmelab.com/react-admin/CreateEdit.html#submission-validation
const getAxiosErrorMessage = (error: any) => {
  const {
    response: { data, status, statusText },
  } = error;

  return status === 400
    ? // stringify it since it might be an object
      `${Object.keys(data)[0]} - ${JSON.stringify(Object.values(data)[0])}`
    : statusText;
};

// get the first error
export const getErrorMessage = (error: any) => {
  // TODO: extend this to get all errors instead of one

  const { isAxiosError, body, status, message, code } = error;

  if (isAxiosError) {
    return getAxiosErrorMessage(error);
  }

  if (code === "server_error") {
    return error?.error?.message;
  }

  return status === 400
    ? `${Object.keys(body)[0]} - ${JSON.stringify(Object.values(body)[0])}`
    : message;
};

export const memoize: Memoize = (fn: any) =>
  lodashMemoize(fn, (...args) => JSON.stringify(args));

export const sanitizeButtonRestProps = ({
  // The next props are injected by Toolbar
  basePath,
  handleSubmit,
  handleSubmitWithRedirect,
  invalid,
  onSave,
  pristine,
  record,
  redirect,
  resource,
  saving,
  submitOnEnter,
  undoable,
  ...rest
}: any) => rest;

export const validatePositivity = (value: number) => {
  if (value < 0) {
    const message = "resources.invoices.validation.negative_number";
    return message;
  }
  return undefined;
};

export const validateUnicity = ({
  reference,
  source,
  record,
  message,
}: {
  reference: string;
  source: string;
  record?: Record;
  message: string;
}) => {
  const checkSourceIsUnique = async (value: string): Promise<boolean> => {
    try {
      // can't use hook since result can't be memoized
      // TODO: use raw data provider
      const response = await customDataProvider.getManyReference(reference, {
        target: source,
        id: value,
        pagination: { page: 1, perPage: 2 },
        sort: { field: "id", order: "DESC" },
        filter: {},
      });

      return (
        response &&
        response.data.length < 2 &&
        (response.data.length === 0 ||
          (record !== undefined && response.data[0].id === record.id))
      );
    } catch (error) {
      // notify('pos.use_validate_unicity.data_provider_error', 'warning');
      return false;
    }
  };

  return lodashMemoize(async (value: string) => {
    const isSourceUnique = await checkSourceIsUnique(value);
    if (!isSourceUnique) {
      return {
        message,
        args: { [source]: value },
      };
    }
    return undefined;
  });
};

export const ccyFormat = (
  num: number | string,
  showCurrency = false
): string => {
  if (isNaN(num as number)) {
    return "0.00";
  }

  if (showCurrency) {
    return Number(num).toLocaleString(undefined, {
      style: "currency",
      currency: "SGD",
    });
  }

  return Number(num).toFixed(2);
};

export const hasPermission = (
  permissions: (string | undefined)[],
  codename: string,
  action: string
) => {
  switch (action) {
    case "list":
      // return permissions.includes(`view_${codename}`);
      // view_permission is no longer in use
      return true;
    case "create":
      return permissions.includes(`add_${codename}`);
    case "edit":
      return permissions.includes(`change_${codename}`);
    case "codename":
      // TODO: remove codename field
      return false;
    default:
      return true;
  }
};

export const getPermissionCodeNames = (userPermissions: number[]) => {
  return userPermissions
    .map((x) => permissions.find((y) => y.id === x)?.codename)
    .filter((x) => x);
};
