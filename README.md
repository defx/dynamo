# Enhance

A lightweight JavaScript library for progressively enhancing static HTML with functional state management and reactive updates.

## Install

```sh
> npm i @defx/enhance
```

## Use

Use any language you like to generate that initial HTML for your pages. The purpose of enhance.js is exactly that: to _enhance_ pre-rendered HTML with asynchronous functionality. This allows you to apply adcanced techniques such as Progressive Enhancement to ensure that your websites and applications are lightweight and resilient.

By including some [special attributes]() in you HTML you will be able to harness the power of the Enhance API to reactively update the page in the browser.

## Attributes

### x-on

Used to bind an event listener to an element, accepts the name of an action handler which will be invoked if and when the event fires on that element.

```html
<button x-on="click:toggleMenu">[=]</button>
```

### x-list

Used to declare an element as a list node.

The data for each list item is derived from each elements dataset, so be sure to declare any values you need as data attributes so that you have them to work with. For example, if you want to allow a user to sort your list, make sure that you declare any values you wish to sort on in each elements dataset:

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
