import { FC } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useInput, InputProps, useTranslate } from 'react-admin';
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from './actions';
import { AppState } from '../types';

const useStyles = makeStyles({
  label: { width: '10em', display: 'inline-block' },
  button: { margin: '1em' },
});

interface Props extends InputProps {}

export const ThemeSelectInput: FC<Props> = (props) => {
  const classes = useStyles();
  const { input } = useInput(props);
  const dispatch = useDispatch();
  const translate = useTranslate();
  const theme = useSelector((state: AppState) => state.theme);

  return (
    <>
      <div className={classes.label}>{translate('pos.theme.name')}</div>
      <Button
        variant="contained"
        className={classes.button}
        color={theme === 'light' ? 'primary' : 'default'}
        onClick={() => {
          input.onChange('light');
          dispatch(changeTheme('light'));
        }}
      >
        {translate('pos.theme.light')}
      </Button>
      <Button
        variant="contained"
        className={classes.button}
        color={theme === 'dark' ? 'primary' : 'default'}
        onClick={() => {
          input.onChange('dark');
          dispatch(changeTheme('dark'));
        }}
      >
        {translate('pos.theme.dark')}
      </Button>
    </>
  );
};
