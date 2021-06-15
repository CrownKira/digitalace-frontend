import { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import ImageIcon from '@material-ui/icons/Image';
import { FieldProps } from 'react-admin';
import { Product } from '../types';

export const imageStyles = makeStyles({
  root: { display: 'inline-block', marginTop: '1em', zIndex: 2 },
  content: { padding: 0, '&:last-child': { padding: 0 } },
  img: {
    width: 'initial',
    minWidth: 'initial',
    maxWidth: '42em',
    maxHeight: '15em',
  },
});

const Image: FC<FieldProps<Product>> = ({ record }) => {
  const classes = imageStyles();

  if (!record) return null;

  return record.image?.src ? (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <img src={record.image?.src} alt="" className={classes.img} />
      </CardContent>
    </Card>
  ) : (
    <ImageIcon color="disabled" />
  );
};

export default Image;
