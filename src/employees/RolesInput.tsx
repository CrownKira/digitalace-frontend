import { FC } from 'react';
import {
  SelectArrayInput,
  InputProps,
  ReferenceArrayInput,
  ChipField,
} from 'react-admin';

interface Props extends Omit<InputProps, 'source'> {
  source: string;
}

const RolesInput: FC<Props> = ({ addField, ...rest }) => (
  <ReferenceArrayInput {...rest} reference="roles">
    <SelectArrayInput>
      <ChipField source="name" />
    </SelectArrayInput>
  </ReferenceArrayInput>
);

RolesInput.defaultProps = {
  addField: true,
  source: 'roles',
  resource: 'employees',
};

export default RolesInput;
