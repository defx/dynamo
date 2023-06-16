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
    elements: [
      {
        select: "input[type=text]",
        attribute: ({ options = [] }) => ({
          role: "combobox",
          ariaAutocomplete: "list",
          ariaExpanded: !!options.length,
          ariaControls: listBoxId,
        }),
        input: "searchInput",
        on: {
          input: onSearchInput,
        },
      },
      {
        select: `[role=listbox]`,
        attribute: () => ({
          id: listBoxId,
        }),
        list: {
          select: "[role=option]",
          template: optionTemplate,
          from: "options",
        },
      },
      {
        select: "[role=option]",
        on: {
          click: onOptionSelected,
        },
      },
    ],
  }
}
