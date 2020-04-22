
import React, {useState, useEffect} from "react";
import styled, {withTheme} from "styled-components";

import {withFirebase} from "../../../Firebase";
import request from 'request-promise'
import JSAlert from 'js-alert';

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from 'react-loader-spinner';
import PaypalExpressBtn from 'react-paypal-express-checkout';
import {
    Avatar as MuiAvatar,
    Breadcrumbs as MuiBreadcrumbs,
    Button,
    Card as MuiCard,
    CardActions,
    CardContent as MuiCardContent,
    CardMedia as MuiCardMedia,
    Chip as MuiChip,
    Divider as MuiDivider,
    Grid,
    Link,
    Typography as MuiTypography
} from "@material-ui/core";

import {spacing} from "@material-ui/system";

import {green, red, orange} from "@material-ui/core/colors";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${props => props.theme.palette.grey[300]};
`;

const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

const Avatar = styled(MuiAvatar)`
  height: 28px;
  width: 28px;
  display: inline-block;
  margin-right: ${props => props.theme.spacing(2)}px;
`;

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${props => props.rgbcolor};
  color: ${props => props.theme.palette.common.white};
  margin-bottom: ${props => props.theme.spacing(4)}px;
`;

function Project({image, title, description, chip}) {
    return (
        <Card mb={6}>
            {image ? <CardMedia image={image} title="Contemplative Reptile"/> : null}
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {title}
                </Typography>

                {chip}

                <Typography mb={4} component="p">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" color="primary">
                    Learn More
                </Button>
                <Button size="small" color="primary">
                    Invest
                </Button>
                <Button size="small" color="primary">
                    Share
                </Button>
            </CardActions>
        </Card>
    );
}

const postApi = async function (data) {
    const options = {
        method: 'POST',
        uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/InsertTransaction',
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

function Default({firebase, theme}) {
    let offerRef = firebase.firestore.collection('offer')
    const [allOffers, setAllOffers] = useState(null)
    const [allPackageDeps, setAllPackageDeps] = useState(null)
    const [allPackageUsds, setAllPackageUsds] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const options = {
            method: 'POST',
            uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetPackage',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                data:JSON.stringify({limit:100,page:1})
            })
        }
        const dataResult = [];
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
                const dataDep = []
                const  dataUsd = []
                dataView.map((row, index) => {
                    if (row.type === 'desposit') {
                        dataDep.push(row)
                    } else {
                        dataUsd.push(row)
                    }
                });
                setAllPackageDeps(dataDep)
                setAllPackageUsds(dataUsd)
                setLoading(false)
            })
    }, [])

    const handleClick = async (row) => {
        const users = localStorage.getItem('users')
        const userArr = JSON.parse(users)
        const token = userArr.token
        const data = {
            package_id:row.id,
            token:token,
            action:'insert'
        }
        setLoading(true)
        const result = await postApi(data);
        if(result.success) {
            window.location.href = '/transaction/list';
        } else {
            setLoading(true)
            JSAlert.alert('<code>'+result.message+'</code>', null, JSAlert.Icons.Failed);
            return false;
        }
    }

    const client = {
        sandbox:    'AfmhyDTbIj2SfPQJkpLXRGVPcS1IxxiJVz4Pl1uB_Nji0IultXBqj-T6RAVO8X7k70HvSIxYSMHwEuXz',
        production: 'YOUR-PRODUCTION-APP-ID',
    }

    const onSuccess = (row) => (payment) =>  {
        const userArr = JSON.parse(users)
        userArr.balance = 1000000
        localStorage.setItem('users', JSON.stringify(userArr))
        window.location.href = ''
        // Congratulation, it came here means everything's fine!
        console.log("The payment was succeeded!", row);
        // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onCancel = (data) => {
        // User pressed "cancel" or close Paypal's popup!
        console.log('The payment was cancelled!', data);
        // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onError = (err) => {
        // The main Paypal's script cannot be loaded or somethings block the loading of that script!
        console.log("Error!", err);
        // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
        // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    }

    let env = 'sandbox'; // you can set here to 'production' for production
    let currency = 'USD'; // or you can set this value from your props or state
    const offercolumn = new Array()
    const users = localStorage.getItem('users')
    const userArr = JSON.parse(users)
    const fullname = userArr.fullname
    return (

        <React.Fragment>
            { loading ? <div className="waitting">
                <Loader type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100} />
            </div> : ''}
            <Grid container spacing={6}>
                <p>QUY ĐỊNH</p>
            </Grid>
            <Grid container spacing={6}>
                <p>Hệ thống của chúng tôi cung cấp nhiều mức nạp tiền khác nhau để quý khách hàng trải nghiệm.</p>
            </Grid>
            <Grid container spacing={6}>
                <p>Để đảm bảo chất lượng trải nghiệm, chúng tôi có bản miễn phí (tính năng tương đương) để quý khách hàng sử dụng.</p>
            </Grid>
            <Grid container spacing={6}>
                <p>Chúng tôi không có chính sách HOÀN TIỀN nên đề nghị quý khách hàng cân nhắc trải nghiệm bản miễn phí trước khi nạp tiền.</p>
            </Grid>
            <Grid container spacing={6}>
                <p>Trân trọng!</p>
            </Grid>
            <Grid container spacing={6}>
                <h3 className="text-vnd">Nạp tiền (VNĐ)</h3>
            </Grid>
            <Grid container spacing={6}>
                {allPackageDeps && allPackageDeps.map((row, index) => (
                    <Grid item md={3}>
                        <div className="pricing ui-ribbon-container">
                            <div className="ui-ribbon-wrapper">
                                <div className="ui-ribbon">
                                    +{row.bonus}%
                                </div>
                            </div>
                            <div className="title">
                                <h2>Topup</h2>
                                <h1>{parseInt(row.money).toLocaleString()} VNĐ</h1>
                                <button
                                    className="btn btn-warning btn-block" role="button" onClick={() => handleClick(row)}>Nạp tiền
                                </button>
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={6}>
                <h3 className="text-usd">Nạp tiền (USD)</h3>
            </Grid>
            <Grid container spacing={6}>
                {allPackageUsds && allPackageUsds.map((row, index) => (
                    <Grid item md={3}>
                        <div className="pricing ui-ribbon-container">
                            <div className="ui-ribbon-wrapper">
                                <div className="ui-ribbon">
                                    +{row.bonus}%
                                </div>
                            </div>
                            <div className="title">
                                <h2>Topup</h2>
                                <h1>{parseInt(row.money).toLocaleString()} VNĐ</h1>
                                <PaypalExpressBtn env={env} client={client} currency={currency} total={row.money} onError={onError} onSuccess={onSuccess(row)} onCancel={onCancel}  />
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>
            <Divider my={6}/>

            <Grid container spacing={6}>
                {allOffers && allOffers.map(row => (
                    <Grid item xs={12} lg={6} xl={3} key={row.id}>
                        <Project
                            title={row.company}
                            description={row.card}
                            image={row.pitch}
                        />
                    </Grid>
                ))}

            </Grid>
        </React.Fragment>
    );
}

export default withFirebase(withTheme(Default));
