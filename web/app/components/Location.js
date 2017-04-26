import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { bindActions } from './../util';
import reduce from './../reducers';
import * as actions from './../actions';

@connect(reduce, bindActions(actions))
export default class Location extends Component {

  shouldComponentUpdate({ location, network, serviceWorker }) {
    return location !== this.props.location
      || network !== this.props.network
      || serviceWorker !== this.props.serviceWorker;
  }

  toggle = () => {
    const { onToggle, location } = this.props;
    onToggle(location);
  };

  remove = () => {
    const { onRemove, location } = this.props;
    onRemove(location);
  }

  render({ location, network, serviceWorker }) {
    const removeStyle = {
      transform: network ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 0)',
    };
    const toggleStyle = {
      transform: network && serviceWorker ? 'scale3d(1, 1, 1)' : 'scale3d(0, 0, 0)',
    };
    return (
      <li className="item">
        <div className="item-avatar"><img src={`./app/assets/svg/${location.icon}.svg`} alt="" /></div>
        <div className="item-content">
          <div className="item-title">{location.name}</div>
          <div className="item-subtitle">{location.temp} ℃, {location.description}</div>
        </div>
        <svg fill="rgba(0, 0, 0, 0.20)" height="24" viewBox="0 0 24 24" width="24" onClick={this.remove} style={removeStyle}>
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
        <svg onClick={this.toggle} fill={location.subscribed ? '#00BFA5' : 'rgba(0, 0, 0, 0.20)'} height="24" viewBox="0 0 24 24" width="24" style={toggleStyle}>
          {location.subscribed ?
            (<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />) :
            (<path d="M20 18.69L7.84 6.14 5.27 3.49 4 4.76l2.8 2.8v.01c-.52.99-.8 2.16-.8 3.42v5l-2 2v1h13.73l2 2L21 19.72l-1-1.03zM12 22c1.11 0 2-.89 2-2h-4c0 1.11.89 2 2 2zm6-7.32V11c0-3.08-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68c-.15.03-.29.08-.42.12-.1.03-.2.07-.3.11h-.01c-.01 0-.01 0-.02.01-.23.09-.46.2-.68.31 0 0-.01 0-.01.01L18 14.68z" />)
          }
        </svg>
      </li>
    );
  }
}
