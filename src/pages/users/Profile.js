import React, { useState, useEffect } from "react";
import request from 'request-promise'
import styled from "styled-components";
import { withFirebase } from "../../Firebase";
import { compose } from "recompose";
import { Link, withRouter } from "react-router-dom";
import countryList from 'react-select-country-list'
import queryString from 'query-string';
import randomToken from 'random-token';
import JSAlert from 'js-alert';
import md5 from 'md5';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import {
    Avatar,
    Button,
    Card as MuiCard,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormLabel,
    Divider as MuiDivider,
    FormControl as MuiFormControl,
    Grid,
    Input,
    Checkbox,
    Radio,
    RadioGroup,
    FormControlLabel,
    InputLabel,
    Typography,
    TextareaAutosize,
    Select as MuiSelect,
    MenuItem
} from "@material-ui/core";

import { CloudUpload as MuiCloudUpload } from "@material-ui/icons";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const CloudUpload = styled(MuiCloudUpload)(spacing);

const Select = styled(MuiSelect)(spacing);

const CenteredContent = styled.div`
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing(2)}px;
`;

const SaveButton = styled(Button)`
  color:white;
  padding-left:40px;
  padding-right:40px;
`;

const CancelButton = styled(Button)`
  background: #3fa0ce;
  color:white;
  padding-left:35px;
  padding-right:35px;
`;

const countryoptions = countryList().getData()

const postApi = async function (data) {
    const options = {
        method: 'POST',
        uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/UpdateUser',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            data:JSON.stringify(data)
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

function LeftForm({firebase, location}) {
    const [user, setUser] = useState({
        fullname: '', username:'', token:'', reference_code : ''
    })
    const [loading, setloading] = useState(true)
    useEffect(() => {
        const users = localStorage.getItem('users')
        const userArr = JSON.parse(users)
        const token = userArr.token
        const options = {
            method: 'POST',
            uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/getUser',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                data:JSON.stringify({token:token,page:1})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if(parsedBodyArr.result.success) {
                    const dataView = []
                    for (const [key, value] of Object.entries(parsedBodyArr.result.data)) {
                        value.id = key
                        dataView.push(value)
                    }
                    if(dataView.length > 0) {
                        setUser(dataView[0])
                    }
                    setloading(false)
                }
            })
    }, [])

    return (
        <Card mb={6}>
            <CardContent>
                { loading ? <div className="waitting">
                    <Loader type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100} />
                </div> : ''}
                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Họ và tên</FormLabel>
                    </Grid>
                    <Grid item md={6}>
                        <FormControl fullWidth mb={3}>
                            <Input name="fullname" id="name" value={user.fullname} disabled />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Phone Number</FormLabel>
                    </Grid>
                    <Grid item md={6}>
                        <FormControl fullWidth mb={3}>
                            <Input name="username" id="name" value={user.username} disabled />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Token</FormLabel>
                    </Grid>
                    <Grid item md={6}>
                        <FormControl fullWidth mb={3}>
                            <Input name="username" id="name" value={user.token} disabled />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Link mời</FormLabel>
                    </Grid>
                    <Grid item md={6}>
                        <FormControl fullWidth mb={3}>
                            <Input name="username" id="name" value={user.reference_code ? 'https://www.autofarmer.net/sign-up?reference_code='+user.reference_code:''} disabled />
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function Settings({firebase, location} ) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Profile
            </Typography>

            <Divider my={6} />

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <LeftForm firebase={firebase} location={location}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const SettingComponent = compose(
    withRouter,
    withFirebase
)(Settings);

export default SettingComponent;
