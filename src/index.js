export { initialise } from "./initialise.js"
export { configure } from "./store.js"

// function $(target, config) {
//   const node =
//     typeof target === "string" ? document.querySelector(target) : target

//   const median = {
//     onStateChange: () => {},
//     onEventDispatch: () => {},
//   }

//   const { dispatch, getState, setState } = configure({
//     ...config,
//     api,
//     onChangeCallback: median.onStateChange,
//   })

//   const { initialState, listeners } = initialise(this, median.onEventDispatch)
// }
