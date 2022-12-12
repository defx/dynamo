import { define } from "../src/index.js"

describe("x-attr", () => {
  it("initialises the attributes", () => {
    mount(html`
      <x-attr-test>
        <button x-e="click:toggle" x-o="toggleButton" hidden>[+]</button>
      </x-attr-test>
    `)
    define("x-attr-test", () => ({
      state: {
        toggleButton: {
          hidden: false,
          ariaExpanded: false,
        },
      },
    }))

    assert.equal($(`button`).hidden, false)
    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })

  it("updates the attributes", async () => {
    mount(html`
      <x-attr-test-2>
        <button x-e="click:toggle" x-o="toggleButton" hidden>[+]</button>
      </x-attr-test-2>
    `)
    define("x-attr-test-2", () => ({
      state: {
        toggleButton: {
          hidden: false,
          ariaExpanded: false,
        },
      },
      update: {
        toggle: (state) => ({
          toggleButton: {
            ariaExpanded: !state.toggleButton.ariaExpanded,
          },
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
        <button x-o="toggleButton.*">[+]</button>
      </x-attr-test-4>
    `)
    define("x-attr-test-4", () => ({
      state: {
        toggleButton: [
          {
            ariaExpanded: false,
          },
        ],
      },
    }))

    assert.equal($(`button`).getAttribute("aria-expanded"), "false")
  })

  it("updates the attribute as part of a collection", async () => {
    mount(html`
      <x-attr-test-5>
        <button x-e="click:toggle" x-o="toggleButtons.*">[+]</button>
      </x-attr-test-5>
    `)
    define("x-attr-test-5", () => ({
      update: {
        toggle: (state, { index }) => {
          return {
            toggleButtons: state.toggleButtons.map((v, i) => {
              return {
                ...v,
                ariaExpanded: i === index ? !v.ariaExpanded : false,
              }
            }),
          }
        },
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
