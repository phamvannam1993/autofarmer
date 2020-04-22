import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Link, withRouter} from 'react-router-dom';
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import ReactPaginate from 'react-paginate';
import request from 'request-promise';
import ReCAPTCHA from "react-google-recaptcha";
import JSAlert from 'js-alert';
import queryString from 'query-string';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';

import {
    Grid,
    CardContent,
    Card as MuiCard,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Button as MuiButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    FormLabel
} from "@material-ui/core";

import {
    Add as AddIcon
} from "@material-ui/icons";

import {spacing} from "@material-ui/system";
import Moment from 'react-moment';
Moment.globalFormat = 'YYYY-MM-DD HH:mm:ss';
const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Button = styled(MuiButton)(spacing);
// Data
let id = 1;
let key = 0
const users = localStorage.getItem('users')
const userArr = JSON.parse(users)
const token = userArr.token

const postApi = async function (data) {
    const options = {
        method: 'POST',
        uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/applyGiftCode',
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

function UsersTable({history, location}) {
    let params = queryString.parse(location.search)
    const [checkSave, setCheckSave] = useState(0)
    const [GiftCode, setGiftCode] = useState({
        code: '',
        capcha:''
    })
    const onSubmit = async e => {
        const data = {
            token:token,
            code:GiftCode.code
        }
        if(checkSave == 1) {
            return false
        }
        setCheckSave(1)
        const result = await postApi(data);
        setCheckSave(0)
        if (result.success) {
            JSAlert.alert('<code>' + result.message + '</code>', null, JSAlert.Icons.Success);
        } else {
            JSAlert.alert('<code>' + result.message + '</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    }
    const onChange = event => setGiftCode({...GiftCode, [event.target.name]: event.target.value});
    const onChangeCap = (value) => {
        GiftCode.capcha = value
    }
    const isInvalid = GiftCode.code === ""
    return (
        <Card mb={6}>
            <CardContent>
                <Grid container spacing={6}>
                    <Grid item md={3}>
                        <FormLabel>Mã gift code</FormLabel>
                    </Grid>
                    <Grid item md={5}>
                        <input type="text" name="code" required="required" onChange={onChange} className="form-control col-md-7 col-xs-12" value={GiftCode.code} />
                    </Grid>
                </Grid>
                <div className="form-group">
                    <div className="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-success mg10" onClick={onSubmit} disabled={isInvalid}>Nhận thưởng</button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function UsersList({history, location, firebase}) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Gift code Nhập mã gift code
            </Typography>

            <Divider my={6}/>

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <UsersTable history={history} location={location}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const InvestListComponent = compose(
    withRouter,
    withFirebase
)(UsersList);

export default InvestListComponent;

// export default UsersList;
