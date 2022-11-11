const $ = (v) => document.querySelector(v)
const $$ = (v) => [...document.querySelectorAll(v)]

function bind() {
  const elements = $$("[@bind]")

  for (const el of elements) {
    const { dataset, nodeType } = el

    // ...
  }
}
