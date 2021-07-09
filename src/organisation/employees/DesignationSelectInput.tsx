import { FC } from 'react';
import { SelectInput, InputProps, required } from 'react-admin';

interface Props extends Omit<InputProps, 'source'> {
  // TODO: provide default source?
}

export const DesignationSelectInput: FC<Props> = ({ record }) => (
  <SelectInput
    // injected props not needed here since resource can be derived from location
    // qn: how is label derived?
    // component is eval to react native component
    // resource is deduced from the location?
    source="designation"
    choices={record ? record.designation_set : []}
    validate={record ? requiredValidate : null}
  />
);

const requiredValidate = required();

/*
rest:
record: { id: 32, name: "Department5", image: {…}, designation_set: (1) […] }
basePath: "/employees"
id: undefined
margin: undefined
resource: "departments"
translateChoice: false
variant: undefined
*/
