# @defx/dynamo

🚧 Please kindly note that this project is a work in progress 🚧

## [![npm](https://shields.io/npm/v/@defx/dynamo)](https://www.npmjs.com/package/@defx/dynamo) [![gzip size](https://img.badgesize.io/https://unpkg.com/@defx/dynamo/dist/dynamo.min.js?compression=gzip&label=gzip)]()

The small yet powerful JavaScript library for progressively enhancing HTML.

## If your only tool is a hammer then every problem looks like a nail

If you're building a website that is server rendered and content-rich (e.g., blog, e-commerce shop, etc) then it's likely that 80-100% of your JavaScript requirements can be solved in a very simple, performant, and easily maintainable way by using a small library such as Dynamo.

### Two types of reactive updates

Reactive DOM updates can broadly be divided into two categories:

- updating attributes and properties of an existing DOM tree
- updating the structure of the DOM tree itself

Making this distinction is useful to consider in terms of the associated costs, because structural updates require a browser templating solution, whereas updating attributes and properties of existing nodes does not, and the cost of templating in the browser can be quite expensive. Consider that, in order to update server-rendered content, your website or application must ship your templates to the browser so that your library understands how to re-render those parts. This makes perfect sense when your entire DOM tree needs to be structurally modifed at any point in time, however most websites and applications don't fall into that category. A common e-commerce website, for example, has very little requirement (if any) for structural DOM updates, and yet many new e-commerce websites are being built with tools that are designed specifically for that purpose.

## Install

### cdn

```js
import { Dynamo } from "https://unpkg.com/@defx/dynamo"
```

### npm

```sh
> npm i @defx/dynamo
```

## \[x-\*\] attributes

Attributes prefixed with an "x-" tell Dynamo about the parts of your HTML that you want to react to, and there are only 3 attributes to learn!

### x-node

The [x-node] attribute is used to identify a named function that can be used to derive that nodes attributes and/or properties from state.

### x-on

Used to bind an event listener to an element, accepts two arguments separated by a colon `x-on="eventType:actionName"` where `eventType` is the type of even you want to listen for and `methodName` is the name of the update method you wish to invoke;

Let's say, for example, we want to add a "load more" button to our product list...

```html
<button x-on="click:loadMore">[=]</button>
```

```js
Dynamo(rootNode, {
  action: {
    loadMore: (state) => {
      /* fetch more products from the server... */
    },
  },
})
```

### x-control

Used to bind any user input control element (e.g., `<input>, <select>, <textarea>`) to a property in state. The x-control attribute is a boolean attribute that doesn't accept any value, the name of the property reflected in state will be inferred from the elements [name] attribute.

> Applying the [name] + [x-control] pattern encourages parity between form data and request data for the purpose of progressive enhancement

> If you use [x-on] with a forms `submit` event then Dynamo will automatically provide the forms FormData as the action payload

```html
<select name="sortBy" x-control>
  <option value="bestsellers">Bestsellers</option>
  <option value="priceLowToHigh">Price (low - high)</option>
  <option value="priceHighToLow">Price (high - low)</option>
  <option value="rating">Rating</option>
</select>
```

## Syntax

```js
Dynamo(rootNode, {
  state: {
    /* the initial state */
  },
  action: {
    /* a dictionary of functions that synchronously update state */
  },
  node: {
    /* a dictionary of functions that update individual node attributes and properties as a side-effect of state transitions */
  },
})
```

### Parameters

#### event

Event handlers are functions that receive the current state as their first argument, an Action object as their second argument, and must synchronously return the _next_ state.

## Actions

An action object provides some context to the `update` and `middleware` functions. Depending on how it was generated, the action will contain two of three possible parameters:

```typescript
type Action = {
  /* Refers to the name of the target function */
  type: string
  /* The native event object. Supplied when triggered via an event with x-on attribute */
  event?: Event
  /* A custom object that may be provided by a developer when invoking the store.dispatch method. Dynamo also uses this to provide the native FormData object when bound to a forms "submit" event */
  payload?: { [key: string]: any }
}
```

> The value of payload _must_ be serializable, which means no functions or classes, just simple objects and primitive values.

## middleware

Middleware functions receieve an `Action` as their first argument, and a special [middleware api](#middleware-api) object as their second argument. Middleware functions are intended to do async work and handle side effects, so the Middleware API object provided as the second argument here provides the functions necessary to achieve that.

```typescript

type ActionInput = {
  type: string
  payload: {
    [key: string]: any
  }
}

type MiddlewareAPI {
  /**
   * Returns the current state at the time of invocation
   */
  getState(): State
  /*
  * Dispatch an update to any event handler with name matching action.type
  */
  dispatch(action: ActionInput): void
  /*
  * A dictionary of any HTML elements declared with the x-ref attribute
  */
  refs: {
    [key: string]: HTMLElement
  }
  /*
  * Register a callback to be invoked once after the next UI update
  */
  nextTick(callback: Function): void
}
```
