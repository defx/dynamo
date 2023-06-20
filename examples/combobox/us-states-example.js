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
    options: states,
  })
})
