# NPM-Redux-Interfaces: 
A self-contained Redux state management library

Note: unfortunately, *npm-redux-interfaces* does **not** currently support server-side rendering. It's something on the radar

## [#1] - How to use:

**In the `index.js` file of your interfaces folder:**

1. Import the *redux-interfaces* library:

    - `import { ri } from 'npm-redux-interfaces';`
    
2. Import your interfaces:

    - `import App_interface from './App/App_interface';`
    
3. Connect your interfaces:

    - `ri.connectInterface("app", App_interface);`
    
4. Export the *root_reducer*:

    - `export const root_reducer = ri.getRootReducer();`
    
**example:**
```
import { ri } from 'npm-redux-interfaces';
import App_interface from './App/App_interface';

ri.connectInterface("app", App_interface);

export const root_reducer = ri.getRootReducer();
```

**In the `index.js` file where you initialize your Redux store:**

1. Import the *redux-interfaces* library:

    - `import { ri } from 'npm-redux-interfaces';`
    
2. Import the *root_reducer*:

    - `import { root_reducer } from './interfaces/index.js';`
    
3. Build the Redux store:

    - `const store = applyMiddleware(...middleware)(createStore)(root_reducer);`
    
4. Pass in reference to the store:

    - `ri.setStore(store);`

**example:**
```
import { ri } from 'npm-redux-interfaces';
import { root_reducer } from './interfaces/index.js';

const store = applyMiddleware(...middleware)(createStore)(root_reducer);

ri.setStore(store);
```

**That's it!**

Now that everything is hooked up, adding a new interface is easy:


1. Import your interface into the `interfaces/index.js` file

2. Call `ri.connectInterface()` passing in a reference to your interface object


*interfaces/index.js*:
```
import Auth_interface from './Auth/Auth_interface';

ri.connectInterface("Auth", Auth_interface);
```

The library takes care of hooking everything else up for you.

You should now be able to access and interact with your interface from anywhere within your application.


**Example**:
```
import { ri } from 'npm-redux-interfaces';

ri.trigger(ri.dispatch.app.RENDER(true));

const renderReducer = ri.getReducer('app.RENDER').getValue(); //true
```

## [#2] - API:
## ri.connectInterface([*string*], [*object*]):
- This method connects your interface to the library allowing you to interact with it's action/reducer API

**Arguments**(*interface_name*, *interface_object*):
 
1. [*interface_name*]:
    - A string which gets used as part of the path for interacting with your interface
2. [*interface_object*]:
    - An object containing the 'actions/reducers' API for your interface

**Returns**: [*NULL*]

**Example**:

`ri.connectInterface("app", App_interface);`

## ri.getRootReducer():
- This method returns the *root_reducer* for your app
- Usually you will want to immediately export the result of calling this function for use when defining your store

**Arguments**():

**Returns**: [*FUNCTION*]

**Example**:

`export const root_reducer = ri.getRootReducer();`

## ri.setStore([*object*]):
- This method gives the library access to the store, allowing it to internally dispatch actions and access reducer state
- Immediately after creating your Redux store, pass it in to the `ri.setStore()` method

**Arguments**(*store*):

1. [*store*]:
    - The object created when initializing your Redux store inside of your app's root level `index.js` file
    
**Returns**: [*NULL*]

**Example**:

```
const store = applyMiddleware(...middleware)(createStore)(root_reducer);`

ri.setStore(store);
```

## ri.getStore():
- This method returns the Redux store object passed in from `ri.setStore()`

**Example**:

`const reduxStore = ri.getStore()`

**Arguments**():

**Returns**: [*OBJECT*]

## ri.trigger([*function*]):
- This method is how you dispatch an action in *redux-interfaces*
- `ri.trigger()` doesn't actually dispatch the action, but instead triggers a request to
    - The actual dispatching of the action takes place from within the *actions* object of your interface file

**Arguments**(*action*):

1. [*action*]:
    - Takes the path to an action as an argument
    
**Returns**: [*NULL*]

**Example**:

`ri.trigger(ri.dispatch.app.RENDER(true));`

## ri.getReducer([*string*]):
- This method gives you access to the state stored in an instance of one of your reducers
- This method is chainable

**Arguments**(*reducer_path*):

1. [*reducer_path*]:
    - Takes a path to the reducer as an argument

**Returns**: [*OBJECT*]:

```
{
  getValue()
}
```

**Chainable Methods**:

1. `.getValue()` - returns the current value stored in the reducers state

**Example**:

`const renderReducer = ri.getReducer('app.RENDER').getValue();`

## [#3] - Dependencies:
1. **redux**
2. **redux-thunk**

## [#4] - Author:
-**Dane Sirois**

## [#5] - License:
-**MIT**
