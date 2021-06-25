import { FC, useEffect } from 'react';
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
  Record,
} from 'react-admin';
import { useForm } from 'react-final-form';

import { toFixedNumber } from '../utils';

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

  useEffect(() => {
    const total = formData?.invoiceitem_set
      ?.map((x: Record) => (x ? toFixedNumber(x.amount, 2) : 0))
      .reduce((x: number, y: number) => x + y, 0);
    const discount_rate = toFixedNumber(formData?.discount_rate, 2);
    const gst_rate = toFixedNumber(formData?.gst_rate, 2);
    const discount_amount = total * (discount_rate / 100);
    const net = total * (1 - discount_rate / 100);
    const gst_amount = net * (gst_rate / 100);
    const grand_total = net * (1 - gst_rate / 100);

    form.batch(() => {
      !isNaN(total) && form.change('total', total.toFixed(2));
      !isNaN(discount_rate) && form.change('discount_rate', discount_rate);
      !isNaN(discount_amount) &&
        form.change('discount_amount', discount_amount.toFixed(2));
      !isNaN(gst_rate) && form.change('gst_rate', gst_rate);
      !isNaN(gst_amount) && form.change('gst_amount', gst_amount.toFixed(2));
      !isNaN(net) && form.change('net', net.toFixed(2));
      !isNaN(grand_total) && form.change('grand_total', grand_total.toFixed(2));
    });
  }, [form, formData]);

  return <NumberInput {...rest} className={inputClassName} />;
};

AmountInput.defaultProps = {};

export default AmountInput;
