import React, { FC, useEffect, useMemo, useCallback } from "react";
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { toFixedNumber } from "../../../utils";
import { InvoiceItem } from "../../../types";

interface Props extends NumberInputProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

// TODO: remove this after making credits application a modal
export const CreditsAppliedInput: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  record,
  ...rest
}) => {
  const form = useForm();
  const formState = useFormState();

  const isBlur = useCallback(
    (field: string) => {
      return form.getFieldState(field)?.active === false;
    },
    [form]
  );

  const amounts_to_credit = useMemo(
    () =>
      formData.creditsapplication_set
        ? (formData.creditsapplication_set as InvoiceItem[]).map((x) =>
            x ? toFixedNumber(x.amount_to_credit, 2) : 0
          )
        : [],
    [formData.creditsapplication_set]
  );

  useEffect(() => {
    amounts_to_credit.forEach((amount_to_credit, index) => {
      const source = `creditsapplication_set[${index}].amount_to_credit`;

      if (isBlur(source)) {
        form.change(source, amount_to_credit.toFixed(2));
      }
    });
  }, [amounts_to_credit, form, isBlur]);

  useEffect(() => {
    // round amount to credit first

    // TODO: extract this calculation to share with TotalCreditsSection.tsx
    const total_amount_to_credit = amounts_to_credit.reduce(
      (x: number, y: number) => x + y,
      0
    );
    const credits_applied =
      toFixedNumber(record?.credits_applied || 0, 2) + total_amount_to_credit;

    const balance_due = formData.grand_total - credits_applied;

    form.batch(() => {
      // TODO: pass down record instead of form.change()?
      form.change("credits_applied", credits_applied.toFixed(2));

      form.change("balance_due", balance_due.toFixed(2));
    });
  }, [amounts_to_credit, form, formData.grand_total, record?.credits_applied]);

  return <NumberInput {...rest} className={inputClassName} />;
};

CreditsAppliedInput.defaultProps = {
  source: "credits_applied",
};
