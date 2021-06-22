import React, { FC } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import throttle from 'lodash/throttle';
import {
  useInput,
  TextInputProps,
  useNotify,
  useDataProvider,
  Record,
  ResettableTextField,
  FieldTitle,
  InputHelperText,
  sanitizeInputRestProps,
} from 'react-admin';

// TODO: reference ReferenceInput and AutocompleteInput
export const AsyncAutocompleteInput: FC<AsyncAutocompleteInputProps> = ({
  label,
  format,
  helperText,
  onBlur,
  onFocus,
  onChange,
  customOptions,
  parse,
  resource,
  source,
  validate,
  reference,
  filter = {},
  filterToQuery = (searchText) => (searchText ? { search: searchText } : {}),
  perPage = 25,
  sort = { field: 'id', order: 'DESC' },
  ...props
}) => {
  const {
    input: { onChange: customOnChange, ...rest },
    isRequired,
    meta: { error, submitError, touched },
  } = useInput({
    format,
    onBlur,
    onChange,
    onFocus,
    parse,
    resource,
    source,
    type: 'text',
    validate,
    ...props,
  });

  const [customValue, setCustomValue] = React.useState<Record | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<Record[]>([]);
  const notify = useNotify();

  const dataProvider = useDataProvider();

  const fetch = React.useMemo(
    () =>
      throttle(
        async (request: string, callback: (results?: Record[]) => void) => {
          dataProvider
            .getList(reference, {
              pagination: { page: 1, perPage },
              sort: { field: 'id', order: 'DESC' },

              filter: { ...filterToQuery(request), filter },
            })
            .then(({ data }: { data: Record[] }) => {
              callback(data);
            })
            .catch((error: Error) => {
              notify('pos.user_menu.profile.failure', 'warning');
            });
        },
        500
      ),
    [dataProvider, filter, filterToQuery, notify, perPage, reference]
  );

  React.useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setOptions(customValue ? [customValue] : []);
      return undefined;
    }

    fetch(inputValue, (results?: Record[]) => {
      if (active) {
        let newOptions = [] as Record[];
        if (customValue) {
          newOptions = [customValue];
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
  }, [customValue, inputValue, fetch]);

  return (
    <Autocomplete
      getOptionLabel={(option) => option.name}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={customValue}
      inputValue={inputValue}
      onChange={(event, newValue: Record | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        customOnChange(event);
        setCustomValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <ResettableTextField
          // qn: is onChange and value safe here
          // will it be overridden by autocomplete wrapper?
          onChange={customOnChange}
          {...rest}
          label={
            label !== '' &&
            label !== false && (
              <FieldTitle
                label={label}
                source={source}
                resource={resource}
                isRequired={isRequired}
              />
            )
          }
          error={!!(touched && (error || submitError))}
          helperText={
            <InputHelperText
              // qn: why need !! here but not in TextInput source code
              touched={!!touched}
              error={error || submitError}
              helperText={helperText}
            />
          }
          {...customOptions}
          {...sanitizeInputRestProps(rest)}
          {...params}
        />
      )}
    />
  );
};

export interface AsyncAutocompleteInputProps extends TextInputProps {
  filter?: { [key: string]: string };
  filterToQuery?: (filter: string) => any;
  perPage?: number;
  reference: string;
  [key: string]: any;
}

AsyncAutocompleteInput.defaultProps = {
  filter: {},
  filterToQuery: (searchText) => (searchText ? { q: searchText } : {}),
  perPage: 25,
  sort: { field: 'id', order: 'DESC' },
};

/*
params:
InputLabelProps: {id: "mui-20000-label", htmlFor: "mui-20000"}
InputProps: {className: "MuiAutocomplete-inputRoot", startAdornment: undefined, endAdornment: {…}, ref: ƒ}
disabled: false
fullWidth: true
id: "mui-20000"
inputProps: {className: "MuiAutocomplete-input MuiAutocomplete-inputFocused", disabled: false, id: "mui-20000", customValue: "", onBlur: ƒ, …}
size: undefined
*/

/*
rest:
checked: undefined
onBlur: ƒ (event)
onFocus: ƒ (event)
*/
