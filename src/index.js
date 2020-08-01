import { combineReducers } from 'redux';

const Store = ((initial = null) => {
  // Set the initial store passed in from the user:
  let ClientStore = initial;

  /**
   * createReducerListener
   *
   * A method for creating a reducer listener and returning
   * an API to be used to add new listner hooks and to update
   * the existing ones with new state.
   */
  const createReducerListener = (interfaceName, reducerName, callback) => {
    let currentValueInReducer = null;

    /**
    * hooks
    *
    * An IIFE that is responsible for keeping track
    * of every listener hook. Listener hooks are
    * instantiated through the `.listen` command.
    */
    const hooks = (() => {
      const instances = [];

      return {
        getAll: () => (
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

    return {
      [reducerName]: {
        updateListeners: (newState) => {
          const updateHooks = () => {
            currentValueInReducer = nextReducerState;

            // Update every listener hook with the new value:
            hooks.getAll().forEach((listener) => {
              if (listener) {
                listener.callback(nextReducerState);
              }
            });
          };

          const nextReducerState = newState[interfaceName][reducerName];

          const dataTypeOfNextState = typeof nextReducerState;
          const dataTypeOfCurrentState = typeof currentValueInReducer;

          /**
           * JSON.stringify works here because the order of
           * arrays or objects should not change by Redux. If it
           * does change then we want it to update the hooks.
           */
          if (
            dataTypeOfNextState !== dataTypeOfCurrentState ||
            JSON.stringify(nextReducerState) !== JSON.stringify(currentValueInReducer)
          ) {
            // If the data has changed we need to update:
            updateHooks();
          }
        },
        addListenerHook: (callback) => {
          /**
           * addListenerHook
           *
           * The method is called when adding a new listener hook.
           * the `callback` argument is what gets called internally
           * to update the listener with the new state on change.
           */

          const listenerHook = {
            remove: () => hooks.remove(hooks.length),
            callback
          };

          hooks.add(listenerHook);

          // populate with existing state:
          callback(ClientStore.getState()[interfaceName][reducerName]);

          return {
            remove: listenerHook.remove
          };
        }
      }
    };
  };

  /**
   * reducerSubscriptions
   *
   * An IIFE that is responsible for instantiating and
   * keeping track of reducer subscriptions. A given reducer
   * can have only one subscription. Each subscription can
   * having multiple listener hooks.
   */
  const reducerSubscriptions = (() => {
    const subscriptions = {};

    return {
      listen: (interfaceName, reducerName, callback) => {
        /**
         * This function is executed in the context of a
         * new listener being added to a reducer subscription.
         */

        let publicListenerHookMethods = null;

        if (!subscriptions.hasOwnProperty(interfaceName)) {
          // if the interface does not yet have any reducer
          // subscriptions, instantiate the first one:
          subscriptions[interfaceName] = createReducerListener(
            interfaceName,
            reducerName,
            callback
          );

          publicListenerHookMethods = (
            subscriptions[interfaceName][reducerName].addListenerHook(callback)
          );
        } else if (
          subscriptions.hasOwnProperty(interfaceName) &&
          !subscriptions[interfaceName][reducerName]
        ) {
          // If the interface already has a subscription but
          // no listeners for this reducer, add the reducer
          // listener to the interface subscription:
          subscriptions[interfaceName] = Object.assign({},
            subscriptions[interfaceName],
            createReducerListener(
              interfaceName,
              reducerName,
              callback
            )
          );

          publicListenerHookMethods = (
            subscriptions[interfaceName][reducerName].addListenerHook(callback)
          );
        } else {
          // if the interface already has a subscription and
          // the reducer already has a listener, add a new
          // listener hook:
          publicListenerHookMethods = (
            subscriptions[interfaceName][reducerName].addListenerHook(callback)
          )
        }

        return publicListenerHookMethods;
      },
      updateSubscriptions: (changesFromStore) => {
        /**
         * An internal method for updating all reducer subscriptions
         * with the new state object.
         *
         * This is called internally on every state change in the store.
         */
        for (let namespace in subscriptions) {
          const Interface = subscriptions[namespace];

          for (let reducerName in Interface) {
            Interface[reducerName].updateListeners(changesFromStore);
          }
        }
      }
    };
  })();

  const subscribe = () => {
    /**
     * subscribe
     *
     * A method to be called on every update made to the
     * store. It is responsible for updating every reducer
     * subscription with the new state.
     *
     * @return {null}
     */

    /**
     * handleChange
     *
     * A method for updating all of the subscriptions
     * with the new state from Redux:
     */
    const handleChange = () => {
      const nextState = ClientStore.getState();

      reducerSubscriptions.updateSubscriptions(nextState);
    };

    // Subscribe to the store passed from the user
    // and save the disconnect method:
    let unsubscribeCallback;
    const createSubscriptionToStore = (store) => {
      // returns method to unsubscribe;
      unsubscribeCallback = store.subscribe(handleChange);
    };

    return Object.assign({}, reducerSubscriptions, {
      createSubscriptionToStore,
      unsubscribeCallback
    });
  };

  const StoreAPI = {
    subscribe: subscribe(),
    dispatch: (action) => {
      ClientStore.dispatch(action);
    },
    get: () => {
      return ClientStore;
    },
    set: (store) => {
      ClientStore = store;
      StoreAPI.subscribe.createSubscriptionToStore(store);
    }
  };

  return StoreAPI;
})();

const Reducer = (store, interfaceName, reducerName) => ({
  getState: () => eval(`store.get().getState().${interfaceName}.${reducerName}`),
  listen: (callback) => store.subscribe.listen(interfaceName, reducerName, callback)
});

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

const mountInterface = (store, interfaceName, input) => {
  // Check if the interface name does not conflict:
  if (!RI[interfaceName]) {

    // Build the actions:
    let actionsObj = {};
    if (input.actions) {
      actionsObj = Object.keys(input.actions).reduce((obj, action) => {
        obj[action] = (...payload) => store.dispatch(input.actions[action](...payload));
        return obj;
      }, {});
    }

    // Build the reducers:
    let reducersObj = {};
    if (input.reducers) {
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

export let RI = {
  mount: (namespace, input) => {
    return mountInterface(Store, namespace, input);
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
