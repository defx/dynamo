# @defx/dynamo

🚧 Please kindly note that this project is a work in progress 🚧

## [![npm](https://shields.io/npm/v/@defx/dynamo)](https://www.npmjs.com/package/@defx/dynamo) [![gzip size](https://img.badgesize.io/https://unpkg.com/@defx/dynamo/dist/dynamo.min.js?compression=gzip&label=gzip)]()

The small yet powerful JavaScript library for progressively enhancing HTML.

## If your only tool is a hammer then every problem looks like a nail

If you're building a website that is server rendered and content-rich (e.g., blog, e-commerce shop, etc) then it's likely that 80-100% of your JavaScript requirements can be solved in a very simple, performant, and easily maintainable way without reactive templating. Dynamo is designed specifically to support this approach, whilst also giving you the flexibility to provide the bare minimum amount of templating required when its really needed.

### Two types of reactive updates

Reactive DOM updates can broadly be divided into two categories:

- updating attributes and properties of an existing DOM tree
- changing the structure of the DOM tree itself

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

## Usage

Dynamo is instantiated with a DOM node (referred to as the _root node_) and a configuration object. Everything that happens next is a combination of two things:

- the configuration object you provide during instantiation
- the special x-attributes that exist on the DOM tree attached to your root node

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
    /* a dictionary of functions that update individual node attributes and properties as a side-effect of every state transition */
  },
})
```

### Parameters

#### state

Specifies the _initial_ state.

#### action

Action handlers are synchronous functions that receive the current state as their first argument, an Action object as their second argument, and return the _next_ state.

```js
Dynamo(rootNode, {
  action: {
    toggleMenu: (state) => ({
      ...state,
      menuIsOpen: !state.menuIsOpen,
    }),
  },
})
```

#### node

Node functions accept the current state and return an object that is used to update the bound nodes attributes and/or properties

```js
Dynamo(rootNode, {
  action: {
    toggleMenu: (state) => ({
      ...state,
      menuIsOpen: !state.menuIsOpen,
    }),
  },
  node: {
    navMenu: (state) => ({
      class: {
        open: state.menuIsOpen,
      },
    }),
  },
})
```

## \[x-\*\] attributes

Attributes prefixed with an "x-" tell Dynamo about the parts of your HTML that you want to update and/or react to, and there are only 4 such attributes.

### x-node

The [x-node] attribute is used to identify a named function that can be used to derive that nodes attributes and/or properties from state.

### x-on

Used to bind an event to an action handler. Accepts two arguments separated by a colon `x-on="eventType:actionName"` where `eventType` is the type of event that you want to listen for and `actionName` is the name of the action handler you wish to invoke;

```html
<button x-on="click:toggleMenu">load more</button>
```

```js
Dynamo(rootNode, {
  action: {
    toggleMenu: (state) => ({
      ...state,
      menuIsOpen: !state.menuIsOpen,
    }),
  },
  node: {
    navMenu: (state) => ({
      class: {
        open: state.menuIsOpen,
      },
    }),
  },
})
```

> If you use [x-on] with a `<form>` `submit` event then Dynamo will automatically provide the forms [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as the action payload

### x-control

Used to bind any user input control element (e.g., `<input>, <select>, <textarea>`) to a property in state. The x-control attribute is a boolean attribute that doesn't expect any value, the name of the property reflected in state will taken from the elements [name] attribute, so this must also be provided in all cases.

> Applying the [name] + [x-control] pattern encourages parity between form data and request data for the purpose of progressive enhancement

```html
<select name="sortBy" x-control>
  <option value="bestsellers">Bestsellers</option>
  <option value="priceLowToHigh">Price (low - high)</option>
  <option value="priceHighToLow">Price (high - low)</option>
  <option value="rating">Rating</option>
</select>
```

### x-each

Used to declare an element as an item within an ordered collection.

The state for each item in the collection is derived from each elements dataset, so be sure to declare any values you need to work with as data attributes. For example, if you want to allow a user to sort a list, make sure that you declare any values you wish to sort on in each elements dataset:

```html
<li x-each="products" id="f7g649f9" data-price="19.99" data-rating="4.2">
  <p>19.99</p>
</li>
```

> The only hard requirement for x-each item nodes is that they must include an `id` attribute so that the list can be reliably re-ordered.

If you need the ability to dynamically add more items into your collection at any point, then you can configure a template using the same name as the collection and Dynamo will use it:

```js
Dynamo(rootNode, {
  template: {
    products: ({ id, price, rating }) => `
    <li x-each="products" id="${id}" data-price="${price}" data-rating="${rating}">
      <p>${price}</p>
    </li>`,
  },
})
```

> If you're collection _doesn't_ need to have items added at any point then there's no need to provide a template, - re-ordering and removals can all be achieved without any templating.

## Action

Depending on how it was generated, the Action object may contain up to three properties:

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
  * Dispatch an update to any action handler with name matching action.type
  */
  dispatch(action: ActionInput): void
  /*
  * Register a callback to be invoked once after the next UI update. Useful for focusing an input element, for example.
  */
  nextTick(callback: Function): void
}
```
