import { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import { DateField, EditButton, useTranslate, Identifier } from 'react-admin';

import AvatarField from './AvatarField';
import ColoredNumberField from './ColoredNumberField';
import { Customer } from '../types';

const useStyles = makeStyles((theme) => ({
  root: { margin: '1em' },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: '0.5rem 0',
  },
  cardTitleContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    ...theme.typography.body1,
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface Props {
  ids?: Identifier[];
  data?: { [key: string]: Customer };
  basePath?: string;
}

const MobileGrid: FC<Props> = ({ ids, data, basePath }) => {
  const translate = useTranslate();
  const classes = useStyles();

  if (!ids || !data) {
    return null;
  }

  return (
    <div className={classes.root}>
      {ids.map((id) => (
        <Card key={id} className={classes.card}>
          <CardHeader
            title={
              <div className={classes.cardTitleContent}>
                <h2>{`${data[id].first_name} ${data[id].last_name}`}</h2>
                <EditButton
                  resource="customers"
                  basePath={basePath}
                  record={data[id]}
                />
              </div>
            }
            avatar={<AvatarField record={data[id]} size="45" />}
          />
          <CardContent className={classes.cardContent}>
            <div>
              {translate('resources.customers.fields.last_seen_gte')}
              &nbsp;
              <DateField record={data[id]} source="last_seen" />
            </div>
            <div>
              {translate('resources.customers.fields.receivables')}
              &nbsp;:&nbsp;
              <ColoredNumberField
                record={data[id]}
                source="receivables"
                options={{ style: 'currency', currency: 'SGD' }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

MobileGrid.defaultProps = {
  data: {},
  ids: [],
};

export default MobileGrid;

/*
// TODO: agent field
// https://marmelab.com/react-admin/Fields.html#referencemanyfield
{data[id].groups && data[id].groups.length > 0 && (
  <CardContent className={classes.cardContent}>
    <SegmentsField record={data[id]} />
  </CardContent>
)}
*/
