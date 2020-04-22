import React, {useEffect, Component} from "react";
import styled from "styled-components";
import {darken} from "polished";
import {withFirebase} from "../Firebase";
import {compose} from "recompose";
import {withRouter} from "react-router-dom";
import request from 'request-promise';
import {
    Badge,
    Grid,
    Hidden,
    InputBase,
    Menu,
    MenuItem,
    AppBar as MuiAppBar,
    IconButton as MuiIconButton,
    Toolbar
} from "@material-ui/core";

import {Menu as MenuIcon} from "@material-ui/icons";

import {
    Bell,
    Search as SearchIcon,
    Power
} from "react-feather";

const AppBar = styled(MuiAppBar)`
  background: ${props => props.theme.header.background};
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${props => props.theme.header.indicator.background};
    color: ${props => props.theme.palette.common.white};
  }
`;

const Search = styled.div`
  border-radius: 2px;
  background-color: ${props => props.theme.header.background};
  display: none;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${props => darken(0.05, props.theme.header.background)};
  }

  ${props => props.theme.breakpoints.up("md")} {
    display: block;
  }
`;

const SearchIconWrapper = styled.div`
  width: 50px;
  height: 100%;
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Input = styled(InputBase)`
  color: inherit;
  width: 100%;

  > input {
    color: ${props => props.theme.header.search.color};
    padding-top: ${props => props.theme.spacing(2.5)}px;
    padding-right: ${props => props.theme.spacing(2.5)}px;
    padding-bottom: ${props => props.theme.spacing(2.5)}px;
    padding-left: ${props => props.theme.spacing(12)}px;
    width: 160px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

let users = localStorage.getItem('users')
let balance = 0
if(users) {
    const userArr = JSON.parse(users)
    balance = userArr.balance
    let token = userArr.token
    const options = {
        method: 'POST',
        uri:'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/getUser',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            data:JSON.stringify({token:token,page:1})
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
                if(dataView.length > 0) {
                    localStorage.setItem('users', JSON.stringify(dataView[0]))
                }
            }
        })
}
class LanguageMenu extends Component {
    state = {
        anchorMenu: null
    };

    toggleMenu = event => {
        this.setState({anchorMenu: event.currentTarget});
    };

    closeMenu = () => {
        this.setState({anchorMenu: null});
    };

    render() {
        const {anchorMenu} = this.state;
        const open = Boolean(anchorMenu);

        return (
            <React.Fragment>
                <IconButton
                    aria-owns={open ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={this.toggleMenu}
                    color="inherit"
                >
                    <Flag src="/static/img/flags/us.png" alt="English"/>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorMenu}
                    open={open}
                    onClose={this.closeMenu}
                >
                    <MenuItem
                        onClick={() => {
                            this.closeMenu();
                        }}
                    >
                        English
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.closeMenu();
                        }}
                    >
                        French
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.closeMenu();
                        }}
                    >
                        German
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.closeMenu();
                        }}
                    >
                        Dutch
                    </MenuItem>
                </Menu>
            </React.Fragment>
        );
    }
}

const API = 'https://ipapi.co/json/';
class UserMenu extends Component {
    state = {
        anchorMenu: null
    };

    toggleMenu = event => {
        this.setState({anchorMenu: event.currentTarget});
    };

    closeMenu = () => {
        this.setState({anchorMenu: null});
    };

    onSignout = () => {
        localStorage.setItem('users', '')
        this.props.currentprops.history.push('/')
        window.location.reload();
    }

    onGotoProfile = () => {
        this.props.currentprops.history.push('/users/settings')
    }

