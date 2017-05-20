import fetch from 'unfetch';

export default (url, body, callback) => {
  fetch(`./${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(response => response.json()).then((data) => {
    callback(data);
  });
};
