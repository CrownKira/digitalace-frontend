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
    // round up quantity and unit_price first since
    // user are expected to type in those values rounded up to 2 dp
    const quantity = toFixedNumber(scopedFormData?.quantity, 0);
    const unit_price = toFixedNumber(scopedFormData?.unit_price, 2);

    getSource &&
      !isNaN(quantity) &&
      !isNaN(unit_price) &&
      form.batch(() => {
        // addition of rounded values return rounded value
        // so this amount can be used for calculation of total
        form.change(getSource('amount'), (quantity * unit_price).toFixed(2));
        form.getFieldState(getSource('quantity'))?.active === false &&
          form.change(getSource('quantity'), quantity.toFixed());
        form.getFieldState(getSource('unit_price'))?.active === false &&
          form.change(getSource('unit_price'), unit_price.toFixed(2));
      });
  }, [
    // qn: for some reason, on blur quantity or unit_price, one of the dependencies change
    form,
    getSource,
    scopedFormData?.quantity,
    scopedFormData?.unit_price,
  ]);

  return (
    <NumberInput
      min={0}
      {...rest}
      label="resources.invoice_items.fields.amount"
      className={inputClassName}
    />
  );
};

AmountInput.defaultProps = {};

export default AmountInput;
