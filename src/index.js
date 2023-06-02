import { initialise } from "./initialise.js"
import { Store } from "./store.js"
import { Medium } from "./medium.js"

export const $ = (target, config) => {
  const node =
    typeof target === "string" ? document.querySelector(target) : target

  let nextTickSubscribers = []

  const api = {
    nextTick: (fn) => nextTickSubscribers.push(fn),
  }

  const medium = Medium({
    postPublish: () => {
      nextTickSubscribers.forEach((fn) => fn(state))
      nextTickSubscribers = []
    },
  })

  const { dispatch, getState, setState } = Store({
    ...config,
    api,
    onChangeCallback: (state) => medium.publish(state, config),
  })

  const initialState = initialise(node, medium.subscribe, dispatch)

  const store = {
    dispatch,
    getState,
    ...api,
  }

  setState({
    ...initialState,
    ...((state) => (typeof state === "function" ? state(initialState) : state))(
      config.state || {}
    ),
  })

  return store
}

export const define = (name, config) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        const store = $(this, config)
        config.connectedCallback?.(store)
      }
    }
  )
}
