import { useNotify, useRefresh } from 'react-admin';

import { getErrorMessage } from '..';

const useOnFailure = () => {
  const notify = useNotify();
  const refresh = useRefresh();

  return (error: any) => {
    notify(
      typeof error === 'string'
        ? error
        : getErrorMessage(error) || 'ra.notification.http_error',
      'warning'
    );

    refresh();
  };
};

export default useOnFailure;
