# @defx/tandem

A lightweight JavaScript library for progressively enhancing static HTML with functional state management and reactive updates.

## Install

```sh
> npm i @defx/tandem
```

## Quick Start

The first thing to understand is that, unlike most UI libraries, Tandem is not concerned with how or where you generate your HTML. You can use whatever language or library you like to generate you initial HTML, Tandem's responsibility is to bind to you existing HTML and provide asynchronous functionality in the browser.

Follow these 3 steps to get started:

- [Custom Element tag](#custom-element-tag) : Wrap the chunk of HTML that you wish to control in a custom tag
- [[x-\*] attributes](#x--attributes) : Add some HTML attributes that Tandem can use to _progressively enhance_ your HTML
- [Define](#define) : Include a script that configures your Custom Element with the data and functions required to handle events and update your HTML

Let's take a look at each of those steps in a little more detail:

## Custom Element tag

The Custom Element spec is a web standard that allows us to extend HTML with our own custom elements. Once defined, we can use those elements just like any other HTML element. You can call your Custom Element anything you like, as long as you include a hyphen in the name (e.g., `main-nav`) - this is simply to differentiate custom elements from built-in elements. So, wrapping the HTML you want to control in a custom element would look like something like this:

```html
<product-list>
  <!-- your HTML here -->
</product-list>
```

## \[x-\*\] attributes

Tandem will look for a set of "special" attributes prefixed with an "x-" that you can use to tell it how to update your HTML. For example, lets say that your HTML includes a list of products that you would like your users to be able to sort in the browser.

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
    <li x-list="products" data-id="f8g7r6d" data-price="5.99" data-rating="4.7">
      <p>£5.99</p>
    </li>
  </ul>
</product-list>
```

The first thing to note is that each list item includes an `x-list` attribute. This tells Tandem that those elements are part of a collection, and Tandem will derive a state value to represent the collection, incorporating values from each elements `data-*` attributes. For the above HTML, you can expect the initial state of your `product-list` element to include a key named `products` like this...

```js
{
  products: [
    {
      id: "afd56erg",
      price: 14.99,
      rating: 4.2,
    },
    {
      id: "f8g7r6d",
      price: 5.99,
      rating: 4.7,
    },
  ],
}
```

The second thing to note is that our `<Select>` element has the `x-input` attribute. This tells Tandem to create another key in state using the `name` attribute of the user input element, and keep the two in sync. If the value of the `<Select>` changes then this will be reflected automatically in state. As "Price (high - low)" is the default option, we can expect the initial state of our `product-list` to reflect that...

```js
{
  sortBy: "priceHighToLow",
  products: [/* ... */]
}
```

## Define

Now lets take a look at how our Custom Element is defined, where state lives, and how we can update it.

Tandem exports the `define` function which is used to define a new custom element.

```js
import { define } from "@defx/tandem"

define("product-list", () => {
  return {
    state: {
      /* 
        Tandem derives the initial state of your element 
        from your HTML attributes 
      */
    },
    update: {
      /* 
        Somewhere to put functions that you need to update state 
      */
    },
    getState: (state) => {
      /* 
        Called once whenever state changes, provide this function 
        if you want to derive any additional properties
      */
      return state
    },
  }
})
```

In the example above, we're telling the browser about a new element called "product-list", and we're providing a factory function that will be called for every new instance of that element on the page.

Looking back at our Product List example, we want any changes to the `<Select>` option to update the sort order of our products, and `getState` gives us a nice and simple way to do this...

```js
const sort = {
  priceLowToHigh: (a, b) => a.price - b.price,
  priceHighToLow: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
}

define("product-list", () => {
  return {
    getState: (state) => ({
      products: state.products.sort(sort[state.sortBy]),
    }),
  }
})
```

In the example above, we're using `getState` to re-define the value of `products` by sorting its initial value using one of three custom sorting functions. We use the value of `sortBy` in state to select the correct sorting function. Because `getState` is called automatically whenever state changes, this is literally all that we need to ensure that our list of products on the page reflects the selected sort option!

Now, what if we want to add more items into the list? A common use case would be to load more products into your list as the user scrolls down the page. You might be tempted to imagine updating `products` in state to add more items to the array but don't forget that Tandem isn't concerned with rendering your HTML, only binding onto the HTML that you give it. Adding items into the list is no different, and Tandem provides the `appendListHTML` function that allows you to do just that. Once invoked, Tandem will ensure that the HTML and state are updated and synchronised accordingly.

The Tandem approach would simply be to request more HTML from your API and then provide that HTML to Tandem so that it can merge into the existing list and re-run the update cycle to ensure that everything is reflected correctly. There's a special function for that (`appendListHTML`) which is available as part of the Store API provided to several functions within your model.

## Attributes

### x-on

Used to bind an event listener to an element, accepts two arguments separated by a colon `x-on="eventType:methodName"` where `eventType` is the type of even you want to listen for (e.g., "click", "mouseover", etc) and `methodName` is the name of the update method you wish to invoke;

```html
<button x-on="click:toggleMenu">[=]</button>
```

### x-list

Used to declare an element as a list node.

The state for each list item in the collection is derived from each elements dataset, so be sure to declare any values you need to work with as data attributes. For example, if you want to allow a user to sort your list, make sure that you declare any values you wish to sort on in each elements dataset:

```html
<li x-list="products" data-id="f7g649f9" data-price="19.99" data-rating="4.2">
  <p>19.99</p>
</li>
```

> The only hard requirement for list items is that you _must_ include a `[data-id]` attribute so that Tandem can safely re-order the list in response to any changes.

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

### x-class

Use to bind an object in state to one or more classes on the element. Object keys declare a class name, and will be applied to the element dependent on whether the corresponding value is truthy or falsy.
