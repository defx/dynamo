import { define } from "/dynamo.js"

define("combo-box", {
  state: {
    suggestions: [],
  },
  middleware: {
    searchInput({ event: { target } }) {
      target.dispatchEvent(
        new CustomEvent("change", {
          detail: target.value,
          bubbles: true,
        })
      )
    },
  },
  node: {
    input: () => ({
      ariaExpanded: false,
      ariaControls: "list",
      ariaAutocomplete: "list",
      role: "combobox",
    }),
    listbox: () => ({
      id: "list",
      role: "listbox",
    }),
  },
  template: {
    suggestions: ({ id }) =>
      `<li id="${id}" role="option" x-list-item>${id}</li>`,
  },
})
