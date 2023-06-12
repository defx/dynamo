import { define } from "/dynamo.js"

const states =
  "Alabama,Alaska,American Samoa,Arizona,Arkansas,California,Colorado,Conneticut,Delaware,District of Columbia"
    .split(",")
    .map((id) => ({ id }))

define("combo-box", {
  state: {
    suggestions: [],
  },
  getState: (state) => {
    const input = state.input?.toLowerCase()

    return {
      ...state,
      suggestions: input?.length
        ? states.filter(({ id }) => id.toLowerCase().startsWith(input))
        : [],
    }
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
    suggestions: ({ id }) =>
      `<li id="${id}" role="option" x-list-item>${id}</li>`,
  },
})
