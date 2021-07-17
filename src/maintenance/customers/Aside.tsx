import React, { FC } from "react";
import { useTranslate, Record, DateField } from "react-admin";
import { Typography, Card, CardContent, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccessTimeTwoToneIcon from "@material-ui/icons/AccessTimeTwoTone";
import AttachMoneyTwoToneIcon from "@material-ui/icons/AttachMoneyTwoTone";
import { toFixedNumber } from "../../utils";

const useAsideStyles = makeStyles((theme) => ({
  root: {
    width: 400,
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

interface AsideProps {
  record?: Record;
  basePath?: string;
}

export const Aside: FC<AsideProps> = ({ record, basePath }) => {
  const classes = useAsideStyles();
  return (
    <div className={classes.root}>
      {record && <EventList record={record} basePath={basePath} />}
    </div>
  );
};

interface EventListProps {
  record?: Record;
  basePath?: string;
}

const EventList: FC<EventListProps> = ({ record }) => {
  const translate = useTranslate();

  return (
    <Box m="0 0 1em 1em">
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {translate("resources.customers.fieldGroups.history")}
          </Typography>
          <Box display="flex">
            <Box flexGrow={1}>
              <Box display="flex">
                <Box mr="1em">
                  <AccessTimeTwoToneIcon fontSize="small" color="disabled" />
                </Box>
                <Box flexGrow={1}>
                  <Typography>
                    {translate("resources.customers.fields.first_seen")}
                  </Typography>
                  <DateField record={record} source="first_seen" />
                </Box>
              </Box>
              {record && toFixedNumber(record.unused_credits, 2) > 0 && (
                <Box display="flex">
                  <Box mr="1em">
                    <AttachMoneyTwoToneIcon fontSize="small" color="disabled" />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography>
                      {translate("resources.customers.unused_credits", {
                        amount: record?.unused_credits,
                      })}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            <Box flexGrow={1}>
              <Box display="flex">
                <Box mr="1em">
                  <AccessTimeTwoToneIcon fontSize="small" color="disabled" />
                </Box>
                <Box flexGrow={1}>
                  <Typography>
                    {translate("resources.customers.fields.last_seen")}
                  </Typography>
                  <DateField record={record} source="last_seen" />
                </Box>
              </Box>
              {record && toFixedNumber(record.receivables, 2) > 0 && (
                <Box display="flex">
                  <Box mr="1em">
                    <AttachMoneyTwoToneIcon fontSize="small" color="disabled" />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography>
                      {translate("resources.customers.receivables", {
                        amount: record?.receivables,
                      })}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
