import { FC, useEffect } from "react";
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";

import { toFixedNumber } from "../utils";
import { CreditNoteItem } from "../types";

interface Props extends NumberInputProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

const TotalInput: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  ...rest
}) => {
  const form = useForm();
  const formState = useFormState();

  useEffect(() => {
    // round quantity, unit_price, gst_rate and discount rate first
    const total_amount = (formData.creditnoteitem_set as CreditNoteItem[])
      ?.map((x) =>
        x ? toFixedNumber(x.quantity, 2) * toFixedNumber(x.unit_price, 2) : 0
      )
      .reduce((x: number, y: number) => x + y, 0);
    // toFixedNumber: returns rounded number that can be used for numeric operations
    const discount_rate = toFixedNumber(formData.discount_rate, 2);
    const gst_rate = toFixedNumber(formData.gst_rate, 2);
    // round the rest only at the end of calculation for display
    const discount_amount = total_amount * (discount_rate / 100);
    const net = total_amount * (1 - discount_rate / 100);
    const gst_amount = net * (gst_rate / 100);
    const grand_total = net * (1 + gst_rate / 100);
    const credits_used = toFixedNumber(formData.credits_used, 2);
    const refund = Math.min(
      toFixedNumber(formData.refund, 2),
      grand_total - credits_used
    );
    const credits_remaining = grand_total - credits_used - refund;

    // toFixed(2): converts '0' to '0.00'
    form.batch(() => {
      !isNaN(total_amount) &&
        form.change("total_amount", total_amount.toFixed(2));
      !isNaN(discount_rate) &&
        form.getFieldState("discount_rate")?.active === false &&
        form.change("discount_rate", discount_rate.toFixed(2));
      !isNaN(discount_amount) &&
        form.change("discount_amount", discount_amount.toFixed(2));
      !isNaN(gst_rate) &&
        form.getFieldState("gst_rate")?.active === false &&
        form.change("gst_rate", gst_rate.toFixed(2));
      !isNaN(gst_amount) && form.change("gst_amount", gst_amount.toFixed(2));
      !isNaN(net) && form.change("net", net.toFixed(2));
      !isNaN(grand_total) && form.change("grand_total", grand_total.toFixed(2));
      !isNaN(credits_remaining) &&
        form.change("credits_remaining", credits_remaining.toFixed(2));
      !isNaN(refund) &&
        form.getFieldState("refund")?.active === false &&
        form.change("refund", refund.toFixed(2));
    });
  }, [
    form,
    formData,
    formState, // so that discount_rate and gst_rate input round up on blur
  ]);

  return <NumberInput {...rest} className={inputClassName} />;
};

TotalInput.defaultProps = {};

export default TotalInput;
