import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import 'style/global';

import { bindActions } from './../util';
import reduce from './../reducers';
import * as actions from './../actions';

import Toolbar from './Toolbar';
import Button from './Button';
import Modal from './Modal';
import Feed from './Feed';

@connect(reduce, bindActions(actions))
export default class App extends Component {

  componentDidMount() {
    window.addEventListener('online', this.notifyNetworkStatus);
    window.addEventListener('offline', this.notifyNetworkStatus);
  }

  notifyNetworkStatus = () => {
    this.props.setNetwork(navigator.onLine);
  }

  render = () => (
    <div id="app">
      <Toolbar />
      <Button />
      <Modal />
      <Feed />
    </div>
  )
}
