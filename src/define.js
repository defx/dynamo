import { initialise } from "./initialise.js"
import { configure } from "./store.js"

export const define = (name, config) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let nextTickSubscribers = []

        const api = {
          nextTick: (fn) => nextTickSubscribers.push(fn),
        }

        const subscribers = []
        const listSubscribers = {}

        const onChangeCallback = (state) => {
          Object.values(listSubscribers)
            .concat(subscribers)
            .forEach((fn) => fn(state, config))
          nextTickSubscribers.forEach((fn) => fn(state))
          nextTickSubscribers = []
        }

        const { dispatch, getState, setState } = configure({
          ...config,
          api,
          onChangeCallback,
        })

        const initialState = initialise(
          this,
          subscribers,
          listSubscribers,
          dispatch
        )

        const store = {
          dispatch,
          getState,
          ...api,
        }

        setState({
          ...initialState,
          ...((state) =>
            typeof state === "function" ? state(initialState) : state)(
            config.state || {}
          ),
        })

        config.connectedCallback?.(store)
      }
    }
  )
}
