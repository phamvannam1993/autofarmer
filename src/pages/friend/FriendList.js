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
    Typography
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
    const [allFriends, setAllFriends] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [count, setCount] = useState(0)
    const usercolumn = new Array()
    const users = localStorage.getItem('users')
    const userArr = JSON.parse(users)
    const token = userArr.token
    useEffect(() => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetFriend',
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
                const dataView = []
                if(parsedBodyArr.result.success) {
                    for (const [key, value] of Object.entries(parsedBodyArr.result.data)) {
                        value.id = key
                        dataView.push(value)
                    }
                    setCount(Math.ceil(parsedBodyArr.result.total / 100))
                }
                setAllFriends(dataView)
                setLoading(false)
            })
    }, [])


    const handleDetail = (row) => {
        history.push({
            pathname:'/friend/detail',
            search: '?query='+row.friend_id
        });
    }

    const handleDelete = (row) => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/DeleteFriend',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({id: row.id, token:token})
            })
        }
        setLoadingDelete(true)
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if (parsedBodyArr.result.success) {
                    const data = []
                    allFriends.map((rowArr) => {
                        if (row.id !== rowArr.id) {
                            data.push(rowArr)
                        }
                    })
                    setLoadingDelete(false)
                    setAllFriends(data)
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
                            <TableCell align="left">name</TableCell>
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
                                           width={100} /> : allFriends && allFriends.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left">{index+1}</TableCell>
                                <TableCell align="left">{row.name}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="primary" onClick={() => handleDetail(row)}>
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
                Friends
            </Typography>

            <div style={{float: 'right'}}>
                <Button mr={2} variant="contained" color="primary" onClick={gotoAdd}>
                    <AddIcon/>
                    Add Friend
                </Button>
            </div>

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
