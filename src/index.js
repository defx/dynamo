import { initialise } from "./initialise.js"
import { Store } from "./store.js"
import { Message } from "./message.js"

export const Dynamo = (target, config) => {
  const node =
    typeof target === "string" ? document.querySelector(target) : target

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

  const { dispatch, getState, setState } = Store({
    ...config,
    api,
    onChangeCallback: (state) => message.publish(state, config),
  })

  const initialState = initialise(node, message.subscribe, dispatch)

  const store = {
    dispatch,
    getState,
    ...api,
  }

  setState({
    ...initialState,
    ...((state) => (typeof state === "function" ? state(initialState) : state))(
      config.state || {}
    ),
  })

  return store
}

export const $ = Dynamo
