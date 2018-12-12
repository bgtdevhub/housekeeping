import request from '../utils/request';
import { UserSession } from "@esri/arcgis-rest-auth";
import { getToken } from '../utils/auth';

const localhostClientId = 'Uyc2ToNAVEsUspgs';
const clientId = 'VnCAHW238RcPLwpj';
const apiUrl = 'https://www.arcgis.com/sharing/rest';

const config = {
  local: {
    id: localhostClientId,
    redirectUri: `http://localhost:3000/profile?clientID=${localhostClientId}`,
  },
  public: {
    id: clientId,
    // redirectUri: `http://localhost:3000/profile?clientID=${clientId}`,
  }
}

function generateToken(username, password) {
  let url = `${apiUrl}/generateToken`;
  let payload = {
      client: "referer",
      referer: window.location.hostname,
      expiration: 60,
      username: username,
      password: password,
      f: "json"
  };
  let options = {
      withCredentials: false
  };
  return request.post(url, payload, options);
}

function getUserInfo(username) {
  let url = `${apiUrl}/community/users/${username}`;
  let parameters = {
      token: getToken(),
      f: "json"
  };
  let options = {
      withCredentials: false
  };
  return request.get(url, parameters, options);
}

function getUserThumbnail(username, thumbnail) {
  let url = `${apiUrl}/community/users/${username}/info/${thumbnail}?token=${getToken()}`;
  return url;
}

function getItemThumbnail(itemId, thumbnail) {
  let url;
  if (thumbnail === null) {
    url = 'https://avatars.io/twitter/esrimalaysia/medium';
  } else {
    url = `${apiUrl}/content/items/${itemId}/info/${thumbnail}?token=${getToken()}`;
  }

  return url;
}

function getUserContent(username) {
  let url = `${apiUrl}/content/users/${username}`;
  let parameters = {
      token: getToken(),
      f: "json"
  };
  let options = {
      withCredentials: false
  };
  return request.get(url, parameters, options);
}

function getUserItemsByFolderName(username, folder) {
    let url = `${apiUrl}/content/users/${username}/${folder}`;
    let parameters = {
        token: getToken(),
        f: "json"
    };
    let options = {
        withCredentials: false
    };
    return request.get(url, parameters, options);
}

function beginOAuth2(configData) {
  const userSession = UserSession;
  if (userSession) {
   userSession.beginOAuth2({
     clientId: configData.id,
     redirectUri: `${configData.redirectUri}?clientID=${configData.id}`,
     popup: false,
   });
  }
}

function deleteItem(username, itemId) {
    let portal = this;
    let url = `${apiUrl}/content/users/${username}/items/${itemId}/delete`;
    let payload = {
        token: getToken(),
        f: "json"
    };
    let options = {
        withCredentials: portal.withCredentials
    };
    return request.post(url, payload, options);
}

export let ArgisApi = {
    generateToken: generateToken,
    getUserInfo: getUserInfo,
    getUserContent: getUserContent,
    getUserItemsByFolderName: getUserItemsByFolderName,
    beginOAuth2: beginOAuth2,
    getUserThumbnail: getUserThumbnail,
    getItemThumbnail: getItemThumbnail,
    deleteItem: deleteItem
};

export default ArgisApi;