    render() {
        const {anchorMenu} = this.state;
        const options = {
            method: 'POST',
            uri: 'https://us-central1-core-autofarmer-net-e1bc5.cloudfunctions.net/GetAction',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: JSON.stringify({limit: 100, page:1})
            })
        }
        request(options)
            .then(function (parsedBody) {

            })
        const open = Boolean(anchorMenu);
            return (
                <React.Fragment>
                    <IconButton
                        aria-owns={open ? "menu-appbar" : undefined}
                        aria-haspopup="true"
                        onClick={this.toggleMenu}
                        color="inherit"
                    >
                        <Power/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorMenu}
                        open={open}
                        onClose={this.closeMenu}
                    >
                        <MenuItem
                            onClick={() => {
                                this.onGotoProfile();
                            }}
                        >
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={this.onSignout}
                        >
                            Sign out
                        </MenuItem>
                    </Menu>
                </React.Fragment>
            );
        }
    }

    class
    Header
    extends
    Component {
        state = {
            anchorMenu: null
        };

        toggleMenu = event => {
            const {anchorMenu} = this.state;
            const open = Boolean(anchorMenu);
            if(open) {
                this.setState({anchorMenu: null});
            } else {
                this.setState({anchorMenu: event.currentTarget});
            }

        };

        closeMenu = () => {
            this.setState({anchorMenu: null});
        };
    onGotoNotification = () => {
        this.props.history.push('/users/notifications')
    }
    render() {
        const {anchorMenu} = this.state;
        const open = Boolean(anchorMenu);
        return (
            <React.Fragment>
                <AppBar position="sticky" elevation={0}>
                    <Toolbar>
                        <Grid container alignItems="center" className="menuMobile">
                            <Hidden mdUp>
                                <Grid item>
                                    <IconButton
                                        color="inherit"
                                        aria-label="Open drawer"
                                        aria-owns={open ? "menu-appbar" : undefined}
                                        aria-haspopup="true"
                                        onClick={this.toggleMenu}
                                    >
                                        <MenuIcon/>
                                    </IconButton>
                                </Grid>

                            </Hidden>
                            <Grid item xs/>
                            <Grid item>
                                <p>balance : {parseInt(balance).toLocaleString()} VNĐ</p>
                            </Grid>
                            <Grid item>
                                <IconButton color="inherit" onClick={() => {
                                    this.onGotoNotification();
                                }}>
                                    <Indicator badgeContent={7}>
                                        <Bell onClick={() => {
                                            this.onGotoNotification();
                                        }}/>
                                    </Indicator>
                                </IconButton>
                                <LanguageMenu/>
                                <UserMenu currentprops={this.props}/>

                            </Grid>
                        </Grid>
                        <ul className={open ? "MenuMobile" : 'hidden'}>
                            <li><Flag src="/static/img/icon/icon_home.png" /><a href="/">Home</a></li>
                            <li><Flag src="/static/img/icon/icon_fb.png" /><a href="/clone/list">Clones</a></li>
                            <li><Flag src="/static/img/icon/icon_device.png" /><a href="/device/list">Devices</a></li>
                            <li><Flag src="/static/img/icon/icon_friend.png" /><a href="/friend/list">Friends</a></li>
                            <li><Flag src="/static/img/icon/icon_group.png" /><a href="/group/list">Groups</a></li>
                            <li><Flag src="/static/img/icon/icon_page.png" /><a href="/page/list">Pages</a></li>
                            <li><Flag src="/static/img/icon/icon_action.jpg" /><a href="/action/list">Actions</a></li>
                            <li><Flag src="/static/img/icon/icon_profile.png" /><a href="/users/profile">Profile</a></li>
                            <li><Flag src="/static/img/icon/icon_transaction.png" /><a href="/transaction/list">Transaction</a></li>
                            <li><Flag src="/static/img/icon/icon_giftcode.jpg" /><a href="/gift-code">GiftCode</a></li>
                        </ul>
                    </Toolbar>
                </AppBar>
            </React.Fragment>

        )
    }
}

// export default withFirebase(Header);

const SignUp = compose(
    withRouter,
    withFirebase
)(Header, UserMenu);

export default SignUp;
