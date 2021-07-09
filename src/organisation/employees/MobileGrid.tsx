import { FC } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import EmailIcon from "@material-ui/icons/Email";
import DomainIcon from "@material-ui/icons/Domain";
import GroupIcon from "@material-ui/icons/Group";
import {
  EditButton,
  Identifier,
  EmailField,
  ReferenceField,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

import { IconText } from "../../utils/components/IconText";
import { AvatarField } from "./AvatarField";
import { DepartmentLinkField } from "../departments/DepartmentLinkField";
import { Employee } from "../../types";

const useStyles = makeStyles((theme) => ({
  root: { margin: "1em" },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "0.5rem 0",
  },
  cardTitleContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardContent: {
    ...theme.typography.body1,
    display: "flex",
    flexDirection: "column",
  },
}));

interface Props {
  ids?: Identifier[];
  data?: { [key: string]: Employee };
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
                <ReferenceField
                  record={data[id]}
                  source="department"
                  reference="departments"
                >
                  <DepartmentLinkField />
                </ReferenceField>
              }
            >
              <DomainIcon color="secondary" />
            </IconText>
            <IconText
              text={
                <ReferenceArrayField
                  record={data[id]}
                  reference="roles"
                  source="roles"
                >
                  <SingleFieldList>
                    <ChipField source="name" />
                  </SingleFieldList>
                </ReferenceArrayField>
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
