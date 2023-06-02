// export { define } from "./define.js"

import { update } from "./initialise.js"
import { configure } from "./store.js"

function $(target, config) {
  const node =
    typeof target === "string" ? document.querySelector(target) : target
}
