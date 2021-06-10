import { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ImageIcon from '@material-ui/icons/Image';
import { FieldProps } from 'react-admin';
import { Product } from '../types';
import { imageStyles } from './Image';

const Thumbnail: FC<FieldProps<Product>> = ({ record }) => {
  const classes = imageStyles();

  if (!record) return null;

  return record.thumbnail ? (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <img src={record.thumbnail} alt="" className={classes.img} />
      </CardContent>
    </Card>
  ) : (
    <ImageIcon color="disabled" />
  );
};

export default Thumbnail;