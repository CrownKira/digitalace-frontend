import { FC } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  useInput,
  InputProps,
  useTranslate,
  useLocale,
  useSetLocale,
} from "react-admin";

const useStyles = makeStyles({
  label: { width: "10em", display: "inline-block" },
  button: { margin: "1em" },
});

interface Props extends InputProps {}

export const LanguageSelectInput: FC<Props> = (props) => {
  const classes = useStyles();
  const { input } = useInput(props);
  const translate = useTranslate();
  const locale = useLocale();
  const setLocale = useSetLocale();

  return (
    <>
      <div className={classes.label}>{translate("pos.language")}</div>
      <Button
        variant="contained"
        className={classes.button}
        color={locale === "en" ? "primary" : "default"}
        onClick={() => {
          input.onChange("en");
          setLocale("en");
        }}
      >
        en
      </Button>
      <Button
        variant="contained"
        className={classes.button}
        color={locale === "zh" ? "primary" : "default"}
        onClick={() => {
          input.onChange("zh");
          setLocale("zh");
        }}
      >
        zh
      </Button>
    </>
  );
};
