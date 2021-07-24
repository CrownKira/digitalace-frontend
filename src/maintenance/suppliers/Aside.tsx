import * as React from "react";
import { FC } from "react";
import {
  NumberField,
  TextField,
  DateField,
  useTranslate,
  useGetList,
  Record,
  RecordMap,
  Identifier,
  useLocale,
} from "react-admin";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Link,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AccessTimeTwoToneIcon from "@material-ui/icons/AccessTimeTwoTone";
import AttachMoneyTwoToneIcon from "@material-ui/icons/AttachMoneyTwoTone";

import { toFixedNumber } from "../../utils";
import { purchase_orders as purchase_order } from "../../transactions/purchase_orders";
import { receives as receive } from "../../transactions/receives";
import {
  PurchaseOrder as PurchaseOrderRecord,
  Receive as ReceiveRecord,
} from "../../types";

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

const useEventStyles = makeStyles({
  stepper: {
    background: "none",
    border: "none",
    marginLeft: "0.3em",
    maxHeight: "1000px",
    overflow: "auto",
  },
});

const EventList: FC<EventListProps> = ({ record, basePath }) => {
  const translate = useTranslate();
  const classes = useEventStyles();
  const locale = useLocale();

  const { data: purchaseOrders, ids: purchaseOrderIds } =
    useGetList<PurchaseOrderRecord>(
      "purchase_orders",
      { page: 1, perPage: 100 },
      { field: "date", order: "DESC" },
      { supplier: record && record.id }
    );

  const { data: receives, ids: receiveIds } = useGetList<ReceiveRecord>(
    "receives",
    { page: 1, perPage: 100 },
    { field: "date", order: "DESC" },
    { supplier: record && record.id }
  );

  const events = mixEvents(
    purchaseOrders,
    purchaseOrderIds,
    receives,
    receiveIds
  );

  return (
    <>
      <Box m="0 0 1em 1em">
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {translate("resources.suppliers.fieldGroups.history")}
            </Typography>
            <Box display="flex">
              <Box flexGrow={1}>
                <Box display="flex">
                  <Box mr="1em">
                    <AccessTimeTwoToneIcon fontSize="small" color="disabled" />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography>
                      {translate("resources.suppliers.fields.first_seen")}
                    </Typography>
                    <DateField record={record} source="first_seen" />
                  </Box>
                </Box>
              </Box>
              <Box flexGrow={1}>
                <Box display="flex">
                  <Box mr="1em">
                    <AccessTimeTwoToneIcon fontSize="small" color="disabled" />
                  </Box>
                  <Box flexGrow={1}>
                    <Typography>
                      {translate("resources.suppliers.fields.last_seen")}
                    </Typography>
                    <DateField record={record} source="last_seen" />
                  </Box>
                </Box>
                {record && toFixedNumber(record.payables, 2) > 0 && (
                  <Box display="flex">
                    <Box mr="1em">
                      <AttachMoneyTwoToneIcon
                        fontSize="small"
                        color="disabled"
                      />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography>
                        {translate("resources.suppliers.payables", {
                          amount: record?.payables,
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
      <Stepper orientation="vertical" classes={{ root: classes.stepper }}>
        {events.map((event) => (
          <Step
            key={`${event.type}-${event.data.id}`}
            expanded
            active
            completed
          >
            <StepLabel
              StepIconComponent={() => {
                const Component =
                  event.type === "purchaseOrder"
                    ? purchase_order.icon
                    : receive.icon;

                return (
                  <Component
                    fontSize="small"
                    color="disabled"
                    style={{ paddingLeft: 3 }}
                  />
                );
              }}
            >
              {new Date(event.date).toLocaleString(locale, {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </StepLabel>
            <StepContent>
              {event.type === "purchaseOrder" ? (
                <PurchaseOrder
                  record={event.data as PurchaseOrderRecord}
                  key={`purchaseOrder_${event.data.id}`}
                  basePath={basePath}
                />
              ) : (
                <Receive
                  record={event.data as ReceiveRecord}
                  key={`receive_${event.data.id}`}
                  basePath={basePath}
                />
              )}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

interface AsideEvent {
  type: string;
  date: Date;
  data: PurchaseOrderRecord | ReceiveRecord;
}

const mixEvents = (
  purchaseOrders?: RecordMap<PurchaseOrderRecord>,
  purchaseOrderIds?: Identifier[],
  receives?: RecordMap<ReceiveRecord>,
  receiveIds?: Identifier[]
): AsideEvent[] => {
  const eventsFromPurchaseOrders =
    purchaseOrderIds && purchaseOrders
      ? purchaseOrderIds.map<AsideEvent>((id) => ({
          type: "purchaseOrder",
          date: purchaseOrders[id].date,
          data: purchaseOrders[id],
        }))
      : [];
  const eventsFromReceives =
    receiveIds && receives
      ? receiveIds.map<AsideEvent>((id) => ({
          type: "receive",
          date: receives[id].date,
          data: receives[id],
        }))
      : [];

  const events = [...eventsFromPurchaseOrders, ...eventsFromReceives];

  events.sort(
    (e1, e2) => new Date(e2.date).getTime() - new Date(e1.date).getTime()
  );
  return events;
};

interface PurchaseOrderProps {
  record?: PurchaseOrderRecord;
  basePath?: string;
}

const PurchaseOrder: FC<PurchaseOrderProps> = ({ record, basePath }) => {
  const translate = useTranslate();

  return record ? (
    <>
      <Typography variant="body2" gutterBottom>
        <Link to={`/purchase_orders/${record.id}`} component={RouterLink}>
          {translate("resources.purchase_orders.name", { smart_count: 1 })} #
          {record.reference}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {translate("resources.purchase_orders.nb_items", {
          smart_count: record.purchaseorderitem_set?.length,
        })}
        &nbsp;-&nbsp;
        <NumberField
          source="grand_total"
          options={{ style: "currency", currency: "SGD" }}
          record={record}
          basePath={basePath}
        />
        &nbsp;-&nbsp;
        <TextField source="status" record={record} basePath={basePath} />
      </Typography>
    </>
  ) : null;
};

interface ReceiveProps {
  record?: ReceiveRecord;
  basePath?: string;
}

const Receive: FC<ReceiveProps> = ({ record, basePath }) => {
  const translate = useTranslate();
  return record ? (
    <>
      <Typography variant="body2" gutterBottom>
        <Link to={`/receives/${record.id}`} component={RouterLink}>
          {translate("resources.receives.name", { smart_count: 1 })} #
          {record.reference}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {translate("resources.receives.nb_items", {
          smart_count: record.receiveitem_set?.length,
        })}
        &nbsp;-&nbsp;
        <NumberField
          source="grand_total"
          options={{ style: "currency", currency: "SGD" }}
          record={record}
          basePath={basePath}
        />
        &nbsp;-&nbsp;
        <TextField source="status" record={record} basePath={basePath} />
      </Typography>
    </>
  ) : null;
};
