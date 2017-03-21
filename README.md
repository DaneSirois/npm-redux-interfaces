# NPM-Redux-Interfaces
*-Create interfaces for interacting with application state:*

**Why interfaces?**

- It allows your state to exist independently from the rest your application
- It's built upon the concept of modularity. With that comes maintainability with the inclination to scale
- It lets you interact with your application's state from anywhere. No more need for bindings like `mapDispatchToProps()`

**Note:**
It's my understanding that this library does **not** currently support server-side rendering. It's something that I'm looking into.

## Index:
1. [Intallation:](#installation)
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
*(Assumes the presence of a preconfigured interface named "**Chatroom**"
Refer to:* [#Creating-an-Interface](#creating-an-interface) *for information on how to create one)*

**Dispatching actions:**
```js
import { RI } from 'npm-redux-interfaces';

// Dispatching an action:
RI.chatroom.NEW_MESSAGE({text: "cool!"});
```

**Accessing reducer state:**
```js
import { RI } from 'npm-redux-interfaces';

// Accessing a reducer:
const messages = RI.chatroom.messages().getState();
```

***
## Configuration:
*(Assumes the presence of a preconfigured interface named "**Chatroom**"
Refer to:* [#Creating-an-Interface](#creating-an-interface) *for information on how to create one)*

1. Create an "**/interfaces**" folder extending from the directory where you define your Redux store.
2. Create an "**index.js**" file within the new "**/interfaces**" folder. This file is where you will make the connection between your interfaces, and the library. At the end of the file, export the **root_reducer**:

`/interfaces/index.js`:
```js
import { RI } from 'npm-redux-interfaces';
import Chatroom_interface from './Chatroom/Chatroom_index';

RI.connectInterface('chatroom', Chatroom_interface);

export const root_reducer = RI.getRootReducer();
```

3. Navigate to your apps root level "**index.js**" file and create the store. Immediately after definition, pass reference with `RI.setStore()`:

`/index.js`:
```js
import { RI } from 'npm-redux-interfaces';
import { root_reducer } from './interfaces/index.js';

const store = applyMiddleware(...middleware)(createStore)(root_reducer);
RI.setStore(store);
```

***
## Creating an Interface:
Creating an interface is easy.

1. Create a new folder inside of the "**/interfaces**" directory - (It's convention to make the first letter of the interfaces name begin with a capital (ex: **Chatroom**).

2. Inside of this new folder, create a "**types**" file for your actions and reducers to import from:

`/interfaces/Chatroom/Chatroom_types.js`:
```js
export const type__NEW_MESSAGE = 'type__NEW_MESSAGE';
```
- It is convention to name your types with capitals.
- The convention of double underscores is optional. I find that having that visual distinction makes your actions and reducers more readable.

3. Create both an **actions**, and **reducers** subfolder. If you haven't guessed, this is where your interfaces actions and reducers will live:

`/interfaces/Chatroom/actions/Chatroom_NEW_MESSAGE.js`:
```js
import { type__NEW_MESSAGE } from '../Chatroom_types.js';

const Chatroom_NEW_MESSAGE = (msg) => {
  return {
    type: type__NEW_MESSAGE,
    payload: msg
  }
}

export default Chatroom_NEW_MESSAGE;
```

`/interfaces/Chatroom/reducers/Chatroom_messages.js`:
```js
import { type__NEW_MESSAGE } from '../Chatroom_types.js';

const Chatroom_messages = (state = [], action) => {
  switch(action.type) {
    case type__NEW_MESSAGE:
      return state.concat([action.payload]);
    default:
      return state;
  };
};

export default Chatroom_messages;
```

4. Create the entry file for your interface. This is where you will build and expose it's public API:

`/interfaces/Chatroom/Chatroom_index.js`:
```js
// Actions:
import Chatroom_NEW_MESSAGE from './actions/Chatroom_NEW_MESSAGE.js';

// Reducers:
import Chatroom_messages from './reducers/Chatroom_messages.js';

// API:
export default {
  actions: {
    NEW_MESSAGE: (msg) => Chatroom_NEW_MESSAGE(msg)
  },
  reducers: {
    messages: Chatroom_messages
  }
};
```
- Give note to the naming convention; Actions **must** be named in all caps. This is distinguish them apart from your reducers. Failure to do so will inevitably result in naming conflicts.
- The keys of the "**actions**" and "**reducers**" objects are what get exposed for use when interacting with the interface.

If you followed all of the steps correctly, you should now how have a directory which mimics the following:

![Chatroom_interface](http://imgur.com/tIz8HNe.png)

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
RI.connectInterface('chatroom', Chatroom_interface);
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
    - The object created upon instantiating your Redux store from inside of your app's root level **index.js** file.

**Returns**: [*null*]

**Example**:
```js
const store = applyMiddleware(...middleware)(createStore)(root_reducer);

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
**[Dane Sirois](https://www.linkedin.com/in/dane-sirois/)**

## License:
**[MIT](https://opensource.org/licenses/MIT)**
