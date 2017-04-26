import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import { bindActions } from './../util';
import reduce from './../reducers';
import * as actions from './../actions';

import Location from './Location';
import subscriptionManager from './../utils/subscriptionManager';

@connect(reduce, bindActions(actions))
export default class Feed extends Component {

  shouldComponentUpdate({ locations }) {
    return locations !== this.props.locations;
  }

  createSubscription = (location) => {
    subscriptionManager.create((subscriptionId) => {
      this.props.setSubscription(subscriptionId);
      this.toggleSubscription(location, subscriptionId);
    });
  }

  toggleSubscription = (location, subscriptionId) => {
    subscriptionManager.toggle(subscriptionId, location.id, !location.subscribed, () => {
      this.props.setLocationSubscription(location, !location.subscribed);
    });
  }

  handleSubscription = (location) => {
    if (this.props.subscription === null) {
      this.createSubscription(location);
    } else {
      this.toggleSubscription(location, this.props.subscription);
    }
  }

  removeLocation = (location) => {
    if (location.subscribed) this.handleSubscription(location);
    this.props.removeLocation(location);
  }

  render({ locations }) {
    return (
      <div>
        {(locations.length < 1) ? (
          <main>
            <div className="container">
              <p>This application uses the <a href="https://www.w3.org/TR/service-workers/">Service Worker API</a> which allows the user to receive push notifications on the web.</p>
              <p>This application shows how the <a href="https://www.w3.org/TR/push-api/">Push API</a> can be used to provide the user with relevant information outside of the tab.</p>
              <p>The weather data for this application was provided by <a href="https://openweathermap.org/">OpenWeatherMap</a>.</p>
              {('serviceWorker' in navigator) ? (<p />) : (
                <p>Sadly your browser does not support this functionality yet. The application will work but you won't be able to receive push notifications.. Support for this feature can be found on <a href="https://jakearchibald.github.io/isserviceworkerready/">isserviceworkerready</a>.</p>
              )}
            </div>
          </main>
        ) : (<ul class="list">
          {locations.map(location => (
            <Location
              key={location.id}
              location={location}
              onToggle={this.handleSubscription}
              onRemove={this.removeLocation} />
          ))}
        </ul>)}
      </div>
    );
  }
}
