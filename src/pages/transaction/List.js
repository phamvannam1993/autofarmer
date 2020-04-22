import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Link, withRouter} from 'react-router-dom';
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import ReactPaginate from 'react-paginate';
import request from 'request-promise';
import JSAlert from 'js-alert';
import queryString from 'query-string';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
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
const users = localStorage.getItem('users')
const userArr = JSON.parse(users)
const token = userArr.token

function UsersTable({history, location}) {
    let params = queryString.parse(location.search)
    const [allTransactions, setAllTransactions] = useState(null)
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [TransactionId, setTransactionId] = useState(params.query)
    const usercolumn = new Array()
    useEffect(() => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetTransaction',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({limit: 100, page: 1, user_id: token})
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
                }
                setAllTransactions(dataView)
                setCount(Math.ceil(parsedBodyArr.result.total / 100))
                setLoading(false)
            })
    }, [])

    const handleDelete = (row) => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/DeleteTransaction',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({id: row.id})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if (parsedBodyArr.result) {
                    const data = []
                    allTransactions.map((rowArr) => {
                        if (row.id !== rowArr.id) {
                            data.push(rowArr)
                        }
                    })
                    setAllTransactions(data)
                    JSAlert.alert('<code>Xóa thành công</code>', null, JSAlert.Icons.success);
                } else {
                    JSAlert.alert('<code>Xóa thất bại</code>', null, JSAlert.Icons.Failed);
                    return false;
                }
            });
    };

    const handleDetail = (row) => {
        window.location.href = '/transaction/detail?transaction_id=' + row.id
    };

    const handlePageClick = data => {
        let selected = data.selected;
        const page = parseInt(selected) + 1
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetTransaction',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({limit: 100, page: page, user_id: token})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                setAllTransactions(parsedBodyArr.result.data)
            })
    };

    return (
        <Card mb={6}>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell align="left">Transaction Code</TableCell>
                            <TableCell align="left">Money</TableCell>
                            <TableCell align="left">Bonus</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">DateCreated</TableCell>
                            <TableCell align="left">Handle</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? <Loader type="Puff"
                                           color="#00BFFF"
                                           height={100}
                                           width={100}/> : allTransactions.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left">{index + 1}</TableCell>
                                <TableCell align="left">{row.code}</TableCell>
                                <TableCell align="left">{parseInt(row.value).toLocaleString()}</TableCell>
                                <TableCell align="left">{parseInt(row.bonus).toLocaleString()}</TableCell>
                                <TableCell align="left">
                                    {row.status == 'Pending' ?
                                        <span className="label label-warning">
                                        <i className="fa fa-spinner fa-spin"></i>
                                        <strong>
                                        Chờ thanh toán.
                                        </strong>
                                        </span> :
                                        <span className="label label-success">
                                        <i className="fa fa-spinner fa-spin"></i>
                                        <strong>
                                        Hoàn thành
                                        </strong>
                                        </span>
                                    }
                                </TableCell>
                                <TableCell align="left"><Moment unix>{row.createdAt / 1000}</Moment></TableCell>
                                <TableCell align="left">
                                    <Button variant="contained" color="primary" onClick={() => handleDetail(row)}>
                                        Detail
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
            {count > 1 ? <ReactPaginate
                    previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={count}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
                : ''}
        </Card>
    );
}

function UsersList({history, location, firebase}) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Transactions
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
