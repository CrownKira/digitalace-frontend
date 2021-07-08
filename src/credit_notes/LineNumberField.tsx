import { FC } from 'react';
import {
  TextField,
  TextFieldProps,
  FormDataConsumerRenderParams,
  Labeled,
} from 'react-admin';

interface Props extends TextFieldProps, FormDataConsumerRenderParams {
  inputClassName?: string | undefined;
}

const LineNumberField: FC<Props> = ({
  formData,
  scopedFormData,
  getSource,
  inputClassName,
  label,
  ...rest
}) => {
  return (
    // FIXME: label doesn't work if passed to TextField
    <Labeled label={label}>
      <TextField
        {...rest}
        className={inputClassName}
        source="total_lines"
        record={{
          // TODO: better way to mock record?
          id: 1,
          total_lines: formData.creditnoteitem_set?.length || 0,
        }}
      />
    </Labeled>
  );
};

LineNumberField.defaultProps = {};

export default LineNumberField;

/*
injected props:
node_modules/ra-ui-materialui/src/field/types.ts

// Props injected by react-admin
export interface InjectedFieldProps<RecordType extends Record = Record> {
    basePath?: string;
    record?: RecordType;
    resource?: string;
}
*/
