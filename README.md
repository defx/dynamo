# @defx/tupelo

A lightweight JavaScript library for progressively enhancing static HTML.

Over-dependence on JavaScript hinders the performance and resilience of many of todays websites. Progressive Enhancement has been around for many years and provides a clear strategy for building resilient and performant websites from first principles, however many of the most popular JavaScript libraries today aren't well suited to this approach. Tupelo has been designed to provide the key features required to enhance web sites and applications with asynchronous functionality through progressive enhancement.

## Features

- Component-driven workflow
- Functional state management
- Reactive UI updates

## Install

```sh
> npm i @defx/tupelo
```

## Quick Start

The first thing to understand is that tupelo is not concerned with how or where you generate your HTML. You can use whatever language or library you like to generate your initial HTML, tupelo's responsibility is to bind to your existing HTML and enable asynchronous updates in the browser.

Follow these 3 steps to get started:

- [Custom Element tag](#custom-element-tag) : Wrap the chunk of HTML that you wish to control in a custom tag
- [[x-\*] attributes](#x--attributes) : Add some HTML attributes that tupelo can use to _progressively enhance_ your HTML
- [Configure](#configure) : Include a script that configures your Custom Element using tupelos `define` function

Let's take a look at each of those steps in a little more detail:

## Custom Element tag

The Custom Element spec is a web standard that allows us to extend HTML with our own custom elements. Once defined, we can use those elements just like any other HTML element. You can call your Custom Element anything you like, as long as you include a hyphen in the name (e.g., `main-nav`) - this is simply to differentiate custom elements from native built-in elements.

```html
<product-list>
  <!-- your HTML here -->
</product-list>
```

## \[x-\*\] attributes

tupelo will look for a set of "special" attributes prefixed with an "x-" that you can use to tell it how to update your HTML. For example, lets say that your HTML includes a list of products that you would like your users to be able to sort in the browser.

Here's our basic HTML...

```html
<product-list>
  <label for="sortInput">Sort by:</label>
  <select id="sortInput" name="sortBy" x-input>
    <option value="priceLowToHigh">Price (low - high)</option>
    <option value="priceHighToLow" selected>Price (high - low)</option>
    <option value="rating">Rating</option>
  </select>
  <ul>
    <li
      x-list="products"
      data-id="afd56erg"
      data-price="14.99"
      data-rating="4.2"
    >
      <p>£14.99</p>
    </li>
    <li
      x-list="products"
      data-id="f8g7r6d2"
      data-price="5.99"
      data-rating="4.7"
    >
      <p>£5.99</p>
    </li>
  </ul>
</product-list>
```

The first thing to note is that each list item includes an `x-list` attribute. This tells tupelo that those elements are part of a collection named "products", and tupelo will derive a state value to represent the collection, incorporating values from each elements `data-*` attributes. For the above HTML, you can expect the initial state of `<product-list>` to look like this...

```js
{
  products: [
    {
      id: "afd56erg",
      price: 14.99,
      rating: 4.2,
    },
    {
      id: "f8g7r6d2",
      price: 5.99,
      rating: 4.7,
    },
  ],
}
```

The second thing to note is that our `<Select>` element has the `x-input` attribute. This instructs tupelo to create another value in state and keep the two in sync. If the value of the `<Select>` changes then this will be reflected automatically in state, and vice versa. As "Price (high - low)" is the default option, we can expect the initial state of `<product-list>` to reflect that...

```js
{
  sortBy: "priceHighToLow",
  products: [/* ... */]
}
```

## Configure

Now lets take a look at how our Custom Element is defined, where state lives, and how we can update it.

tupelo exports the `define` function which is used to define a new custom element.

```js
import { define } from "@defx/tupelo"

define("product-list", () => {
  return {
    /* some configuration here */
  }
})
```

In the example above, we're telling the browser about a new element called "product-list", and we're providing a factory function that will be called for every new instance of that element on the page. The object returned from this factory function is used to configure our custom element (see [Define](#define) for all the options)

Looking back at our Product List example, we want any changes to the `<Select>` option to update the sort order of our products, and the `getState` configuration parameter gives us a nice, simple way to do this...

```js
const sort = {
  priceLowToHigh: (a, b) => a.price - b.price,
  priceHighToLow: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
}

define("product-list", () => {
  return {
    getState: (state) => ({
      ...state,
      products: state.products.sort(sort[state.sortBy]),
    }),
  }
})
```

In the example above, we're using `getState` to re-define the value of `products` by sorting its initial value using one of three custom sorting functions. We use the value of `sortBy` in state to select the correct sorting function. Because `getState` is called automatically whenever state changes, this is literally all that we need to ensure that our list of products on the page reflects the selected sort option!

## Attributes

### x-list

Used to declare an element as a list node.

The state for each list item in the collection is derived from each elements dataset, so be sure to declare any values you need to work with as data attributes. For example, if you want to allow a user to sort your list, make sure that you declare any values you wish to sort on in each elements dataset:

```html
<li x-list="products" data-id="f7g649f9" data-price="19.99" data-rating="4.2">
  <p>19.99</p>
</li>
```

> The only hard requirement for list items is that you _must_ include a `[data-id]` attribute so that tupelo can safely re-order the list in response to any changes.

### x-input

Used to bind any user input element (e.g., `<input>, <select>, <textarea>`) to a property in state. The x-input attribute is a boolean attribute that doesn't accept any value, the name of the property reflected in state will be inferred from the elements [name] attribute.

> Applying the [name] + [x-input] pattern encourages parity between form data and request data for the purpose of progressive enhancement.

```html
<select name="sortBy" x-input>
  <option value="bestsellers">Bestsellers</option>
  <option value="priceLowToHigh">Price (low - high)</option>
  <option value="priceHighToLow">Price (high - low)</option>
  <option value="rating">Rating</option>
</select>
```

### x-on

Used to bind an event listener to an element, accepts two arguments separated by a colon `x-on="eventType:methodName"` where `eventType` is the type of even you want to listen for and `methodName` is the name of the update method you wish to invoke;

Let's say, for example, we want to add a "load more" button to our product list...

```html
<button x-on="click:loadMore">[=]</button>
```

```js
define("some-element", () => {
  return {
    middleware: {
      loadMore: (state) => {
        /* fetch more products from the server... */
      },
    },
  }
})
```

### x-ref

Used to create a reference to a particular DOM element which will be available on the `refs` object provided as the third argument to a `middleware` callback function (see [Middleware]() for more details) and also as part of the first argument provided to `connectedCallback` (see [Lifecycle Events]()).

Each ref also includes a special `append` method that can be used to append additional HTML to the element which will then trigger an update cycle to ensure state and DOM are synchronised.

```html
<!-- .... -->
<ul x-ref="productList">
  <li x-list="products" data-id="afd56erg" data-price="14.99" data-rating="4.2">
    <p>14.99</p>
  </li>
  <li x-list="products" data-id="f8g7r6d" data-price="5" data-rating="4.7">
    <p>5</p>
  </li>
  <button x-on="click:loadMore">load more</button>
</ul>
```

In the example above, we've added the `x-ref` to the list parent so that we have a reference to the element that we want to append more list items to.

We've also included a "load more" button with an `x-on` binding which will invoke our `loadMore` function in the event of a click.

The `loadMore` function in our `product-list` definition might look something like this:

```js
define("product-list", () => {
  return {
    /* ... */
    middleware: {
      loadMore: (action, next, { refs: { productList } }) => {
        productList.append(
          html`
            <li
              x-list="products"
              data-id="f7g649f9"
              data-price="19.99"
              data-rating="4.2"
            >
              <p>19.99</p>
            </li>
            <li
              x-list="products"
              data-id="k7s95jg7"
              data-price="3.99"
              data-rating="4.7"
            >
              <p>3.99</p>
            </li>
          `
        )
      },
    },
  }
})
```

We've configured `middleware` to define our `loadMore` function as we're handling a side effect rather than simply updating state (see [Middleware]() for full details). In the example above we simply append some hard-coded html to the product list, however a more realistic scenario would include fetching the HTML from your server. Once the `append` function is invoked, the `product-list` DOM will be synchronised with state and your list will now include the additional items with the correct sorting applied.

### x-class

Use to bind an object in state to one or more classes on the element.

Let's say that we want to include a sliding navigation menu on our website, we could initially render the menu at the foot of the page so that it is...

- part of the initial HTML payload
- accessible without JavaScript
- out of the way of the main content

Our hamburger button will be initialised with a fragment link so that clicking it will simply scroll the page down the where the menu starts.

```html
<style>
  .hamburger {
    transform: translate(-100%, 0);
    transition: transform 0.5s ease-in-out;
  }

  .hamburger.open {
    transform: translate(0, 0);
  }
</style>
<a href="#mainNavigation" x-on="click:toggleMenu">[=]</a>
<main>
  <!-- main page content here -->
</main>
<nav x-class="navClasses">
  <ul id="mainNavigation">
    <li>New In</li>
    <li>Bestsellers</li>
    <li>Skincare</li>
    <li>Makeup</li>
  </ul>
</nav>
```

Now in our element defintion we can define the desired behaviour:

```js
define("page-container", () => {
  return {
    state: {
      navClasses: {
        hamburger: true,
        open: false,
      },
    },
    update: {
      toggleMenu: (state) => {
        return {
          ...state,
          navClasses: {
            hamburger: true,
            open: !state.navClasses.open,
          },
        }
      },
    },
  }
})
```

In the example above, we define some initial state for our `navClasses` causing the menu to be hidden offscreen, as well as our `toggleMenu` update function to toggle the `open` class in response to the click event.

## define

The define function is used to configure a new Custom Element.

### syntax

```js
define(tagName, factory)
```

### Parameters

- `tagName` (required) [string] - Name for the new Custom Element. As per the Custom Element
  spec, an elements name must include a hyphen to differentiate from standard built-in elements.

- `factory` (required) [function] - A factory function that will be called whenever a new instance of your Custom Element is created. It will be provided with one argument which is the Custom Element node itself. The factory function returns a [Model]() or a Promise that resolves to a Model.

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

Both `update` and `middleware` functions can be invoked via [`x-on`](#x-on) events, whereas `update` functions can also be dispatched directly from `middleware` functions.

## update

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
{
  /* Simply refers to the name of the target function */
  type: String,
  /* The native event object, supplied if triggered via an event */
  event?: Event
  /* The payload is a custom object provided by the developer when calling dispatch */
  payload?: Object
}
```

## middleware

The middleware function accepts an `Action` as its first argument, and a special [middleware api](#middleware-api) object as its second argument.

### Middleware API

```typescript

type State = {
    [key: string]: any
  }

type ActionInput = {
  type: string
  payload: {
    [key: string]: any
  }
}

interface Element extends HTMLElement {
  /* appends the provided html to the element and then triggers an update cycle to ensure state and UI are synchronised */
  appendHTML(html: String):void
}

type MiddlewareAPI {
  /**
   * Returns the current state at the time of invocation
   */
  getState():State
  /*
  * Dispatch an update to any update function with name matching action.type
  */
  dispatch(action: ActionInput):void
  /*
  * A dictionary of any HTML elements declared with the x-ref attribute
  */
  refs: {
    [key: string]:Element
  }
  /*
  * Register a callback to be invoked once after the next UI update
  */
 nextTick(callback: Function):void
}
```
