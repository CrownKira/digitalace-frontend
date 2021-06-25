import { FC, useState, useMemo, useEffect } from 'react';
import debounce from 'lodash/debounce';
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@material-ui/lab/Autocomplete';
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

// TODO: rewrite
// TODO: add loading icon
// TODO: add allowEmpty
// https://material-ui.com/components/autocomplete/#google-maps-place
export const AsyncAutocompleteInput: FC<AsyncAutocompleteInputProps> = ({
  // TextInputProps
  // use this instead of AutocompleteInputProps since most of them are not needed here
  label,
  format,
  helperText,
  onBlur,
  onFocus,
  options,
  parse,
  // source and resource: only used for title
  resource,
  source,
  validate,
  // ReferenceInputProps
  filter = {},
  filterToQuery = (searchText) => (searchText ? { search: searchText } : {}),
  perPage = 25,
  sort = { field: 'id', order: 'DESC' },
  reference,
  // AutocompleteInput props
  optionText = 'name',
  optionValue = 'id',
  // props passed to MUIAutocomplete
  // override props produced by useInput()
  className,
  fullWidth,
  onChange: onChangeOverride = (event, newValue) => {},
  ...props
}) => {
  const {
    input,
    isRequired,
    meta: { error, submitError, touched },
  } = useInput({
    format,
    onBlur,
    onFocus,
    parse,
    resource,
    source,
    type: 'text',
    validate,
    ...props,
  });

  // manage the value here instead of letting useInput do it
  // the selected value
  const [valueOverride, setValueOverride] = useState<Record | null>(null);
  // the input value
  const [inputValue, setInputValue] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<Record[]>([]);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const fetch = useMemo(
    // TODO: use debounce instead?
    () =>
      debounce(
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
        150
      ),
    [dataProvider, filter, filterToQuery, notify, perPage, reference, sort]
  );

  useEffect(() => {
    let active = true;
    if (inputValue === '') {
      setAutocompleteOptions(valueOverride ? [valueOverride] : []);
      return undefined;
    }

    fetch(inputValue, (results?: Record[]) => {
      if (active) {
        let newOptions = [] as Record[];
        if (valueOverride) {
          newOptions = [valueOverride];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setAutocompleteOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [valueOverride, inputValue, fetch]);

  return (
    <Autocomplete
      options={autocompleteOptions}
      getOptionLabel={(option) => option[optionText]}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={valueOverride}
      inputValue={inputValue}
      onChange={(event, newValue: Record | null, reason, details) => {
        setAutocompleteOptions(
          newValue ? [newValue, ...autocompleteOptions] : autocompleteOptions
        );
        onChangeOverride(event, newValue, reason, details);
        newValue && input.onChange(newValue[optionValue]);
        setValueOverride(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      className={className}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <ResettableTextField
          // qn: is onChange and value safe here
          // will it be overridden by autocomplete wrapper?
          // onChange={onChangeOverride}
          {...input}
          label={
            label !== '' &&
            label !== false && (
              <FieldTitle
                // TODO: translate array input source label
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
          {...options}
          {...sanitizeInputRestProps(input)}
          {...params}
        />
      )}
    />
  );
};

export interface AsyncAutocompleteInputProps
  extends Omit<TextInputProps, 'onChange'> {
  filter?: any;
  filterToQuery?: (filter: string) => any;
  perPage?: number;
  reference: string;
  optionText: any;
  optionValue: any;
  onChange?:
    | ((
        event: React.ChangeEvent<{}>,
        value: Record | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<Record> | undefined
      ) => void)
    | undefined;
  [key: string]: any;
}

AsyncAutocompleteInput.defaultProps = {
  options: {},
  filter: {},
  filterToQuery: (searchText) => (searchText ? { q: searchText } : {}),
  perPage: 25,
  sort: { field: 'id', order: 'DESC' },
  optionText: 'name',
  optionValue: 'id',
  onChange: (event, newValue) => {},
};

/*
input:
onChange:
checked: undefined
name: "salesperson"
onBlur: ƒ (event)
onFocus: ƒ (event)
type: "text"
value: ""
*/

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
