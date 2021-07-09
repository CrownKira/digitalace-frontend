import { FC } from "react";
import {
  Edit,
  EditProps,
  TextInput,
  Toolbar,
  FormWithRedirect,
  required,
  email,
  FieldProps,
  ImageInput,
  ImageField,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  EditButton,
  ReferenceManyField,
  Labeled,
} from "react-admin";
import { Box, Card, CardContent } from "@material-ui/core";

import Aside from "./Aside";
import FullNameField from "./FullNameField";
import { validatePasswords } from "./SupplierCreate";
import { Supplier } from "../../types";
import { formatImage, validateUnicity } from "../../utils";
import { memoize } from "../../utils";
import { useOnFailure } from "../../utils/hooks";
import { SectionTitle, Separator } from "../../utils/components/Divider";
import NameField from "../categories/NameField";
import ProductRefField from "../products/ProductRefField";
import ThumbnailField from "../products/ThumbnailField";
import { PriceField } from "../../utils/components/PriceField";

const SupplierEdit: FC<EditProps> = (props) => {
  const onFailure = useOnFailure();

  return (
    <Edit
      title={<SupplierTitle />}
      aside={<Aside />}
      component="div"
      onFailure={onFailure}
      {...props}
    >
      <SupplierForm />
    </Edit>
  );
};

const SupplierTitle: FC<FieldProps<Supplier>> = ({ record }) =>
  record ? <FullNameField record={record} size="32" /> : null;

const SupplierForm = (props: any) => {
  return (
    <FormWithRedirect
      validate={validatePasswords}
      {...props}
      render={(formProps: any) => (
        <Card>
          <form>
            <CardContent>
              <SectionTitle label="resources.suppliers.fieldGroups.avatar" />
              <ImageInput
                format={formatImage}
                source="image"
                label=""
                accept="image/*"
                placeholder={<p>Drop your file here</p>}
              >
                <ImageField source="src" title="title" />
              </ImageInput>
              <Separator />
              <SectionTitle label="resources.suppliers.fieldGroups.identity" />
              <TextInput
                source="reference"
                validate={validateReference(props)}
              />
              <Box display={{ xs: "block", sm: "flex" }}>
                <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
                  <TextInput
                    source="name"
                    resource="suppliers"
                    validate={requiredValidate}
                    fullWidth
                  />
                </Box>
                <Box flex={1} ml={{ xs: 0, sm: "0.5em" }}>
                  <TextInput
                    source="attention"
                    resource="suppliers"
                    fullWidth
                  />
                </Box>
              </Box>
              <TextInput
                type="email"
                source="email"
                resource="suppliers"
                validate={validateEmail}
                fullWidth
              />
              <Box display={{ xs: "block", sm: "flex" }}>
                <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
                  <TextInput
                    source="phone_no"
                    resource="suppliers"
                    fullWidth
                    helperText={false}
                  />
                </Box>
                <Box flex={2} ml={{ xs: 0, sm: "0.5em" }} />
              </Box>
              <Separator />
              <SectionTitle label="resources.suppliers.fieldGroups.address" />
              <TextInput
                source="address"
                resource="suppliers"
                multiline
                fullWidth
                helperText={false}
              />
              <Box display={{ xs: "block", sm: "flex" }}>
                <Box flex={2} mr={{ xs: 0, sm: "0.5em" }}>
                  <TextInput source="city" resource="suppliers" fullWidth />
                </Box>
                <Box flex={1} mr={{ xs: 0, sm: "0.5em" }}>
                  <TextInput
                    source="state"
                    resource="suppliers"
                    fullWidth
                    helperText={false}
                  />
                </Box>
                <Box flex={2}>
                  <TextInput
                    source="zipcode"
                    resource="suppliers"
                    fullWidth
                    helperText={false}
                  />
                </Box>
              </Box>
              <Separator />
              <SectionTitle label="resources.suppliers.fieldGroups.other_details" />
              <Labeled label="resources.suppliers.fields.product_set">
                <ReferenceManyField
                  reference="products"
                  target="supplier"
                  resource="suppliers"
                  perPage={20}
                  fullWidth
                >
                  <Datagrid>
                    <ThumbnailField />
                    <ProductRefField source="name" />
                    <TextField source="unit" />
                    <PriceField source="cost" />
                    <PriceField source="unit_price" />
                    <NumberField source="stock" />
                    <NumberField source="sales" />
                    <ReferenceField source="category" reference="categories">
                      <NameField {...props} />
                    </ReferenceField>
                    <EditButton />
                  </Datagrid>
                </ReferenceManyField>
              </Labeled>
            </CardContent>
            <Toolbar
              resource="suppliers"
              record={formProps.record}
              basePath={formProps.basePath}
              undoable={true}
              invalid={formProps.invalid}
              handleSubmit={formProps.handleSubmit}
              saving={formProps.saving}
              pristine={formProps.pristine}
            />
          </form>
        </Card>
      )}
    />
  );
};

const requiredValidate = required();
const validateEmail = email();
const validateReferenceUnicity = (props: any) =>
  validateUnicity({
    reference: "suppliers",
    source: "reference",
    record: props.record,
    message: "resources.suppliers.validation.reference_already_used",
  });
const validateReference = memoize((props: any) => [
  requiredValidate,
  validateReferenceUnicity(props),
]);

export default SupplierEdit;

// TODO: password field
/*
<Typography variant="h6" gutterBottom>
  {translate(
    'resources.suppliers.fieldGroups.change_password'
  )}
</Typography>
<Box display={{ xs: 'block', sm: 'flex' }}>
  <Box flex={1} mr={{ xs: 0, sm: '0.5em' }}>
    <PasswordInput
      source="password"
      resource="suppliers"
      fullWidth
    />
  </Box>

  <Box flex={1} ml={{ xs: 0, sm: '0.5em' }}>
    <PasswordInput
      source="confirm_password"
      resource="suppliers"
      fullWidth
    />
  </Box>
</Box>
*/

// TODO: agent fields
/*
<div>
  <SegmentsInput fullWidth />
</div>
*/
