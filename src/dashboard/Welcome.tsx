import React, { FC } from "react";
import { Box, Card, CardActions, Button, Typography } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/HomeTwoTone";
import CodeIcon from "@material-ui/icons/CodeTwoTone";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslate } from "react-admin";

import publishArticleImage from "./welcome_illustration.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      theme.palette.type === "dark"
        ? "#535353"
        : `linear-gradient(to right, #3b8d99, #6b6b83, #aa4b6b)`, // https://uigradients.com/#Memariani
    color: "#fff",
    padding: 20,
    marginTop: theme.spacing(2),
    marginBottom: "1em",
  },
  media: {
    background: `url(${publishArticleImage}) top right / cover`,
    marginLeft: "auto",
  },
  actions: {
    [theme.breakpoints.down("md")]: {
      padding: 0,
      flexWrap: "wrap",
      "& a": {
        marginTop: "1em",
        marginLeft: "0!important",
        marginRight: "1em",
      },
    },
  },
}));

export const Welcome: FC = () => {
  const translate = useTranslate();
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <Box display="flex">
        <Box flex="1">
          <Typography variant="h5" component="h2" gutterBottom>
            {translate("pos.dashboard.welcome.title")}
          </Typography>
          <Box maxWidth="40em">
            <Typography variant="body1" component="p" gutterBottom>
              {translate("pos.dashboard.welcome.subtitle")}
            </Typography>
          </Box>
          <CardActions className={classes.actions}>
            <Button
              variant="contained"
              href="https://github.com/CrownKira/digitalace"
              startIcon={<HomeIcon />}
            >
              {translate("pos.dashboard.welcome.ra_button")}
            </Button>
            <Button
              variant="contained"
              href="https://github.com/CrownKira/digitalace-frontend.git"
              startIcon={<CodeIcon />}
            >
              {translate("pos.dashboard.welcome.demo_button")}
            </Button>
          </CardActions>
        </Box>
        <Box
          display={{ xs: "none", sm: "none", md: "block" }}
          className={classes.media}
          width="16em"
          height="9em"
          overflow="hidden"
        />
      </Box>
    </Card>
  );
};
