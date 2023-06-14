// import { define } from "/dynamo.js"

// define("combo-box", {
//   state: {
//     suggestions: [],
//   },
//   middleware: {
//     searchInput({ event: { target } }) {
//       target.dispatchEvent(
//         new CustomEvent("change", {
//           detail: target.value,
//           bubbles: true,
//         })
//       )
//     },
//   },
//   node: {
//     input: () => ({
//       ariaExpanded: false,
//       ariaControls: "list",
//       ariaAutocomplete: "list",
//       role: "combobox",
//     }),
//     listbox: () => ({
//       id: "list",
//       role: "listbox",
//     }),
//   },
//   template: {
//     suggestions: ({ id }) =>
//       `<li id="${id}" role="option" x-list-item>${id}</li>`,
//   },
//   listen: {
//     input: {
//       input: (event) => {
//         // ...
//       },
//     },
//   },
// })

// const comboBox = {
//   state: {
//     suggestions: [],
//   },
//   is: {
//     searchInput: {
//       listen: {
//         input: (e, { dispatch }) =>
//           dispatch("searchInput", {
//             detail: { value: e.target.value },
//             bubbles: true,
//           }),
//       },
//       update: (state) => ({
//         ariaExpanded: state.suggestions.length,
//         ariaControls: "list",
//         ariaAutocomplete: "list",
//         role: "combobox",
//       }),
//     },
//     listbox: {
//       update: () => ({
//         id: "list",
//         role: "listbox",
//       }),
//     },
//   },
// }

// function SearchBox(
//   $,
//   {
//     listItemTemplate = ({ id }) =>
//       `<li id="${id}" role="option" x-is="suggestion">${id}</li>`,
//   }
// ) {
//   $(`search-input`)
//     .set({
//       ariaControls: "listbox",
//       ariaAutocomplete: "list",
//       role: "combobox",
//     })
//     .on("input", (e, { emit }) => emit("searchInput", e))
//     .update((state) => ({
//       ariaExpanded: state.suggestions.length,
//     }))

//   $(`suggestions-listbox`)
//     .set({
//       id: "listbox",
//       role: "listbox",
//     })
//     .each((state) => state.suggestions, listItemTemplate)

//   $(`suggestion`).on("click", (e, { emit }) => emit("optionSelected", e))
// }

const SearchBox = ({
  optionTemplate = ({ id }) =>
    `<li id="${id}" role="option" x-is="suggestion">${id}</li>`,
  onSearchInput = () => {},
  onOptionSelected = () => {},
}) => ({
  searchInput: {
    set: {
      ariaControls: "listbox",
      ariaAutocomplete: "list",
      role: "combobox",
    },
    update: ({ options = [] }) => ({
      ariaExpanded: options.length,
    }),
    on: {
      input: onSearchInput,
    },
  },
  optionsList: {
    set: {
      id: "listbox",
      role: "listbox",
    },
    each: (state) => state.options,
    template: optionTemplate,
  },
  option: {
    on: {
      click: onOptionSelected,
    },
  },
})

/*

- initialise with non-reactive changes (once)
- add event listeners with dispatch access
- configure reactive updates based on store state


*/
