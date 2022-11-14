import { deriveState } from "./deriveState.js"
import { deriveSubscribers } from "./deriveSubscribers.js"
import { bindInputs } from "./bindInputs.js"
import { configure } from "./store.js"
import { mergeList } from "./list.js"

export const define = (name, factory) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let config = factory(this)

        const initialState = deriveState(this)
        const subscribers = deriveSubscribers(this, initialState)

        const { dispatch, getState, refs } = configure({
          ...config,
          state: {
            ...(config.state || {}),
            ...initialState,
          },
          onChangeCallback: (state, updated) => {
            subscribers.forEach((fn) => fn(state))
            updated()
          },
        })

        const mergeListItems = (k, v) => {
          mergeList(this, k, v)
          const nextState = deriveState(this)
          dispatch({
            type: "MERGE",
            payload: nextState,
          })
        }

        const store = { dispatch, getState, mergeListItems }

        bindInputs(this, dispatch)

        config.connectedCallback?.(store)
      }
    }
  )
}
