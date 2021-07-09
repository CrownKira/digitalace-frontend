import { FC } from "react";
import MuiGridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import { makeStyles } from "@material-ui/core/styles";
import withWidth, { WithWidth } from "@material-ui/core/withWidth";
import {
  linkToRecord,
  useListContext,
  DatagridProps,
  Identifier,
} from "react-admin";
import { Link } from "react-router-dom";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

import { PriceField } from "../utils/components/PriceField";

const useStyles = makeStyles((theme) => ({
  gridList: {
    margin: 0,
  },
  tileBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)",
  },
  placeholder: {
    backgroundColor: theme.palette.grey[300],
    height: "100%",
  },
  price: {
    display: "inline",
    fontSize: "1em",
  },
  link: {
    color: "#fff",
  },
}));

const getColsForWidth = (width: Breakpoint) => {
  if (width === "xs") return 2;
  if (width === "sm") return 3;
  if (width === "md") return 4;
  if (width === "lg") return 5;
  return 6;
};

const times = (nbChildren: number, fn: (key: number) => any) =>
  Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList: FC<GridProps & { nbItems?: number }> = ({
  width,
  nbItems = 20,
}) => {
  const classes = useStyles();
  return (
    <MuiGridList
      cellHeight={180}
      cols={getColsForWidth(width)}
      className={classes.gridList}
    >
      {" "}
      {times(nbItems, (key) => (
        <GridListTile key={key}>
          <div className={classes.placeholder} />
        </GridListTile>
      ))}
    </MuiGridList>
  );
};

const LoadedGridList: FC<GridProps> = ({ width }) => {
  const { ids, data, basePath } = useListContext();
  const classes = useStyles();

  if (!ids || !data) return null;

  // FIXME: fix blink on load
  return (
    <MuiGridList
      cellHeight={180}
      cols={getColsForWidth(width)}
      className={classes.gridList}
    >
      {ids.map((id: Identifier) => (
        <GridListTile
          key={id}
          component={Link}
          to={linkToRecord(basePath, data[id]?.id)}
        >
          <img
            src={data[id].thumbnail?.src || data[id].image?.src}
            alt={data[id].thumbnail.title}
          />
          <GridListTileBar
            className={classes.tileBar}
            title={data[id].name}
            subtitle={
              <span>
                {data[id].reference},{" "}
                <PriceField
                  className={classes.price}
                  source="unit_price"
                  record={data[id]}
                  color="inherit"
                />
              </span>
            }
          ></GridListTileBar>
        </GridListTile>
      ))}
    </MuiGridList>
  );
};

// TODO: DatagridProps has width prop?
interface GridProps extends Omit<DatagridProps, "width">, WithWidth {}

const GridList: FC<WithWidth> = ({ width }) => {
  const { loaded } = useListContext();
  return loaded ? (
    <LoadedGridList width={width} />
  ) : (
    <LoadingGridList width={width} />
  );
};

export default withWidth()(GridList);
