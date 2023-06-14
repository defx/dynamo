export function Store({
  action: actionHandlers = {},
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

  function dispatch(type, event) {
    if (type in actionHandlers) {
      const x = actionHandlers[type](getState(), event)
      transition({ ...state, ...x })
    }
  }

  return {
    dispatch, // dispatch an action to the reducers
    getState, // optionally provide a wrapper function to derive additional properties in state
    setState: (fn) => {
      transition(fn(getState()))
    },
    ...api,
  }
}
