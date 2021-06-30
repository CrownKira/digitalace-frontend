import { FC } from 'react';
import { SelectInput, TextFieldProps, required } from 'react-admin';

interface Props extends TextFieldProps {
  formData: any;
}

const DesignationSelectInput: FC<Props> = ({ formData, record, ...rest }) => {
  return (
    <SelectInput
      // qn: how is label derived?
      // look at source and resource of innermost component?
      source="designation"
      choices={record ? record.designation_set : []}
      validate={record ? requiredValidate : null}
    />
  );
};

const requiredValidate = required();

export default DesignationSelectInput;

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
