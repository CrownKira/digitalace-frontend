import { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  TextInputProps,
  FormDataConsumerRenderParams,
  linkToRecord,
} from 'react-admin';
import { useForm } from 'react-final-form';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';

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
      optionText="name"
      optionValue="id"
      reference="products"
      onChange={(event, newValue) => {
        getSource &&
          newValue &&
          form.batch(() => {
            form.change(getSource('unit'), newValue.unit);
            form.change(getSource('unit_price'), newValue.unit_price);
            form.change(getSource('quantity'), '0');
          });
      }}
      label="resources.invoice_items.fields.product"
      className={inputClassName}
    />
  );
};

ProductNameInput.defaultProps = {};

export default ProductNameInput;

// InputProps={
//   scopedFormData && scopedFormData.product
//     ? {
//         startAdornment: (
//           <IconButton
//             size="small"
//             color="primary"
//             component={Link}
//             to={linkToRecord('/products', scopedFormData.product)}
//           >
//             <EditIcon />
//           </IconButton>
//         ),
//       }
//     : null
// }
