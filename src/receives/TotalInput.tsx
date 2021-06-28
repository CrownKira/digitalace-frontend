import { FC, useEffect } from 'react';
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
} from 'react-admin';
import { useForm, useFormState } from 'react-final-form';

import { toFixedNumber } from '../utils';
import { ReceiveItem } from '../types';

interface Props extends NumberInputProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

const AmountInput: FC<Props> = ({
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
    const total_amount = (formData?.receiveitem_set as ReceiveItem[])
      ?.map((x) =>
        x ? toFixedNumber(x.quantity, 2) * toFixedNumber(x.unit_price, 2) : 0
      )
      .reduce((x: number, y: number) => x + y, 0);
    // toFixedNumber: returns rounded number that can be used for numeric operations
    const discount_rate = toFixedNumber(formData?.discount_rate, 2);
    const gst_rate = toFixedNumber(formData?.gst_rate, 2);
    // round the rest only at the end of calculation for display
    const discount_amount = total_amount * (discount_rate / 100);
    const net = total_amount * (1 - discount_rate / 100);
    const gst_amount = net * (gst_rate / 100);
    const grand_total = net * (1 - gst_rate / 100);

    // toFixed(2): converts '0' to '0.00'
    form.batch(() => {
      !isNaN(total_amount) &&
        form.change('total_amount', total_amount.toFixed(2));
      !isNaN(discount_rate) &&
        form.getFieldState('discount_rate')?.active === false &&
        form.change('discount_rate', discount_rate.toFixed(2));
      !isNaN(discount_amount) &&
        form.change('discount_amount', discount_amount.toFixed(2));
      !isNaN(discount_rate) &&
        form.getFieldState('gst_rate')?.active === false &&
        form.change('gst_rate', gst_rate.toFixed(2));
      !isNaN(gst_amount) && form.change('gst_amount', gst_amount.toFixed(2));
      !isNaN(net) && form.change('net', net.toFixed(2));
      !isNaN(grand_total) && form.change('grand_total', grand_total.toFixed(2));
    });
  }, [
    form,
    formData,
    formState, // so that discount_rate and gst_rate input round up on blur
  ]);

  return <NumberInput {...rest} className={inputClassName} />;
};

AmountInput.defaultProps = {};

export default AmountInput;
