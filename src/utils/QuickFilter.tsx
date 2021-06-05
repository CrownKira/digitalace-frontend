import { FC } from 'react';
import { Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { InputProps, useTranslate } from 'react-admin';

const useQuickFilterStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3),
  },
}));

const QuickFilter: FC<InputProps> = ({ label }) => {
  const translate = useTranslate();
  const classes = useQuickFilterStyles();

  return <Chip className={classes.root} label={translate(label)} />;
};

export default QuickFilter;
