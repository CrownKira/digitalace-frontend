import React, { FC } from "react";
import { Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTranslate, Record, useRedirect } from "react-admin";

interface Props {
  record: Record;
}

export const DetailsAlertSection: FC<Props> = ({ record }) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  return <div></div>;
};
