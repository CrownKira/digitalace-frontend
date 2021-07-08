import { FC, useEffect } from 'react';
import {
  NumberInputProps,
  NumberInput,
  FormDataConsumerRenderParams,
  minValue,
  maxValue,
  number,
} from 'react-admin';
import { useForm, useFormState } from 'react-final-form';
import get from 'lodash/get';

import { toFixedNumber } from '../utils';
import { InvoiceItem } from '../types';

interface Props extends NumberInputProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

// TODO: remove this after making credits application a modal
const CreditsAppliedInput: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  record,
  ...rest
}) => {
  const form = useForm();
  const formState = useFormState();

  useEffect(() => {
    // console.log(formData);
    // round amount to credit first
    // console.log(formData.fake_creditsapplication_set);
    if (!formData.fake_creditsapplication_set) return;

    // TODO: extract this calculation to share with TotalCredits.tsx
    const amounts_to_credit = (
      formData.fake_creditsapplication_set as InvoiceItem[]
    )?.map((x) => (x ? toFixedNumber(x.amount_to_credit, 2) : 0));

    const total_amount_to_credit = amounts_to_credit.reduce(
      (x: number, y: number) => x + y,
      0
    );
    const credits_applied =
      toFixedNumber(record?.credits_applied || 0, 2) + total_amount_to_credit;

    // console.log('k2');
    // console.log(amounts_to_credit);
    // console.log(total_amount_to_credit);
    // console.log(credits_applied);

    const balance_due = formData.grand_total - credits_applied;
    // console.log(balance_due);

    form.batch(() => {
      // TODO: pass down record instead of form.change()?
      !isNaN(credits_applied) &&
        form.change('credits_applied', credits_applied.toFixed(2));
      !isNaN(balance_due) && form.change('balance_due', balance_due.toFixed(2));
      amounts_to_credit.forEach((amount_to_credit, index) => {
        const source = `fake_creditsapplication_set[${index}].amount_to_credit`;
        !isNaN(amount_to_credit) &&
          form.getFieldState(source)?.active === false &&
          form.change(source, amount_to_credit.toFixed(2));
      });
    });
  }, [form, formData, formState, record]);

  return (
    <NumberInput
      // max={scopedFormData && toFixedNumber(scopedFormData.credits_remaining, 2)}
      {...rest}
      className={inputClassName}
    />
  );
};

CreditsAppliedInput.defaultProps = {};

// const validateNumber = [number(), minValue(0)];
// const validateCredits = (scopedFormData: any) => (value: any) => {
//   // https://stackoverflow.com/questions/65123272/arrayinput-validate-in-react-admin
//   console.log('credit', scopedFormData);
//   if (scopedFormData) {
//     const isCreditsValid =
//       toFixedNumber(scopedFormData.amount_to_credit, 2) <=
//       // TODO: get from credit note instead?
//       // TODO: better error message eg. credits cannot be less than...
//       toFixedNumber(scopedFormData.credits_remaining, 2);
//     const message = 'resources.invoices.validation.invalid_credits';

//     if (!isCreditsValid) {
//       return message;
//     }
//   }
// };

export default CreditsAppliedInput;
