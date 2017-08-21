import { combineReducers } from 'redux';

// ====== Private ====== //
const Reducer = (store, interfaceName, reducerName) => ({
  getState: () => eval(`store.getState().${interfaceName}.${reducerName}`),
  setSubscription: (cb) => store.subscribe.setSubscription(interfaceName, reducerName, cb)
});

const Store = ((initial = null) => {
  let ClientStore = initial;
  let currentState;

  const subscriptions = (() => {
    const subs = {};
    return {
      setSubscription: (interfaceName, reducerName, callback) => {
        /* In the context of the incoming subscription */
        const hooks = (() => {
          const instances = [];
          return {
            get: () => (
              instances
            ),
            add: (hook) => {
              instances.push(hook);
            },
            remove: (position) => {
              instances[position] = null;
            },
            length: instances.length
          };
        })();
        let arrayPosition = null;
        let currentValue = null;

        // set the subscription
        if (!subs.hasOwnProperty(interfaceName)) {
          subs[interfaceName] = { [reducerName]: callback };
        }

        subs[interfaceName][reducerName] = callback;

        // return the subscriptions API:
        return {
          subscribe: (cb) => {
            // Potential issue if 2 hooks are created at the same time?
            const hook = {
              remove: () => hooks.remove(hooks.length),
              cb
            };

            hooks.add(hook);

            // populate with existing state:
            cb(ClientStore.getState()[interfaceName][reducerName]);

            return hook;
          },
          update: (changes) => {
            const nextState = changes[interfaceName][reducerName];

            if (currentValue !== nextState) {
              currentValue = nextState;
              hooks.get().forEach((hook) => {
                if (hook) {
                  // give it the new value:
                  hook.cb(nextState);
                }
              });
            }
          }
        };
      },
      update: (changesFromStore) => {
        for (let namespace in subs) {
          const Interface = subs[namespace];

          for (let reducer in Interface) {
            Interface[reducer](changesFromStore);
          }
        }
      }
    };
  })();

  const subscribe = () => {
    // Check for changes and update currentState:
    const handleChange = () => {
      const nextState = ClientStore.getState();

      // on first run:
      if (!currentState) {
        currentState = nextState;
        subscriptions.update(nextState);
      }

      if (nextState !== currentState) {
        subscriptions.update(nextState);
        currentState = nextState;
      }
    };

    // Subscribe to the store and save the disconnect method:
    let unsubscribeCallback;
    const createSubscriptionToStore = (store) => {
      unsubscribeCallback = store.subscribe(handleChange); // returns method to unsubscribe;
    };

    return Object.assign({}, subscriptions, {
      createSubscriptionToStore,
      unsubscribeCallback
    });
  };

  const API = {
    subscribe: subscribe(),
    dispatch: (action) => {
      ClientStore.dispatch(action);
    },
    get: () => {
      return ClientStore;
    },
    set: (store) => {
      ClientStore = store;
      API.subscribe.createSubscriptionToStore(store);
    }
  };
  return API;
})();

const RootReducer = ((initial = null) => {
  let root_reducer = initial;
  let reducerStore = {};

  return {
    addInterface: (name, input) => {
      // Format the inputs:
      const nextInterface = {[name]: input};

      // Add the new interface:
      reducerStore = Object.assign(reducerStore, nextInterface);

      // Rebuild the root_reducer:
      return root_reducer = combineReducers(reducerStore);
    },
    get: () => {
      return root_reducer;
    }
  }
})();

// ====== Interface Methods: ====== //
const _mountInterface = (store, interfaceName, input) => {
  if (!RI[interfaceName]) { // If the interface does not conflict:

    let actionsObj = {};
    if (input.actions) { // Build the actions:
      actionsObj = Object.keys(input.actions).reduce((obj, action) => {
        obj[action] = (...payload) => store.dispatch(input.actions[action](...payload));
        return obj;
      }, {});
    }

    let reducersObj = {};
    if (input.reducers) { // Build the reducers:
      reducersObj = Object.keys(input.reducers).reduce((acc, reducerName) => {
        acc[reducerName] = new Reducer(store, interfaceName, reducerName);
        return acc;
      }, {});

      // Add the interface's reducers to the RootReducer:
      RootReducer.addInterface(interfaceName, combineReducers(input.reducers));
    }

    // Mount the interface:
    return RI = Object.assign({},
      RI,
      { [interfaceName]: Object.assign({}, actionsObj, reducersObj) }
    );
  }
  // If the interface conflicts:
  console.error(`
    Interface '${interfaceName}' is already in use. Try a different name for your interface.
  `);

  return err;
};

// ====== Public ====== //
export let RI = {
  mount: (namespace, input) => {
    return _mountInterface(Store, namespace, input);
  },
  setStore: (input) => {
    return Store.set(input);
  },
  getStore: () => {
    return Store.get();
  },
  getRootReducer: () => {
    return RootReducer.get();
  }
};
