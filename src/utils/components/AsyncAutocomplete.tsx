import React, { FC } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import throttle from 'lodash/throttle';
import { useInput, TextInputProps } from 'react-admin';

import { Customer } from '../../types';
import backend from '../../dataProvider/backend';

export const AsyncAutocomplete: FC<TextInputProps> = (props) => {
  const {
    input: { name, onChange: customOnChange, value, ...rest },
    meta: { touched, error },
    isRequired,
  } = useInput(props);

  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<Customer[]>([]);

  const fetch = React.useMemo(
    () =>
      throttle(
        async (
          request: { input: string },
          callback: (results?: Customer[]) => void
        ) => {
          try {
            const response = await backend.get(
              `/api/customers/?ordering=-id&page=1&page_size=25&search=${request}`
            );

            if (response.status < 200 || response.status >= 300)
              throw new Error();

            callback(response.data);
          } catch (error) {
            // TODO: change error
            throw new Error('ra.auth.sign_in_error');
          }
        },
        200
      ),
    []
  );

  React.useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    // TODO: use type parameter
    fetch({ input: inputValue }, (results?: Customer[]) => {
      if (active) {
        let newOptions = [] as Customer[];
        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      // TODO: remove this
      getOptionLabel={(option) => option.name}
      // filterOptions={(x)=>x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event: any, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        customOnChange(event); // will set value for us?
        // setValue(newValue)
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={props.label}
          error={!!(touched && error)}
          helperText={touched && error}
          required={isRequired}
          variant="outlined"
          fullWidth
          {...rest}
        />
      )}
    />
  );
};
