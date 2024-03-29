# @defx/dynamo

🚧 Please kindly note that this project is a work in progress 🚧

[![npm](https://shields.io/npm/v/@defx/dynamo)](https://www.npmjs.com/package/@defx/dynamo)
[![gzip size](https://img.badgesize.io/https://unpkg.com/@defx/dynamo/dist/dynamo.min.js?compression=gzip&label=gzip)](https://unpkg.com/@defx/dynamo/dist/dynamo.min.js)

The small yet powerful JavaScript library for progressively enhancing HTML.

## If your only tool is a hammer then every problem looks like a nail

It's likely that 80-100% of your JavaScript interaction/reactivity requirements can be solved in a very simple, performant, and easily maintainable way without the use of a browser-side templating solution. Dynamo is designed specifically to support this approach, whilst also giving you the flexibility to provide the bare minimum amount of templating required as and when it's really needed.

### Two types of reactive updates

Reactive DOM updates can broadly be divided into two categories:

- updating attributes and properties of an existing DOM tree
- changing the structure of the DOM tree itself

Making this distinction is useful to consider in terms of the associated costs, because structural updates require a browser templating solution, whereas updating attributes and properties of existing nodes does not, and the cost of templating in the browser can be quite expensive. Consider that, in order to update server-rendered content, your website or application must ship your templates to the browser so that your library understands how to re-render those parts. This makes perfect sense when your entire DOM tree needs to be structurally modifed at any point in time, however most websites and applications don't fall into that category. A common e-commerce website, for example, has very little requirement (if any) for structural DOM updates, and yet many such websites are being built with tools that are designed specifically for that purpose.

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
    /* a dictionary of functions that update individual node attributes 
    and properties as a side-effect of every state transition */
  },
})
```

### Parameters

#### state

Specifies the _initial_ state.

#### action

Action handlers are synchronous functions that receive the _current state_ as their first argument, an Action object as their second argument, and return the _next state_.

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

node functions accept the current state and return an object that is used to update the attributes and/or properties of each node that references it via the [x-node] attribute.

```js
Dynamo(rootNode, {
  action: {
    toggle: (state) => ({
      ...state,
      isOpen: !state.isOpen,
    }),
  },
  node: {
    accordionTrigger: (state) => ({
      ariaExpanded: state.isOpen,
      ariaControls: "accordionPanel",
    }),
    accordionPanel: (state) => ({
      id: "accordionPanel",
      hidden: !state.isOpen,
    }),
  },
})
```

```html
<h3>
  <button x-node="accordionTrigger" x-on="click:toggle">
    <!-- content title -->
  </button>
</h3>
<div x-node="accordionPanel"><!-- content detail --></div>
```

## \[x-\*\] attributes

Attributes prefixed with an "x-" tell Dynamo about the parts of the DOM tree that need to be updated and/or react to, and there are only 4 such attributes.

### x-node

The [x-node] attribute is used to identify a named function that can be used to derive that nodes attributes and/or properties from state.

### x-on

Used to bind an event to an action handler. Accepts two arguments separated by a colon `x-on="eventType:actionName"` where `eventType` is the type of event that you want to listen for and `actionName` is the name of the action handler you wish to invoke.

```html
<button x-on="click:toggleMenu">[=]</button>
<nav x-node="navMenu">...</nav>
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

Used to bind any user input control element (e.g., `<input>, <select>, <textarea>`) to a property in state. The x-control attribute is a boolean attribute that doesn't expect any value; the name of the property reflected in state will taken from the elements [name] attribute, so this must also be provided in all cases.

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

> If you're collection _doesn't_ need to have items added at any point then there's no need to provide a template as re-ordering and removals can all be achieved without it.
