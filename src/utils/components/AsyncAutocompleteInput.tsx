import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@material-ui/lab/Autocomplete';
import {
  useInput,
  useNotify,
  useDataProvider,
  Record,
  ResettableTextField,
  FieldTitle,
  InputHelperText,
  sanitizeInputRestProps,
  linkToRecord,
  LinearProgress,
  ReferenceInputProps,
} from 'react-admin';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';

// TODO: write js doc
// TODO: show top results if empty
// TODO: add renderOption
// https://material-ui.com/components/autocomplete/#google-maps-place
export const AsyncAutocompleteInput: FC<AsyncAutocompleteInputProps> = ({
  /**
   * TextInputProps
   * use this instead of AutocompleteInputProps since most of them are not needed here
   */
  label,
  format,
  helperText,
  onBlur,
  onFocus,
  options,
  parse,
  source, // source and resource: only used for title
  resource,
  validate,
  /**
   * ReferenceInputProps
   */
  filter = {},
  perPage = 25,
  sort = { field: 'id', order: 'DESC' },
  reference,
  /**
   * AutocompleteInput props
   */
  optionText = 'name',
  optionValue = 'id',
  /**
   * MUIAutocomplete props
   * override props produced by useInput()
   */
  className,
  fullWidth,
  InputProps: InputPropsOverride,
  /**
   * custom props
   */
  queryParamName,
  onChange: onChangeOverride = () => {},
  onInputChange: onInputChangeOverride = () => {},
  wait = 300, // debounce timeout
  showEdit = true,
  showSuggestions = true,
  suggestionsCount = 5,
  ...props
}) => {
  const {
    input: { onChange, ...input },
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

  /**
   * manage the value here instead of letting useInput do it
   */
  const [
    valueOverride, // selected value
    setValueOverride,
  ] = useState<Record | null>(null);

  const [
    inputValue, // input value
    setInputValue,
  ] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState<Record[]>([]);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const filterToQuery = useCallback(
    (searchText) =>
      searchText
        ? { [`${queryParamName || optionText}__icontains`]: searchText }
        : {},
    [optionText, queryParamName]
  );

  const fetch = useMemo(
    () =>
      debounce(
        async (request: string, callback: (results?: Record[]) => void) => {
          dataProvider
            .getList(reference, {
              pagination: {
                page: 1,
                perPage:
                  !showSuggestions || request ? perPage : suggestionsCount,
              },
              sort,
              filter: { ...filterToQuery(request), ...filter },
            })
            .then((response) => {
              response && callback(response.data);
            })
            .catch((error: Error) => {
              notify(
                'pos.async_autocomplete_input.data_provider_error',
                'warning'
              );
            });
        },
        wait
      ),
    [
      dataProvider,
      filter,
      filterToQuery,
      notify,
      perPage,
      reference,
      showSuggestions,
      sort,
      suggestionsCount,
      wait,
    ]
  );

  /**
   * fetch initial value for display of optionText
   * since input.value will be initialized before valueOverride
   */
  useEffect(() => {
    if (
      inputValue || // presence means value has already been fetched
      valueOverride || // presence means value has already been fetched
      !input.value || // undefined means initial value from record is undefined
      isNaN(input.value) // eg. 'hello', {}, etc
    ) {
      return;
    }

    dataProvider
      .getOne(reference, { id: input.value })
      .then((response) => {
        response && setValueOverride(response.data);
      })
      .catch((error: Error) => {
        notify('pos.async_autocomplete_input.data_provider_error', 'warning');
      });
  }, [dataProvider, input.value, inputValue, notify, reference, valueOverride]);

  useEffect(() => {
    // FIXME: eliminate additional api calls after invoice update
    let active = true;
    if (!showSuggestions && inputValue === '') {
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
  }, [valueOverride, inputValue, fetch, showSuggestions]);

  return input.value && !valueOverride ? (
    <LinearProgress />
  ) : (
    <Autocomplete
      options={autocompleteOptions}
      getOptionLabel={(option) => option[optionText]}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={valueOverride}
      inputValue={inputValue} // overrides TextField value
      onChange={(event, newValue: Record | null, reason, details) => {
        setAutocompleteOptions(
          newValue ? [newValue, ...autocompleteOptions] : autocompleteOptions
        );
        onChangeOverride(event, newValue, reason, details);
        onChange(newValue ? newValue[optionValue] : '');
        setValueOverride(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }} // merged with TextField onChange, invoked before TextField onChange
      className={className}
      fullWidth={fullWidth}
      renderInput={(params) => {
        const { InputProps, ...rest } = params;

        return (
          /**
           * from TextInput.tsx
           */
          <ResettableTextField
            {...input}
            onChange={onInputChangeOverride}
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
                // TODO: get rid of undefined from boolean | undefined
                touched={!!touched}
                error={error || submitError}
                helperText={helperText}
              />
            }
            {...options}
            {...sanitizeInputRestProps(input)}
            {...rest}
            InputProps={{
              ...InputProps,
              startAdornment:
                showEdit && input.value ? (
                  <IconButton
                    size="small"
                    color="primary"
                    component={Link}
                    to={linkToRecord(`/${reference}`, input.value)}
                  >
                    <EditIcon />
                  </IconButton>
                ) : null,

              ...InputPropsOverride,
            }}
          />
        );
      }}
    />
  );
};

export interface AsyncAutocompleteInputProps
  extends Omit<ReferenceInputProps, 'children'> {
  filter?: any;
  optionText: any;
  optionValue: any;
  queryParamName?: string;
  onChange?:
    | ((
        event: React.ChangeEvent<{}>,
        value: Record | null,
        reason: AutocompleteChangeReason,
        details?: AutocompleteChangeDetails<Record> | undefined
      ) => void)
    | undefined;
  onInputChange?: (event: any) => void;
  wait?: number;
  showSuggestions?: boolean;
  suggestionsCount?: number;
}

AsyncAutocompleteInput.defaultProps = {
  options: {},
  filter: {},
  perPage: 25,
  sort: { field: 'id', order: 'DESC' },
  optionText: 'name',
  optionValue: 'id',
  onChange: () => {},
  onInputChange: () => {},
  wait: 300,
  showEdit: true,
  showSuggestions: true,
  suggestionsCount: 5,
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
