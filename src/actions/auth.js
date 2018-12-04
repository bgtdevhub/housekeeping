import { AUTH_START, AUTH_SUCCESS } from '../constants/actions.js';

export const authStart = (data) => {
    return {
        type: AUTH_START,
        data
    }
}

export const authSuccess = (data) => {
    return {
        type: AUTH_SUCCESS,
        data
    }
}
