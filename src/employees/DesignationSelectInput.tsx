import { FC } from 'react';
import {
  SelectInput,
  LinearProgress,
  useGetOne,
  FormDataConsumerRenderParams,
  required,
} from 'react-admin';

const DesignationSelectInput: FC<FormDataConsumerRenderParams> = ({
  formData,
  ...rest
}) => {
  // here we assume that department is defined
  // since we cannot conditionally invoke useGetOne
  // we have to make sure to pass in formData in which department is defined
  const { data, loading } = useGetOne('departments', formData.department);

  return loading || !data ? (
    <LinearProgress />
  ) : (
    <SelectInput
      {...rest}
      source="designation"
      choices={data.designation_set}
      validate={data.designation_set.length > 0 ? requiredValidate : null}
    />
  );
};

const requiredValidate = required();

export default DesignationSelectInput;
