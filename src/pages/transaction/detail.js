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
    const [transaction, setTransaction] = useState({
        code: '',
        money: '',
        bonus: '',
        status:'',
        createdAt:''
    })
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [TransactionId, setTransactionId] = useState(params.transaction_id)
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
                data: JSON.stringify({limit: 100, page: 1, transaction_id:TransactionId})
            })
        }
        request(options)
            .then(function (parsedBody) {
                const parsedBodyArr = JSON.parse(parsedBody)
                if(parsedBodyArr.result.success) {
                    setTransaction(parsedBodyArr.result.data)
                    setLoading(false)
                }
            })
    }, [])

    return (
        <Card mb={6}>
            { loading ? <div className="waitting">
                <Loader type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100} />
            </div> : ''}
            <Paper>
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <td className="text-right col-xs-3"><strong>  Mã giao dịch</strong></td>
                        <td>
                            <p>{transaction.code ? transaction.code : ''}</p>
                            <small>Nếu bạn cần hỗ trợ đơn hàng của bạn, hãy cung cấp mã hóa đơn này.</small>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right col-xs-3"><strong>Số tiền</strong></td>
                        <td>
                            <p>{transaction.value ? parseInt(transaction.value).toLocaleString() : ''} VNĐ</p>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right col-xs-3"><strong>Ngày Tạo</strong></td>
                        <td>
                            <p><Moment unix>{transaction.createdAt ? transaction.createdAt / 1000 : ''}</Moment></p>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right col-xs-3"><strong>Ngày Cập nhật</strong></td>
                        <td>
                            <p><Moment unix>{transaction.updatedAt ? transaction.updatedAt / 1000 : transaction.createdAt / 1000}</Moment></p>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right col-xs-3"><strong>Trạng thái</strong></td>
                        <td className="transaction-status">
                            {transaction.status == 'Pending' ?
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

                        </td>
                    </tr>
                    <tr>
                        <td className="text-right col-xs-3"><strong>Hướng Dẫn Thanh Toán</strong></td>
                        <td>
                            <p>Vui lòng chuyển vào tài khoản <strong>Vietcombank </strong> Sau khi:</p>
                            <p>Ngân hàng: <strong>Ngân hàng Ngoại Thương Việt Nam</strong></p>
                            <p>Số tài khoản: <strong>0011000412973</strong></p>
                            <p>Tên tài khoản: <strong>TRUONG THANH NAM</strong></p>
                            <p>Số tiền: <strong>{parseInt(transaction.value).toLocaleString()} VNĐ</strong></p>
                            <p>Nội dung chuyển khoản (memo): <strong>{transaction.code}</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right col-xs-3"></td>
                        <td>
                            <em>
                                <strong >
                                    Lưu ý: Giao dịch cần được thanh toán trong vòng 15 phút trước khi bị hủy. Vui lòng chuyển tiền chính xác(bao gồm cả số lẻ) và nội dung chuyển khoản theo như hướng dẫn.
                                </strong>
                            </em>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </Paper>
        </Card>
    );
}

function UsersList({history, location, firebase}) {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Chi tiết giao dịch
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
