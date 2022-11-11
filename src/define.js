import { deriveState } from "./deriveState.js"
import { deriveEvents } from "./deriveEvents.js"
import { bindEvents } from "./bindEvents.js"
import { configure } from "./store.js"

/*

in synergy, anything that needs to update is a subscriber, and all subscribers are called when state changes. it is then the responsibility of the subscriber to determine whether changes to state effect it and, if so, update accordingly

in the case of our list updates, we really only need to subscribe using the path...


if the value of that path changes then we know that we need to reorder the list

*/

export const define = (name, factory) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let config = factory(this)

        const initialState = deriveState(this)

        const { dispatch, getState, onChange, updated, refs } = configure({
          ...config,
          state: {
            ...(config.state || {}),
            ...initialState,
          },
        })

        const events = deriveEvents(this)

        bindEvents(events, dispatch)

        const subscribers = deriveSubscribers(this, initialState)

        onChange(() => {
          const state = getState()
          subscribers.forEach((fn) => fn(state))
          updated()
        })
      }
    }
  )
}
