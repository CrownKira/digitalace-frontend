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
import { sales_orders as sales_order } from "../../transactions/sales_orders";
import { invoices as invoice } from "../../transactions/invoices";
import { credit_notes as credit_note } from "../../transactions/credit_notes";
import {
  SalesOrder as SalesOrderRecord,
  Invoice as InvoiceRecord,
  CreditNote as CreditNoteRecord,
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

  const { data: salesOrders, ids: salesOrderIds } =
    useGetList<SalesOrderRecord>(
      "sales_orders",
      { page: 1, perPage: 100 },
      { field: "date", order: "DESC" },
      { customer: record && record.id }
    );

  const { data: invoices, ids: invoiceIds } = useGetList<InvoiceRecord>(
    "invoices",
    { page: 1, perPage: 100 },
    { field: "date", order: "DESC" },
    { customer: record && record.id }
  );

  const { data: creditNotes, ids: creditNoteIds } =
    useGetList<CreditNoteRecord>(
      "credit_notes",
      { page: 1, perPage: 100 },
      { field: "date", order: "DESC" },
      { customer: record && record.id }
    );

  const events = mixEvents(
    salesOrders,
    salesOrderIds,
    invoices,
    invoiceIds,
    creditNotes,
    creditNoteIds
  );

  return (
    <>
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
                      <AttachMoneyTwoToneIcon
                        fontSize="small"
                        color="disabled"
                      />
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
                      <AttachMoneyTwoToneIcon
                        fontSize="small"
                        color="disabled"
                      />
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
                  event.type === "salesOrder"
                    ? sales_order.icon
                    : event.type === "invoice"
                    ? invoice.icon
                    : credit_note.icon;

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
              {event.type === "salesOrder" ? (
                <SalesOrder
                  record={event.data as SalesOrderRecord}
                  key={`salesOrder_${event.data.id}`}
                  basePath={basePath}
                />
              ) : event.type === "invoice" ? (
                <Invoice
                  record={event.data as InvoiceRecord}
                  key={`invoice_${event.data.id}`}
                  basePath={basePath}
                />
              ) : (
                <CreditNote
                  record={event.data as CreditNoteRecord}
                  key={`invoice_${event.data.id}`}
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
  date: string;
  data: SalesOrderRecord | InvoiceRecord | CreditNoteRecord;
}

const mixEvents = (
  salesOrders?: RecordMap<SalesOrderRecord>,
  salesOrderIds?: Identifier[],
  invoices?: RecordMap<InvoiceRecord>,
  invoiceIds?: Identifier[],
  creditNotes?: RecordMap<CreditNoteRecord>,
  creditNoteIds?: Identifier[]
): AsideEvent[] => {
  const eventsFromSalesOrders =
    salesOrderIds && salesOrders
      ? salesOrderIds.map<AsideEvent>((id) => ({
          type: "salesOrder",
          date: salesOrders[id].date,
          data: salesOrders[id],
        }))
      : [];
  const eventsFromInvoices =
    invoiceIds && invoices
      ? invoiceIds.map<AsideEvent>((id) => ({
          type: "invoice",
          date: invoices[id].date,
          data: invoices[id],
        }))
      : [];
  const eventsFromCreditNotes =
    creditNoteIds && creditNotes
      ? creditNoteIds.map<AsideEvent>((id) => ({
          type: "creditNote",
          date: creditNotes[id].date,
          data: creditNotes[id],
        }))
      : [];

  const events = [
    ...eventsFromSalesOrders,
    ...eventsFromInvoices,
    ...eventsFromCreditNotes,
  ];

  events.sort(
    (e1, e2) => new Date(e2.date).getTime() - new Date(e1.date).getTime()
  );
  return events;
};

interface SalesOrderProps {
  record?: SalesOrderRecord;
  basePath?: string;
}

const SalesOrder: FC<SalesOrderProps> = ({ record, basePath }) => {
  const translate = useTranslate();

  return record ? (
    <>
      <Typography variant="body2" gutterBottom>
        <Link to={`/sales_orders/${record.id}`} component={RouterLink}>
          {translate("resources.sales_orders.name", { smart_count: 1 })} #
          {record.reference}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {translate("resources.sales_orders.nb_items", {
          smart_count: record.salesorderitem_set?.length,
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

interface InvoiceProps {
  record?: InvoiceRecord;
  basePath?: string;
}

const Invoice: FC<InvoiceProps> = ({ record, basePath }) => {
  const translate = useTranslate();
  return record ? (
    <>
      <Typography variant="body2" gutterBottom>
        <Link to={`/invoices/${record.id}`} component={RouterLink}>
          {translate("resources.invoices.name", { smart_count: 1 })} #
          {record.reference}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {translate("resources.invoices.nb_items", {
          smart_count: record.invoiceitem_set?.length,
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

interface CreditNoteProps {
  record?: CreditNoteRecord;
  basePath?: string;
}

const CreditNote: FC<CreditNoteProps> = ({ record, basePath }) => {
  const translate = useTranslate();
  return record ? (
    <>
      <Typography variant="body2" gutterBottom>
        <Link to={`/credit_notes/${record.id}`} component={RouterLink}>
          {translate("resources.credit_notes.name", { smart_count: 1 })} #
          {record.reference}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {translate("resources.credit_notes.nb_items", {
          smart_count: record.creditnoteitem_set?.length,
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
