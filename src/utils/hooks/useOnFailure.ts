import { useNotify, useRefresh } from 'react-admin';

import { getFieldError } from '..';

const useOnFailure = () => {
  const notify = useNotify();
  const refresh = useRefresh();

  return (error: any) => {
    notify(
      typeof error === 'string'
        ? error
        : getFieldError(error) || 'ra.notification.http_error',
      'warning'
    );

    refresh();
  };
};

export default useOnFailure;
