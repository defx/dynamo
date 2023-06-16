let counter = 0

export const ComboBox = ({
  optionTemplate,
  onSearchInput,
  onOptionSelected,
}) => {
  const id = counter++
  const listBoxId = `listbox_${id}`

  return {
    state: {},
    element: {
      searchInput: {
        query: "input[type=text]", // @todo: rename "query" to "select"
        attribute: ({ options = [] }) => ({
          role: "combobox",
          ariaAutocomplete: "list",
          ariaExpanded: !!options.length,
          ariaControls: listBoxId,
        }),
        on: {
          input: onSearchInput,
        },
        input: "searchInput", // @todo: rename "input" to ...map? mapToState?
      },
      options: {
        // don't implicitly use properties as names in other contexts!
        // ...binding to a property should use the same syntax as with the input controls
        // and that should happen on the "list" object :)
        query: `[role=listbox]`,
        attribute: () => ({
          id: listBoxId,
        }),
        list: {
          query: "[role=option]",
          template: optionTemplate,
        },
      },
      option: {
        query: "[role=option]",
        on: {
          click: onOptionSelected,
        },
      },
    },
  }
}
