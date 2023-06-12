import { initialise } from "./initialise.js"
import { Store } from "./store.js"
import { Message } from "./message.js"

export const define = (name, config) => {
  if (customElements.get(name)) return

  customElements.define(
    name,
    class extends HTMLElement {
      async connectedCallback() {
        let nextTickSubscribers = []

        const api = {
          nextTick: (fn) => nextTickSubscribers.push(fn),
        }

        const message = Message({
          postPublish: () => {
            nextTickSubscribers.forEach((fn) => fn(state))
            nextTickSubscribers = []
          },
        })

        const observed = new Set()
        const host = this

        const wrap = (state) => {
          return new Proxy(state, {
            get(_, name) {
              if (observed.has(name) === false) {
                Object.defineProperty(host, name, {
                  get() {
                    return getState()[property]
                  },
                  set(value) {
                    setState((state) => ({ ...state, [name]: value }))
                  },
                })

                observed.add(name)
              }
              return Reflect.get(...arguments)
            },
          })
        }

        const { dispatch, getState, setState } = Store({
          ...config,
          api,
          onChangeCallback: (state) => {
            message.publish(wrap(state), config)
          },
        })

        const initialState = initialise(
          this,
          message.subscribe,
          dispatch,
          config
        )

        setState({
          ...initialState,
          ...((state) =>
            typeof state === "function" ? state(initialState) : state)(
            config.state || {}
          ),
        })

        const sa = this.setAttribute
        this.setAttribute = (name, value) => {
          if (observed.has(name)) {
            setState((state) => ({ ...state, [name]: value }))
          }
          return sa.apply(this, [name, value])
        }
        const ra = this.removeAttribute
        this.removeAttribute = (name) => {
          if (observed.has(name)) {
            setState((state) => ({ ...state, [name]: null }))
          }
          return ra.apply(this, [name])
        }
      }
    }
  )
}
