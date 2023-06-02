import { initialise } from "./initialise.js"
import { configure } from "./store.js"
import { Median } from "./median.js"

export const define = (name, config) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let nextTickSubscribers = []

        const api = {
          nextTick: (fn) => nextTickSubscribers.push(fn),
        }

        const median = Median({
          postPublish: () => {
            nextTickSubscribers.forEach((fn) => fn(state))
            nextTickSubscribers = []
          },
        })

        const { dispatch, getState, setState } = configure({
          ...config,
          api,
          onChangeCallback: (state) => median.publish(state, config),
        })

        const initialState = initialise(this, median.subscribe, dispatch)

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
