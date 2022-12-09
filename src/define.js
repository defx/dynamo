import { update } from "./update.js"
import { deriveRefs } from "./deriveRefs.js"
import { bindInputs } from "./bindInputs.js"
import { bindEvents } from "./bindEvents.js"
import { configure } from "./store.js"

function mergeHTML(parentNode, html) {
  const tpl = document.createElement("template")
  tpl.innerHTML = html.trim()
  const childNodes = [...tpl.content.childNodes]
  parentNode.appendChild(tpl.content)
  return childNodes
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

        const subscribers = []
        const listSubscribers = {}
        const initialState = update(this, {}, subscribers, listSubscribers)

        const onChangeCallback = (state) => {
          subscribers
            .concat(Object.values(listSubscribers))
            .forEach((fn) => fn(state))
          nextTickSubscribers.forEach((fn) => fn(state))
          nextTickSubscribers = []
        }

        const { dispatch, getState } = configure({
          ...config,
          state: {
            ...initialState,
            ...((state) =>
              typeof state === "function" ? state(initialState) : state)(
              config.state || {}
            ),
          },
          api,
          onChangeCallback,
        })

        api.append = (html, targetNode) => {
          const childNodes = mergeHTML(targetNode, html)

          const nextState = childNodes.reduce((state, node) => {
            return update(node, state, subscribers, listSubscribers)
          }, getState())

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
        onChangeCallback(getState())

        config.connectedCallback?.(store)
      }
    }
  )
}
