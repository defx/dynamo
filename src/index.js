import { initialise } from "./initialise.js"
import { Store } from "./store.js"
import { Message } from "./message.js"

export const Dynamo = (node, config) => {
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

  const store = Store({
    ...config,
    api,
    onChangeCallback: (state) => message.publish(state, config),
  })

  const { setState } = store

  const initialState = initialise(node, message.subscribe, config, store)

  const nextState = {
    ...initialState,
    ...((state) => (typeof state === "function" ? state(initialState) : state))(
      config.state || {}
    ),
  }
  setState((state) => ({
    ...state,
    ...nextState,
  }))

  return store
}

export const $ = Dynamo
