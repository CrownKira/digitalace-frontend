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

export const ApplyCreditsButton: FC<Props> = ({
  onClick: originalOnClickHandler,
  disabled,
}) => {
  const classes = useStyles();
  const form = useForm();
  const translate = useTranslate();
  const notify = useNotify();

  const { values: formData } = useFormState();
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(false);

  return (
    <div className={classes.wrapper}>
      <Button
        onClick={async (event) => {
          if (!formData.customer) {
            // TODO: redirect to Details Tab
            notify("Please select a customer first.");
            return;
          }

          setLoading(true);

          const response = await dataProvider.getManyReference("credit_notes", {
            target: "customer",
            id: formData.customer,
            pagination: { page: 1, perPage: 25 },
            sort: { field: "id", order: "DESC" },
            filter: {},
          });

          setLoading(false);

          form.change(
            "creditsapplication_set",
            response
              ? response.data.map((creditNote) => ({
                  ...pick(creditNote, [
                    "reference",
                    "grand_total",
                    "credits_remaining",
                    "id",
                  ]),
                  credit_note: creditNote.id,
                  amount_to_credit: "0.00",
                }))
              : []
          );

          if (originalOnClickHandler) {
            originalOnClickHandler(event);
          }
        }}
        label={translate("resources.credits_applications.action.apply_credits")}
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
