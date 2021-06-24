import React, { useEffect } from 'react';
import { useForm } from 'react-final-form';
import { AutocompleteArrayInput } from 'react-admin';

const AutoConsole = () => {
  const form = useForm();
  useEffect(() => {
    form.change('category', ['whattt']);
  }, []);
  return (
    <AutocompleteArrayInput
      source="category"
      choices={[
        {
          id: 'programming',
          name: 'Programming',
          sex: 'mamamiya',
        },
        { id: 'lifestyle', name: 'Lifestyle', sex: 'helloooo' },
        { id: 'photography', name: 'Photography', sex: 'whattt' },
      ]}
      optionValue="sex"
    />
  );
};

export default AutoConsole;
