import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withFirebase } from "../../Firebase";
import { compose } from "recompose";
import { Link, withRouter } from "react-router-dom";
import countryList from 'react-select-country-list'
import queryString from 'query-string';

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
    Form,
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

function LeftForm({firebase, location}) {

    let params = queryString.parse(location.search)
    const [userid, setUserid] = useState(params.query)

    const [setting, setSetting] = useState({
        CGBConsole_versionCode: '',
        apk_version_code: '',
        apk_test_version: '',
        money: '',
        money_usd: '',
        // address: customeraddress
        apkmaxrunningtime: '',
        help_link: '',
        ssh_queue: '',
        proxy_queue: '',
        debug_log_config: '',
        DropBoxAccessToken:'',
        deleted: false
    })

    // useEffect(() => {
    //     firebase.db.ref('settings/setting_admin').on('value', function(snapshot) {
    //         if (snapshot.empty) {
    //             console.log('No matching users documents.');
    //             return;
    //         }
    //         setSetting({
    //             CGBConsole_versionCode:snapshot.val().CGBConsole_versionCode,
    //             apk_version_code: snapshot.val().apk_version_code,
    //             apk_test_version: snapshot.val().apk_test_version,
    //             money: snapshot.val().money,
    //             money_usd: snapshot.val().money_usd,
    //             // address: customeraddress
    //             apkmaxrunningtime: snapshot.val().apkmaxrunningtime,
    //             help_link: snapshot.val().help_link,
    //             ssh_queue: snapshot.val().ssh_queue,
    //             proxy_queue: snapshot.val().proxy_queue,
    //             debug_log_config: snapshot.val().debug_log_config,
    //             DropBoxAccessToken:snapshot.val().DropBoxAccessToken,
    //             deleted: false
    //         })
    //     });
    // }, [])

    const onChange = event => setSetting({ ...setting, [event.target.name]: event.target.value})

    const onSubmit = e => {
        e.preventDefault();
        firebase.db.ref('settings/setting_admin').set(setting)

        return;
    }

    return (
        <Card mb={6}>
            <CardContent>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>CGBConsole Version Code</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="CGBConsole_versionCode" id="name" value={setting.CGBConsole_versionCode} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>APK Version Code</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="apk_version_code" id="name" value={setting.apk_version_code} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>APK Test version</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="apk_test_version" id="name" value={setting.apk_test_version} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>A cost per day</FormLabel>
                    </Grid>
                    <Grid item md={2}>
                        <FormControl fullWidth mb={3}>
                            <Input name="money" id="name" value={setting.money} onChange={onChange}/>
                        </FormControl>
                    </Grid>
                    <Grid item md={3}>
                        <FormControl fullWidth mb={3}>
                            <Input name="money_usd" id="name" value={setting.money_usd} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Apk Max Running Time</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="apkmaxrunningtime" id="name" value={setting.apkmaxrunningtime} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Help Link</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="help_link" id="help_link" value={setting.help_link} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>SSH Queue</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="ssh_queue" id="ssh_queue" value={setting.ssh_queue} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Proxy Queue</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="proxy_queue" id="proxy_queue" value={setting.proxy_queue} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Debug Log Config</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <TextareaAutosize onChange={onChange} name="debug_log_config" id="debug_log_config" value={setting.debug_log_config}  style={{width : '100%', height:'100px'}}>
                        </TextareaAutosize>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>DropBox Access Token</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <FormControl fullWidth mb={3}>
                            <Input name="DropBoxAccessToken" id="DropBoxAccessToken" value={setting.DropBoxAccessToken} onChange={onChange} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={6}>
                    <Grid item md={8}>
                    </Grid>
                    <Grid item md={2}>
                        <CancelButton variant="contained">
                            Cancel
                        </CancelButton>
                    </Grid>
                    <Grid item md={2}>
                        <SaveButton variant="contained" color="primary" onClick={onSubmit}>
                            Save
                        </SaveButton>
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
                Customer Settings
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
