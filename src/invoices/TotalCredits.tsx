import { FC, useMemo, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { useForm, useFormState } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { Record } from 'react-admin';

import { toFixedNumber } from '../utils';
import { InvoiceItem } from '../types';

const useStyles = makeStyles({
  label: {
    padding: '1em',
  },
});
interface Props {
  formData: any;
  record: Record;
}

const TotalCredits: FC<Props> = ({ formData, record }) => {
  const form = useForm();
  const formState = useFormState();
  const classes = useStyles();
  // const amounts_to_credit = useMemo(
  //   () =>
  //     (formData.fake_creditsapplication_set as InvoiceItem[])?.map((x) =>
  //       x ? toFixedNumber(x.amount_to_credit, 2) : 0
  //     ),

  //   [formData.fake_creditsapplication_set]
  // );
  // const total_amount_to_credit = useMemo(
  //   () => amounts_to_credit.reduce((x: number, y: number) => x + y, 0),
  //   [amounts_to_credit]
  // );

  // TODO: formData and record always present?
  const total_amount_to_credit = useMemo(
    () => formData.credits_applied - (record?.credits_applied || 0),
    [formData.credits_applied, record]
  );
  const balance_due = useMemo(
    () => toFixedNumber(formData.balance_due, 2) - total_amount_to_credit,
    [formData.balance_due, total_amount_to_credit]
  );

  // useEffect(() => {
  //   if (!formData.fake_creditsapplication_set) return;

  //   form.batch(() => {
  //     amounts_to_credit.forEach((amount_to_credit, index) => {
  //       const source = `fake_creditsapplication_set[${index}].amount_to_credit`;
  //       !isNaN(amount_to_credit) &&
  //         form.getFieldState(source)?.active === false &&
  //         form.change(source, amount_to_credit.toFixed(2));
  //     });
  //   });
  // }, [amounts_to_credit, form, formData, formState]);

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <span className={classes.label}>
          Amount to Credit:{' '}
          {total_amount_to_credit.toLocaleString(undefined, {
            style: 'currency',
            currency: 'SGD',
          })}
        </span>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <span className={classes.label}>
          Invoice Balance Due:{' '}
          {balance_due.toLocaleString(undefined, {
            style: 'currency',
            currency: 'SGD',
          })}
        </span>
      </Box>
    </>
  );
};

export default TotalCredits;
