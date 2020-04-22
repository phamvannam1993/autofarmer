import React from "react";
import { connect } from "react-redux";

import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { StylesProvider } from "@material-ui/styles";
import { ThemeProvider } from "styled-components";
import StartupState from './context/startup/StartupState'

import maTheme from "./theme";
import Routes from "./routes/Routes";
import { withAuthentication } from "./Session";

function App({ theme }) {
  return (
    <StartupState>
      <StylesProvider injectFirst>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <MuiThemeProvider theme={maTheme[theme.currentTheme]}>
            <ThemeProvider theme={maTheme[theme.currentTheme]}>
              <Routes />
            </ThemeProvider>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </StylesProvider>
    </StartupState>
  );
}

// export default connect(store => ({ theme: store.themeReducer })) withAuthentication(App);
export default withAuthentication(connect(store => ({ theme: store.themeReducer })) (App));
