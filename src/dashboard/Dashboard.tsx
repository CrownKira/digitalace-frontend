import React, { FC, CSSProperties } from "react";
import { useMediaQuery, Theme, Link } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useGetList } from "react-admin";

import { Welcome } from "./Welcome";
import { Separator } from "../utils/components/Divider";
import { Announcement } from "../types";
import { getSeverity } from "../announcements/data";

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
      { field: "id", order: "DESC" }
    );

  return (
    <>
      {announcementIds &&
        announcementIds.map((id) => {
          const announcement = announcements[id];

          return (
            <>
              <Alert severity={getSeverity(announcement.severity)}>
                <AlertTitle>{announcement.title}</AlertTitle>
                {announcement.message}
              </Alert>
              <Separator />
            </>
          );
        })}
    </>
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

/*
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
