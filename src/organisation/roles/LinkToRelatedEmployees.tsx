import { FC } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { useTranslate, FieldProps } from 'react-admin';
import { stringify } from 'query-string';

import { employees } from '../employees';
import { Role } from '../../types';

const useStyles = makeStyles({
  icon: { paddingRight: '0.5em' },
  link: {
    display: 'inline-flex',
    alignItems: 'center',
  },
});

export const LinkToRelatedEmployees: FC<FieldProps<Role>> = ({ record }) => {
  const translate = useTranslate();
  const classes = useStyles();
  return record ? (
    <Button
      size="small"
      color="primary"
      component={Link}
      to={{
        pathname: '/employees',
        search: stringify({
          filter: JSON.stringify({ roles: record.id }),
        }),
      }}
      className={classes.link}
    >
      <employees.icon className={classes.icon} />
      {translate('resources.roles.fields.user_set')}
    </Button>
  ) : null;
};
