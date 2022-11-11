import { deriveState } from "./deriveState.js"
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

        // @todo: bind events ... bindEvents(this, dispatch)

        // @todo: update the DOM onChange
      }
    }
  )
}
