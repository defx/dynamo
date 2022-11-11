import { deriveState } from "./deriveState.js"
import { deriveEvents } from "./deriveEvents.js"
import { bindEvents } from "./bindEvents.js"
import { configure } from "./store.js"

export const define = (name, factory) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let config = factory(this)

        const { dispatch, getState, onChange, updated, refs } = configure({
          ...config,
          state: {
            ...(config.state || {}),
            ...deriveState(this),
          },
        })

        const events = deriveEvents(this)

        bindEvents(events, dispatch)

        onChange(() => {
          // ...
        })
      }
    }
  )
}
