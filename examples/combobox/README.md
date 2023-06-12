# Combobox

## Prior Art

The Combobox pattern is a very common one on the web, and there's plenty to think about when it comes to making it accessible. I'm going to give myself a headstart by taking the HTML and CSS directly from the Combobox Example included in the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/" target="_blank">ARIA Authoring Practices Guide (APG)</a>. The APG is always my first port of call when considering accessibility for common patterns like this. I'm going to leave out the JavaScript provided with the example because I'm going to re-implement that myself using Dynamo.

## On Progressive Enhancement and Resiliency

The first thing that I notice when opening the document in my browser is that the list of options is hidden by default. If JavaScript isn't turned on or, more likely, if a prior JavaScript error means that the combobox's JavaScript never gets the chance to run, that's going to mean that the only method of input will be manual text input. How much of a problem this is really depends on the use case, because the list of values that a Combobox presents to the user can be mere _suggestions_, acting already as a _Progressive Enhancement_ to what is essentially a "free text" input, or they could be a finite list of _possible values_. If it is the _latter_ then I would suggest that the options ought to be presented in the first instance as a list of Radio Inputs that can then be replaced by a combobox using JavaScript. The use case I have in mind here howver, is a classic "search input" blox. In this case, the list of options are just suggestions.

## The x-list and x-list-item attributes

The APG Combobox example uses a _static_ list of options that already exist in the HTML. A search input however would have no such luxury, so I'm going to render my list of options from state instead using a Dynamo `x-list`. The `x-list` attribute tells Dynamo that an element is a container for other elements that represent a collection of values in state. Elements that represent list items are marked with an `x-list-item` attribute. Dynamo derives the state of a list by reading the id's and any data attributes of these list item elements. Supplying data-\* attributes on list item elements isn't always necessary, but it's useful to provide additional context when you need to sort a list on different properties.
