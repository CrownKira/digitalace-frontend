import { FC, useState, useMemo, useEffect } from 'react';
import throttle from 'lodash/throttle';
import Autocomplete from '@material-ui/lab/Autocomplete';
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

// TODO: reference ReferenceInput, AutocompleteInput, TextInput
// TODO: add loading icon
// https://material-ui.com/components/autocomplete/#google-maps-place
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
  getOptionLabel = (option) => String(option.id),
  className,
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

  const [customValue, setCustomValue] = useState<Record | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<Record[]>([]);
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const fetch = useMemo(
    () =>
      throttle(
        async (request: string, callback: (results?: Record[]) => void) => {
          dataProvider
            .getList(reference, {
              pagination: { page: 1, perPage },
              sort,
              filter: { ...filterToQuery(request), ...filter },
            })
            .then(({ data }: { data: Record[] }) => {
              callback(data);
            })
            .catch((error: Error) => {
              notify('ra.notification.data_provider_error', 'warning');
            });
        },
        200
      ),
    [dataProvider, filter, filterToQuery, notify, perPage, reference, sort]
  );

  useEffect(() => {
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
      // fullWidth
      className={className}
      getOptionLabel={getOptionLabel}
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
  filter?: any;
  filterToQuery?: (filter: string) => any;
  perPage?: number;
  reference: string;
  getOptionLabel?: (option: Record) => string;
  [key: string]: any;
}

AsyncAutocompleteInput.defaultProps = {
  filter: {},
  filterToQuery: (searchText) => (searchText ? { q: searchText } : {}),
  perPage: 25,
  sort: { field: 'id', order: 'DESC' },
  getOptionLabel: (option) => String(option.id),
};

/*
params:
InputLabelProps: {id: "mui-49604-label", htmlFor: "mui-49604"}
InputProps: {className: "MuiAutocomplete-inputRoot", startAdornment: undefined, endAdornment: {…}, ref: ƒ}
disabled: false
fullWidth: true
id: "mui-49604"
inputProps: {className: "MuiAutocomplete-input MuiAutocomplete-inputFocused", disabled: false, id: "mui-49604", value: "", onBlur: ƒ, …}
size: undefined
*/

/*
InputProps:
className: "MuiAutocomplete-inputRoot"
endAdornment: {$$typeof: Symbol(react.element), type: "div", key: null, ref: null, props: {…}, …}
ref: ƒ ()
startAdornment: undefined
*/

/*
inputProps:
aria-activedescendant: null
aria-autocomplete: "both"
aria-controls: null
autoCapitalize: "none"
autoComplete: "off"
className: "MuiAutocomplete-input MuiAutocomplete-inputFocused"
disabled: false
id: "mui-22643"
onBlur: ƒ handleBlur(event)
onChange: ƒ handleInputChange(event)
onFocus: ƒ handleFocus(event)
onMouseDown: ƒ handleInputMouseDown(event)
ref: {current: input#mui-22643.MuiInputBase-input.MuiFilledInput-input.MuiAutocomplete-input.MuiAutocomplete-input…}
spellCheck: "false"
value: ""
*/

/*
rest:
checked: undefined
onBlur: ƒ (event)
onFocus: ƒ (event)
*/
