import { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import {
  useShowController,
  FieldProps,
  ReferenceField,
  TextField,
} from 'react-admin';

import Basket from './Basket';
import { Receive, Supplier } from '../types';

const SupplierField: FC<FieldProps<Supplier>> = ({ record }) =>
  record ? (
    <Typography>
      {record.first_name} {record.last_name}
      <br />
      {record.address}
      <br />
      {record.city}
      {record.zipcode ? `, ${record.zipcode}` : ''}
    </Typography>
  ) : null;

const ReceiveShow = (props: any) => {
  const { record } = useShowController<Receive>(props);
  const classes = useStyles();

  if (!record) return null;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              {record.company_name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="right">
              Receive {record.reference}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} container alignContent="flex-end">
            <ReferenceField
              reference="suppliers"
              resource="receives"
              source="supplier"
              link={false}
              basePath="/receives"
              record={record}
            >
              <SupplierField />
            </ReferenceField>
          </Grid>
        </Grid>
        <div className={classes.spacer}>&nbsp;</div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom align="center">
              Date{' '}
            </Typography>
            <Typography gutterBottom align="center">
              {new Date(record.date).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h6" gutterBottom align="center">
              Purchase Order
            </Typography>
            <TextField
              source="purchase_order"
              align="center"
              component="p"
              gutterBottom
            />
          </Grid>
        </Grid>
        <div className={classes.receives}>
          <Basket record={record} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiveShow;

const useStyles = makeStyles({
  root: { width: 600, margin: 'auto' },
  spacer: { height: 20 },
  receives: { margin: '10px 0' },
});
