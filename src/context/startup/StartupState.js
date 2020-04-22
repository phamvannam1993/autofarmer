import React, { useReducer } from 'react';
import axios from 'axios';

import startupContext from './startupContext';
import startupReducer from './startupReducer';
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

const StartupState = props => {
    const initialState = {
        startups: [],
        current: null,
        filtered: null,
        error: null
    };

    const [state, dispatch] = useReducer(startupReducer, initialState);

    // Get Startups
    const getStartups = async () => {
        try {
            const res = await axios.get('/api/startups');
            dispatch({ type: GET_STARTUPS, payload: res.data });
        } catch (err) {
            dispatch({ type: STARTUP_ERROR, payload: err.response.msg });
        }
    };

    // Add Startup
    const addStartup = async startup => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.post('/api/startups', startup, config);
            dispatch({ type: ADD_STARTUP, payload: res.data });

        } catch (err) {
            dispatch({ type: STARTUP_ERROR, payload: err.response.msg });
        }
    };

    // Delete Startup
    const deleteStartup = async id => {
        try {
            await axios.delete(`/api/startups/${id}`);

            dispatch({ type: DELETE_STARTUP, payload: id });
        } catch (err) {
            dispatch({ type: STARTUP_ERROR, payload: err.response.msg });
        }
    };

    // Update Startup
    const updateStartup = async startup => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.put(`/api/startups/${startup._id}`, startup, config);
            dispatch({ type: UPDATE_STARTUP, payload: res.data });
        } catch (err) {
            dispatch({ type: STARTUP_ERROR, payload: err.response.msg });
        }
    };

    // Set Current Startup
    const setCurrent = startup => {
        dispatch({ type: SET_CURRENT, payload: startup });
    };

    // Clear Current Startup
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT });
    };

    // Filter Startups
    const filterStartups = text => {
        dispatch({ type: FILTER_STARTUP, payload: text });
    };

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER });
    };

    return (
        <startupContext.Provider
            value={{
                startups: state.startups,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                getStartups,
                addStartup,
                deleteStartup,
                updateStartup,
                setCurrent,
                clearCurrent,
                filterStartups,
                clearFilter
            }}>
            {props.children}
        </startupContext.Provider>
    );
};

export default StartupState;