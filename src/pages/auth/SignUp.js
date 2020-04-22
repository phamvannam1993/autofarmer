import React, {Component} from "react";
import styled from "styled-components";
import {Link, withRouter} from "react-router-dom";
import queryString from 'query-string';
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import validator from 'validator';
import JSAlert from 'js-alert';
import request from 'request-promise';
import md5 from 'md5';
import {
    FormControl,
    Input,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography
} from "@material-ui/core";
import {spacing} from "@material-ui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const INITIAL_STATE = {
    username: "",
    fullname: "",
    passwordOne: "",
    passwordTwo: "",
    error: null
};

const API = 'https://ipapi.co/json/';
let params = queryString.parse(window.location.search)
const reference_code = params.reference_code
if(!reference_code) {
    window.location.href = '/'
}
class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }


    onChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };



    render() {
        const {username, fullname, passwordOne, passwordTwo, error} = this.state;
        const checkSave = 0
        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === "" ||
            fullname === "" ||
            username === "";

        const postApi = async function (data) {
            const options = {
                method: 'POST',
                uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/InsertUser',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: JSON.stringify(data)
                })
            }
            const dataResult = [];
            await request(options)
                .then(function (parsedBody) {
                    const parsedBodyArr = JSON.parse(parsedBody)
                    dataResult.push(parsedBodyArr.result)
                })
            return dataResult[0]
        };

        const onSubmit = async e => {
            const {username, fullname, passwordOne} = this.state;
            const isValidPhoneNumber = validator.isMobilePhone(username)
            if(!isValidPhoneNumber) {
                JSAlert.alert('<code>Phone number format is incorrect</code>', null, JSAlert.Icons.Failed);
                return false;
            }
            var randomToken = require('random-token').create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
            const token = randomToken(40);
            const data = {
                username: username,
                fullname:fullname,
                balance:0,
                token:token,
                status:'Active',
                reference_code: reference_code,
                password: md5(passwordOne)
            }
            const result = await postApi(data);
            if (result.success) {
                localStorage.setItem('users', JSON.stringify(data))
                this.props.history.push('/')
                window.location.reload();
            } else {
                JSAlert.alert('<code>' + result.message + '</code>', null, JSAlert.Icons.Failed);
                return false;
            }
        };

        return (
            <Wrapper>
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    Get started
                </Typography>
                <Typography component="h2" variant="body1" align="center">
                    Start creating the best possible user experience for you customers
                </Typography>
                <form onSubmit={this.onSubmit}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="fullname">Full Name</InputLabel>
                        <Input id="fullname"
                               name="fullname"
                               value={fullname}
                               onChange={this.onChange}
                               autoFocus/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="username">UserName (Phone Number)</InputLabel>
                        <Input id="username"
                               name="username"
                               value={username}
                               onChange={this.onChange}/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="passwordOne">Password</InputLabel>
                        <Input
                            name="passwordOne"
                            type="password"
                            id="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="passwordTwo">Confirm Password</InputLabel>
                        <Input
                            name="passwordTwo"
                            type="password"
                            id="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                        />
                    </FormControl>
                    <Button
                        disabled={isInvalid}
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        mt={2}
                        onClick={onSubmit}
                    >
                        Sign up
                    </Button>
                    {error && <p style={{color: 'red'}}>{error.message}</p>}
                </form>
            </Wrapper>
        );
    }
}

// export default SignUp;
const SignUp = compose(
    withRouter,
    withFirebase
)(SignUpForm);

export default SignUp;
