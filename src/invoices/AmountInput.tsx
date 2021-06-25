import { FC, useEffect } from 'react';
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
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
    const quantity = toFixedNumber(scopedFormData?.quantity, 2);
    const unit_price = toFixedNumber(scopedFormData?.unit_price, 2);

    getSource &&
      !isNaN(quantity) &&
      !isNaN(unit_price) &&
      form.batch(() => {
        form.change(getSource('amount'), (quantity * unit_price).toFixed(2));
        form.change(getSource('quantity'), quantity);
        form.change(getSource('unit_price'), unit_price);
      });
  }, [form, getSource, scopedFormData?.quantity, scopedFormData?.unit_price]);

  return (
    <NumberInput
      {...rest}
      label="resources.invoice_items.fields.amount"
      className={inputClassName}
    />
  );
};

AmountInput.defaultProps = {};

export default AmountInput;
