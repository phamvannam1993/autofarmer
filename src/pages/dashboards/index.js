import React from "react";
import styled, { withTheme } from "styled-components";

import { withFirebase } from "../../Firebase";

import {
  Grid,
  Divider as MuiDivider,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Default({ firebase, theme }) {
  console.log('{firebase.auth.currentUser.displayName}',firebase.auth.currentUser)
  return (
    <React.Fragment>
      <Grid justify="space-between" container spacing={6}>
        <Grid item>
          <Typography variant="h3" display="inline">
            Welcome back, {firebase.auth.currentUser.displayName}
          </Typography>
          <Typography variant="body2" ml={2} display="inline">
            Monday, 29 April 2019
          </Typography>
        </Grid> 
      </Grid>

      <Divider my={6} /> 
    </React.Fragment>
  );
}

export default withFirebase(withTheme(Default));
