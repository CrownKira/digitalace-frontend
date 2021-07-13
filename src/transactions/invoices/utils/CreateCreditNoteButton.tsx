import React, { FC, useState } from "react";
import pick from "lodash/pick";
import {
  Button,
  useDataProvider,
  ButtonProps,
  useNotify,
  useTranslate,
} from "react-admin";
import { useForm, useFormState } from "react-final-form";
import ContentAdd from "@material-ui/icons/Add";
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

interface Props extends ButtonProps {}

export const CreateCreditNoteButton: FC<Props> = ({
  onClick: originalOnClickHandler,
  disabled,
}) => {
  const classes = useStyles();
  const translate = useTranslate();
  const notify = useNotify();
  const form = useForm();

  const { values: formData } = useFormState();
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(false);

  return (
    <div className={classes.wrapper}>
      <Button
        onClick={() => {
          notify("pos.message.coming_soon");
        }}
        label={translate(
          "resources.credits_applications.action.create_credit_note"
        )}
        disabled={disabled}
      >
        <ContentAdd />
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
};
