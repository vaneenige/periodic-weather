import fetch from 'unfetch';
import config from './../config/config';

export default (url, body, callback) => {
  fetch(`${config.apiRoute}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json()).then((data) => {
    callback(data);
  });
};
