# Redux-Interfaces
> Domain based Redux architecture and API.

Interfaces are wrappers around your Redux actions and reducers that provide an importable API for interacting with your applications state. Interfaces are organized by domain allowing for easier conceptualization of your state. Through the library you can access and subscribe to data directly from your reducers without the need for external bindings. Dispatching actions can be done from anywhere and becomes as simple as a function call.

**Why interfaces**:

- They reduce the amount of boilerplate needed for interacting with your store
  - Say goodbye to bindings like `mapDistpatchToProps()`
- They force you to think about the different domains in your app and model your state around them
- They provide structure around your usage of Redux by giving you an easily repeatable and understandable architecture for adding new actions and reducers

**Consumption**:

- (*See [#Creating-an-interface](#creating-an-interface) for information on how to create an interface*)
```js
import { RI } from 'npm-redux-interfaces';

// DISPATCHING ACTIONS:
RI.app.LOADING(true);

// Get the state from the loading reducer:
const appIsLoading = RI.app.loading.getState();

// Create a listener on the messages reducer:
RI.chatroom.messages.listen((changes) => {
  // Called on every change to the reducer
});

// Add a message to a chatroom:
RI.chatroom.NEW_MESSAGE({ text: 'My message' });
```
- (*See [#Creating-an-interface](#creating-an-interface) for more information on how to configure*)

## Index:
1. [Installation:](#installation)
2. [Mirgrating to v3.0.0:](#Migrating-from-v2.0-to-v3.0)
3. [Usage:](#usage)
4. [Configuration:](#configuration)
5. [Creating an Interface:](#creating-an-interface)
6. [API:](#api)
7. [Dependencies:](#dependencies)
8. [Author:](#author)
9. [License:](#license)

***
## Installation:
```
npm install --save npm-redux-interfaces
```

***
## Migrating from v2.0 to v3.0:
- see the [release notes](https://github.com/DaneSirois/npm-redux-interfaces/releases/tag/v3.0.0) for changes

***
## Usage:
- (*See [#Creating-an-interface](#creating-an-interface) for information on how to configure an interface*)

**Creating an interface**:
```js
/*[ /interfaces/App/App_index.js ]*/

import App_RENDER from './actions/App_RENDER.js';

import App_render from './reducers/App_render.js';

export default {
  actions: {
    RENDER: (bool) => App_RENDER(bool)
  },
  reducers: {
    render: App_render
  }
};
```
- (*See [#Creating-an-interface](#creating-an-interface) for more information on how to configure*)

**Connecting an interface**:
```js
import { RI } from 'npm-redux-interfaces';

// Import your interfaces:
import App_interface from './App/App_index';

// Mount your interfaces:
RI.mount('chatroom', Chatroom_interface);

// Export the root_reducer:
export const root_reducer = RI.getRootReducer();
```

**Dispatching an action:**
```js
import { RI } from 'npm-redux-interfaces';

RI.chatroom.NEW_MESSAGE({ text: 'Cool!' });
```

**Accessing state from reducers:**
```js
import { RI } from 'npm-redux-interfaces';

const messages = RI.chatroom.messages.getState();

RI.chatroom.messages.listen((changes) => {
  // Called on every state change in the reducer
});
```

***
## Configuration:
- (*See [#Creating-an-interface](#creating-an-interface) for information on how to create an interface*)

**[1]**: Create an *interfaces* folder off of the directory where you define your Redux store.

**[2]**: Create an `index.js` file within your new *interfaces* folder. This file is where you will make the connection between your interfaces, and the library. At the end of this file, export the `root_reducer`.

**[ src/interfaces/index.js ]:**
```js
import { RI } from 'npm-redux-interfaces';

// Import your interfaces:
import Chatroom_interface from './Chatroom/Chatroom_index';

// Mount your interfaces:
RI.mount('chatroom', Chatroom_interface);

// Export the root_reducer:
export const root_reducer = RI.getRootReducer();
```

**[3]**: Navigate to your apps root `index.js` file and create the store. Immediately after definition, pass in reference to it with `RI.setStore()`.

**[ src/index.js ]:**
```js
import { RI } from 'npm-redux-interfaces';
import { root_reducer } from './interfaces/index.js';

// Create the store:
const store = applyMiddleware(...middleware)(createStore)(root_reducer);

// Pass reference to it:
RI.setStore(store);
```

**Your app is now ready to mount interfaces**.
***
## Creating an Interface:

**[1]**: Create a new folder for your interface inside of the `/interfaces` directory:
- It's convention to capitalize the first letter of the interface folders name (**ex**: `Chatroom`).

[2]: Inside of this new folder, create a **types** file:
- *It's convention to name your constants with the name of the interface appended with the type in all capitals.*

**[ src/interfaces/Chatroom/Chatroom_types.js ]:**
```js
export const Chatroom_NEW_MESSAGE = 'Chatroom_NEW_MESSAGE';
```

**[3]**: Create sub directories for your *actions* and *reducers*:

**[ src/interfaces/Chatroom/actions/Chatroom_NEW_MESSAGE.js ]:**
```js
import { Chatroom_NEW_MESSAGE } from '../Chatroom_types.js';

export default (message) => {
  return {
    type: Chatroom_NEW_MESSAGE,
    payload: {
      message
    }
  };
};
```

**[ src/interfaces/Chatroom/reducers/Chatroom_messages.js ]:**
```js
import { Chatroom_NEW_MESSAGE } from '../Chatroom_types.js';

export default (state = false, action) => {
  switch(action.type) {
    case Chatroom_NEW_MESSAGE:
      return state.concat([action.payload]);
    default:
      return state;
  };
};
```

**[4]**: Create the entry point for your interface. This is where you build and expose it's public API.

- *This file **must** export an object that contains the keys **actions**, and **reducers**. It's okay to omit either key, but know that their presence is required if you wish to use that part of your interface.*
- *Your actions **must** be named in all caps. This is what differentiates them from your reducers.*

**[ src/interfaces/Chatroom/Chatroom_index.js ]:**
```js
import App_RENDER from './actions/App_RENDER.js';

import App_render from './reducers/App_render.js';

export default {
  actions: {
    RENDER: (bool) => App_RENDER(bool)
  },
  reducers: {
    render: App_render
  }
};
```

**If you followed all of the steps correctly, you should now how have a directory which mimics the following**:

![Chatroom_interface](http://imgur.com/hLjLGAw.png)

***
## API:
## RI.mount([*string*], [*object*]):
This method mounts your interface into to the library giving you access to it's internal API.
- As convention, namespace your interfaces using lowercase.

**Arguments**([*1*], [*2*]):

1. [*interface_name*]:
    - A string which gets used as the namespace for your interface.
2. [*interface_object*]:
    - An object containing the API of your interface.

**Returns**: [ *null* ]

**Example**:
```js
RI.mount('chatroom', Chatroom_interface);
```

***
## RI.getRootReducer():
This method returns the `root_reducer` of your app.
- Usually you will want to immediately export this for use when defining your store.

**Arguments**( ): [ *none* ]

**Returns**: [ *function* ]

**Example**:
```js
export const root_reducer = RI.getRootReducer();
```

***
## RI.setStore([*object*]):
This method gives the library access to your redux store allowing it to internally dispatch actions and access reducer state.

- Immediately after instantiating your Redux store, pass reference to it with this method.

**Arguments**([1]):

1. [*store*]:
    - The object created upon instantiating your Redux store from inside of your app's root level *index.js* file.

**Returns**: [ *null* ]

**Example**:
```js
const store = applyMiddleware(...middleware)(createStore)(root_reducer);

RI.setStore(store);
```
***
## RI.getStore():
This method returns the store object initially passed in from the `RI.setStore()` method.

**Arguments**( ):

**Returns**: [ *object* ]

**Example**:
```js
const reduxStore = RI.getStore();
```

***
## Dependencies:
1. **redux**

## Author:
**[Dane Sirois](https://www.linkedin.com/in/dane-sirois/)**

## License:
**[MIT](https://opensource.org/licenses/MIT)**
