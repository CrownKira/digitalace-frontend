import React, { FC } from "react";
import { Button, ButtonProps, useTranslate } from "react-admin";
import ContentAdd from "@material-ui/icons/AddTwoTone";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    buttonProgress: {
      color: "secondary",
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

interface Props extends ButtonProps {
  create: (query?: any, options?: any) => void | Promise<any>;
  loading: boolean;
}

export const CreateInvoiceButton: FC<Props> = ({ create, loading }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <div className={classes.wrapper}>
      <Button
        onClick={create}
        label={translate("resources.sales_orders.action.create_invoice")}
        disabled={loading}
      >
        <ContentAdd />
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
