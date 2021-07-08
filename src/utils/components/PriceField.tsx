import { FC } from 'react';
import { NumberField, NumberFieldProps } from 'react-admin';
import get from 'lodash/get';

export const PriceField: FC<NumberFieldProps> = (props: any) => {
  const { record, source } = props;

  const value = get(record, source);
  record[source] = Number(value);

  return (
    <NumberField
      {...props}
      record={record}
      options={{
        style: 'currency',
        currency: 'SGD', // TODO: make configurable
      }}
    />
  );
};

// Ensure the original component defaultProps are still applied as they may be used by its parents (such as the `Show` component):
PriceField.defaultProps = NumberField.defaultProps;
