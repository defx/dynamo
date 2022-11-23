import { deriveState } from "./deriveState.js"
import { deriveSubscribers } from "./deriveSubscribers.js"
import { bindInputs } from "./bindInputs.js"
import { bindEvents } from "./bindEvents.js"
import { bindClasses } from "./bindClasses.js"
import { configure } from "./store.js"

function last(v) {
  return v[v.length - 1]
}

function mergeHTML(rootNode, selector, html) {
  const nodes = [...rootNode.querySelectorAll(selector)]
  const lastNode = last(nodes)
  const tpl = document.createElement("template")
  tpl.innerHTML = html.trim()
  lastNode.after(tpl.content)
}

export const define = (name, factory) => {
  customElements.define(
    name,
    class extends HTMLElement {
      connectedCallback() {
        let mergeHTMLWrapper

        const api = {
          appendHTML: (k, v) => mergeHTMLWrapper?.(k, v),
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

        mergeHTMLWrapper = (k, v) => {
          mergeHTML(this, k, v)
          const nextState = deriveState(this)
          dispatch({
            type: "MERGE",
            payload: nextState,
          })
        }

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
