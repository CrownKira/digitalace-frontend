import React from "react";
import { MemoizedFunction } from "lodash";
import { useTranslate, useNotify, required } from "react-admin";

import { getValidationErrorMessage } from "../../utils";

export const useValidateRow = ({
  validateReferenceUnicity,
  requiredFields,
  itemSetKey,
}: {
  validateReferenceUnicity: (props: any) => ((value: string) => Promise<
    | {
        message: string;
        args: {
          [x: string]: string;
        };
      }
    | undefined
  >) &
    MemoizedFunction;
  requiredFields: string[];
  itemSetKey: string;
}) => {
  const translate = useTranslate();
  const notify = useNotify();

  // validateRow occurs after transformRows
  return async (csvRowItem: any): Promise<void> => {
    // TODO: validate types eg. number

    const getErrorMessage = (
      title: string,
      error:
        | string
        | {
            message: string;
            args: any;
          }
    ) => {
      const errorMessage = translate(getValidationErrorMessage(error));
      return `${title} - ${errorMessage}`;
    };

    try {
      requiredFields.forEach((field) => {
        const requiredError = required()(csvRowItem[field], undefined);
        if (requiredError) {
          throw new Error(getErrorMessage(field, requiredError));
        }
      });
    } catch (error: any) {
      notify(error.message, "warning");
      return Promise.reject(error);
    }

    const requiredLineItemFields = ["product", "quantity", "unit_price"];
    try {
      requiredLineItemFields.forEach((field) => {
        csvRowItem[itemSetKey].forEach((item: any) => {
          const requiredError = required()(item[field], undefined);
          if (requiredError) {
            throw new Error(getErrorMessage(field, requiredError));
          }
        });
      });
    } catch (error: any) {
      notify(error.message, "warning");
      return Promise.reject(error);
    }

    // validate reference
    const referenceError = await validateReferenceUnicity({})(
      csvRowItem.reference
    );
    if (referenceError) {
      const errorMessage = getErrorMessage(
        csvRowItem.reference,
        referenceError
      );
      notify(errorMessage);
      return Promise.reject(errorMessage);
    }

    return Promise.resolve();
  };
};
