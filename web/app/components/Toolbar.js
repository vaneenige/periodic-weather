import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { bindActions } from './../util';
import reduce from './../reducers';
import * as actions from './../actions';

import fetchApi from './../utils/fetchApi';

@connect(reduce, bindActions(actions))
export default class Toolbar extends Component {

  shouldComponentUpdate({ network, serviceWorker }) {
    return network !== this.props.network || serviceWorker !== this.props.serviceWorker;
  }

  componentDidMount() {
    if (this.props.network && this.props.locations.length > 0) {
      this.sync();
    }
  }

  sync = () => {
    this.svg.classList.add('rotate');
    fetchApi('weather/locations', {
      locations: this.props.locations.map(location => location.id),
    }, (data) => {
      this.svg.classList.remove('rotate');
      this.props.syncLocations(data);
    });
  }

  render({ network, serviceWorker }) {
    const syncStyle = {
      transform: network ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 0)',
    };
    return (
      <div id="toolbar">
        <span>{serviceWorker ? 'Periodic' : ''} Weather</span>
        <svg onClick={this.sync} ref={(svg) => { this.svg = svg; }} style={syncStyle} fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>
    );
  }
}
