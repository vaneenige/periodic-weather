export const setNetwork = toggleState => ({
  type: 'SET_NETWORK',
  toggleState,
});

export const setModal = toggleState => ({
  type: 'SET_MODAL',
  toggleState,
});

export const setSubscription = toggleState => ({
  type: 'SET_SUBSCRIPTION',
  toggleState,
});

export const setLocationSubscription = (location, toggleState) => ({
  type: 'SET_LOCATION_SUBSCRIPTION',
  location,
  toggleState,
});

export const addLocation = location => ({
  type: 'ADD_LOCATION',
  location,
});

export const removeLocation = location => ({
  type: 'REMOVE_LOCATION',
  location,
});

export const syncLocations = newLocations => ({
  type: 'SYNC_LOCATIONS',
  newLocations,
});


