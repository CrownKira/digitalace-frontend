import React, { FC, useEffect, useMemo } from "react";
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { toFixedNumber } from "../../../utils";
import { CreditNoteItem } from "../../../types";

interface Props extends NumberInputProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

export const TotalInput: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  ...rest
}) => {
  const form = useForm();
  const formState = useFormState();

  const lineItems = useMemo(
    () =>
      formData.creditnoteitem_set
        ? (formData.creditnoteitem_set as CreditNoteItem[]).map((lineItem) => {
            const quantity = lineItem ? toFixedNumber(lineItem.quantity, 0) : 0;

            const unitPrice = lineItem
              ? toFixedNumber(lineItem.unit_price, 2)
              : 0;

            const amount = quantity * unitPrice;

            return {
              quantity: quantity,
              unit_price: unitPrice,
              amount: amount,
            };
          })
        : [],
    [formData.creditnoteitem_set]
  );
  const amounts = useMemo(
    () => lineItems.map((lineItem) => lineItem.amount),
    [lineItems]
  );
  const discount_rate = useMemo(
    () => toFixedNumber(formData.discount_rate, 2),
    [formData.discount_rate]
  );
  const gst_rate = useMemo(
    () => toFixedNumber(formData.gst_rate, 2),
    [formData.gst_rate]
  );

  useEffect(() => {
    form.batch(() => {
      "discount_rate" !== formState.active &&
        form.change("discount_rate", discount_rate.toFixed(2));

      "gst_rate" !== formState.active &&
        form.change("gst_rate", gst_rate.toFixed(2));

      if (
        formState.active &&
        !formState.active.includes("creditnoteitem_set")
      ) {
        return;
      }

      lineItems.forEach(({ quantity, unit_price, amount }, index) => {
        const quantitySource = `creditnoteitem_set[${index}].quantity`;
        quantitySource !== formState.active &&
          form.change(quantitySource, quantity.toFixed());

        const unitPriceSource = `creditnoteitem_set[${index}].unit_price`;
        unitPriceSource !== formState.active &&
          form.change(unitPriceSource, unit_price.toFixed(2));

        const amountSource = `creditnoteitem_set[${index}].amount`;
        amountSource !== formState.active &&
          form.change(amountSource, amount.toFixed(2));
      });
    });
  }, [discount_rate, form, formState.active, gst_rate, lineItems]);

  useEffect(() => {
    // TODO: onBlur, then do calculation
    // round quantity, unit_price, gst_rate and discount rate first
    const total_amount = amounts.reduce((x: number, y: number) => x + y, 0);

    // toFixedNumber: returns rounded number that can be used for numeric operations
    // round the rest only at the end of calculation for display
    const discount_amount = total_amount * (discount_rate / 100);
    const net = total_amount * (1 - discount_rate / 100);
    const gst_amount = net * (gst_rate / 100);
    const grand_total = net * (1 + gst_rate / 100);

    // toFixed(2): converts '0' to '0.00'
    form.batch(() => {
      form.change("total_amount", total_amount.toFixed(2));
      form.change("discount_amount", discount_amount.toFixed(2));
      form.change("gst_amount", gst_amount.toFixed(2));
      form.change("net", net.toFixed(2));
      form.change("grand_total", grand_total.toFixed(2));
    });
  }, [amounts, discount_rate, form, formData.creditnoteitem_set, gst_rate]);

  return <NumberInput {...rest} className={inputClassName} />;
};

TotalInput.defaultProps = {
  source: "total_amount",
};
