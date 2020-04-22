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
        uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/InsertGroup',
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

function LeftForm({firebase, location}) {
    const [checkSave, setCheckSave] = useState(0)
    let params = queryString.parse(location.search)
    const [userid, setUserid] = useState(params.query)
    const [loading, setloading] = useState(false)
    const [group, setgroup] = useState({
        name: '',
        uids: ''
    })

    const onChange = event => setgroup({...group, [event.target.name]: event.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        const uids = group.uids
        const uidArr = uids.split("\n");
        const users = localStorage.getItem('users')
        const userArr = JSON.parse(users)
        const token = userArr.token
        const data = {
            name: group.name,
            uids: uidArr,
            token: token,
            action: 'insert'
        }
        if(checkSave == 1) {
            return false
        }
        setCheckSave(1)
        setloading(true)
        const result = await postApi(data);
        if (result.success) {
            window.location.href = '/group/list';
        } else {
            setloading(false)
            setCheckSave(0)
            JSAlert.alert('<code>' + result.message + '</code>', null, JSAlert.Icons.Failed);
            return false;
        }
        // window.location.href = '/group/list';
        //firebase.db.ref('settings/setting_admin').set(group)
        //window.location.reload();
        return;
    }

    const onclickRedirect = async e => {
        window.location.href = '/group/list';
    }
    const isInvalid = group.uids === "" || group.name === "";
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
                        <FormLabel>Group Name</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="name" id="name" value={group.name} onChange={onChange}/>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>uids</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <TextareaAutosize onChange={onChange} name="uids" id="uids"
                                          style={{width: '100%', height: '300px'}}>
                        </TextareaAutosize>
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
                Add groups
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
