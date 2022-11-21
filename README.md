# Enhance

A lightweight JavaScript library for progressively enhancing static HTML with functional state management and reactive updates.

## Install

```sh
> npm i @defx/enhance
```

## Use

Use any language you like to generate the initial HTML for your pages. The purpose of enhance.js is exactly that: to _enhance_ pre-rendered HTML with asynchronous functionality.

By including a few additional [attributes]() in you HTML you will be able to harness the power of the Enhance API to reactively update the page in the browser.

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
<li x-list="products.*" data-id="f7g649f9" data-price="19.99" data-rating="4.2">
  <p>19.99</p>
</li>
```

> The only hard requirement for list items is that you _must_ include a `[data-id]` attribute so that Enhance can safely re-order the list in response to any changes.

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
