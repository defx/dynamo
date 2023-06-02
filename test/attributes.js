import { define } from "../src/define.js"

describe("x-node", () => {
  it("initialises the attributes", () => {
    mount(html`
      <x-attr-test>
        <button x-node="toggleButton" hidden>[+]</button>
      </x-attr-test>
    `)
    define("x-attr-test", {
      node: {
        toggleButton: () => ({
          hidden: false,
          ariaExpanded: false,
        }),
      },
    })

    assert.equal($(`button`).hidden, false)
    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })

  it("updates the attributes", async () => {
    mount(html`
      <x-attr-test-2>
        <button x-on="click:toggle" x-node="toggleButton" hidden>[+]</button>
      </x-attr-test-2>
    `)
    define("x-attr-test-2", {
      state: {
        expanded: false,
      },
      node: {
        toggleButton: ({ expanded }) => ({
          hidden: false,
          ariaExpanded: expanded,
        }),
      },
      update: {
        toggle: (state) => ({
          expanded: !state.expanded,
        }),
      },
    })

    $(`button`).click()

    await nextFrame()

    assert.equal($(`button`).getAttribute("aria-expanded"), "true")
  })

  it("initialises the attribute as part of a collection", () => {
    mount(html`
      <x-attr-test-4>
        <button x-node="toggleButtons.*">[+]</button>
      </x-attr-test-4>
    `)
    define("x-attr-test-4", {
      node: {
        toggleButtons: () => ({
          ariaExpanded: false,
        }),
      },
    })

    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })

  it("updates the attribute as part of a collection", async () => {
    mount(html`
      <x-attr-test-5>
        <button x-on="click:toggleMenuItem" x-node="menuItems.*">[+]</button>
      </x-attr-test-5>
    `)

    define("x-attr-test-5", {
      state: {
        openMenuItems: {},
      },
      update: {
        toggleMenuItem: (state, { index: i }) => {
          const { openMenuItems } = state
          openMenuItems[i] = !(openMenuItems[i] || false)

          return {
            openMenuItems,
          }
        },
      },
      node: {
        menuItems: (state, i) => ({
          ariaExpanded: !!state.openMenuItems[i],
        }),
      },
    })

    $(`button`).click()

    await nextFrame()

    assert.equal($(`button`).getAttribute("aria-expanded"), "true")

    $(`button`).click()

    await nextFrame()

    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })
})
