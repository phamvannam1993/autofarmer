import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Link, withRouter} from 'react-router-dom';
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";

import JSAlert from 'js-alert';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import request from 'request-promise'
import ReactPaginate from 'react-paginate';
import {
    Grid,
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
    Select,
    MenuItem
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

function UsersTable({history, firebase}) {
    const [allDevices, setAllDevices] = useState(null)
    const [allActionProfiles, setAllActionProfiles] = useState(null)
    const [allFriends, setAllFriends] = useState(null)
    const [allGroups, setAllGroups] = useState(null)
    const [allPage, setAllPage] = useState(null)
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState(0)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const usercolumn = new Array()
    const users = localStorage.getItem('users')
    const userArr = JSON.parse(users)
    const token = userArr.token
    useEffect(() => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetDevice',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({limit: 100, page: 1, token: token})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                const dataDevice = []
                const dataActionProfile = []
                const dataFriend = []
                const dataGroups = []
                const dataPage= []
                if(parsedBodyArr.result.success) {
                    for (const [key, value] of Object.entries(parsedBodyArr.result.data.deviceList)) {
                        value.id = key
                        dataDevice.push(value)
                    }
                    if(parsedBodyArr.result.data.actionProfileList.data) {
                        for (const [key, value] of Object.entries(parsedBodyArr.result.data.actionProfileList.data)) {
                            value.id = key
                            dataActionProfile.push(value)
                        }
                    }
                    if(parsedBodyArr.result.data.friendList.data) {
                        for (const [key, value] of Object.entries(parsedBodyArr.result.data.friendList.data)) {
                            value.id = key
                            dataFriend.push(value)
                        }
                    }
                    if(parsedBodyArr.result.data.groupList.data) {
                        for (const [key, value] of Object.entries(parsedBodyArr.result.data.groupList.data)) {
                            value.id = key
                            dataGroups.push(value)
                        }
                    }
                    if(parsedBodyArr.result.data.pageList.data) {
                        for (const [key, value] of Object.entries(parsedBodyArr.result.data.pageList.data)) {
                            value.id = key
                            dataPage.push(value)
                        }
                    }
                    setCount(Math.ceil(parsedBodyArr.result.total / 100))
                }
                setAllDevices(dataDevice)
                setAllActionProfiles(dataActionProfile)
                setAllFriends(dataFriend)
                setAllGroups(dataGroups)
                setAllPage(dataPage)
                setLoading(false)
            })
    }, [])


    const handleDetail = (row) => {
        history.push({
            pathname:'/friend/detail',
            search: '?query='+row.friend_id
        });
    }

    const onChange = (id) => (event) => {
        const name = event.target.name
        const value = event.target.value
        const dataArr = []
              dataArr[name] = value
        const data = Object.assign({}, dataArr)
        const dataUpdate = {
            data:data,
            token:token,
            id:id
        }
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/UpdateDevice',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify(dataUpdate)
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if(parsedBodyArr.result.success) {
                    JSAlert.alert('<code>Cập nhật thành công</code>', null, JSAlert.Icons.Success);
                    const data = []
                    allDevices.map((rowArr) => {
                        if (rowArr.id === id) {
                            if(name === 'action_profile_id') {
                                rowArr.action_profile_id = value
                            }

                            if(name === 'group_id') {
                                rowArr.group_id = value
                            }

                            if(name === 'friend_id') {
                                rowArr.friend_id = value
                            }

                            if(name === 'page_id') {
                                rowArr.page_id = value
                            }
                            data.push(rowArr)
                        }
                    })
                    setAllDevices(data)
                }
            })
    };

    const handleDelete = (row) => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/DeleteDevice',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({id: row.id, token: token})
            })
        }
        setLoadingDelete(true)
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if (parsedBodyArr.result.success) {
                    const data = []
                    allDevices.map((rowArr) => {
                        if (row.id !== rowArr.id) {
                            data.push(rowArr)
                        }
                    })
                    setLoadingDelete(false)
                    setAllDevices(data)
                    JSAlert.alert('<code>Xóa thành công</code>', null, JSAlert.Icons.Success);
                } else {
                    JSAlert.alert('<code>Xóa thất bại</code>', null, JSAlert.Icons.Failed);
                    return false;
                }
            });
    };

    return (
        <Card mb={6}>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell align="left">Device Name</TableCell>
                            <TableCell align="left">Model</TableCell>
                            <TableCell align="left">Action Profile</TableCell>
                            <TableCell align="left">Group Profile</TableCell>
                            <TableCell align="left">Friend Profile</TableCell>
                            <TableCell align="left">Page</TableCell>
                            <TableCell align="left">Time Out</TableCell>
                            <TableCell align="left">Reset 3G</TableCell>
                            <TableCell align="left">Handle</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { loadingDelete ? <div className="waitting">
                            <Loader type="Puff"
                                    color="#00BFFF"
                                    height={100}
                                    width={100} />
                        </div> : ''}
                        {loading ? <Loader type="Puff"
                                           color="#00BFFF"
                                           height={100}
                                           width={100} /> : allDevices && allDevices.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left">{index+1}</TableCell>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">{row.device.model ? row.device.model : ''}</TableCell>
                                <TableCell align="left">
                                    <Select id={row.id} name="action_profile_id" mt={4} value={row.action_profile_id ? row.action_profile_id : ''}  style={{width: '200px'}} onChange={onChange(row.id)}>
                                        {allActionProfiles && allActionProfiles.map((row, k) => (
                                        <MenuItem key={k} value={row.id}>{row.name}</MenuItem>
                                         ))}
                                    </Select>
                                </TableCell>
                                <TableCell align="left">
                                    <Select id={row.id} name="group_id" mt={4} value={row.group_id ? row.group_id : ''}  style={{width: '200px'}} onChange={onChange(row.id)}>
                                        {allGroups && allGroups.map((row, k) => (
                                            <MenuItem key={k} value={row.id}>{row.name}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell align="left">
                                    <Select id={row.id} name="friend_id" mt={4} value={row.friend_id ? row.friend_id : ''}  style={{width: '200px'}} onChange={onChange(row.id)}>
                                        {allFriends && allFriends.map((row, k) => (
                                            <MenuItem key={k} value={row.id}>{row.name}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell align="left">
                                    <Select id={row.id} name="page_id" mt={4} value={row.page_id ? row.page_id : ''}  style={{width: '200px'}} onChange={onChange(row.id)}>
                                        {allPage && allPage.map((row, k) => (
                                            <MenuItem key={k} value={row.id}>{row.uid}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell align="left">{row.time_out ? row.time_out : ''}</TableCell>
                                <TableCell align="left">{row.reset_3g ? row.reset_3g : ''}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="primary" style={{"width":"100px"}} onClick={() => handleDetail(row)}>
                                        View detail
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(row)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Card>
    );
}

function UsersList({history, location, firebase}) {
    const gotoAdd = () => {
        history.push({
            pathname: '/friend/add',
            search: ''
        });
    }
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Devices
            </Typography>

            <Divider my={6}/>

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <UsersTable history={history} firebase={firebase}/>
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
