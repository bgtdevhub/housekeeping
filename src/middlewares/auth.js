import { AUTH_SUCCESS, AUTH_START } from '../constants/actions';
import { refreshAuth, getAuth } from '../utils/auth';
import argisApi from '../services/argis';

const auth = store => {

    return next => action => {
        next(action);

        switch (action.type) {
          case AUTH_START:
              argisApi.beginOAuth2();
            break;

            case AUTH_SUCCESS:
              let lookup = {
                token: 0,
                username: 2
              };
              let hash = action.data;
              let splittedByAnd = hash.split('&');
              let token = splittedByAnd[lookup.token].split('=')[1];
              let username = splittedByAnd[lookup.username].split('=')[1];
              refreshAuth({token:token,username:username}, (status) => {
                if (status === 'auth_refresh_success') {
                  console.log("getAuth--->", getAuth());
                }
              });
            break;

          default:

        }
    }
}

export default auth;
