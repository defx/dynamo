import { define } from "../src/index.js"

describe("x-attr", () => {
  it("initialises the attributes", () => {
    mount(html`
      <x-attr-test>
        <button x-attr="toggleButton" hidden>[+]</button>
      </x-attr-test>
    `)
    define("x-attr-test", () => ({
      attributes: {
        toggleButton: (_, attrs) => ({
          ...attrs,
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
      attributes: {
        toggleButton: ({ expanded }, attrs) => ({
          ...attrs,
          hidden: false,
          ariaExpanded: expanded,
        }),
      },
      update: {
        toggle: (state) => ({
          ...state,
          expanded: !state.expanded,
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
      attributes: {
        toggleButtons: (_, attrs) => ({
          ...attrs,
          ariaExpanded: false,
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
      state: {
        openMenuItems: {},
      },
      update: {
        toggleMenuItem: (state, { index: i }) => {
          const { openMenuItems } = state
          openMenuItems[i] = !(openMenuItems[i] || false)

          return {
            ...state,
            openMenuItems,
          }
        },
      },
      attributes: {
        menuItems: (state, attrs, i) => ({
          ...attrs,
          ariaExpanded: !!state.openMenuItems[i],
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
