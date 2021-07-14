import React, { FC } from "react";
import { TopToolbar, Record } from "react-admin";

import { ApplyCreditsButton } from "../utils/ApplyCreditsButton";

interface Props {
  IsApplyCreditsOpen: boolean;
  setApplyCreditsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreditsToolbar: FC<Props> = ({
  IsApplyCreditsOpen,
  setApplyCreditsOpen,
  ...rest
}) => {
  return (
    <TopToolbar {...rest}>
      <ApplyCreditsButton
        onClick={() => {
          setApplyCreditsOpen(true);
        }}
        disabled={IsApplyCreditsOpen}
      />
    </TopToolbar>
  );
};
