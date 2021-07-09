import { FC } from "react";
import inflection from "inflection";
import { Card as MuiCard, CardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import Domain from "@material-ui/icons/Domain";
import WorkOutline from "@material-ui/icons/WorkOutline";
import {
  FilterList,
  FilterLiveSearch,
  FilterListItem,
  useGetList,
} from "react-admin";

import { Category } from "../../types";

const Card = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      order: -1,
      width: "15em",
      marginRight: "1em",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}))(MuiCard);

const Aside: FC = () => {
  const { data: departments, ids: departmentIds } = useGetList<Category>(
    "departments",
    { page: 1, perPage: 100 },
    { field: "name", order: "ASC" },
    {}
  );
  const { data: designations, ids: designationIds } = useGetList<Category>(
    "designations",
    { page: 1, perPage: 100 },
    { field: "name", order: "ASC" },
    {}
  );
  const { data: roles, ids: roleIds } = useGetList<Category>(
    "roles",
    { page: 1, perPage: 100 },
    { field: "name", order: "ASC" },
    {}
  );

  return (
    <Card>
      <CardContent>
        <FilterLiveSearch />
        <FilterList
          label="resources.employees.filters.department"
          icon={<Domain />}
        >
          {departmentIds &&
            departments &&
            departmentIds.map((id) => (
              <FilterListItem
                label={inflection.humanize(departments[id].name)}
                key={departments[id].id}
                value={{ designation__department: departments[id].id }}
              />
            ))}
        </FilterList>
        <FilterList
          label="resources.employees.filters.designation"
          icon={<WorkOutline />}
        >
          {designationIds &&
            designations &&
            designationIds.map((id) => (
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
          {roleIds &&
            roles &&
            roleIds.map((id) => (
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
