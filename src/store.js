import { setValueAtPath } from "./helpers.js"

function systemReducer(state, action) {
  switch (action.type) {
    case "SET": {
      const { name, value } = action.payload

      let o = { ...state }
      setValueAtPath(name, value, o)

      return o
    }
    case "MERGE": {
      return {
        ...state,
        ...action.payload,
      }
    }
  }
}

export function configure({
  update = {},
  middleware = [],
  state: initialState = {},
  getState: getStateWrapper = (v) => v,
  onChangeCallback,
  api = {},
}) {
  let state

  function transition(o) {
    state = getStateWrapper({ ...o })
    onChangeCallback(getState())
  }

  transition(initialState)

  function getState() {
    return { ...state }
  }

  function dispatch(action) {
    const { type, payload, event } = action

    if (type === "SET" || type === "MERGE") {
      transition(systemReducer(getState(), action))
      return
    }

    if (action.type in middleware) {
      middleware[action.type]?.(
        { type, payload, event },
        {
          getState,
          dispatch,
          ...api,
        }
      )
      return
    }

    if (action.type in update) {
      transition(update[action.type](getState(), { type, payload, event }))
    }
  }

  return {
    dispatch, // dispatch an action to the reducers
    getState, // optionally provide a wrapper function to derive additional properties in state
    ...api,
  }
}

/*

      return {
        then: (fn) =>
          new Promise((resolve) => {
            subscribe(() => {
              fn()
              resolve()
            })
          }),
      }

*/
