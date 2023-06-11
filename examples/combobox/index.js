import { define } from "/dynamo.js"

define("combo-box", {
  state: {
    options: [],
  },
  action: {},
  node: {
    input: () => {
      return {
        ariaExpanded: false,
        ariaControls: "list",
        ariaAutocomplete: "list",
        role: "combobox",
      }
    },
    listbox: () => {
      return {
        id: "list",
        role: "listbox",
      }
    },
  },
  template: {
    options: ({ id, value }) =>
      html`<li id="${id}" role="option">${value}</li>`,
  },
})
