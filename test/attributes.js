import { define } from "../src/index.js"

describe("x-attr", () => {
  it("initialises the attributes", () => {
    mount(html`
      <x-attr-test>
        <button x-on="click:toggle" x-attr="toggleButton" hidden>[+]</button>
      </x-attr-test>
    `)
    define("x-attr-test", () => ({
      "x-attr": {
        toggleButton: () => ({
          hidden: false,
          ariaExpanded: false,
        }),
      },
    }))

    assert.equal($(`button`).hidden, false)
    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })

  it("updates the attributes", async () => {
    mount(html`
      <x-attr-test-2>
        <button x-on="click:toggle" x-attr="toggleButton" hidden>[+]</button>
      </x-attr-test-2>
    `)
    define("x-attr-test-2", () => ({
      state: {
        expanded: false,
      },
      update: {
        toggle: (state) => ({
          ...state,
          expanded: !state.expanded,
        }),
      },
      "x-attr": {
        toggleButton: (state, attrs) => ({
          ...attrs,
          ariaExpanded: state.expanded,
        }),
      },
    }))

    $(`button`).click()

    await nextFrame()

    assert.equal($(`button`).getAttribute("aria-expanded"), "true")
  })

  it("initialises the attribute as part of a collection", () => {
    mount(html`
      <x-attr-test-4>
        <button x-attr="toggleButtons.*">[+]</button>
      </x-attr-test-4>
    `)
    define("x-attr-test-4", () => ({
      state: {
        openMenuItem: -1,
      },
      "x-attr": {
        toggleButtons: (state, attrs, i) => ({
          ...attrs,
          ariaExpanded: state.openMenuItem === i,
        }),
      },
    }))

    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })

  it("updates the attribute as part of a collection", async () => {
    mount(html`
      <x-attr-test-5>
        <button x-on="click:toggleMenuItem" x-attr="menuItems.*">[+]</button>
      </x-attr-test-5>
    `)
    define("x-attr-test-5", () => ({
      update: {
        toggleMenuItem: (state, { index }) => {
          return {
            ...state,
            openMenuItem: state.openMenuItem === index ? -1 : index,
          }
        },
      },
      "x-attr": {
        menuItems: (state, attrs, i) => ({
          ...attrs,
          ariaExpanded: state.openMenuItem === i,
        }),
      },
    }))

    $(`button`).click()

    await nextFrame()

    assert.equal($(`button`).getAttribute("aria-expanded"), "true")

    $(`button`).click()

    await nextFrame()

    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })
})
