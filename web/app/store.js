import { createStore } from 'redux';
import { loadState, saveState, getLocationSubscription } from './local';

const ACTIONS = {
  SET_NETWORK: ({ network, ...state }, { toggleState }) => ({
    network: toggleState,
    ...state,
  }),

  SET_MODAL: ({ modal, ...state }, { toggleState }) => ({
    modal: toggleState,
    ...state,
  }),

  SET_SUBSCRIPTION: ({ subscription, ...state }, { toggleState }) => ({
    subscription: toggleState,
    ...state,
  }),

  ADD_LOCATION: ({ locations, ...state }, { location }) => ({
    locations: [...locations, Object.assign({ subscribed: false }, location)].sort((a, b) => a.name.localeCompare(b.name)),
    ...state,
  }),

  REMOVE_LOCATION: ({ locations, ...state }, { location }) => ({
    locations: locations.filter(i => i !== location),
    ...state,
  }),

  SET_LOCATION_SUBSCRIPTION: ({ locations, ...state }, { location, toggleState }) => ({
    locations: locations.map(currentLocation => {
      if (currentLocation === location) {
        currentLocation.subscribed = toggleState;
        currentLocation = Object.assign({}, currentLocation);
      }
      return currentLocation;
    }),
    ...state,
  }),

  SYNC_LOCATIONS: ({ locations, ...state }, { newLocations }) => {
    newLocations.sort((a, b) => a.name.localeCompare(b.name));
    newLocations.map((newLocation) => Object.assign(newLocation, {
      subscribed: getLocationSubscription(locations, newLocation.name),
    }));
    return {
      locations: newLocations,
      ...state,
    };
  },
};

const INITIAL = {
  locations: loadState('locations') || [],
  network: navigator.onLine,
  serviceWorker: ('serviceWorker' in navigator),
  subscription: loadState('subscription') || null,
};

const store = createStore((state, action) => (
  action && ACTIONS[action.type] ? ACTIONS[action.type](state, action) : state
), INITIAL, window.devToolsExtension && window.devToolsExtension());

store.subscribe(() => {
  saveState({
    locations: store.getState().locations,
    subscription: store.getState().subscription,
  });
});

export default store;

