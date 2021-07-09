import { useNotify } from 'react-admin';

import { getErrorMessage } from '..';

export const useOnFailure = () => {
  const notify = useNotify();

  return (error: any) => {
    notify(
      typeof error === 'string'
        ? error
        : getErrorMessage(error) || 'ra.notification.http_error',
      'warning'
    );
  };
};
