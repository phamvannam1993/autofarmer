import {
    GET_STARTUPS,
    ADD_STARTUP,
    DELETE_STARTUP,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_STARTUP,
    FILTER_STARTUP,
    CLEAR_FILTER,
    STARTUP_ERROR,
} from '../types';

const initialState = {
    startups: [],
    current: null,
    filtered: null,
    error: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_STARTUPS:
            return {
                ...state,
                startups: action.payload,
                loading: false
            };
        case ADD_STARTUP:

            return {
                ...state,
                startups: [...state.startups, action.payload],
            };
        case UPDATE_STARTUP:
            return {
                ...state,
                startups: state.startups.map(startup => startup._id === action.payload._id ? action.payload : startup),
                loading: false
            };
        case DELETE_STARTUP:
            return {
                ...state,
                startups: state.startups.filter(startup => startup._id !== action.payload)
            };
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload,
                loading: false
            };
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            };
        case CLEAR_FILTER:
            return {
                ...state,
                filtered: null
            };
        case FILTER_STARTUP:
            return {
                ...state,
                filtered: state.startups.filter(startup => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return startup.name.match(regex) || startup.country.match(regex)
                })
            };
        case STARTUP_ERROR:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}