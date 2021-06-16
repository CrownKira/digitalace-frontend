import { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core/styles';
import EmailIcon from '@material-ui/icons/Email';
import DomainIcon from '@material-ui/icons/Domain';
import GroupIcon from '@material-ui/icons/Group';
import { EditButton, Identifier, EmailField, TextField } from 'react-admin';

import { IconText } from '../utils/components/IconText';
import AvatarField from './AvatarField';
// import ColoredNumberField from './ColoredNumberField';
import { Employee } from '../types';

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
  data?: { [key: string]: Employee };
  basePath?: string;
}

const MobileGrid: FC<Props> = ({ ids, data, basePath }) => {
  const classes = useStyles();

  if (!ids || !data) {
    return null;
  }

  return (
    <div className={classes.root}>
      {ids.map((id) => (
        // TODO: make it expandable
        // https://material-ui.com/components/cards/#complex-interaction
        <Card key={id} className={classes.card}>
          <CardHeader
            title={
              <div className={classes.cardTitleContent}>
                <h2>{data[id].name}</h2>
                <EditButton
                  resource="employees"
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
            <IconText
              text={
                <TextField
                  // TODO: custom field (link to edit)
                  record={data[id]}
                  source="department"
                />
              }
            >
              <DomainIcon color="secondary" />
            </IconText>
            <IconText
              text={
                <TextField
                  // TODO: custom field (link to edit)
                  source="roles"
                />
              }
            >
              <GroupIcon color="secondary" />
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
