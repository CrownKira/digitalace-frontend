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
      .reduce((x: number, y: number) => x + y)
      .toFixed(2);

    total &&
      // total might be 'NaN' which will pass the first test
      !isNaN(total) &&
      form.batch(() => {
        form.change('total', total);
      });
  }, [form, formData]);

  return <NumberInput {...rest} className={inputClassName} />;
};

AmountInput.defaultProps = {};

export default AmountInput;
