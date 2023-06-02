import { initialise } from "./initialise.js"
import { Store } from "./store.js"
import { Medium } from "./medium.js"

export const define = (name, config) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
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

        const initialState = initialise(this, medium.subscribe, dispatch)

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
