import { combineReducers } from 'redux';

// ====== Private Methods: ====== //
const _store = ((initial = null) => {
  let clientStore = initial;

  return {
    dispatch: (action) => {
      return clientStore.dispatch(action);
    },
    get: () => {
      return clientStore;
    },
    set: (store) => {
      return clientStore = store;
    }
  }
})();

const _reducers = ((initial = null) => {
  let rootReducer = initial;

  return {
    mount: (name, reducers) => {
      const newReducers = {};
      newReducers[name] = reducers;

      if (rootReducer) {
        return rootReducer = combineReducers( rootReducer, newReducers );
      }

      rootReducer = {};
      rootReducer[name] = newReducers[name];
      return rootReducer = combineReducers(rootReducer);
    },
    getRootReducer: () => {
      return rootReducer;
    }
  }
})();

// ====== Action Methods: ====== //
const _dispatach = (action) => _store.dispatch(action);

// ====== Reducer Methods: ====== //
const _getState = (Store, interfaceName, reducer) => eval(`Store.getState().${interfaceName}.${reducer}`);

// ====== Interface Methods: ====== //
const _connectInterface = (name, interfaceObj) => {
  if (!RI[name]) { // If the interface does not conflict:
    let newInterface = {};

    // Build the actions:
    let actionsObj = {};

    Object.keys(interfaceObj.actions).forEach((action) => {    
      actionsObj[action] = (payload) => {
        return _dispatach(interfaceObj.actions[action](payload));
      };
    });

    // Build the reducers:
    let reducerObj = {};

    Object.keys(interfaceObj.reducers).forEach((reducer) => {
      reducerObj[reducer] = () => {
        const Store = _store.get();

        return {
          getState: () => _getState(Store, name, reducer)
        };
      };
    });

    _reducers.mount(name, combineReducers(interfaceObj.reducers));

    // Build the interface:
    newInterface[name] = Object.assign({}, actionsObj, reducerObj);

    // Rebuild the RI object with the new interface:
    return RI = Object.assign({}, RI, newInterface);
  }
  const errorMsg = `Interface '${name}' is already in use. Try a different name..`;

  console.log(errorMsg);
  return { message: errorMsg };
};

// ====== Public Methods: ====== //
export let RI = {
  connectInterface: (name, interfaceObj) => {
    return _connectInterface(name, interfaceObj);
  },
  setStore: (clientStore) => {
    return _store.set(clientStore);
  },
  getStore: () => {
    return _store.get();
  },
  getRootReducer: () => {
    return _reducers.getRootReducer();
  }
};
