import { Labeling, Filter } from './serviceTyping';

const axios = require('axios');

const BASE_URL: string = 'https://damp-garden-93707.herokuapp.com/';

export function getCaller(
  endpoint: string,
  callBack: Function,
  isLoggedIn?: boolean,
) {
  axios({
    method: 'get',
    url: `${BASE_URL}/${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(isLoggedIn ? { user_id: '24b456' } : {}),
    },
  })
    .then((res: any) => {
      callBack({ success: true, data: res.data.data });
    })
    .catch((err: any) => {
      callBack({ success: false, ...(err as object) });
    });
}

export async function postCaller(
  endpoint: string,
  payload: Filter | Labeling,
  callBack: Function,
  isLoggedIn?: boolean,
) {
  axios({
    method: 'post',
    url: `${BASE_URL}/${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...(isLoggedIn ? { user_id: '24b456' } : {}),
    },
    data: payload,
  })
    .then((res: any) => {
      callBack({ success: true, data: res.data.data });
    })
    .catch((err: any) => {
      callBack({ success: false, ...(err as object) });
    });
}
