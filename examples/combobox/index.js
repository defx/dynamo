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
        query: "input[type=text]",
        attribute: ({ options = [] }) => ({
          role: "combobox",
          ariaAutocomplete: "list",
          ariaExpanded: !!options.length,
          ariaControls: listBoxId,
        }),
        on: {
          input: onSearchInput,
        },
        input: "searchInput",
      },
      options: {
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
