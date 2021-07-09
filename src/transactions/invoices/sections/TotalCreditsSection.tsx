import { FC, useMemo } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Record } from 'react-admin';

import { toFixedNumber } from '../../../utils';

const useStyles = makeStyles({
  label: {
    padding: '1em',
  },
});

interface Props {
  formData: any;
  record: Record;
}

export const TotalCreditsSection: FC<Props> = ({ formData, record }) => {
  const classes = useStyles();

  const total_amount_to_credit = useMemo(
    () => formData.credits_applied - (record?.credits_applied || 0),
    [formData.credits_applied, record]
  );
  const balance_due = useMemo(
    () =>
      (
        toFixedNumber(formData.balance_due, 2) - total_amount_to_credit
      ).toLocaleString(undefined, {
        style: 'currency',
        currency: 'SGD',
      }),
    [formData.balance_due, total_amount_to_credit]
  );

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
          Invoice Balance Due: {balance_due}
        </span>
      </Box>
    </>
  );
};
