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

const ProductCreate: FC<CreateProps> = (props) => {
  const classes = useStyles();

  return (
    <Create {...props}>
      <TabbedForm>
        <FormTab label="resources.products.tabs.image">
          <ImageInput
            source="image"
            label="Image"
            accept="image/*"
            placeholder={<p>Drop your file here</p>}
          >
            <ImageField
              /**
               * ImageInput passes record in this format to
               * ImageInput: {src=<url>, title=<filename>}
               */
              source="src"
              title="title"
            />
          </ImageInput>
          <ImageInput
            source="thumbnail"
            label="Thumbnail"
            accept="image/*"
            placeholder={<p>Drop your file here</p>}
          >
            <ImageField source="src" title="title" />
          </ImageInput>
        </FormTab>
        <FormTab label="resources.products.tabs.details" path="details">
          <TextInput source="name" validate={required()} />
          <NumberInput
            source="cost"
            validate={required()}
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
            validate={required()}
            className={classes.unitPrice}
            formClassName={classes.unitPriceFormGroup}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S$</InputAdornment>
              ),
            }}
          />
          <TextInput
            className={classes.unit}
            source="unit"
            validate={required()}
          />
          <ReferenceInput source="supplier" reference="suppliers" allowEmpty>
            <SelectInput source="name" validate={required()} />
          </ReferenceInput>
        </FormTab>
        <FormTab label="resources.products.tabs.description" path="description">
          <RichTextInput source="description" label="" />
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

export default ProductCreate;
