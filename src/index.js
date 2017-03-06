import { combineReducers } from 'redux';

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
      // This feels hacky:
      rootReducer = {};
      rootReducer[name] = newReducers[name];
      return rootReducer = combineReducers(rootReducer);
    },
    getRootReducer: () => {
      return rootReducer;
    }
  }
})();

export const ri = {
  dispatch: {},
  trigger: (action) => {
    return _store.dispatch(action);
  },
  connectInterface: (name, rawInterface) => {
    let newInterface = {};

    // build the new interface:
    newInterface[name] = Object.assign({}, rawInterface.actions);
    // Rebuild the interface object:
    ri.dispatch = Object.assign({}, ri.dispatch, newInterface);
    // Rebuild the rootReducer:
    return _reducers.mount(name, rawInterface.reducers);
  },
  setStore: (clientStore) => {
    return _store.set(clientStore);
  },
  getStore: () => {
    return _store.get();
  },
  getRootReducer: () => {
    return _reducers.getRootReducer();
  },
  getReducer: (reducerStr) => {
    const Store = _store.get();
    // Get reducer from input:
    const reducer = eval(`Store.getState().${reducerStr}`);

    return { 
      getValue: () => {
        return reducer;
      }
    };
  }
};
