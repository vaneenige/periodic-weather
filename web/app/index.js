import { h, render } from 'preact';
import { Provider } from 'preact-redux';

import store from './store';
import App from './components/App';

window.store = store;

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.body);
