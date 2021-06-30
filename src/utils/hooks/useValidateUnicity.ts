import { useNotify, useDataProvider, Record } from 'react-admin';

import { memoize } from '..';

interface Props {
  reference: string;
  source: string;
  record?: Record;
  message: string;
}

const useValidateUnicity = ({ reference, source, record, message }: Props) => {
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const checkSourceIsUnique = memoize(
    async (value: string): Promise<boolean> => {
      try {
        const response = await dataProvider.getList(reference, {
          pagination: { page: 1, perPage: 2 },
          sort: { field: 'id', order: 'DESC' },
          filter: { [source]: value },
        });
        return (
          response &&
          response.data.length < 2 &&
          (response.data.length === 0 ||
            (record !== undefined && response.data[0].id === record.id))
        );
      } catch (error) {
        notify('pos.use_validate_unicity.data_provider_error', 'warning');
        return false;
      }
    }
  );

  return memoize(async (value: string) => {
    const isSourceUnique = await checkSourceIsUnique(value);
    if (!isSourceUnique) {
      return {
        message,
        args: { [source]: value },
      };
    }
  });
};

export default useValidateUnicity;
