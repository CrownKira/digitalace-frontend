import { FC } from 'react';
import { TextInputProps, FormDataConsumerRenderParams } from 'react-admin';
import { useForm } from 'react-final-form';

import { AsyncAutocompleteInput } from '../utils/components/AsyncAutocompleteInput';

interface Props extends TextInputProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

const ProductNameInput: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  ...rest
}) => {
  const form = useForm();

  return (
    <AsyncAutocompleteInput
      {...rest} // pass injected props
      getOptionLabel={(option) => option.name}
      reference="products"
      onChange={(event, newValue) => {
        getSource &&
          form.batch(() => {
            form.change(getSource('unit'), newValue ? newValue.unit : '');
            form.change(
              getSource('unit_price'),
              newValue ? newValue.unit_price : '0.00'
            );
            form.change(getSource('quantity'), '0.00');
          });
      }}
      label="resources.invoice_items.fields.product"
      className={inputClassName}
    />
  );
};

ProductNameInput.defaultProps = {};

export default ProductNameInput;
