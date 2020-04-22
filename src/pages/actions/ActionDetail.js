import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withFirebase } from "../../Firebase";
import { compose } from "recompose";
import { Link, withRouter } from "react-router-dom";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
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
const users = localStorage.getItem('users')
const userArr = JSON.parse(users)
const token = userArr.token
const postApi = async function (data) {
    const options = {
        method: 'POST',
        uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/InsertAction',
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

    let params = queryString.parse(location.search)
    const [actionId, setactionId] = useState(params.query)
    const [loading, setLoading] = useState(true)
    const [action, setaction] = useState({
        FeedLike_check:false, FeedLike_time_out:3, FeedLike_re_run:60,FeedLike_des:'',
        VipLike_check:false, VipLike_time_out:3,VipLike_re_run:60, VipLike_des:'',
        LikePage_check:false, LikePage_time_out:3, LikePage_re_run:60, LikePage_des:'',
        SubFollow_check:false, SubFollow_time_out:3, SubFollow_re_run:60, SubFollow_des:'',
        PageLike_check:false, PageLike_time_out:3, PageLike_re_run:60, PageLike_des:'',
        GroupLike_check:false,  GroupLike_time_out:3, GroupLike_re_run:60, GroupLike_des:'',
        FriendLike_check:false, FriendLike_time_out:3, FriendLike_re_run:60, FriendLike_des:'',
        AddFriendSuggest_check:false, AddFriendSuggest_time_out:3, AddFriendSuggest_re_run:60, AddFriendSuggest_des:'',
        AddFriendUid_check:false, AddFriendUid_time_out:3,AddFriendUid_re_run:60, AddFriendUid_des:'',
        ConfirmFriend_check:false, ConfirmFriend_time_out:3, ConfirmFriend_re_run:60, ConfirmFriend_des:'',
        JoinGroup_check:false, JoinGroup_time_out:3, JoinGroup_re_run:60, JoinGroup_des:'',
        ShareNow_check:false, ShareNow_time_out:3, ShareNow_re_run:60, ShareNow_des:'',
        ShareGroup_check:false, ShareGroup_time_out:3, ShareGroup_re_run:60, ShareGroup_des:'',
        ChangePassword_check:false, ChangePassword_time_out:3, ChangePassword_re_run:60, ChangePassword_des:'',
        Avatar_check:false, Avatar_time_out:3,Avatar_re_run:60,Avatar_des:'',
        Cover_check:false, Cover_time_out:3,Cover_re_run:60,Cover_des:'',
    })

    useEffect(() => {
        const options = {
            method: 'POST',
            uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetActionDetail',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                data:JSON.stringify({type:'action',token:token, id:actionId})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if(parsedBodyArr.result.success) {
                    const dataAction = parsedBodyArr.result.dataAction[0]
                    const  dataAfter = []
                    for (const [key, value] of Object.entries(dataAction)) {
                        dataAfter[key+'_check'] = value.check
                        dataAfter[key+'_time_out'] = value.time_out
                        dataAfter[key+'_re_run'] = value.re_run
                        dataAfter[key+'_des'] = value.des
                    }
                    const data = Object.assign({}, dataAfter)
                    setaction(data)
                    setLoading(false)
                }
            })
    }, [])

    const onChange = event => setaction({ ...action, [event.target.name]: event.target.value});
    const onCheckBox = event => setaction({ ...action, [event.target.name]: event.target.checked});
    const onSubmit = async e  => {
        e.preventDefault();
        const dataSave = {
            FeedLike:{check:action.FeedLike_check,time_out:action.FeedLike_time_out, re_run:action.FeedLike_re_run, des:action.FeedLike_des},
            VipLike:{check:action.VipLike_check,time_out:action.VipLike_time_out, re_run:action.VipLike_re_run, des:action.VipLike_des},
            LikePage:{check:action.LikePage_check,time_out:action.LikePage_time_out, re_run:action.LikePage_re_run, des:action.LikePage_des},
            SubFollow:{check:action.SubFollow_check,time_out:action.SubFollow_time_out, re_run:action.SubFollow_re_run, des:action.SubFollow_des},
            PageLike:{check:action.PageLike_check,time_out:action.PageLike_time_out, re_run:action.PageLike_re_run, des:action.PageLike_des},
            GroupLike:{check:action.GroupLike_check,time_out:action.GroupLike_time_out, re_run:action.GroupLike_re_run, des:action.GroupLike_des},
            FriendLike:{check:action.FriendLike_check,time_out:action.FriendLike_time_out, re_run:action.FriendLike_re_run, des:action.FriendLike_des},
            AddFriendSuggest:{check:action.AddFriendSuggest_check,time_out:action.AddFriendSuggest_time_out, re_run:action.AddFriendSuggest_re_run, des:action.AddFriendSuggest_des},
            ConfirmFriend:{check:action.ConfirmFriend_check,time_out:action.ConfirmFriend_time_out, re_run:action.ConfirmFriend_re_run, des:action.ConfirmFriend_des},
            AddFriendUid:{check:action.AddFriendUid_check,time_out:action.AddFriendUid_time_out, re_run:action.AddFriendUid_re_run, des:action.AddFriendUid_des},
            JoinGroup:{check:action.JoinGroup_check,time_out:action.JoinGroup_time_out, re_run:action.JoinGroup_re_run, des:action.JoinGroup_des},
            ShareGroup:{check:action.ShareGroup_check,time_out:action.ShareGroup_time_out, re_run:action.ShareGroup_re_run, des:action.ShareGroup_des},
            ShareNow:{check:action.ShareNow_check,time_out:action.ShareNow_time_out, re_run:action.ShareNow_re_run, des:action.ShareNow_des},
            ChangePassword:{check:action.ChangePassword_check,time_out:action.ChangePassword_time_out, re_run:action.ChangePassword_re_run, des:action.ChangePassword_des},
            Avatar:{check:action.Avatar_check,time_out:action.Avatar_time_out, re_run:action.Avatar_re_run, des:action.Avatar_des},
            Cover:{check:action.Cover_check,time_out:action.Cover_time_out, re_run:action.Cover_re_run, des:action.Cover_des}
        }
        const data = {
            type:'user',
            token:token,
            id:actionId,
            action : dataSave
        }
        setLoading(true)
        const result = await postApi(data);
        if(result.success) {
            window.location.href = '/action/list';
        } else {
            setLoading(false)
            JSAlert.alert('<code>'+result.message+'</code>', null, JSAlert.Icons.Failed);
            return false;
        }
        //firebase.db.ref('settings/setting_admin').set(group)
        //window.location.reload();
        return;
    }
    return (
        <Card mb={6}>
            <CardContent>
                { loading ? <div className="waitting">
                    <Loader type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100} />
                </div> : ''}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Action Name</TableCell>
                            <TableCell align="left">Số lần thực hiện</TableCell>
                            <TableCell align="left">Chạy lại sau N phút</TableCell>
                            <TableCell align="left">Mô tả</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow key="1">
                            <TableCell align="left">
                                <input type="checkbox" name="VipLike_check" checked={action.VipLike_check} onChange={onCheckBox} />
                                VipLike
                            </TableCell>
                            <TableCell align="left">
                                <Input name="VipLike_time_out" id="VipLike_time_out" value={action.VipLike_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="FeedLike_re_run" id="name" value={action.FeedLike_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="VipLike_des"  style={{width : '100%', height:'50px'}}>{action.VipLike_des}</TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="2">
                            <TableCell align="left">
                                <input type="checkbox" name="LikePage_check" checked={action.LikePage_check} onChange={onCheckBox} /> LikePage
                            </TableCell>
                            <TableCell align="left">
                                <Input name="LikePage_time_out" id="LikePage_time_out" value={action.LikePage_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="LikePage_re_run" id="name" value={action.LikePage_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="FeedLike_des" value={action.FeedLike_des}    style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="3">
                            <TableCell align="left">
                                <input type="checkbox" name="SubFollow_check" checked={action.SubFollow_check} onChange={onCheckBox} /> SubFollow
                            </TableCell>
                            <TableCell align="left">
                                <Input name="SubFollow_time_out" id="SubFollow_time_out" value={action.SubFollow_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="SubFollow_re_run" id="name" value={action.SubFollow_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="SubFollow_des" value={action.SubFollow_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="4">
                            <TableCell align="left">
                                <input type="checkbox" name="FeedLike_check" checked={action.FeedLike_check} onChange={onCheckBox} />
                                FeedLike
                            </TableCell>
                            <TableCell align="left">
                                <Input name="FeedLike_time_out" id="FeedLike_time_out" value={action.FeedLike_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="FeedLike_re_run" id="name" value={action.FeedLike_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="FeedLike_des"    style={{width : '100%', height:'50px'}}>{action.FeedLike_des}</TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="22">
                            <TableCell align="left">
                                <input type="checkbox" name="PageLike_check" checked={action.PageLike_check} onChange={onCheckBox} />
                                PageLike
                            </TableCell>
                            <TableCell align="left">
                                <Input name="PageLike_time_out" id="FeedLike_time_out" value={action.PageLike_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="PageLike_re_run" id="name" value={action.PageLike_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="PageLike_des"  style={{width : '100%', height:'50px'}}>{action.PageLike_des}</TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="13">
                            <TableCell align="left">
                                <input type="checkbox" name="GroupLike_check" checked={action.GroupLike_check} onChange={onCheckBox} />
                                GroupLike
                            </TableCell>
                            <TableCell align="left">
                                <Input name="GroupLike_time_out" id="GroupLike_time_out" value={action.GroupLike_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="GroupLike_re_run" id="name" value={action.GroupLike_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="GroupLike_des" value={action.GroupLike_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="20">
                            <TableCell align="left">
                                <input type="checkbox" name="FriendLike_check" checked={action.FriendLike_check} onChange={onCheckBox} />
                                GroupLike
                            </TableCell>
                            <TableCell align="left">
                                <Input name="FriendLike_time_out" id="GroupLike_time_out" value={action.FriendLike_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="FriendLike_re_run" id="name" value={action.FriendLike_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="GroupLike_des" value={action.FriendLike_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="5">
                            <TableCell align="left">
                                <input type="checkbox" name="AddFriendSuggest_check" checked={action.AddFriendSuggest_check} onChange={onCheckBox} />
                                AddFriendSuggest
                            </TableCell>
                            <TableCell align="left">
                                <Input name="AddFriendSuggest_time_out" id="AddFriendSuggest_time_out" value={action.AddFriendSuggest_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="AddFriendSuggest_re_run" id="name" value={action.AddFriendSuggest_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="AddFriendSuggest_des" value={action.AddFriendSuggest_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="7">
                            <TableCell align="left">
                                <input type="checkbox" name="ConfirmFriend_check" checked={action.ConfirmFriend_check} onChange={onCheckBox} />
                                ConfirmFriend
                            </TableCell>
                            <TableCell align="left">
                                <Input name="ConfirmFriend_time_out" id="ConfirmFriend_time_out" value={action.ConfirmFriend_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="ConfirmFriend_re_run" id="name" value={action.ConfirmFriend_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="ConfirmFriend_des" value={action.ConfirmFriend_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="6">
                            <TableCell align="left">
                                <input type="checkbox" name="AddFriendUid_check" checked={action.AddFriendUid_check} onChange={onCheckBox} />
                                AddFriendUid
                            </TableCell>
                            <TableCell align="left">
                                <Input name="AddFriendUid_time_out" id="AddFriendUid_time_out" value={action.AddFriendUid_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="AddFriendUid_re_run" id="name" value={action.AddFriendUid_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="AddFriendUid_des" value={action.AddFriendUid_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="9">
                            <TableCell align="left">
                                <input type="checkbox" name="JoinGroup_check" checked={action.JoinGroup_check} onChange={onCheckBox} />
                                JoinGroup
                            </TableCell>
                            <TableCell align="left">
                                <Input name="JoinGroup_time_out" id="JoinGroup_time_out" value={action.JoinGroup_time_out} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <Input name="JoinGroup_re_run" id="name" value={action.JoinGroup_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="JoinGroup_des" value={action.JoinGroup_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="10">
                            <TableCell align="left">
                                <input type="checkbox" name="ShareNow_check" checked={action.ShareNow_check} onChange={onCheckBox} />
                                ShareNow
                            </TableCell>
                            <TableCell align="left">
                            </TableCell>
                            <TableCell align="left">
                                <Input name="ShareNow_re_run" id="name" value={action.ShareNow_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="ShareNow_des" value={action.ShareNow_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="11">
                            <TableCell align="left">
                                <input type="checkbox" name="ShareGroup_check" checked={action.ShareGroup_check} onChange={onCheckBox} />
                                ShareGroup
                            </TableCell>
                            <TableCell align="left">
                            </TableCell>
                            <TableCell align="left">
                                <Input name="ShareGroup_re_run" id="name" value={action.ShareGroup_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="ShareGroup_des" value={action.ShareGroup_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="14">
                            <TableCell align="left">
                                <input type="checkbox" name="ChangePassword_check" checked={action.ChangePassword_check} onChange={onCheckBox} />
                                ChangePassword
                            </TableCell>
                            <TableCell align="left">

                            </TableCell>
                            <TableCell align="left">
                                <Input name="ChangePassword_re_run" id="name" value={action.ChangePassword_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="ChangePassword_des" value={action.ChangePassword_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="15">
                            <TableCell align="left">
                                <input type="checkbox" name="Avatar_check" checked={action.Avatar_check} onChange={onCheckBox} />
                                Avatar
                            </TableCell>
                            <TableCell align="left">

                            </TableCell>
                            <TableCell align="left">
                                <Input name="Avatar_re_run" id="name" value={action.Avatar_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="Avatar_des" value={action.Avatar_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>

                        <TableRow key="16">
                            <TableCell align="left">
                                <input type="checkbox" name="Cover_check" checked={action.Cover_check} onChange={onCheckBox} />
                                Cover
                            </TableCell>
                            <TableCell align="left">

                            </TableCell>
                            <TableCell align="left">
                                <Input name="Cover_re_run" id="name" value={action.Cover_re_run} onChange={onChange} />
                            </TableCell>
                            <TableCell align="left">
                                <TextareaAutosize onChange={onChange} name="Cover_des" value={action.Cover_des}   style={{width : '100%', height:'50px'}}></TextareaAutosize>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

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
                Add Action
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
