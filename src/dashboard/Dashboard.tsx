import React, {
  FC,
  CSSProperties,
  Fragment,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useMediaQuery, Theme, Link } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useDataProvider, useGetList, useVersion } from "react-admin";
import { subDays } from "date-fns";

import { Welcome } from "./Welcome";
import { Separator } from "../utils/components/Divider";
import { Announcement, CreditNote, Invoice, Receive } from "../types";
import { getSeverity } from "../announcements/data";
import { ccyFormat, dateFormatter, toFixedNumber } from "../utils";
import { MonthlyRevenue } from "./ MonthlyRevenue";
import { NbNewInvoices } from "./NbNewInvoices";

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

// const stopPropagation = (e: any) => e.stopPropagation();
// const email = "t.karwi@yahoo.com";

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
}

interface State {
  revenue?: string;
  nbNewInvoices?: number;
  receivables?: number;
  payables?: number;
  unpaidInvoices?: Invoice[];
  unpaidReceives?: Receive[];
  recentInvoices?: Invoice[];
  recentReceives?: Receive[];
  recentCreditNotes?: CreditNote[];
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
            stats.unpaidInvoices.push(invoice);
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
            stats.unpaidReceives.push(receive);
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
      receivables: aggregations.receivables,
      payables: aggregations.payables,
      nbNewInvoices: aggregations.nbNewInvoices,
      recentInvoices,
      recentReceives,
      recentCreditNotes,
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
  } = state;

  return isXSmall ? (
    <div>
      <ProgressAlert />
      <div style={styles.flexColumn as CSSProperties}>
        <Welcome />
      </div>
    </div>
  ) : isSmall ? (
    <div>
      <ProgressAlert />
      <div style={styles.flexColumn as CSSProperties}>
        <div style={styles.flex}>
          <Welcome />
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
          <div style={styles.singleCol}></div>
        </div>
      </div>
    </>
  );
};

/*
 <OrderChart
              invoices={recentInvoices}
              receives={recentReceives}
              credit_notes={recentCreditNotes}
            />


            
<Separator />
<Alert severity="warning">
  <AlertTitle>Work in Progress</AlertTitle>
  Here is a non-exhaustive and nonchronological list of features we are
  working on:
  <ul>
    <li>Inventory Reports</li>
    <li>PDF/Print</li>
    <li>Import Data</li>
    <li>Email Verification on Account Creation</li>
    <li>Delivery Order System</li>
    <li>Data Visualization</li>
    <li>Receives</li>
    <li>Purchase Orders</li>
    <li>Inventory adjustments</li>
    <li>Payroll management</li>
    <li>Attendance management</li>
    <li>Show view for all tabs</li>
  </ul>
  Want to suggest a feature? Feel free to drop us an email at{" "}
  <Link
    className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
    href={`mailto:${email}`}
    onClick={stopPropagation}
  >
    {email}
  </Link>
  <br />
  Please feel free to file any issues that you have encountered{" "}
  <Link
    className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
    href="https://github.com/CrownKira/digitalace/issues"
    target="_blank"
  >
    here
  </Link>
</Alert>

<Alert severity="info">
        <AlertTitle>We are moving</AlertTitle>
        We are migrating to{" "}
        <Link
          className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
          href="https://eizea.com/"
          target="_blank"
        >
          EIZEA.COM
        </Link>
        ! You can pronounce it as /ˈiːzi/ or /ˈeɪ.zɪə/... up to you! Let us know
        what you think about our new name! Meanwhile, we are conducting our
        final round of user testing. We would appreciate it if you could set
        aside your precious 15min to complete our{" "}
        <Link
          className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdH_svSkLrqfGPoOAGCQ1-SRT4Vw6mBpkGTqGtiXmtkHELUng/viewform"
          target="_blank"
        >
          survey
        </Link>
        . We welcome any critiques with open arms!
      </Alert>
*/
