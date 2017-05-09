# Redux-Interfaces
> Redux State-Management API builder:

Interfaces define the consumption methods surrounding both the modification and retrieval of application state.
With them the aim is to reduce boilerplate, while providing cross-repo code reuse/liberation.

**Why interfaces**:

- **Liberate your state** - Interfaces give you access to your redux state from anywhere within your application. Dispatching actions is now just a function call, so bindings like `mapDispatchToProps()` are no longer needed.
- **Write *once* then *reuse*** - Interfaces exist independently from the rest of your application. They even exist independently from other interfaces. Reuse your interface code across repos.
- **Maintainability** - The nature of interfaces make you decide upon groupings for dividing up your applications state. You can think of it as organizing by *feature*, or *functionality*, opposed to by *type*. This division keep your state sane, while ultimately painting a piece of the broader picture of your applications state as a whole.

**Consumption**:

- (*See [#Creating-an-interface](#creating-an-interface) for information on how to create an interface*)
```js
import { RI } from 'npm-redux-interfaces';

// DISPATCHING ACTIONS:
RI.app.LOADING(true);
RI.user.ADD_FRIEND({ name: 'Don' });

// Follow CRUD:
RI.post.CREATE({...});
RI.post.READ({...});
RI.post.UPDATE({...});
RI.post.DELETE(...);

// ACCESSING REDUCERS:
const posts = RI.posts.allPosts().getState();

// Using React:
function mapStateToProps() {
  return ({
    loading: RI.app.loading().getState(),
    friendsList: RI.user.friendsList().getState()
  });
};
```

- **Note:**
This library may **not** currently support server-side rendering.. It's something that needs looking into.

## Index:
1. [Installation:](#installation)
2. [Usage:](#usage)
3. [Configuration:](#configuration)
4. [Creating an Interface:](#creating-an-interface)
5. [API:](#api)
6. [Dependencies:](#dependencies)
7. [Author:](#author)
8. [License:](#license)

***
## Installation:
```
npm install --save npm-redux-interfaces
```

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

**Connecting an interface**:
```js
import { RI } from 'npm-redux-interfaces';

// Import your interfaces:
import App_interface from './App/App_index';

// Mount your interfaces:
RI.mountInterface('app', App_interface);

// Export the root_reducer:
export const root_reducer = RI.getRootReducer();
```

**Dispatching an action:**
```js
import { RI } from 'npm-redux-interfaces';

RI.app.RENDER(true);
```

**Accessing a reducer:**
```js
import { RI } from 'npm-redux-interfaces';

const renderApp = RI.app.render().getState(); // true
```

***
## Configuration:
- (*See [#Creating-an-interface](#creating-an-interface) for information on how to create an interface*)

**[1]**: Create an *interfaces* folder off of the directory where you define your Redux store.

**[2]**: Create an `index.js` file within your new *interfaces* folder. This file is where you will make the connection between your interfaces, and the library. At the end of this file, export the `root_reducer`.

**[interfaces/index.js]**:
```js
import { RI } from 'npm-redux-interfaces';

// Import your interfaces:
import Chatroom_interface from './Chatroom/Chatroom_index';

// Mount your interfaces:
RI.mountInterface('chatroom', Chatroom_interface);

// Export the root_reducer:
export const root_reducer = RI.getRootReducer();
```

**[3]**: Navigate to your apps root `index.js` file and create the store. Immediately after definition, pass in reference to it with `RI.setStore()`.

**[/index.js]:**
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

**[2]**: Inside of the new folder, create a **types** file. This is where your will define your Redux types:
- It's convention to name your types with capitals.
- You do not need a *types* file if you are using [`type-stash`](https://www.npmjs.com/package/type-stash)(recommended).

**[/interfaces/App/App_types.js]**:
```js
export const type__APP_RENDER = 'type__APP_RENDER';
```

**[3]**: Create sub directories for your *actions* and *reducers*:

**[/interfaces/App/actions/App_RENDER.js]:**
```js
// Action:
import { type__APP_RENDER } from '../App_types.js';

export default (bool) => {
  return {
    type: type__APP_RENDER,
    payload: bool
  };
};

// With type-stash:
import typeStash from 'type-stash';

export default (bool) => {
  return {
    type: typeStash.use('APP_RENDER'),
    payload: bool
  };
};
```

**[/interfaces/App/reducers/App_render.js]:**
```js
// Reducer:
import { type__App_RENDER } from '../App_types.js';

export default (state = false, action) => {
  switch(action.type) {
    case type__App_RENDER:
      return action.payload;
    default:
      return state;
  };
};

// With type-stash:
import typeStash from 'type-stash';

export default (state = false, action) => {
  switch(action.type) {
    case typeStash.use('App_RENDER'):
      return action.payload;
    break;
    default:
      return state;
  };
};
```

**[4]**: Create the entry point for your interface. This is where you build and expose it's public API.

- This file **must** export an object that contains the properties *actions*, and *reducers*. It's okay to omit either key, but do know that their presence is required if you wish to use that part of the interface.
- Your actions **must** be named in all caps. This is what differentiates them from your reducers.

**[/interfaces/App/App_index.js]:**
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
## RI.mountInterface([*string*], [*object*]):
**Note**: This is being renamed to `RI.mount()` in **v3**.

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
RI.mountInterface('app', App_interface);
```

***
## RI.connectInterface([*string*], [*object*]):
- **This method is being replaced by `RI.mount()` in v3.**

This still works for now, but it will be removed in version 3.
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
