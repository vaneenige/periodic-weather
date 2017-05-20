import fetch from 'unfetch';
import fetchApi from './fetchApi';

export default {
  create: (callback) => {
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager.subscribe({ userVisibleOnly: true })
        .then((subscription) => {
          callback(subscription.endpoint.replace('https://android.googleapis.com/gcm/send/', '', subscription));
        });
    });
  },

  toggle: (subscriptionId, locationId, state, callback) => {
    fetchApi('subscriptions', { subscriptionId, locationId, state }, (data) => {
      callback(data);
    });
  },
};
