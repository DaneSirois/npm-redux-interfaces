import { combineReducers } from 'redux';

// ====== Private ====== //
const Store = ((initial = null) => {
  let ClientStore = initial;

  const _connectStore = (store) => API.subscribe.connectStore(store);
  const _removeSub = () => API.subscribe.removeSub();

  let API = {
    subscribe: (() => {
      /*[1] Whenever currentState changes, this method should
      update all pointers to it with the new value. */
      const subscriptions = {};
      let currentState;
      let unsubscribe;

      //[3] Check for changes and update currentState:
      const handleChange = () => {
        const nextState = ClientStore.getState();

        if (nextState !== currentState) {
          for (let namespace in subscriptions) {
            const _interface = subscriptions[namespace];

            for (let reducer in _interface) { // Assign new state to subscription:
              _interface[reducer] = nextState[namespace][reducer];
            }
          }
          currentState = nextState;
        }
      };

      //[2] Subscribe to the store and save the disconnect method:
      const _connect = (store) => {
        unsubscribe = store.subscribe(handleChange); // returns: unsubscribe();
      };

      return {
        connectStore: _connect,
        addSub: (name, reducer) => {
          if (!subscriptions[name]) {
            subscriptions[name] = { [reducer]: ClientStore.getState()[name][reducer] };
            return subscriptions[name];
          }
        },
        removeSub: (namespace, reducer) =>  {
          if (subscriptions[namespace]) {
            return delete subscriptions[namespace][reducer];
          }
          return "there is no reducer with these inputs to unsubscribe to";
        }
      };
    })(),
    dispatch: (action) => {
      ClientStore.dispatch(action);
    },
    get: () => {
      return ClientStore;
    },
    set: (store) => {
      ClientStore = store;
      _connectStore(store);
    }
  };
  return API;
})();

const Reducer = ((initial = null) => {
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
const _getState = (Store, interfaceName, reducer) => eval(`Store.getState().${interfaceName}.${reducer}`);

// ====== Interface Methods: ====== //
const _mountInterface = (namespace, input) => {
  if (!RI[namespace]) { // If the interface does not conflict:

    let actionsObj = {};
    if (input.actions) { // Build the actions:
      actionsObj = Object.keys(input.actions).reduce((obj, action) => {
        obj[action] = (...payload) => Store.dispatch(input.actions[action](...payload));
        return obj;
      }, {});
    }

    let reducersObj = {};
    if (input.reducers) { // Build the reducers:
      reducersObj = Object.keys(input.reducers).reduce((obj, reducer) => {
        obj[reducer] = {
          getState: () => _getState(Store.get(), namespace, reducer),
          subscribe: () => Store.subscribe.addSub(namespace, reducer),
          unsubscribe: () => Store.subscribe.removeSub(namespace, reducer)
        };
        return obj;
      }, {});

      // Mount the reducers:
      Reducer.add(namespace, combineReducers(input.reducers));
    }

    // Build the interface:
    const nextInterface = { [namespace]: Object.assign(actionsObj, reducersObj) };

    // Mount the interface:
    return RI = Object.assign(RI, nextInterface);
  }
  // If the interface conflicts:
  const err = { message: `Interface '${namespace}' is already in use. Try a different namespace.` };

  console.log(err.message);

  return err;
};

// ====== Public ====== //
export let RI = {
  mount: (namespace, input) => {
    return _mountInterface(namespace, input);
  },
  setStore: (input) => {
    return Store.set(input);
  },
  getStore: () => {
    return Store.get();
  },
  getRootReducer: () => {
    return Reducer.getRoot();
  }
};
