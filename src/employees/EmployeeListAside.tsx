import { FC } from 'react';
import inflection from 'inflection';
import { Card as MuiCard, CardContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import {
  FilterList,
  FilterLiveSearch,
  FilterListItem,
  useGetList,
} from 'react-admin';

import { Category } from '../types';

const Card = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      order: -1,
      width: '15em',
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))(MuiCard);

const Aside: FC = () => {
  const { data: departments, ids: departmentIDs } = useGetList<Category>(
    'departments',
    { page: 1, perPage: 100 },
    { field: 'name', order: 'ASC' },
    {}
  );
  const { data: designations, ids: designationIDs } = useGetList<Category>(
    'designations',
    { page: 1, perPage: 100 },
    { field: 'name', order: 'ASC' },
    {}
  );
  const { data: roles, ids: roleIDs } = useGetList<Category>(
    'roles',
    { page: 1, perPage: 100 },
    { field: 'name', order: 'ASC' },
    {}
  );
  return (
    <Card>
      <CardContent>
        <FilterLiveSearch />
        <FilterList
          label="resources.employees.filters.department"
          icon={<DirectionsWalkIcon />}
        >
          {departmentIDs &&
            departments &&
            departmentIDs.map((id: any) => (
              <FilterListItem
                label={inflection.humanize(departments[id].name)}
                key={departments[id].id}
                value={{ department: departments[id].id }}
              />
            ))}
        </FilterList>
        <FilterList
          label="resources.employees.filters.designation"
          icon={<DirectionsWalkIcon />}
        >
          {designationIDs &&
            designations &&
            designationIDs.map((id: any) => (
              <FilterListItem
                label={inflection.humanize(designations[id].name)}
                key={designations[id].id}
                value={{ designation: designations[id].id }}
              />
            ))}
        </FilterList>
        <FilterList
          label="resources.employees.filters.role"
          icon={<DirectionsWalkIcon />}
        >
          {roleIDs &&
            roles &&
            roleIDs.map((id: any) => (
              <FilterListItem
                label={inflection.humanize(roles[id].name)}
                key={roles[id].id}
                value={{ roles: roles[id].id }}
              />
            ))}
        </FilterList>
      </CardContent>
    </Card>
  );
};

export default Aside;
