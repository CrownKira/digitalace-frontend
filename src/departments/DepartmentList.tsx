import { FC } from 'react';
import { EditButton, List, ListProps, useListContext } from 'react-admin';
import inflection from 'inflection';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LinkToRelatedEmployees from './LinkToRelatedEmployees';
import { Department } from '../types';

const useStyles = makeStyles({
  root: {
    marginTop: '1em',
  },
  media: {
    height: 140,
  },
  title: {
    paddingBottom: '0.5em',
  },
  actionSpacer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
});

const DepartmentGrid: FC = (props) => {
  const classes = useStyles(props);
  const { data, ids } = useListContext<Department>();
  return ids ? (
    <Grid container spacing={2} className={classes.root}>
      {ids.map((id) => (
        <Grid key={id} xs={12} sm={6} md={4} lg={3} xl={2} item>
          <Card>
            <CardMedia
              component="img"
              image={data[id].image?.src}
              title={data[id].image?.title}
              className={classes.media}
            />
            <CardContent className={classes.title}>
              <Typography variant="h5" component="h2" align="center">
                {inflection.humanize(data[id].name)}
              </Typography>
            </CardContent>
            <CardActions
              classes={{
                spacing: classes.actionSpacer,
              }}
            >
              <LinkToRelatedEmployees record={data[id]} />
              <EditButton basePath="/departments" record={data[id]} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  ) : null;
};

const DepartmentList: FC<ListProps> = (props) => (
  <List
    {...props}
    sort={{ field: 'name', order: 'ASC' }}
    perPage={25}
    component="div"
  >
    <DepartmentGrid />
  </List>
);

export default DepartmentList;
