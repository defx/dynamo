# @defx/dynamo

## [![npm](https://shields.io/npm/v/@defx/dynamo)](https://www.npmjs.com/package/@defx/dynamo) [![gzip size](https://img.badgesize.io/https://unpkg.com/@defx/dynamo/dist/dynamo.min.js?compression=gzip&label=gzip)]()

The small yet powerful JavaScript library for the progressive enhancement of HTML.

## Features

- Component-driven workflow
- Functional state management
- Reactive UI updates

## Install

### cdn

```js
import { define } from "https://unpkg.com/@defx/dynamo"
```

### npm

```sh
> npm i @defx/dynamo
```

## Quick Start

The first thing to understand is that, from a Dynamo point of view, it doesn't matter how or where you generate your HTML. Dynamo binds to your _existing_ HTML to enable asynchronous updates in the browser.

Follow these 3 steps to get started:

- [Custom Element tag](#custom-element-tag) : Wrap the chunk of HTML that you wish to control in a custom tag
- [[x-\*] attributes](#x--attributes) : Used to declare the dynamic parts of your HTML
- [Configure](#configure) : Include a script that configures your Custom Element using the `define` function

Let's take a look at each of those steps in a little more detail:

## Custom Element tag

Include a custom element tag in your HTML to define a block of content that you wish to enhance with some behaviour.

You can call your Custom Element anything you like, as long as you include a hyphen in the name (e.g., `main-nav`) - this is simply to differentiate custom elements from native built-in elements.

```html
<product-list>
  <!-- your HTML here -->
</product-list>
```

You can have as many or as few custom elements as you like within your HTML and it's fine to nest multiple custom elements.

## Configure

Now lets take a look at how our Custom Element is defined, where state lives, and how we can update it.

The `define` function can be imported and used to define a new custom element.

```js
import { define } from "@defx/dynamo"

define("product-list", () => {
  return {
    /* some configuration here */
  }
})
```

In the example above, we're telling the browser about a new element called "product-list", and we're providing a factory function that will be called for every new instance of that element on the page. The object returned from this factory function is used to configure our custom elements behaviour (see [Define](#define) for all the options)

## define

The define function is used to configure a new Custom Element.

### syntax

```js
define(tagName, factory)
```

### Parameters

- `tagName` (required) [string] - Name for the new Custom Element. As per the Custom Element
  spec, an elements name must include a hyphen to differentiate from standard built-in elements.

- `factory` (required) [function] - A factory function that will be called whenever a new instance of your Custom Element is created. It will be provided with one argument which is the Custom Element node itself. The factory function returns a [Model]().

### Model

The Model returned from your custom elements factory function accepts various parameters which are detailed in full in the API Reference section. Three of the most commonly used parameters are `state`,`update`, and `middleware`.

```js
define(tagName, () => {
  return {
    state: {
      /* the initial state */
    },
    update: {
      /* a dictionary of synchronous functions that update state */
    },
    middleware: {
      /* a dictionary of functions that handle async work or side effects */
    },
  }
})
```

Both `update` and `middleware` functions can be invoked via [`x-e`](#x-e) events, whereas `update` functions can also be dispatched directly from `middleware` functions.

## update

Update functions receive the current state as their first argument and return the _next_ state.

The most important thing to understand about update functions is that;

1. They must be synchronous
2. They accept the current state as their first argument
3. They return the next state

For example...

```js
define("page-container", () => {
  return {
    state: {
      menuIsOpen: false,
    },
    update: {
      toggleMenu: (state) => {
        return {
          ...state,
          menuIsOpen: !state.menuIsOpen,
        }
      },
    },
  }
})
```

The second argument passed to an update function is an `Action` object.

## Actions

An action object provides some context to the `update` and `middleware` functions. Depending on how it was generated, the action will contain two of three possible parameters:

```typescript
type Action = {
  /* Refers to the name of the target function */
  type: string
  /* The native event object. Supplied when triggered via an event with x-e attribute */
  event?: Event
  /* A custom object provided by the developer when calling the Middleware API's dispatch method */
  payload?: { [key: string]: any }
  /* If the event was triggered by a node that is part of an x-o collection, this is the index of that node within the collection */
  index? number
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
  * Dispatch an update to any update or middleware function with name matching action.type
  */
  dispatch(action: ActionInput): void
  /*
  * A dictionary of any HTML Elements with an x-o binding
  */
  refs: {
    [key: string]: HTMLElement | HTMLElement[]
  }
  /*
  * Register a callback to be invoked once after the next UI update
  */
  nextTick(callback: Function): void
}
```

## [x-*] attributes

There are only two special attributes used by dynamo to enhance your HTML, `x-o` and `x-e`.

## x-e (Event binding)

Used to bind an event listener to an element node, accepts two arguments separated by a colon `x-e="type:method"` where `type` is the type of even you want to listen for and `method` is the name of the update or middleware method that you wish to invoke;

Let's say, for example, we want to add a "load more" button to our product list...

```html
<button x-e="click:loadMore">load more</button>
```

```js
define("product-list", () => {
  return {
    middleware: {
      loadMore: (state) => {
        /* fetch more products from the server... */
      },
    },
  }
})
```

## x-o (Object binding)

Used to bind an element node to an object in state. The object in state will be initialised from the elements attributes and dataset, and changes to the object will be reflected back on to the node whenever state changes.

### Collections

A set of adjacent siblings may be bound to an array in state using the `.*` "glob" postfix convention, making it possible to group items together, and also sort the items.
