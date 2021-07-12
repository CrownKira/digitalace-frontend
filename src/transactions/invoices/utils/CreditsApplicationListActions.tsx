import React, { FC } from "react";
import pick from "lodash/pick";
import { TopToolbar, Button, useDataProvider, ButtonProps } from "react-admin";
import { useForm, useFormState } from "react-final-form";
import ContentAdd from "@material-ui/icons/Add";

import { CreditNote } from "../../../types";

interface Props extends ButtonProps {
  // formData: any;
}

export const CreditsApplicationListActions: FC<Props> = ({
  onClick,
  disabled,
}) => {
  const form = useForm();
  const { values: formData } = useFormState();
  const dataProvider = useDataProvider();

  return (
    <TopToolbar>
      <Button
        onClick={async (event) => {
          // console.log("customer", formData.customer);
          const response =
            formData.customer &&
            (await dataProvider.getManyReference("credit_notes", {
              target: "customer",
              id: formData.customer,
              pagination: { page: 1, perPage: 25 },
              sort: { field: "id", order: "DESC" },
              filter: {},
            }));

          form.change(
            "fake_creditsapplication_set",
            response
              ? response.data.map((creditNote: CreditNote) => ({
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

          onClick && onClick(event);
        }}
        label="Apply Credits"
        disabled={disabled}
      >
        <ContentAdd />
      </Button>
    </TopToolbar>
  );
};
