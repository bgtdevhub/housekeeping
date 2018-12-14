import { AUTH_START, AUTH_SUCCESS, LOGOUT } from '../constants/actions.js';

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

export const logout = (data) => {
    return {
        type: LOGOUT,
        data
    }
}
