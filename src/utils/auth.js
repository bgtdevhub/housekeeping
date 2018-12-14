
export function getAuth() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth;
}

export function getToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.token;
}

export function getUsername() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth && auth.username) {
    return auth.username;
  }
  return null;
}

export function setAuth(response) {
  const auth = JSON.stringify(response);
  localStorage.setItem("auth", auth);
}

export function removeAuth() {
  localStorage.removeItem("auth");
}

export function refreshAuth(newAuth, cb) {
  localStorage.removeItem("auth");
  setAuth(newAuth);
  cb("auth_refresh_success");
}
