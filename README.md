# NPM-Redux-Interfaces: 
A self contained Redux state management library

**Dispatch actions through an interface from anywhere:**
```
import { RI } from 'npm-redux-interfaces';

RI.app.RENDER(true);
```

**Access reducer state through an interface from anywhere:**
```
import { RI } from 'npm-redux-interfaces';

RI.app.render().getState();
```

**Note:**
Unfortunately, *npm-redux-interfaces* does **not** currently support server-side rendering. It's something I'm looking into.

## Index:
1. [Configuration](#configuration)
2. [API](#api)
3. [Dependencies](#dependencies)
4. [Author](#author)
5. [License](#license)

## Configuration:

**In the `index.js` file of your interfaces folder:**

1. Import the *redux-interfaces* library:

    - `import { RI } from 'npm-redux-interfaces';`
    
2. Import your interfaces:

    - `import App_interface from './App/App_interface';`
    
3. Connect your interfaces:

    - `RI.connectInterface("app", App_interface);`
    
4. Export the *root_reducer*:

    - `export const root_reducer = RI.getRootReducer();`
    
**/interfaces/index.js:**
```
import { RI } from 'npm-redux-interfaces';
import App_interface from './App/App_interface';

RI.connectInterface("app", App_interface);

export const root_reducer = RI.getRootReducer();
```

**In the `index.js` file where you initialize your Redux store:**

1. Import the *redux-interfaces* library:

    - `import { RI } from 'npm-redux-interfaces';`
    
2. Import the *root_reducer*:

    - `import { root_reducer } from './interfaces/index.js';`
    
3. Build the Redux store:

    - `const store = applyMiddleware(...middleware)(createStore)(root_reducer);`
    
4. Pass in reference to the store:

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

RI.connectInterface("auth", Auth_interface);
```

The library takes care of hooking everything else up for you.

You should now be able to access and interact with your interface from anywhere within your application:

**/components/loginForm.js:**
```
import { RI } from 'npm-redux-interfaces';

RI.auth.LOGIN({username: "dane", password: "abc123"});

const loggedInReducer = RI.auth.loggedIn().getState();
```

## API:
## RI.connectInterface([*string*], [*object*]):
- This method connects your interface to the library allowing you to interact with it's action/reducer API

**Arguments**([*interface_name*], [*interface_object*]):
 
1. [*interface_name*]:
    - A string which gets used as part of the path for interacting with your interface
2. [*interface_object*]:
    - An object containing the 'actions/reducers' API for your interface

**Returns**: [*NULL*]

**Example**:

`RI.connectInterface("app", App_interface);`

## RI.getRootReducer():
- This method returns the *root_reducer* for your app
- Usually you will want to immediately export the result of calling this function for use when defining your store

**Arguments**():

**Returns**: [*FUNCTION*]

**Example**:

`export const root_reducer = RI.getRootReducer();`

## RI.setStore([*object*]):
- This method gives the library access to the redux store allowing it to internally dispatch actions and access reducer state
- Immediately after creating your Redux store, pass it in to the `RI.setStore()` method

**Arguments**([*store*]):

1. [*store*]:
    - The object created when initializing your Redux store inside of your app's root level `index.js` file
    
**Returns**: [*NULL*]

**Example**:

```
const store = applyMiddleware(...middleware)(createStore)(root_reducer);`

RI.setStore(store);
```

## RI.getStore():
- This method returns the Redux store passed in from `RI.setStore()`

**Example**:

`const reduxStore = RI.getStore()`

**Arguments**():

**Returns**: [*OBJECT*]

## Dependencies:
1. **redux**

## Author:
**Dane Sirois**

## License:
**MIT**
