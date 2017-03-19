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
Assuming you have a preconfigured interface named **auth**:

**Dispatching actions through it:**
```js
import { RI } from 'npm-redux-interfaces';

// Dispatching an action:
RI.auth.LOGIN({...});
```

**Accessing reducer state through it:**
```js
import { RI } from 'npm-redux-interfaces';

// Accessing a reducer:
RI.auth.loggedIn().getState();
```

***
## Configuring the Library:
First, create an **/interfaces** folder in the same directory that you define your redux store.

Next, create an **index.js** file within your new interfaces folder. This file is where you will both import, and connect each one of your interfaces from. This is also the spot where you will retreive and export your *root_reducer*:

**/interfaces/index.js:**
```js
import { RI } from 'npm-redux-interfaces';
import Auth_interface from './Auth/Auth_interface';

RI.connectInterface('auth', Auth_interface);

export const root_reducer = RI.getRootReducer();
```

Now, head back over to your root level **index.js** file and create your store. After defining the store, you are going to want to give the library access to it. Doing so gives the libray access to your reducers, as well as the ability to dispatch actions:

**/index.js:**
```js
import { RI } from 'npm-redux-interfaces';
import { root_reducer } from './interfaces/index.js';

const store = applyMiddleware(...middleware)(createStore)(root_reducer);
RI.setStore(store);
```

***
## Defining an Interface:
Defining an interface is simple!

First, create a new folder for your interface inside of your **/interfaces** directory.
- It's convention to make the first letter of the interfaces name a capital -- ex: **Auth**.

Inside of this new folder, create a **types** file for use inside of your actions and reducers:

**/interfaces/Auth/Auth_types.js**:
```js
export const type__LOGIN = 'type__LOGIN';
```
- The use of double underscores is optional. However, I personally think having that visual distinction makes your actions and reducers more readable

Next, create both an **actions**, and **reducers** sub-folder. In case you haven't already guessed, this is where your actions and reducers for the interface will live:

**/interfaces/Auth/actions/Auth_LOGIN.js**:
```js
import { type__LOGIN } from '../Auth_types.js';

const Auth_LOGIN = (creds) => {
  return {
    type: type__LOGIN,
    payload: creds
  }
}

export default Auth_LOGIN;
```
**/interfaces/Auth/reducers/Auth_loggedIn.js**:
```js
import { type__LOGIN } from '../Auth_types.js';

const Auth_loggedIn = (state = false, action) => {
  switch(action.type) {
    case 'type__LOGIN':
      return action.payload;
    default:
      return state;
  };
};

export default Auth_loggedIn;
```

Finally, create the entry point for your interface. This is where you will build and expose it's public API:

**/interfaces/Auth/Auth_interface.js**:
```js
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
- Give note to the naming convention; Actions **must** be named in all caps. This is how you tell them apart from your reducers. Failure to do so will inevitably result in naming conflicts.

If you followed all the steps correctly, you should now how have a directory which mimics the following:

![Auth_interface](http://imgur.com/G2JYNO1.png)

**Thats it!**

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
```js
RI.connectInterface('app', App_interface);
```

***
## RI.getRootReducer():
This method returns the *root_reducer* for your app.
- Usually you will want to immediately export the result of calling this method for use when defining your store.

**Arguments**(): [none]

**Returns**: [*function*]

**Example**:
```js
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
```js
const store = applyMiddleware(...middleware)(createStore)(root_reducer);`

RI.setStore(store);
```
***
## RI.getStore():
This method returns the store object initially passed in from the `RI.setStore()` method.

**Arguments**():

**Returns**: [*object*]

**Example**:
```js
const reduxStore = RI.getStore()
```

***
## Dependencies:
1. **redux**

## Author:
**Dane Sirois**

## License:
**MIT**
