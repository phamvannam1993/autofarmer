import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { withFirebase } from "../../Firebase";

import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const INITIAL_STATE = {
  email: "",
  error: null
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        // this.props.history.push('/');
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <Wrapper>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Reset password
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          Enter your email to reset your password
        </Typography>
        <form onSubmit={this.onSubmit}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" 
              name="email" 
              value={this.state.email}
              onChange={this.onChange}
              autoComplete="email" 
              autoFocus />
          </FormControl>
          <Button 
            disabled={isInvalid} 
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            mt={2}
          >
            Reset password
          </Button>
          <Button
            style={{marginTop:'10px'}}
            component={Link}
            to="/"
            fullWidth
            color="primary"
          >
            Go to Sign in
          </Button>
          {error && <p style={{color:'red'}}>{error.message}</p>}
        </form>
      </Wrapper>
    );
  }
}

export default withFirebase(PasswordForgetFormBase);
