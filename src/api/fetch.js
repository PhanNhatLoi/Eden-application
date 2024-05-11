import {store} from 'src/state/store';
import * as API_STRING from 'src/config';
import _ from 'lodash';
import {pushNotify} from 'src/state/reducers/Notification/notify';
import {logout, removeUserLogin} from 'src/state/reducers/authUser/authSlice';
import {logOutUser} from 'src/state/reducers/authUser/authThunk';
const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const API_TYPE = {
  auth: 'auth',
  godi: 'godi',
  sys: 'sys',
  mock: 'mock',
};
export default function FETCH(
  type,
  path,
  method,
  headers = {},
  body,
  isNotHaveVersion = false,
  params = {},
) {
  return new Promise(function (resolve, reject) {
    startFetch(type, path, method, headers, body, isNotHaveVersion, params)
      .then(response => {
        resolve(response);
      })
      .catch(error => reject(error));
  });
}

function startFetch(
  type,
  path,
  method,
  headers,
  body,
  isNotHaveVersion,
  params,
) {
  return new Promise((resolve, reject) => {
    const internet = store.getState().notify.internet;
    if (!internet) {
      store.dispatch(
        pushNotify({
          title: 'no_connect_internet',
          message: 'no_connect_internet',
        }),
      );
      return reject({
        message: 'no_connect_internet',
        localizeMessage: 'no_connect_internet',
      });
    }
    const token = store.getState().authReducer?.token;
    if (token) {
      if (!headers.Authorization)
        headers.Authorization = !_.isNil(token) ? `Bearer ${token}` : undefined;
    }

    const timeout = setTimeout(() => {
      return reject({
        message: 'requestApiTimeout',
        localizeMessage: 'requestApiTimeout',
      });
    }, 30000); //time out in 30s
    let services;
    switch (type) {
      case API_TYPE.auth:
        services = API_STRING.SERVICES_SYS_AUTH;
        break;
      case API_TYPE.godi:
        services = API_STRING.SERVICES_GODI;
        break;
      case API_TYPE.sys:
        services = API_STRING.SERVICES_SYS;
        break;
    }
    let paramsString = '';
    Object.keys(params).map((m, i) => {
      paramsString += (i === 0 ? '?' : '&') + m + '=' + params[m].toString();
    });
    let fetchURL =
      type === API_TYPE.mock
        ? path + paramsString
        : isNotHaveVersion
        ? API_STRING.API_URL + services + '/api' + path + paramsString
        : API_STRING.API_URL +
          services +
          API_STRING.VERSION +
          path +
          paramsString;
    let bodyrequest = body?.body || body;

    let httpResponseCode = 200;
    fetch(fetchURL, {
      method,
      headers: {
        ...HEADERS,
        ...headers,
      },
      body: JSON.stringify(bodyrequest),
    })
      .then(response => {
        clearTimeout(timeout);
        if (!response) {
          return false;
        }

        const {status} = response;
        // console.log(
        //   '🚀 ~ file: fetch.js:75 ~ returnnewPromise ~ status:',
        //   status,
        // );
        httpResponseCode = status;

        if (httpResponseCode === 204) {
          // 204 return nothing
          return true;
        }

        return response.json();
      })
      .then(responseJson => {
        if (httpResponseCode > 300) {
          console.log(
            {
              ...HEADERS,
              ...headers,
            }.Authorization,
            'url: ' + fetchURL,
            body,
            responseJson,
          );
        }
        //log for debug
        // console.log(paramsString)
        // console.log(fetchURL,body)
        // console.log(
        //   '🚀 ~ file: fetch.js ~ line 85 ~ returnnewPromise ~ responseJson',
        //   {
        //     ...HEADERS,
        //     ...headers,
        //   }.Authorization,
        //   'url: ' + fetchURL,
        //   body,
        //   responseJson,
        // );
        handleResponse({
          responseJson,
          httpResponseCode,
          onFullfill: resolve,
          onReject: reject,
        });
      })
      .catch(error => {
        handleResponse({
          error,
          httpResponseCode,
          onFullfill: resolve,
          onReject: reject,
        });
        clearTimeout(timeout);
        reject(error);
      });
  });
}

function handleResponse({
  responseJson,
  httpResponseCode,
  onFullfill = response => Promise.resolve(response),
  onReject = error => Promise.reject(error),
}) {
  const localizeEntityName = responseJson?.entityName;
  const localizeMessage = responseJson?.message;
  const token = store.getState().authReducer?.token;

  switch (httpResponseCode) {
    case 200:
    case 201:
    case 204: {
      //do some thing
      onFullfill(responseJson);
      break;
    }
    case 400:
      if (['account', 'profile'].includes(localizeEntityName)) {
        store.dispatch(removeUserLogin());
        if (token) {
          store.dispatch(
            pushNotify({
              title: 'end_login_session',
              message: 'please_log_in_again',
              type: 'ALERT',
              onpress: () => {
                store.dispatch(removeUserLogin());
                store.dispatch(logOutUser());
              },
            }),
          );
        } else {
          onReject({
            status: httpResponseCode,
            message: 'user.login.invalid',
            localizeMessage: 'user.login.invalid',
          });
        }
      } else {
        store.dispatch(
          pushNotify({
            title: responseJson?.message,
            message: responseJson?.message,
          }),
        );
        onReject({
          status: httpResponseCode,
          message: responseJson?.message || '',
          localizeMessage: localizeMessage,
        });
      }

      break;
    case 401:
      store.dispatch(removeUserLogin());
      if (token) {
        store.dispatch(
          pushNotify({
            title: 'end_login_session',
            message: 'please_log_in_again',
            type: 'ALERT',
            onpress: () => {
              store.dispatch(logOutUser());
            },
          }),
        );
      }
      onReject({
        status: httpResponseCode,
        message: responseJson?.message || '',
        localizeMessage: localizeMessage,
      });
      break;
    case 403: {
      store.dispatch(
        pushNotify({
          title: 'end_login_session',
          message: 'please_log_in_again',
          type: 'ALERT',
          onpress: () => {
            store.dispatch(logOutUser());
          },
        }),
      );
      onReject({
        status: httpResponseCode,
        message: responseJson?.message || '',
        localizeMessage: localizeMessage,
      });
      break;
    }
    case 404: {
      onReject({
        status: httpResponseCode,
        message: responseJson?.message || '',
        localizeMessage: localizeMessage,
      });
      break;
    }

    case 500: {
      //do some thing
      store.dispatch(
        pushNotify({
          title: 'server_error',
          message: 'server_error_please_try_again_latter',
        }),
      );
      onReject({
        status: httpResponseCode,
        message: responseJson?.message || '',
        localizeMessage: localizeMessage,
      });

      break;
    }

    default: {
      store.dispatch(
        pushNotify({title: 'unknow_error', message: 'unknow_error'}),
      );
      onReject({
        status: httpResponseCode,
        message: responseJson?.message || '',
        localizeMessage: localizeMessage,
      });
      break;
    }
  }
}
