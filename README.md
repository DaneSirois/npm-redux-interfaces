# NPM-Redux-Interfaces 
-A self contained Redux state management library

**why interfaces?**

- They provide a scalable architecture for organizing and interacting with application state.
- It allows your state, and the methods to interact with that state to exist independently from the rest your application. It's built on the concept of modularity.
- It gives you control over your data so that you can interact with it on your own terms. No more conforming to bindings like `mapDispatchToProps()`.

## Index:
1. [Configuration](#configuration)
2. [API](#api)
3. [Dependencies](#dependencies)
4. [Author](#author)
5. [License](#license)

**Dispatch actions through an interface:**
```
import { RI } from 'npm-redux-interfaces';

// Dispatch an action:
RI.app.RENDER(true);
```

**Access reducer state through an interface:**
```
import { RI } from 'npm-redux-interfaces';

// Access a reducer:
RI.app.render().getState();
```

**Note:**
Unfortunately, *NPM-Redux-Interfaces* does **not** currently support server-side rendering. It's something I'm looking into.

## Configuration:

**In the `index.js` file of your interfaces folder:**

1. Import the library:

    - `import { RI } from 'npm-redux-interfaces';`
    
2. Import your interfaces:

    - `import App_interface from './App/App_interface';`
    
3. Connect your interfaces:

    - `RI.connectInterface('app', App_interface);`
    
4. Get and export the *root_reducer*:

    - `export const root_reducer = RI.getRootReducer();`
    
**/interfaces/index.js:**
```
import { RI } from 'npm-redux-interfaces';
import App_interface from './App/App_interface';

RI.connectInterface('app', App_interface);

export const root_reducer = RI.getRootReducer();
```

**In the `index.js` file where you initialize your Redux store:**

1. Import the library:

    - `import { RI } from 'npm-redux-interfaces';`
    
2. Import the *root_reducer*:

    - `import { root_reducer } from './interfaces/index.js';`
    
3. Build the Redux store:

    - `const store = applyMiddleware(...middleware)(createStore)(root_reducer);`
    
4. Pass reference to the library:

    - `RI.setStore(store);`

**/index.js:**
```
import { RI } from 'npm-redux-interfaces';
import { root_reducer } from './interfaces/index.js';

const store = applyMiddleware(...middleware)(createStore)(root_reducer);

RI.setStore(store);
```

**That's it!**

Now that everything is hooked up, adding a new interface is easy:

**/interfaces/index.js**:
```
import Auth_interface from './Auth/Auth_interface';

RI.connectInterface('auth', Auth_interface);
```

The library takes care of hooking everything else up for you.

You should now have access, along with the ability to interact with your interface from anywhere within your application:

**/components/loginForm.js:**
```
import { RI } from 'npm-redux-interfaces';

RI.auth.LOGIN({username: 'user1', password: 'abc123'});

const loggedIn_reducer = RI.auth.loggedIn().getState();
```

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
