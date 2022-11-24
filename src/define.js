import { deriveState } from "./deriveState.js"
import { deriveSubscribers } from "./deriveSubscribers.js"
import { deriveRefs } from "./deriveRefs.js"
import { bindInputs } from "./bindInputs.js"
import { bindEvents } from "./bindEvents.js"
import { bindClasses } from "./bindClasses.js"
import { configure } from "./store.js"

function last(v) {
  return v[v.length - 1]
}

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
        const api = {
          refs: {},
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
          onChangeCallback: (state, updated) => {
            subscribers.forEach((fn) => fn(state))
            updated()
          },
        })

        api.refs = deriveRefs(this, (parentNode) => (html) => {
          mergeHTML(parentNode, html)
          const nextState = deriveState(this)
          dispatch({
            type: "MERGE",
            payload: nextState,
          })
        })

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
