import React, {Component} from "react";
import {compose} from "recompose";
import styled from "styled-components";
import {Link, withRouter} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import {withFirebase} from "../../Firebase";
import request from 'request-promise'
import md5 from 'md5';
import JSAlert from 'js-alert';
import queryString from 'query-string';
// import { AuthUserContext, withAuthorization } from "../../Session";

import {
    Avatar,
    Checkbox,
    FormControl,
    FormControlLabel,
    Input,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography
} from "@material-ui/core";
import {spacing} from "@material-ui/system";

import TwitterIcon from '@material-ui/icons/Twitter';
// const condition = authUser => !!authUser;

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${props => props.theme.spacing(5)}px;
`;

const CenteredContent = styled.div`
  text-align: center;
`;

const GoogleButton = styled(Button)`
  background: #fff;
  color: #333;
`;

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null
};

const API = 'https://ipapi.co/json/';

const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    handleGoogleLogin() {
        this.props.firebase.doSigninWithGoogle()
            .catch(function (error) {
                alert(error); // or show toast
                localStorage.removeItem(firebaseAuthKey);
            });
        localStorage.setItem(firebaseAuthKey, "1");
    }

    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };
    onChangeCap = (value) => {
        this.setState({capcha: value});
    }

    render() {
        const {email, password, error, capcha} = this.state;

        const postApi = async function () {
            const options = {
                method: 'POST',
                uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/checkLogin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    data:JSON.stringify({
                        username: email,
                        password: password
                    })
                })
            }
            const dataResult = [];
            await request(options)
                .then(function (parsedBody) {
                    const parsedBodyArr = JSON.parse(parsedBody)
                    dataResult.push(parsedBodyArr.result)
                })
            if(dataResult.length > 0) {
                return dataResult[0]
            } else {
                return dataResult
            }
        };

        // const isInvalid = password === "" || email === "";
        const onSubmit = async e => {
            if (email === '' || password === '') {
                JSAlert.alert("<code>Vui lòng nhập username và password</code>", null, JSAlert.Icons.Failed);
                return false;
            }
            // if (typeof(capcha) === "undefined" && email !== 'phamvannam4624@gmail.com') {
            //     JSAlert.alert("<code>Vui lòng chọn capcha</code>", null, JSAlert.Icons.Failed);
            //     return false;
            // }
            const result = await postApi()
            console.log(result)
            if (result.success && result.data) {
                localStorage.setItem('users', JSON.stringify(result.data))
                JSAlert.alert("<code>Login success</code>", null, JSAlert.Icons.Success);
                this.props.history.push('/')
                window.location.reload();
            } else {
                JSAlert.alert("<code>username or passoword falsed</code>", null, JSAlert.Icons.Failed);
            }
        };

        const isInvalid = email === "" || password === ""
        return (
            <Wrapper>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Welcome to AutoFarmer
                </Typography>

                <Typography component="h2" variant="body1" align="center">
                    Sign in to your account to continue
                </Typography>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Username</InputLabel>
                    <Input id="email"
                           value={email}
                           onChange={this.onChange}
                           name="email"
                           autoComplete="email"
                           autoFocus/>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        name="password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={this.onChange}
                        autoComplete="current-password"
                    />
                </FormControl>
                <ReCAPTCHA name="capcha"
                           sitekey="6Lf6Bq8UAAAAAG91_DvPgDr8EQna7kfHv8LlxQ1v"
                           onChange={this.onChangeCap}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary"/>}
                    label="Remember me"
                />
                <CenteredContent>
                    <Button
                        type="submit"
                        style={{width: '150px'}}
                        variant="contained"
                        color="primary"
                        mb={2}
                        onClick={onSubmit}
                        disabled={isInvalid}
                    >
                        Sign in
                    </Button>
                </CenteredContent>

                <Button
                    component={Link}
                    to="/auth/reset-password"
                    fullWidth
                    color="primary"
                >
                    Forgot password
                </Button>
                <div style={{height: '10px'}}/>

                {error && <p style={{color: 'red'}}>{error.message}</p>}
            </Wrapper>
        );
    }
}

const SignIn = compose(
    withRouter,
    withFirebase
)(SignInForm);

export default SignIn;
// export default withAuthorization(condition)(SignIn);
