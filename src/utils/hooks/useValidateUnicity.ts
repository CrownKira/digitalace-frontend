import { useNotify, useDataProvider, Record } from 'react-admin';

interface Props {
  reference: string;
  source: string;
  record?: Record;
  message: string;
}

const useValidateUnicity = ({ reference, source, record, message }: Props) => {
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const checkSourceIsUnique = async (value: string): Promise<boolean> => {
    try {
      const response = await dataProvider.getList(reference, {
        pagination: { page: 1, perPage: 2 },
        sort: { field: 'id', order: 'DESC' },
        filter: { [source]: value },
      });
      return (
        response.data.length < 2 &&
        (response.data.length === 0 ||
          (record !== undefined && response.data[0].id === record.id))
      );
    } catch (error) {
      // TODO: notify more specific error
      notify('ra.notification.data_provider_error', 'warning');
      return false;
    }
  };

  return async (value: string) => {
    const isEmailUnique = await checkSourceIsUnique(value);
    if (!isEmailUnique) {
      return {
        message,
        args: { [source]: value },
      };
    }
  };
};

export default useValidateUnicity;
