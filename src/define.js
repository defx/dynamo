import { deriveState } from "./deriveState.js"
import { deriveSubscribers } from "./deriveSubscribers.js"
import { deriveRefs } from "./deriveRefs.js"
import { bindInputs } from "./bindInputs.js"
import { bindEvents } from "./bindEvents.js"
import { bindClasses } from "./bindClasses.js"
import { configure } from "./store.js"

function mergeHTML(parentNode, html) {
  const tpl = document.createElement("template")
  tpl.innerHTML = html.trim()
  parentNode.appendChild(tpl.content)
}

export const define = (name, factory) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let nextTickSubscribers = []

        const api = {
          refs: {},
          nextTick: (fn) => nextTickSubscribers.push(fn),
        }

        let config = factory(this)

        const initialState = deriveState(this)
        const subscribers = deriveSubscribers(this, initialState).concat(
          bindClasses(this)
        )

        const { dispatch, getState } = configure({
          ...config,
          state: {
            ...(config.state || {}),
            ...initialState,
          },
          api,
          onChangeCallback: (state) => {
            subscribers.forEach((fn) => fn(state))
            nextTickSubscribers.forEach((fn) => fn(state))
            nextTickSubscribers = []
          },
        })

        api.append = (html, targetNode) => {
          mergeHTML(targetNode, html)
          const nextState = deriveState(this)
          dispatch({
            type: "MERGE",
            payload: nextState,
          })
        }

        api.refs = deriveRefs(this)

        const store = {
          dispatch,
          getState,
          ...api,
        }

        bindInputs(this, dispatch)
        bindEvents(this, dispatch)

        config.connectedCallback?.(store)
      }
    }
  )
}
