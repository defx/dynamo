import { listItems, listData, listSync } from "./list.js"
import { write } from "./xo.js"

export function initialise(rootNode, subscribe, config, store, state = {}) {
  const event = {}
  const entries = Object.entries(config.element || {})

  // find event listeners
  entries.forEach(([_, c]) => {
    const { select, on } = c
    if (on) {
      Object.entries(on).forEach(([type, callback]) => {
        event[type] = event[type] || []
        event[type].push({
          select,
          callback,
        })
      })
    }
  })

  //derive initial state from lists...
  entries
    .filter(([_, { list }]) => list)
    .forEach(([name, { select, list }]) => {
      const targets = [...rootNode.querySelectorAll(select)]
      targets.forEach((target) => {
        const items = listItems(target, list.select)
        const curr = listData(items)
        state[name] = curr
      })
    })

  // derive initial state from input directives...
  entries
    .filter(([_, { input }]) => input)
    .forEach(([_, { select, input }]) => {
      const targets = [...rootNode.querySelectorAll(select)]
      targets.forEach((target) => {
        state = { ...state, [input]: target.value }

        event.input = event.input || []
        event.input.push({
          select,
          callback: ({ target }) => {
            store.merge({ [input]: target.value })
          },
        })
      })
    })

  // delegate from the root node
  Object.entries(event).forEach(([type, listeners]) => {
    rootNode.addEventListener(type, (e) => {
      listeners
        .filter(({ select }) => e.target.matches(select))
        .forEach(({ select, callback }) => {
          if (typeof callback === "function") {
            callback(e)
          }
          if (typeof callback === "string") {
            const { target } = e

            const targets = [...rootNode.querySelectorAll(select)]

            const index = targets.indexOf(target)

            store.dispatch(callback, { event: e, index })
          }
        })
    })
  })

  const onChange = (state) => {
    // lists first
    entries
      .filter(([_, { list }]) => list)
      .forEach(([name, { select, list }]) => {
        const targets = [...rootNode.querySelectorAll(select)]
        targets.forEach((target) => {
          const items = listItems(target, list.select)
          const curr = listData(items)
          const next = state[name]
          listSync(target, items, curr, next, list.template)
        })
      })

    // then the rest...
    entries.forEach(([name, c]) => {
      const { select, attribute, input } = c

      const targets = [...rootNode.querySelectorAll(select)]

      targets.forEach((target, i) => {
        if (attribute) {
          write(target, attribute(state, i))
        }
        if (input) {
          const value = state[input]

          if (target.value !== value) target.value = value
        }
      })
    })
  }

  subscribe(onChange)

  return state
}
