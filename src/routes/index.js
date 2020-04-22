import React from "react";

import async from "../components/Async";

import {
    BookOpen,
    Briefcase,
    Calendar as CalendarIcon,
    CheckSquare,
    CreditCard,
    Grid,
    Heart,
    Layout,
    List,
    Map,
    Monitor,
    PieChart,
    Facebook,
    Settings,
    Sliders,
    User,
    Users,
    Bell,
    Home,
    Clock
} from "react-feather";

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));
const Profile = async(() => import("../pages/users/Profile"))

// Dashboards components
const Default = async(() => import("../pages/dashboards/Dashboard"));

const PageList = async(() => import("../pages/page/PageList"));
const PageAdd = async(() => import("../pages/page/PageAdd"));

const CloneList = async(() => import("../pages/clones/CloneList"))
const AddClone = async(() => import("../pages/clones/CloneAdd"))

const GroupList = async(() => import("../pages/group/GroupList"))
const AddGroup = async(() => import("../pages/group/GroupAdd"))
const GroupDetail = async(() => import("../pages/group/GroupDetail"))

const FriendList = async(() => import("../pages/friend/FriendList"))
const AddFriend = async(() => import("../pages/friend/FriendAdd"))
const FriendDetail = async(() => import("../pages/friend/FriendDetail"))

const TransactionList = async(() => import("../pages/transaction/List"))
const TransactionDetail = async(() => import("../pages/transaction/detail"))

const ActionAdd = async(() => import("../pages/actions/ActionAdd"))
const ActionDetail = async(() => import("../pages/actions/ActionDetail"))
const ActionList = async(() => import("../pages/actions/ActionList"))

const GiftCode = async(() => import("../pages/users/giftCode"))

const DeviceDetail = async(() => import("../pages/device/DeviceDetail"))
const DeviceList = async(() => import("../pages/device/DeviceList"))

const userRoutes = {
    id: "Profile",
    icon: "/static/img/icon/icon_profile.png",
    path: "/users/profile",
    component: Profile,
    name: "Profile",
}

const TransactionRoutes = {
    id: "Transaction",
    icon: "/static/img/icon/icon_transaction.png",
    path: "/transaction/list",
    component: TransactionList,
    name: "Transaction",
}

const GiftCodeRoutes = {
    id: "GiftCode",
    icon: "/static/img/icon/icon_giftcode.jpg",
    path: "/gift-code",
    component: GiftCode,
    name: "GiftCode",
}

const dashboardsRoutes = {
    id: "Home",
    path: "/",
    name: "Default",
    component: Default,
    icon: "/static/img/icon/icon_home.png",
    containsHome: true
};

const clonesRoutes = {
    id: "Clones",
    path: "/clone/list",
    icon: "/static/img/icon/icon_fb.png",
    name: "Clone List",
    component: CloneList
};

const friendRoutes = {
    id: "Friends",
    path: "/friend/list",
    icon: "/static/img/icon/icon_friend.png",
    name: "Friend List",
    component: FriendList
};

const actionRoutes = {
    id: "Actions",
    path: "/action/list",
    icon: "/static/img/icon/icon_action.jpg",
    name: "Action List",
    component: ActionList
};

const groupRoutes = {
    id: "Groups",
    path: "/group/list",
    icon: "/static/img/icon/icon_group.png",
    name: "Group List",
    component: GroupList
};

const pageRoutes = {
    id: "Pages",
    path: "/page/list",
    icon: "/static/img/icon/icon_page.png",
    name: "Page List",
    component: PageList
};

const deviceRoutes = {
    id: "Device",
    path: "/device/list",
    icon: "/static/img/icon/icon_device.png",
    name: "Device List",
    component: DeviceList
};

const $pageShows = {
    id: "show",
    path: "/",
    icon: "/static/img/icon/icon_device.png",
    children: [
        {
            path: "/page/add",
            icon: <User/>,
            name: "Page Add",
            component: PageAdd
        },
        {
            path: "/group/add",
            icon: <User/>,
            name: "Group Add",
            component: AddGroup
        },
        {
            path: "/friend/add",
            icon: <User/>,
            name: "Friend Add",
            component: AddFriend
        },
        {
            path: "/clone/add",
            icon: <User/>,
            name: "Clone Add",
            component: AddClone
        },
        {
            path: "/friend/detail",
            component: FriendDetail,
            name: "Friend Uid List",
            children: null
        },
        {
            path: "/group/detail",
            component: GroupDetail,
            name: "Group Uid List",
            children: null
        },
        {
            path: "/transaction/detail",
            component: TransactionDetail,
            name: "Transaction detail",
            children: null
        },
        {
            path: "/action/add",
            component: ActionAdd,
            name: "Action Add",
            children: null
        },
        {
            path: "/action/detail",
            component: ActionDetail,
            name: "Action Detail",
            children: null
        },
        {
            path: "/device/detail",
            component: DeviceDetail,
            name: "Device Detail",
            children: null
        }
    ]
}

const authRoutes = {
    id: "Auth",
    path: "/auth",
    icon: <Users/>,
    children: [
        {
            path: "/",
            name: "Sign In",
            component: SignIn
        },
        {
            path: "/sign-up",
            name: "Sign Up",
            component: SignUp
        },
        {
            path: "/auth/reset-password",
            name: "Reset Password",
            component: ResetPassword
        },
        {
            path: "/auth/404",
            name: "404 Page",
            component: Page404
        },
        {
            path: "/auth/500",
            name: "500 Page",
            component: Page500
        }
    ]
};

export const dashboard = [
    dashboardsRoutes,
    clonesRoutes,
    deviceRoutes,
    friendRoutes,
    groupRoutes,
    pageRoutes,
    actionRoutes,
    $pageShows,
    userRoutes,
    TransactionRoutes,
    GiftCodeRoutes
];

export const auth = [authRoutes];

export default [
    dashboardsRoutes,
    clonesRoutes,
    deviceRoutes,
    friendRoutes,
    groupRoutes,
    pageRoutes,
    actionRoutes,
    userRoutes,
    TransactionRoutes,
    GiftCodeRoutes
];
