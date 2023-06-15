import { listItems, listData, listSync } from "./list.js"
import { write } from "./xo.js"

export function initialise(rootNode, subscribe, config, store) {
  let state = {}
  const event = {}
  const entries = Object.entries(config.element || {})

  // find event listeners
  entries.forEach(([_, c]) => {
    const { query, on } = c
    if (on) {
      Object.entries(on).forEach(([type, callback]) => {
        event[type] = event[type] || []
        event[type].push({
          selector: query,
          callback,
        })
      })
    }
  })

  //derive initial state from lists...
  entries
    .filter(([_, { list }]) => list)
    .forEach(([name, { query, list }]) => {
      const targets = [...rootNode.querySelectorAll(query)]
      targets.forEach((target) => {
        const items = listItems(target, list.query)
        const curr = listData(items)
        state[name] = curr
      })
    })

  // derive initial state from input directives...
  entries
    .filter(([_, { input }]) => input)
    .forEach(([_, { query, input }]) => {
      const targets = [...rootNode.querySelectorAll(query)]
      targets.forEach((target) => {
        state = { ...state, [input]: target.value }

        event.input = event.input || []
        event.input.push({
          selector: query,
          callback: ({ target }) =>
            store.setState((state) => ({ ...state, [input]: target.value })),
        })
      })
    })

  // delegate from the root node
  Object.entries(event).forEach(([type, listeners]) => {
    rootNode.addEventListener(type, (e) => {
      listeners
        .filter(({ selector }) => e.target.matches(selector))
        .forEach(({ selector, callback }) => {
          if (typeof callback === "function") {
            callback(e)
          }
          if (typeof callback === "string") {
            const { target } = e

            const targets = [...rootNode.querySelectorAll(selector)]

            const index = targets.indexOf(target)

            store.dispatch(callback, { event: e, index })
          }
        })
    })
  })

  subscribe((state) => {
    entries
      .filter(([_, { read }]) => read)
      .forEach(([_, { query, read }]) => {
        const targets = [...rootNode.querySelectorAll(query)]
        targets.forEach((target) => {
          state = { ...state, ...read(target) }
        })
      })

    // lists first
    entries
      .filter(([_, { list }]) => list)
      .forEach(([name, { query, list }]) => {
        const targets = [...rootNode.querySelectorAll(query)]
        targets.forEach((target) => {
          const items = listItems(target, list.query)
          const curr = listData(items)
          const next = state[name]
          listSync(target, items, curr, next, list.template)
        })
      })

    // then the rest...
    entries.forEach(([name, c]) => {
      const { query, attribute } = c

      const targets = [...rootNode.querySelectorAll(query)]

      targets.forEach((target, i) => {
        if (attribute) {
          write(target, attribute(state, i))
        }
      })
    })
  })

  return state
}
