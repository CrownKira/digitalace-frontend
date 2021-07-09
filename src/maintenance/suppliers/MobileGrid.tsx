import { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import { EditButton, Identifier, EmailField, TextField } from 'react-admin';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import { IconText } from '../../utils/components/IconText';
import AvatarField from './AvatarField';
import ColoredNumberField from './ColoredNumberField';
import { Supplier } from '../../types';

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
  data?: { [key: string]: Supplier };
  basePath?: string;
}

export const MobileGrid: FC<Props> = ({ ids, data, basePath }) => {
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
                <h2>{data[id].name}</h2>
                <EditButton
                  resource="suppliers"
                  basePath={basePath}
                  record={data[id]}
                />
              </div>
            }
            avatar={<AvatarField record={data[id]} size="45" />}
          />
          <CardContent className={classes.cardContent}>
            <IconText text={<EmailField record={data[id]} source="email" />}>
              <EmailIcon color="secondary" />
            </IconText>
            <IconText text={<TextField record={data[id]} source="phone_no" />}>
              <PhoneIcon color="secondary" />
            </IconText>
            <IconText
              text={<ColoredNumberField record={data[id]} source="payables" />}
            >
              <AttachMoneyIcon color="secondary" />
            </IconText>
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

/*
// TODO: agent field
// https://marmelab.com/react-admin/Fields.html#referencemanyfield
{data[id].groups && data[id].groups.length > 0 && (
  <CardContent className={classes.cardContent}>
    <SegmentsField record={data[id]} />
  </CardContent>
)}
*/
