import React, { FC } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";
import {
  DateInput,
  TextInput,
  AutocompleteInput,
  ReferenceInput,
  useCreate,
  useTranslate,
  useCreateSuggestionContext,
  useNotify,
} from "react-admin";
import { getErrorMessage } from "../../../utils";

interface Props {}

export const PaymentSection: FC<Props> = () => {
  return (
    <>
      <Box display={{ sm: "block", md: "flex" }}>
        <Box flex={1} mr={{ sm: 0, md: "0.5em" }}>
          <DateInput source="payment_date" resource="invoices" fullWidth />
        </Box>
        <Box flex={1} ml={{ sm: 0, md: "0.5em" }}>
          <ReferenceInput
            suggestionLimit={5}
            source="payment_method"
            reference="payment_methods"
            fullWidth
          >
            <AutocompleteInput
              resettable
              source="name"
              create={<CreatePaymentMethod />}
            />
          </ReferenceInput>
        </Box>
      </Box>
      <TextInput source="payment_note" multiline fullWidth />
    </>
  );
};

const CreatePaymentMethod = () => {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const [value, setValue] = React.useState(filter || "");
  const [create] = useCreate("payment_methods");
  const translate = useTranslate();
  const notify = useNotify();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    create(
      { payload: { data: { name: value } } },
      {
        onSuccess: ({ data }: { data: any }) => {
          setValue("");
          onCreate(data);
        },
        onFailure: (error: any) => {
          notify(getErrorMessage(error), "warning");
        },
      }
    );
  };

  return (
    <Dialog open onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label={translate("resources.invoices.fields.payment_method")}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
