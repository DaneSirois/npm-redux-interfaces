import { combineReducers } from 'redux';

// ====== Private ====== //

const _Store = ((initial = null) => {
  let storeInstance = initial;

  return {
    dispatch: (action) => {
      return storeInstance.dispatch(action);
    },
    get: () => {
      return storeInstance;
    },
    set: (store) => {
      return storeInstance = store;
    }
  }
})();

const _Reducers = ((initial = null) => {
  let root_reducer = initial;
  let reducerStore = {};

  return {
    add: (name, input) => {
      // Format the inputs:
      const nextInterface = {[name]: input};

      // Add the new interface:
      reducerStore = Object.assign(reducerStore, nextInterface);

      // Rebuild the root_reducer:
      return root_reducer = combineReducers(reducerStore);
    },
    getRoot: () => {
      return root_reducer;
    }
  }
})();

// ====== Reducer Methods: ====== //
const _getState = (interfaceName, reducer, Store) => eval(`Store.getState().${interfaceName}.${reducer}`);

// ====== Interface Methods: ====== //
const _mountInterface = (name, input) => {
  if (!RI[name]) { // If the interface does not conflict:

    // Build the actions:
    const actionsObj = Object.keys(input.actions).reduce((obj, index) => {
      obj[index] = (...payload) => _Store.dispatch(input.actions[index](...payload));
      return obj;
    }, {});

    // Build the reducers:
    const reducersObj = Object.keys(input.reducers).reduce((obj, index) => {
      obj[index] = () => ({ getState: () => _getState(name, index, _Store.get()) });
      return obj;
    }, {});

    // Mount the reducers:
    _Reducers.add(name, combineReducers(input.reducers));

    // Build the interface:
    const nextInterface = {[name]: Object.assign(actionsObj, reducersObj)};

    // Mount the interface:
    return RI = Object.assign(RI, nextInterface);
  }
  // If the interface conflicts:
  const err = { message: `Interface '${name}' is already in use. Try a different name..` };

  console.log(err.message);

  return err;
};

// ====== Public ====== //

export let RI = {
  connectInterface: (name, input) => {
    return _mountInterface(name, input);
  },
  mountInterface: (name, input) => {
    return _mountInterface(name, input);
  },
  setStore: (input) => {
    return _Store.set(input);
  },
  getStore: () => {
    return _Store.get();
  },
  getRootReducer: () => {
    return _Reducers.getRoot();
  }
};
