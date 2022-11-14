# Enhance

A JavaScript library for progressively enhancing static HTML.

## Rationale

hydration requires that both data and templates are serialised in order for a library to understand how to resume state and functionality in the browser. this has a significant impact on the size of the initial payload sent to the user, as well as the amount of javascript processing that needs to happen after the initial render and before the page becomes interactive.

progressive enhancement is a technique that has been with us for much longer than hydration, however it is one that hasn't gained widespread usage beyond smaller websites, in part due to the difficulty of applying its principals when there is a requirement for things such as list re-renders (think sort / filter / pagination for a list of products). to do such a thing requires an understanding of the current and next state of the list, and then the means to reconcile those two states. this is a non trivial problem to solve when your primary requirement is to build a website, and a problem that hasn't been solved by library authors.

Enhance.js tackles this problem by providing a simple pattern for taking control of statically rendered html by deriving partial data structures from data attributes which may then be manipulated using a functional state management workflow.
