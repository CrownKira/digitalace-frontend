import { FC, CSSProperties } from "react";
import { useMediaQuery, Theme } from "@material-ui/core";

import { Welcome } from "./Welcome";

const styles = {
  flex: { display: "flex" },
  flexColumn: { display: "flex", flexDirection: "column" },
  leftCol: { flex: 1, marginRight: "0.5em" },
  rightCol: { flex: 1, marginLeft: "0.5em" },
  singleCol: { marginTop: "1em", marginBottom: "1em" },
};

export const Dashboard: FC = () => {
  const isXSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("xs")
  );
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return isXSmall ? (
    <div>
      <div style={styles.flexColumn as CSSProperties}>
        <Welcome />
      </div>
    </div>
  ) : isSmall ? (
    <div style={styles.flexColumn as CSSProperties}>
      <div style={styles.flex}>
        <Welcome />
      </div>
    </div>
  ) : (
    <>
      <Welcome />
    </>
  );
};
