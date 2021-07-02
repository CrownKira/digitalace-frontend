import { FC } from 'react';
import { SelectInput, ReferenceInput, InputProps } from 'react-admin';
import { useForm } from 'react-final-form';

interface Props extends Omit<InputProps, 'source'> {
  // use InputProps to take in injected props
  source?: string;
}

// use InputProps to take in injected props
// wrapper for department select input
const DepartmentSelectInput: FC<Props> = (props) => {
  // TODO: can just use formProps.form
  const form = useForm();

  return (
    <ReferenceInput
      source="department"
      reference="departments"
      allowEmpty
      onChange={() => {
        form.change('designation', '');
      }}
      {...props}
    >
      <SelectInput source="name" />
    </ReferenceInput>
  );
};

DepartmentSelectInput.defaultProps = {
  source: 'department',
};

export default DepartmentSelectInput;

/*
injected props:
basePath: "/employees"
className: "RaFormInput-input-216"
id: "department"
margin: undefined
record: Object { id: 30, email: "testuser3@gmail.com", name: "testuser3", … }
resource: "employees"
variant: undefined
*/
