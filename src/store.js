import { serializable } from "./helpers.js"

export function configure({
  update = {},
  middleware = [],
  getState: getStateWrapper = (v) => v,
  onChangeCallback,
  api = {},
}) {
  let state

  function transition(o) {
    state = getStateWrapper({ ...o })

    onChangeCallback(getState())
  }

  function getState() {
    return { ...state }
  }

  function dispatch(_action) {
    const { type, payload = {}, event, index } = _action
    const action = { type, payload: serializable(payload), event, index }

    if (type === "MERGE") {
      transition({
        ...getState(),
        ...action.payload,
      })
      return
    }

    if (action.type in middleware) {
      middleware[action.type]?.(action, {
        getState,
        dispatch,
        ...api,
      })
      return
    }

    if (action.type in update) {
      transition(update[action.type](getState(), action))
    }
  }

  return {
    dispatch, // dispatch an action to the reducers
    getState, // optionally provide a wrapper function to derive additional properties in state
    setState: transition,
    ...api,
  }
}
