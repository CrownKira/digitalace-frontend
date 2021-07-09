import { FC } from "react";
import {
  Edit,
  EditProps,
  FormTab,
  NumberInput,
  ReferenceInput,
  required,
  SelectInput,
  TabbedForm,
  TextInput,
  ImageInput,
  ImageField,
  number,
  minValue,
} from "react-admin";
import { InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RichTextInput from "ra-input-rich-text";

import { styles as createStyles } from "./ProductCreate";
import { Product } from "../types";
import { formatImage, validateUnicity } from "../utils";
import { memoize } from "../utils";
import { useOnFailure } from "../utils/hooks";

interface ProductTitleProps {
  record?: Product;
}

const ProductEdit: FC<EditProps> = (props) => {
  const onFailure = useOnFailure();

  return (
    <Edit {...props} title={<ProductTitle />} onFailure={onFailure}>
      <ProductForm />
    </Edit>
  );
};

const ProductTitle: FC<ProductTitleProps> = ({ record }) =>
  record ? <span>Product #{record.reference}</span> : null;

const useStyles = makeStyles({
  ...createStyles,
  comment: {
    maxWidth: "20em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tab: {
    maxWidth: "40em",
    display: "block",
  },
});

const ProductForm = (props: any) => {
  const classes = useStyles();

  return (
    <TabbedForm {...props}>
      <FormTab
        label="resources.products.tabs.image"
        contentClassName={classes.tab}
      >
        <ImageInput
          format={formatImage}
          source="image"
          accept="image/*"
          placeholder={<p>Drop your file here</p>}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        <ImageInput
          format={formatImage}
          source="thumbnail"
          accept="image/*"
          placeholder={<p>Drop your file here</p>}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </FormTab>
      <FormTab
        label="resources.products.tabs.details"
        path="details"
        contentClassName={classes.tab}
      >
        <TextInput
          source="reference"
          validate={validateReference(props)}
          resource="products"
        />
        <ReferenceInput
          source="category"
          reference="categories"
          validate={requiredValidate}
        >
          <SelectInput source="name" />
        </ReferenceInput>
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
          validate={validateNumber}
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
          validate={validateNumber}
        />
        <TextInput
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
        <RichTextInput source="description" label="" />
      </FormTab>
      <FormTab label="resources.products.tabs.reviews" path="reviews"></FormTab>
      <FormTab label="resources.products.tabs.stock" path="stock"></FormTab>
      <FormTab
        label="resources.products.tabs.transactions"
        path="transactions"
      ></FormTab>
    </TabbedForm>
  );
};

const requiredValidate = required();
const validateNumber = [requiredValidate, number(), minValue(0)];
const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "products",
    source: "reference",
    record: props.record,
    message: "resources.products.validation.reference_already_used",
  });
const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

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
