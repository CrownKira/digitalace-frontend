import { FC, useEffect } from 'react';
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

const CreditsAppliedInput: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  ...rest
}) => {
  const form = useForm();
  const formState = useFormState();

  useEffect(() => {
    // round amount to credit first
    const credits_applied = (formData?.creditsapplication_set as InvoiceItem[])
      ?.map((x) => (x ? toFixedNumber(x.amount_to_credit, 2) : 0))
      .reduce((x: number, y: number) => x + y, 0);

    const balance_due = formData.grand_total - credits_applied;

    form.batch(() => {
      !isNaN(credits_applied) &&
        form.change('credits_applied', credits_applied.toFixed(2));
      !isNaN(balance_due) && form.change('balance_due', balance_due.toFixed(2));
    });
  }, [form, formData, formState]);

  return (
    <NumberInput
      min={0}
      max={scopedFormData && toFixedNumber(scopedFormData.credits_remaining, 2)}
      {...rest}
      className={inputClassName}
      validate={validateCreditsValidity(scopedFormData)}
    />
  );
};

CreditsAppliedInput.defaultProps = {};

const validateCreditsValidity = (scopedFormData: any) => () => {
  // https://stackoverflow.com/questions/65123272/arrayinput-validate-in-react-admin
  if (scopedFormData) {
    const isCreditsValid =
      toFixedNumber(scopedFormData.amount_to_credit, 2) <=
      // TODO: get from credit note instead?
      toFixedNumber(scopedFormData.credits_remaining, 2);
    const message = 'resources.invoices.validation.invalid_credits';

    if (!isCreditsValid) {
      return message;
    }
  }
};

export default CreditsAppliedInput;
