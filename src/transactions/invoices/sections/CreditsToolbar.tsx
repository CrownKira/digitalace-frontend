import React, { FC } from "react";
import { TopToolbar, Record } from "react-admin";

import { ApplyCreditsButton } from "../utils/ApplyCreditsButton";

interface Props {
  applyCreditsIsOpen: boolean;
  setApplyCreditsIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreditsToolbar: FC<Props> = ({
  applyCreditsIsOpen,
  setApplyCreditsIsOpen,
  ...rest
}) => {
  return (
    <TopToolbar {...rest}>
      <ApplyCreditsButton
        onClick={() => {
          setApplyCreditsIsOpen(true);
        }}
        disabled={applyCreditsIsOpen}
      />
    </TopToolbar>
  );
};
