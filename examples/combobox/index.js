let counter = 0

export const ComboBox = ({
  optionTemplate,
  onSearchInput,
  onOptionSelected,
}) => {
  const id = counter++
  const listBoxId = `listbox_${id}`

  return {
    state: {
      searchText: "",
      options: [],
      selectedOption: -1,
    },
    action: {
      selectNextOption: (state) => {
        const { options, selectedOption } = state
        return {
          ...state,
          selectedOption:
            selectedOption < options.length - 1 ? selectedOption + 1 : 0,
        }
      },
      clearSelectedOption: (state) => ({ ...state, selectedOption: -1 }),
    },
    elements: [
      {
        select: "input[type=text]",
        attribute: ({ options = [], selectedOption }) => ({
          role: "combobox",
          ariaAutocomplete: "list",
          ariaExpanded: !!options.length,
          ariaControls: listBoxId,
          ariaActivedescendant: options[selectedOption]?.id || "",
        }),
        input: "searchText",
        on: {
          input: (e, store) => {
            store.dispatch("clearSelectedOption")
            onSearchInput(e)
          },
          keydown: (event, store) => {
            if (event.ctrlKey || event.shiftKey) {
              return
            }

            const { options } = store.getState()
            if (!options?.length) return

            switch (event.key) {
              case "Down":
              case "ArrowDown": {
                store.dispatch("selectNextOption")
                break
              }
            }
          },
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
        attribute: ({ selectedOption }, i) => {
          return {
            ariaSelected: selectedOption === i,
          }
        },
      },
    ],
  }
}
