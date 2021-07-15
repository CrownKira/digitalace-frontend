import React, { FC, CSSProperties } from "react";
import { useMediaQuery, Theme, Link } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { Welcome } from "./Welcome";

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

const stopPropagation = (e: any) => e.stopPropagation();
const email = "t.karwi@yahoo.com";

const ProgressAlert: FC = () => {
  return (
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
    </Alert>
  );
};

export const Dashboard: FC = () => {
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xs")
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

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
    </>
  );
};
