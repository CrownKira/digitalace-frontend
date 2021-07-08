import { FC, useEffect, useMemo } from 'react';
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
} from 'react-admin';
import { useForm, useFormState } from 'react-final-form';

import { toFixedNumber } from '../utils';
import { InvoiceItem } from '../types';

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

  const discount_rate = useMemo(
    () => toFixedNumber(formData.discount_rate, 2),
    [formData.discount_rate]
  );
  const gst_rate = useMemo(
    () => toFixedNumber(formData.gst_rate, 2),
    [formData.gst_rate]
  );
  const credits_applied = useMemo(
    () => toFixedNumber(formData.credits_applied, 2),
    [formData.credits_applied]
  );

  useMemo(() => {
    form.batch(() => {
      'discount_rate' !== formState.active &&
        form.change('discount_rate', discount_rate.toFixed(2));

      'gst_rate' !== formState.active &&
        form.change('gst_rate', gst_rate.toFixed(2));

      'credits_applied' !== formState.active &&
        form.change('credits_applied', credits_applied.toFixed(2));
    });
  }, [credits_applied, discount_rate, form, formState.active, gst_rate]);

  useEffect(() => {
    if (!formData.invoiceitem_set) return;
    // TODO: onBlur, then do calculation
    // round quantity, unit_price, gst_rate and discount rate first
    const total_amount = (formData.invoiceitem_set as InvoiceItem[])
      .map((x) =>
        x ? toFixedNumber(x.quantity, 2) * toFixedNumber(x.unit_price, 2) : 0
      )
      .reduce((x: number, y: number) => x + y, 0);
    // toFixedNumber: returns rounded number that can be used for numeric operations
    // round the rest only at the end of calculation for display

    const discount_amount = total_amount * (discount_rate / 100);
    const net = total_amount * (1 - discount_rate / 100);
    const gst_amount = net * (gst_rate / 100);
    const grand_total = net * (1 + gst_rate / 100);
    const balance_due = grand_total - credits_applied;

    // toFixed(2): converts '0' to '0.00'
    form.batch(() => {
      form.change('total_amount', total_amount.toFixed(2));
      form.change('discount_amount', discount_amount.toFixed(2));
      form.change('gst_amount', gst_amount.toFixed(2));
      form.change('net', net.toFixed(2));
      form.change('grand_total', grand_total.toFixed(2));
      form.change('balance_due', balance_due.toFixed(2));
    });
  }, [
    form,
    formData.invoiceitem_set,
    formData.gst_rate,
    formData.discount_rate,
    formData.credits_applied,
    discount_rate,
    gst_rate,
    credits_applied,
  ]);

  return <NumberInput {...rest} className={inputClassName} />;
};

TotalInput.defaultProps = {};

export default TotalInput;
