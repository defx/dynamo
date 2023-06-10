import { Dynamo } from "/dynamo.js"

export const Combobox = (rootNode) =>
  Dynamo(rootNode, {
    state: {},
    action: {},
    middleware: {
      search: () => {
        // ...
      },
    },
    node: {},
  })
