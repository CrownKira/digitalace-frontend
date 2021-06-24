import { FC } from 'react';
import { InputProps, required } from 'react-admin';
import { useForm } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';

import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';

const useStyles = makeStyles({
  lineItemInput: { width: 150 },
});

interface Props extends InputProps {
  getSource: (source: string) => string;
}

const ProductNameInput: FC<Props> = ({ getSource }) => {
  const classes = useStyles();
  const form = useForm();
  return (
    <AsyncAutocompleteInput
      getOptionLabel={(option) => option.name}
      // TODO: let async know the source
      label="resources.invoice_items.fields.product"
      source={getSource('product')}
      resource="invoice_items"
      reference="products"
      validate={requiredValidate}
      fullWidth
      className={classes.lineItemInput}
      onChange={(event, newValue) => {
        form.batch(() => {
          form.change(getSource('unit'), newValue ? newValue.unit : '');
          form.change(
            getSource('unit_price'),
            newValue ? newValue.unit_price : ''
          );
          form.change(getSource('quantity'), newValue ? newValue.quantity : '');
          form.change(getSource('amount'), newValue ? newValue.amount : '');
        });
      }}
    />
  );
};

ProductNameInput.defaultProps = {};

const requiredValidate = [required()];

export default ProductNameInput;
