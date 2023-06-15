import { define } from "/dynamo.js"
import { ComboBox } from "./index.js"

const states =
  "Alabama,Alaska,American Samoa,Arizona,Arkansas,California,Colorado,Conneticut,Delaware,District of Columbia"
    .split(",")
    .map((id) => ({ id }))

const optionTemplate = ({ id }) => `<li id="${id}" role="option">${id}</li>`

define("combo-box", (rootNode) => {
  return ComboBox({
    optionTemplate,
    onSearchInput: ({ target: { value } }) => {
      const searchInput = value.toLowerCase()
      const options = searchInput.length
        ? states.filter(({ id }) => id.toLowerCase().startsWith(searchInput))
        : []

      rootNode.options = options
    },
  })
})
