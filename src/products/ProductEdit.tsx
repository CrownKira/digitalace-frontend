import { FC } from 'react';
import {
  // Datagrid,
  // DateField,
  Edit,
  // EditButton,
  EditProps,
  FormTab,
  NumberInput,
  // Pagination,
  ReferenceInput,
  // ReferenceManyField,
  required,
  SelectInput,
  TabbedForm,
  // TextField,
  TextInput,
} from 'react-admin';
import { InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

// import CustomerReferenceField from '../customers/CustomerReferenceField';
// import StarRatingField from '../reviews/StarRatingField';
import Image from './Image';
import { styles as createStyles } from './ProductCreate';
import { Product } from '../types';

interface ProductTitleProps {
  record?: Product;
}

const ProductTitle: FC<ProductTitleProps> = ({ record }) =>
  record ? <span>Product #{record.reference}</span> : null;

const useStyles = makeStyles({
  ...createStyles,
  comment: {
    maxWidth: '20em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tab: {
    maxWidth: '40em',
    display: 'block',
  },
});

const ProductEdit: FC<EditProps> = (props) => {
  const classes = useStyles();

  return (
    <Edit {...props} title={<ProductTitle />}>
      <TabbedForm>
        <FormTab
          label="resources.products.tabs.image"
          contentClassName={classes.tab}
        >
          <Image />
          <TextInput source="image" fullWidth validate={requiredValidate} />
          <TextInput source="thumbnail" fullWidth validate={requiredValidate} />
        </FormTab>
        <FormTab
          label="resources.products.tabs.details"
          path="details"
          contentClassName={classes.tab}
        >
          <TextInput source="name" validate={requiredValidate} />
          <NumberInput
            source="cost"
            className={classes.cost}
            formClassName={classes.costFormGroup}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S$</InputAdornment>
              ),
            }}
            validate={requiredValidate}
          />
          <NumberInput
            source="unit_price"
            className={classes.unitPrice}
            formClassName={classes.unitPriceFormGroup}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S$</InputAdornment>
              ),
            }}
            validate={requiredValidate}
          />
          <NumberInput
            source="unit"
            className={classes.unit}
            validate={requiredValidate}
          />
          <ReferenceInput
            source="supplier"
            reference="suppliers"
            validate={requiredValidate}
          >
            <SelectInput source="name" />
          </ReferenceInput>
        </FormTab>
        <FormTab
          label="resources.products.tabs.description"
          path="description"
          contentClassName={classes.tab}
        >
          <RichTextInput
            source="description"
            label=""
            validate={requiredValidate}
          />
        </FormTab>
        <FormTab label="resources.products.tabs.reviews" path="reviews">
          <div>Coming soon...</div>
        </FormTab>
        <FormTab label="resources.products.tabs.stock" path="stock">
          <div>Coming soon...</div>
        </FormTab>
        <FormTab
          label="resources.products.tabs.transactions"
          path="transactions"
        >
          <div>Coming soon...</div>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};

const requiredValidate = [required()];

export default ProductEdit;

// TODO:reviews tab
/*
<FormTab label="resources.products.tabs.reviews" path="reviews">
  <ReferenceManyField
    reference="reviews"
    target="product_id"
    addLabel={false}
    pagination={<Pagination />}
    fullWidth
  >
    <Datagrid>
      <DateField source="date" />
      <CustomerReferenceField />
      <StarRatingField />
      <TextField source="comment" cellClassName={classes.comment} />
      <TextField source="status" />
      <EditButton />
    </Datagrid>
  </ReferenceManyField>
</FormTab>
*/
