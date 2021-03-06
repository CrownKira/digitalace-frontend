import React, { FC } from "react";
import {
  Create,
  FormTab,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TabbedForm,
  TextInput,
  required,
  CreateProps,
  ImageInput,
  ImageField,
  useGetList,
  Loading,
  number,
  minValue,
} from "react-admin";
import { InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import RichTextInput from "ra-input-rich-text";

import { Product } from "../../types";
import { getNextReference, validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";

export const styles = {
  unit: { width: "7em" },
  cost: { width: "7em" },
  unitPrice: { width: "7em" },
  costFormGroup: { display: "inline-block" },
  unitPriceFormGroup: { display: "inline-block", marginLeft: 32 },
};

const useStyles = makeStyles(styles);

export const ProductCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();
  const onFailure = useOnFailure();

  const {
    data: products,
    ids: productIds,
    loading: loadingProducts,
  } = useGetList<Product>(
    "products",
    { page: 1, perPage: 1 },
    { field: "id", order: "DESC" },
    {}
  );
  const postDefaultValue = () => ({
    image: "",
    thumbnail: "",
    reference:
      products && productIds.length > 0
        ? getNextReference(products[productIds[0]].reference, "P", 4)
        : "P-0000",
  });

  return loadingProducts ? (
    <Loading />
  ) : (
    <Create {...props} onFailure={onFailure}>
      <TabbedForm warnWhenUnsavedChanges initialValues={postDefaultValue}>
        <FormTab label="resources.products.tabs.image">
          <ImageInput
            source="image"
            accept="image/*"
            placeholder={<p>Drop your file here</p>}
          >
            <ImageField
              /**
               * ImageInput passes record in this format to
               * ImageField: {src=<url>, title=<filename>}
               */
              source="src"
              title="title"
            />
          </ImageInput>
          <ImageInput
            source="thumbnail"
            accept="image/*"
            placeholder={<p>Drop your file here</p>}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
        <FormTab label="resources.products.tabs.details" path="details">
          <TextInput source="reference" validate={validateReference(props)} />
          <ReferenceInput source="category" reference="categories">
            <SelectInput source="name" validate={requiredValidate} />
          </ReferenceInput>
          <TextInput source="name" validate={requiredValidate} />
          <NumberInput
            source="cost"
            validate={validateNumber}
            className={classes.cost}
            formClassName={classes.costFormGroup}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S$</InputAdornment>
              ),
            }}
          />
          <NumberInput
            source="unit_price"
            validate={validateNumber}
            className={classes.unitPrice}
            formClassName={classes.unitPriceFormGroup}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S$</InputAdornment>
              ),
            }}
          />
          <TextInput
            source="unit"
            className={classes.unit}
            validate={requiredValidate}
          />
          <ReferenceInput source="supplier" reference="suppliers">
            <SelectInput source="name" validate={requiredValidate} />
          </ReferenceInput>
        </FormTab>
        <FormTab label="resources.products.tabs.description" path="description">
          <RichTextInput source="description" label="" />
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

export const requiredValidate = required();
export const validateNumber = [requiredValidate, number(), minValue(0)];
export const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "products",
    source: "reference",
    record: props.record,
    message: "resources.products.validation.reference_already_used",
  });
export const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);
