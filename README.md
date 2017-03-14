# NPM-Redux-Interfaces 
-A self contained Redux state management library

**Why interfaces?**

- They provide a scalable architecture for organizing and interacting with application state.
- It allows your state, and the methods to interact with that state to exist independently from the rest your application. It's built on the concept of modularity.
- It gives you control over your data so that you can interact with it on your own terms. No more conforming to bindings like `mapDispatchToProps()`.

**Note:**
unfortunately, *NPM-Redux-Interfaces* does **not** currently support server-side rendering. It's something I'm looking into.

## Index:
1. [Usage:](#usage)
2. [Configuring the Library:](#configuring-the-library)
3. [Defining an Interface:](#defining-an-interface)
4. [API:](#api)
5. [Dependencies:](#dependencies)
6. [Author:](#author)
7. [License:](#license)

***
## Usage:
**Dispatching actions through an interface:**
```
import { RI } from 'npm-redux-interfaces';

// Dispatching an action:
RI.auth.LOGIN({...});
```

**Accessing reducer state through an interface:**
```
import { RI } from 'npm-redux-interfaces';

// Accessing a reducer:
RI.auth.loggedIn().getState();
```

***
## Configuring the Library:
First, create an **/interfaces** folder in the same directory that you define your redux store.

Next, create an `index.js` file within your new interfaces folder. This file is where you will both import, and connect each one of your interfaces from. This is also the spot where you will retreive and export your *root_reducer*:

**/interfaces/index.js:**
```
import { RI } from 'npm-redux-interfaces';
import Auth_interface from './Auth/Auth_interface';

RI.connectInterface('auth', Auth_interface);

export const root_reducer = RI.getRootReducer();
```

Now what you are going to want to do is head back over to your root level `index.js` file and create your store. After defining the store, you are going to want to give the library access to it. Doing so gives the libray access to your reducers, as well as the ability to dispatch actions:

**/index.js:**
```
import { RI } from 'npm-redux-interfaces';
import { root_reducer } from './interfaces/index.js';

const store = applyMiddleware(...middleware)(createStore)(root_reducer);
RI.setStore(store);
```

***
## Defining an Interface:
Defining an interface is simple!

First, create a new folder for your interface inside of your **/interfaces** folder. 
- (It's convention to make the first letter of the name a capital -- ex: `Auth`).

Inside of this new folder, create both an `actions`, and `reducers` sub-folder. In case you haven't already guessed, this is where your actions and reducers for the interface will live. 

Now, create an entry file for your interface. This is where you will build and expose it's public API:

**/interfaces/Auth/Auth_interface.js**:
```
// Actions:
import Auth_LOGIN from './actions/Auth_LOGIN.js';

// Reducers:
import Auth_loggedIn from './reducers/Auth_loggedIn.js';

// API:
export default {
  actions: {
    LOGIN: (creds) => Auth_LOGIN(creds)
  },
  reducers: {
    loggedIn: Auth_loggedIn
  }
}; 
```

***
## API:
## RI.connectInterface([*string*], [*object*]):
This method connects your interface to the library allowing you to interact with it's internal API.
- As convention, name your interfaces in lowercase.

**Arguments**([*1*], [*2*]):
 
1. [*interface_name*]:
    - A string which gets used as the namespace of your interface.
2. [*interface_object*]:
    - An object containing the API of your interface.

**Returns**: [*null*]

**Example**:
```
RI.connectInterface('app', App_interface);
```

***
## RI.getRootReducer():
This method returns the *root_reducer* for your app.
- Usually you will want to immediately export the result of calling this method for use when defining your store.

**Arguments**(): [none]

**Returns**: [*function*]

**Example**:
```
export const root_reducer = RI.getRootReducer();
```

***
## RI.setStore([*object*]):
This method gives the library access to your redux store allowing it to internally dispatch actions and access reducer state.
- Immediately after instantiating your Redux store, pass in reference to it with this method.

**Arguments**([1]):

1. [*store*]:
    - The object created upon instantiating your Redux store from inside of your app's root `index.js` file.

**Returns**: [*null*]

**Example**:
```
const store = applyMiddleware(...middleware)(createStore)(root_reducer);`

RI.setStore(store);
```
***
## RI.getStore():
This method returns the store object initially passed in from the `RI.setStore()` method.

**Arguments**():

**Returns**: [*object*]

**Example**:
`const reduxStore = RI.getStore()`

***
## Dependencies:
1. **redux**

## Author:
**Dane Sirois**

## License:
**MIT**
