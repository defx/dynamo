# Combobox

## Prior Art

The Combobox pattern is a very common one on the web, and there's plenty to think about when it comes to making it accessible. I'm going to give myself a headstart by taking the HTML and CSS directly from the Combobox Example included in the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/" target="_blank">ARIA Authoring Practices Guide (APG)</a>. The APG is always my first port of call when considering accessibility for common patterns like this. I'm going to leave out the JavaScript provided with the example because I'm going to re-implement that myself using Dynamo.

## On Progressive Enhancement and Resiliency

The first thing that I notice when opening the document in my browser is that the list of options is hidden by default. If JavaScript isn't turned on or, more likely, if a prior JavaScript error means that the combobox's JavaScript never runs, that's going to mean that the only method of input will be manual text input. How much of a problem this is really depends on your use case, because the list of values that a Combobox presents to the user can be mere _suggestions_, acting already as a _Progressive Enhancement_ to what is essentially a "free text" input, or they could be a finite list of _possible values_. If it is the _latter_ then I would suggest that the options ought to be presented in the first instance as a list of Radio Inputs that can then be replaced by a combobox. For this example however, I'm going to build a combobox where the list of options are just suggestions, which is perhaps the most common type of combobox commonly used as a "search input" on many websites.
