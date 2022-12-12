import { update } from "./update.js"
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

        const onChangeCallback = (state) => {
          // always update collections first
          Object.values(listSubscribers)
            .concat(subscribers)
            .forEach((fn) => fn(state))

          nextTickSubscribers.forEach((fn) => fn(state))
          nextTickSubscribers = []
        }

        const { dispatch, getState } = configure({
          ...config,
          api,
          onChangeCallback,
        })

        const initialState = update(
          this,
          {},
          subscribers,
          listSubscribers,
          dispatch,
          api.refs
        )

        api.append = (html, ref) => {
          const targetNode = Array.isArray(ref) ? ref[0].parentNode : ref
          const childNodes = mergeHTML(targetNode, html)

          const nextState = childNodes.reduce((state, node) => {
            return update(
              node,
              state,
              subscribers,
              listSubscribers,
              dispatch,
              api.refs
            )
          }, getState())

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

        dispatch({
          type: "MERGE",
          payload: {
            ...initialState,
            ...((state) =>
              typeof state === "function" ? state(initialState) : state)(
              config.state || {}
            ),
          },
        })

        config.connectedCallback?.(store)
      }
    }
  )
}
