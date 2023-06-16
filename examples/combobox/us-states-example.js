import { define } from "/dynamo.js"
import { ComboBox } from "./index.js"

const states =
  "Alabama,Alaska,American Samoa,Arizona,Arkansas,California,Colorado,Conneticut,Delaware,District of Columbia"
    .split(",")
    .map((value) => ({ id: `option_${value}`, value }))

const optionTemplate = ({ id, value }) =>
  `<li id="${id}" role="option">${value}</li>`

define("combo-box", (rootNode) => {
  return ComboBox({
    optionTemplate,
    onSearchInput: ({ target: { value } }) => {
      const inputValue = value.toLowerCase()
      const options = inputValue.length
        ? states.filter(({ value }) =>
            value.toLowerCase().startsWith(inputValue)
          )
        : []

      rootNode.options = options
    },
    onOptionSelected: ({ target: { id } }) => {
      // !!
      rootNode.searchText = id
      rootNode.options = []
    },
  })
})
