/**
 * Load state from localStorage.
 */
export const loadState = (state) => {
  try {
    const serializedState = localStorage.getItem('periodic-weather');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState)[state];
  } catch (err) {
    return undefined;
  }
};

/**
 * Save state to localStorage.
 *
 * @param {object} stateValue
 */
export const saveState = (stateValue) => {
  try {
    const serializedState = JSON.stringify(stateValue);
    localStorage.setItem('periodic-weather', serializedState);
  } catch (err) {
    // Ignore
  }
};

/**
 * Get the current subscription state of a location.
 *
 * @param {array} locations
 * @param {string} location
 */
export const getLocationSubscription = (locations, location) => {
  for (let i = 0; i < locations.length; i += 1) {
    if (locations[i].name === location) {
      return locations[i].subscribed;
    }
  }
  return false;
};
