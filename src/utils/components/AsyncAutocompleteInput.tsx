import React, { FC, useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from "@material-ui/lab/Autocomplete";
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
} from "react-admin";
import EditIcon from "@material-ui/icons/EditTwoTone";
import { IconButton } from "@material-ui/core";

// TODO: write js doc
// TODO: show top results if empty
// TODO: add renderOption
// TODO: remove optionValue? since we only query using id?
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
  perPage = 5,
  sort = { field: "id", order: "DESC" },
  reference,
  /**
   * AutocompleteInput props
   */
  optionText = "name",
  optionValue = "id", // this value is used to fetch data
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
  onChange: originalOnChangeHandler,
  onInputChange: onInputChangeOverride,
  wait = 300, // debounce timeout
  showEdit = true,
  showSuggestions = true,
  suggestionsCount = 5,
  onInit,
  cache,
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
    type: "text",
    validate,
    ...props,
  });

  /**
   * manage the value here instead of letting useInput do it
   */
  const [
    autocompleteValue, // selected value
    setAutocompleteValue,
  ] = useState<Record | null>(null);
  const [
    inputValue, // input value
    setInputValue,
  ] = useState("");
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
              if (response) {
                callback(response.data);
              }
            })
            .catch((error: Error) => {
              notify(
                "pos.async_autocomplete_input.data_provider_error",
                "warning"
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

  const valueIsConsistent = useCallback(() => {
    return !(
      (
        input.value &&
        autocompleteValue &&
        autocompleteValue[optionValue] !== input.value
      ) // unequal values indicate components being swapped
    );
  }, [autocompleteValue, input.value, optionValue]);

  const dataIsFetched = useCallback(() => {
    return !(
      (input.value && !autocompleteValue) // autocompleteValue not set then data is not fetched
    );
  }, [autocompleteValue, input.value]);
  const valueIsCorrupted = useCallback(() => {
    /**
     * if autocompleteValue exists, then input.value must exist (see onChange below)
     * contrapositive: if input.value doesn't exist, autocompleteValue must not exist
     * a -> b
     * ~b -> ~a
     * not corrupted: b or ~a
     * corrupted: ~b and a
     */
    return !input.value && autocompleteValue;
  }, [autocompleteValue, input.value]);
  const fetchFromCache = useCallback(() => {
    if (input.value === undefined) {
      return;
    }

    if (cache) {
      const option = cache.get(input.value);
      if (option) {
        setAutocompleteOptions((autocompleteOptions) => [
          ...autocompleteOptions,
          option,
        ]);

        setInputValue(option[optionText]);
        setAutocompleteValue(option);
      }
    }
  }, [cache, input.value, optionText]);
  const pushToCache = useCallback(
    (option: Record | null) => {
      if (option && cache) {
        cache.set(option[optionValue], option);
      }
    },
    [cache, optionValue]
  );

  /**
   * fetch initial value for display of optionText
   * since input.value will be initialized before autocompleteValue
   */
  useEffect(() => {
    // https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
    let active = true;

    if (valueIsCorrupted()) {
      // reset if corrupted
      // may be caused by dnd
      setInputValue("");
      setAutocompleteValue(null);
      return;
    }

    if (!valueIsConsistent()) {
      if (cache) {
        fetchFromCache();
        return;
      }
    }

    if (dataIsFetched()) {
      return;
    }

    fetchFromCache(); // fetch from cache first to eliminate blink

    dataProvider
      .getOne(reference, { id: input.value })
      .then((response) => {
        if (active && response) {
          const result = response.data;

          setAutocompleteOptions((autocompleteOptions) => [
            ...autocompleteOptions,
            result,
          ]);

          setAutocompleteValue(result);
          pushToCache(result);

          if (onInit) {
            onInit(result);
          }
        }
      })
      .catch(() => {
        if (active) {
          notify("pos.async_autocomplete_input.data_provider_error", "warning");
        }
      });

    return () => {
      active = false;
    };
  }, [
    cache,
    dataIsFetched,
    dataProvider,
    fetchFromCache,
    input.value,
    notify,
    onInit,
    pushToCache,
    reference,
    valueIsConsistent,
    valueIsCorrupted,
  ]);

  useEffect(() => {
    // FIXME: eliminate additional api calls after invoice update
    let active = true;
    if (!showSuggestions && inputValue === "") {
      setAutocompleteOptions(autocompleteValue ? [autocompleteValue] : []);
      return;
    }

    fetch(inputValue, (results?: Record[]) => {
      if (active) {
        let newOptions = [] as Record[];
        if (autocompleteValue) {
          newOptions = [autocompleteValue];
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
  }, [autocompleteValue, inputValue, fetch, showSuggestions]);

  // FIXME: temporary blink
  return !(dataIsFetched() && valueIsConsistent()) ? (
    <LinearProgress />
  ) : (
    <Autocomplete
      options={autocompleteOptions}
      getOptionLabel={(option) => option[optionText]}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={autocompleteValue}
      inputValue={inputValue} // overrides TextField value
      onChange={(event, newValue: Record | null, reason, details) => {
        // set options
        setAutocompleteOptions(
          newValue ? [newValue, ...autocompleteOptions] : autocompleteOptions
        );
        // set input.value (register to the formContext )
        onChange(newValue ? newValue[optionValue] : "");
        // set autocompleteValue
        setAutocompleteValue(newValue);
        pushToCache(newValue);
        // original onChange handler
        if (originalOnChangeHandler) {
          originalOnChangeHandler(event, newValue, reason, details);
        }
      }}
      onInputChange={(event, newInputValue) => {
        // set inputValue
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
              label !== "" &&
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
  extends Omit<ReferenceInputProps, "children"> {
  filter?: any;
  optionText: any;
  optionValue: any;
  queryParamName?: string;
  onChange?: (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: Record | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Record> | undefined
  ) => void;

  onInputChange?: (event: any) => void;
  wait?: number;
  showSuggestions?: boolean;
  suggestionsCount?: number;
  onInit?: (value: Record | null) => void;
  cache?: Map<number, Record>;
}

AsyncAutocompleteInput.defaultProps = {
  options: {},
  filter: {},
  perPage: 5,
  sort: { field: "id", order: "DESC" },
  optionText: "name",
  optionValue: "id",
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
