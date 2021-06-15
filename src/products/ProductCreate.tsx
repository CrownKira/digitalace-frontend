import { FC } from 'react';
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
} from 'react-admin';
import { InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RichTextInput from 'ra-input-rich-text';

export const styles = {
  unit: { width: '7em' },
  cost: { width: '7em' },
  unitPrice: { width: '7em' },
  costFormGroup: { display: 'inline-block' },
  unitPriceFormGroup: { display: 'inline-block', marginLeft: 32 },
};

const useStyles = makeStyles(styles);

const postDefaultValue = () => ({
  image: null,
  thumbnail: null,
});

const ProductCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  return (
    <Create {...props}>
      <TabbedForm initialValues={postDefaultValue}>
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
          <ReferenceInput source="category" reference="categories">
            <SelectInput source="name" validate={requiredValidate} />
          </ReferenceInput>
          <TextInput source="name" validate={requiredValidate} />
          <NumberInput
            source="cost"
            validate={requiredValidate}
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
            validate={requiredValidate}
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

const requiredValidate = [required()];

export default ProductCreate;
