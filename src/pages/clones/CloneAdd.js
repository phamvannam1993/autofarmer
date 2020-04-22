import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {withFirebase} from "../../Firebase";
import {compose} from "recompose";
import {Link, withRouter} from "react-router-dom";
import countryList from 'react-select-country-list'
import queryString from 'query-string';
import request from 'request-promise'
import JSAlert from 'js-alert';
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

import {CloudUpload as MuiCloudUpload} from "@material-ui/icons";

import {spacing} from "@material-ui/system";

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
        uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/InsertClone',
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
        }).catch(error => alert('Error! ' + error.message))
    return dataResult[0]
};

function LeftForm({firebase, location}) {

    let params = queryString.parse(location.search)
    const [userid, setUserid] = useState(params.query)
    const [loading, setloading] = useState(false)
    const [checkSave, setCheckSave] = useState(0)
    const [clone, setClone] = useState({
        country: 'vn',
        clones: '',
        type: 'facebook'
    })

    const onChange = event => setClone({...clone, [event.target.name]: event.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        const users = localStorage.getItem('users')
        const userArr = JSON.parse(users)
        const token = userArr.token
        if(checkSave == 1) {
            return false
        }
        setCheckSave(1)
        const data = {
            country: clone.country,
            type: clone.type,
            clones: clone.clones,
            token: token
        }
        setloading(true)
        const result = await postApi(data);
        setCheckSave(0)
        setloading(false)
        if (result.success) {
            window.location.href = '/clone/list';
        } else {
            JSAlert.alert('<code>' + result.message + '</code>', null, JSAlert.Icons.Failed);
            return false;
        }

        return;
    }

    const onclickRedirect = async e => {
        window.location.href = '/clone/list';
    }

    const isInvalid = clone.country === "" || clone.clones === "" || clone.type === "";
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
                        <FormLabel>Country</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <Select id="country" name="country" mt={4} value={clone.country} onChange={onChange}
                                style={{width: '200px'}}>
                            <MenuItem key="1" value="vn">Việt Nam</MenuItem>
                            <MenuItem key="2" value="in">Indonesia</MenuItem>
                            <MenuItem key="3" value="en">England</MenuItem>
                            <MenuItem key="4" value="au">Australia</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Clones</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <TextareaAutosize onChange={onChange} name="clones" id="clones"
                                          style={{width: '100%', height: '300px'}}>
                        </TextareaAutosize>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Type</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <Select id="type" name="type" mt={4} value={clone.type} onChange={onChange}
                                style={{width: '200px'}}>
                            <MenuItem key="1" value="facebook">facebook</MenuItem>
                            <MenuItem key="2" value="zalo">zalo</MenuItem>
                            <MenuItem key="3" value="instagram">instagram</MenuItem>
                            <MenuItem key="4" value="twitter">twitter</MenuItem>
                            <MenuItem key="5" value="pinterest">pinterest</MenuItem>
                        </Select>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={8}>
                    </Grid>
                    <Grid item md={2}>
                        <SaveButton variant="contained" color="primary" onClick={onSubmit} disabled={isInvalid}>
                            Save
                        </SaveButton>
                    </Grid>
                    <Grid item md={2}>
                        <CancelButton variant="contained" onClick={onclickRedirect}>
                            Cancel
                        </CancelButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

function Settings({firebase, location}) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Add clones
            </Typography>

            <Divider my={6}/>

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
