import React, {
  FC,
  CSSProperties,
  Fragment,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMediaQuery, Theme } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useDataProvider, useGetList, useVersion } from "react-admin";
import { subDays } from "date-fns";

import { Welcome } from "./Welcome";
import { Separator } from "../utils/components/Divider";
import {
  Announcement,
  CreditNote,
  Customer,
  Invoice,
  Receive,
  Supplier,
} from "../types";
import { getSeverity } from "../announcements/data";
import { ccyFormat, dateFormatter, toFixedNumber } from "../utils";
import { MonthlyRevenue } from "./ MonthlyRevenue";
import { NbNewInvoices } from "./NbNewInvoices";
import { OrderChart } from "./OrderChart";
import { UnpaidInvoices } from "./UnpaidInvoices";
import { UnpaidReceives } from "./UnpaidReceives";

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 2, marginRight: "0.5em" },
  rightCol: { flex: 3, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

const ProgressAlert: FC = () => {
  const { data: announcements, ids: announcementIds } =
    useGetList<Announcement>(
      "announcements",
      { page: 1, perPage: 100 },
      { field: "id", order: "DESC" },
      { status: "OP" }
    );

  return (
    <>
      {announcementIds &&
        announcementIds.map((id) => {
          const announcement = announcements[id];

          return (
            <Fragment key={announcement.id}>
              <Alert severity={getSeverity(announcement.severity)}>
                <AlertTitle>{announcement.title}</AlertTitle>
                {announcement.message}
              </Alert>
              <Separator />
            </Fragment>
          );
        })}
    </>
  );
};

interface OrderStats {
  revenue: number;
  nbNewInvoices: number;
  receivables: number;
  payables: number;
  unpaidInvoices: Invoice[];
  unpaidReceives: Receive[];
  nbUnpaidInvoices: number;
  nbUnpaidReceives: number;
}

interface CustomerData {
  [key: string]: Customer;
}

interface SupplierData {
  [key: string]: Supplier;
}

interface State {
  revenue?: string;
  nbNewInvoices?: number;
  receivables?: string;
  payables?: string;
  unpaidInvoices?: Invoice[];
  unpaidReceives?: Receive[];
  recentInvoices?: Invoice[];
  recentReceives?: Receive[];
  recentCreditNotes?: CreditNote[];
  unpaidInvoicesCustomers?: CustomerData;
  unpaidReceivesSuppliers?: SupplierData;
  nbUnpaidInvoices?: number;
  nbUnpaidReceives?: number;
}

const Spacer = () => <span style={{ width: "1em" }} />;
const VerticalSpacer = () => <span style={{ height: "1em" }} />;

export const Dashboard: FC = () => {
  const [state, setState] = useState<State>({});
  const version = useVersion();
  const dataProvider = useDataProvider();
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xs")
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  const fetchOrders = useCallback(async () => {
    const aMonthAgo = subDays(new Date(), 30);

    const { data: recentInvoices } = await dataProvider.getList<Invoice>(
      "invoices",
      {
        filter: { date__gte: dateFormatter(aMonthAgo) },
        sort: { field: "date", order: "DESC" },
        // TODO: set limit of invoices per month
        pagination: { page: 1, perPage: Infinity },
      }
    );

    const { data: recentReceives } = await dataProvider.getList<Receive>(
      "receives",
      {
        filter: { date__gte: dateFormatter(aMonthAgo) },
        sort: { field: "date", order: "DESC" },
        // TODO: set limit of receives per month
        pagination: { page: 1, perPage: Infinity },
      }
    );

    const { data: recentCreditNotes } = await dataProvider.getList<CreditNote>(
      "credit_notes",
      {
        filter: { date__gte: dateFormatter(aMonthAgo) },
        sort: { field: "date", order: "DESC" },
        // TODO: set limit of credit notes per month
        pagination: { page: 1, perPage: Infinity },
      }
    );

    let aggregations = recentInvoices
      .filter((invoice) => invoice.status !== "DFT")
      .reduce(
        (stats: OrderStats, invoice) => {
          if (invoice.status !== "DFT") {
            stats.revenue += toFixedNumber(invoice.grand_total, 2);
            stats.nbNewInvoices++;
          }
          if (invoice.status === "UPD") {
            stats.receivables += toFixedNumber(invoice.grand_total, 2);
            stats.nbUnpaidInvoices++;
            if (stats.unpaidInvoices.length < 10) {
              stats.unpaidInvoices.push(invoice);
            }
          }
          return stats;
        },
        {
          revenue: 0,
          nbNewInvoices: 0,
          receivables: 0,
          payables: 0,
          unpaidInvoices: [],
          unpaidReceives: [],
          nbUnpaidInvoices: 0,
          nbUnpaidReceives: 0,
          // TODO: include incoming and outgoing
        }
      );

    aggregations = recentReceives
      .filter((receive) => receive.status !== "DFT")
      .reduce(
        (stats: OrderStats, receive) => {
          if (receive.status !== "DFT") {
            stats.revenue -= toFixedNumber(receive.grand_total, 2);
          }

          if (receive.status === "UPD") {
            stats.payables += toFixedNumber(receive.grand_total, 2);
            stats.nbUnpaidReceives++;
            if (stats.unpaidReceives.length < 10) {
              stats.unpaidReceives.push(receive);
            }
          }

          return stats;
        },

        aggregations
      );

    aggregations = recentCreditNotes
      .filter((credit_note) => credit_note.status !== "DFT")
      .reduce((stats: OrderStats, credit_note) => {
        if (credit_note.status !== "DFT") {
          stats.revenue -= toFixedNumber(credit_note.refund, 2);
        }
        return stats;
      }, aggregations);

    setState((state) => ({
      ...state,
      revenue: ccyFormat(aggregations.revenue, true),
      unpaidInvoices: aggregations.unpaidInvoices,
      unpaidReceives: aggregations.unpaidReceives,
      receivables: ccyFormat(aggregations.receivables, true),
      payables: ccyFormat(aggregations.payables, true),
      nbNewInvoices: aggregations.nbNewInvoices,
      nbUnpaidInvoices: aggregations.nbUnpaidInvoices,
      nbUnpaidReceives: aggregations.nbUnpaidReceives,
      recentInvoices,
      recentReceives,
      recentCreditNotes,
    }));

    const { data: customers } = await dataProvider.getMany<Customer>(
      "customers",
      {
        ids: aggregations.unpaidInvoices.map(
          (invoice: Invoice) => invoice.customer
        ),
      }
    );

    setState((state) => ({
      ...state,
      unpaidInvoicesCustomers: customers.reduce(
        (prev: CustomerData, customer) => {
          prev[customer.id] = customer;
          return prev;
        },
        {}
      ),
    }));

    const { data: suppliers } = await dataProvider.getMany<Supplier>(
      "suppliers",
      {
        ids: aggregations.unpaidReceives.map(
          (receive: Receive) => receive.supplier
        ),
      }
    );

    setState((state) => ({
      ...state,
      unpaidReceivesSuppliers: suppliers.reduce(
        (prev: SupplierData, supplier) => {
          prev[supplier.id] = supplier;
          return prev;
        },
        {}
      ),
    }));
  }, [dataProvider]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, version]);

  const {
    revenue,
    unpaidInvoices,
    unpaidReceives,
    receivables,
    payables,
    nbNewInvoices,
    recentInvoices,
    recentReceives,
    recentCreditNotes,
    unpaidInvoicesCustomers,
    unpaidReceivesSuppliers,
    nbUnpaidInvoices,
    nbUnpaidReceives,
  } = state;

  return isXSmall ? (
    <div>
      <ProgressAlert />
      <div style={styles.flexColumn as CSSProperties}>
        <Welcome />
        <MonthlyRevenue value={revenue} />
        <VerticalSpacer />
        <NbNewInvoices value={nbNewInvoices} />
        <VerticalSpacer />
        <OrderChart
          invoices={recentInvoices}
          receives={recentReceives}
          credit_notes={recentCreditNotes}
        />
        <VerticalSpacer />
        <UnpaidInvoices
          invoices={unpaidInvoices}
          customers={unpaidInvoicesCustomers}
          receivables={receivables}
        />
        <VerticalSpacer />
        <UnpaidReceives
          receives={unpaidReceives}
          suppliers={unpaidReceivesSuppliers}
          payables={payables}
        />
      </div>
    </div>
  ) : isSmall ? (
    <div>
      <ProgressAlert />
      <div style={styles.flexColumn as CSSProperties}>
        <div style={styles.singleCol}>
          <Welcome />
        </div>
        <div style={styles.flex}>
          <MonthlyRevenue value={revenue} />
          <Spacer />
          <NbNewInvoices value={nbNewInvoices} />
        </div>
        <div style={styles.singleCol}>
          <OrderChart
            invoices={recentInvoices}
            receives={recentReceives}
            credit_notes={recentCreditNotes}
          />
        </div>
        <div style={styles.flex}>
          <UnpaidInvoices
            invoices={unpaidInvoices}
            customers={unpaidInvoicesCustomers}
            receivables={receivables}
          />
          <Spacer />
          <UnpaidReceives
            receives={unpaidReceives}
            suppliers={unpaidReceivesSuppliers}
            payables={payables}
          />
        </div>
      </div>
    </div>
  ) : (
    <>
      <ProgressAlert />
      <Welcome />
      <div style={styles.flex}>
        <div style={styles.leftCol}>
          <div style={styles.flex}>
            <MonthlyRevenue value={revenue} />
            <Spacer />
            <NbNewInvoices value={nbNewInvoices} />
          </div>
          <div style={styles.singleCol}>
            <OrderChart
              invoices={recentInvoices}
              receives={recentReceives}
              credit_notes={recentCreditNotes}
            />
          </div>
        </div>

        <div style={styles.rightCol}>
          <div style={styles.flex}>
            <UnpaidInvoices
              invoices={unpaidInvoices}
              customers={unpaidInvoicesCustomers}
              receivables={receivables}
            />
            <Spacer />
            <UnpaidReceives
              receives={unpaidReceives}
              suppliers={unpaidReceivesSuppliers}
              payables={payables}
            />
          </div>
        </div>
      </div>
    </>
  );
};
