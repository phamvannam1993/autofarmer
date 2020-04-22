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
let limit = 50
// Data
function ClonesTable({history, firebase}) {
    const [allClones, setAllClones] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [count, setCount] = useState(0)
    const users = localStorage.getItem('users')
    const UserArr = JSON.parse(users)
    const token = UserArr.token
    useEffect(() => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetClone',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({limit: limit, page: 1, token: token})
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
                    setAllClones(dataView)
                    setCount(Math.ceil(parsedBodyArr.result.total/limit))
                }
                setLoading(false)
            })
    }, [])

    const handleDelete = (row) => {
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/DeleteClone',
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
                    allClones.map((rowArr) => {
                        if (row.id !== rowArr.id) {
                            data.push(rowArr)
                        }
                    })
                    setAllClones(data)
                    setLoadingDelete(false)
                    JSAlert.alert('<code>Xóa thành công</code>', null, JSAlert.Icons.Success);
                } else {
                    JSAlert.alert('<code>Xóa thất bại</code>', null, JSAlert.Icons.Failed);
                    return false;
                }
            });
    };

    const handlePageClick = data => {
        let selected = data.selected;
        const page = parseInt(selected) + 1
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetClone',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({limit: limit, page: page, token: token})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                const dataView = []
                for (const [key, value] of Object.entries(parsedBodyArr.result.data)) {
                    value.id = key
                    dataView.push(value)
                }
                setAllClones(dataView)
            })
    };

    return (
        <Card mb={6}>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Uid</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="left">Action</TableCell>
                            <TableCell align="left">language</TableCell>
                            <TableCell align="left">CreatedAt</TableCell>
                            <TableCell align="left">updateLastTime</TableCell>
                            <TableCell align="left">Detail</TableCell>
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
                                           width={100} /> : allClones && allClones.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="left">{index+1}</TableCell>
                                <TableCell align="left">{row.uid}</TableCell>
                                <TableCell align="left">{row.email}</TableCell>
                                <TableCell align="left">{row.action}</TableCell>
                                <TableCell align="left">{row.language ? row.language : ''}</TableCell>
                                <TableCell align="left"><Moment unix>{row.createdAt/1000}</Moment></TableCell>
                                <TableCell align="left"><Moment unix>{row.updateLastTime/1000}</Moment></TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary">
                                        Detail
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

function ClonesList({history, location, firebase}) {
    const gotoAdd = () => {
        history.push({
            pathname: '/clone/add',
            search: ''
        });
    }
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Clones
            </Typography>

            <div style={{float: 'right'}}>
                <Button mr={2} variant="contained" color="primary" onClick={gotoAdd}>
                    <AddIcon/>
                    Add Clone
                </Button>
            </div>

            <Divider my={6}/>

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <ClonesTable history={history} firebase={firebase}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

const InvestListComponent = compose(
    withRouter,
    withFirebase
)(ClonesList);

export default InvestListComponent;

// export default ClonesList;
