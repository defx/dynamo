import { $ } from "../src/index.js"

describe("x-node", () => {
  let rootNode

  beforeEach(() => {
    rootNode = document.createElement("root-node")
    document.body.appendChild(rootNode)
  })

  afterEach(() => {
    document.body.removeChild(rootNode)
  })

  it("initialises the attributes", () => {
    rootNode.innerHTML = html`<button x-node="toggleButton" hidden>[+]</button>`

    $(rootNode, {
      node: {
        toggleButton: () => ({
          hidden: false,
          ariaExpanded: false,
        }),
      },
    })

    assert.equal(rootNode.querySelector(`button`).hidden, false)
    assert.equal(
      rootNode.querySelector(`button`).getAttribute("aria-expanded"),
      "false"
    )
  })

  it("updates the attributes", async () => {
    rootNode.innerHTML = html`<button
      x-on="click:toggle"
      x-node="toggleButton"
      hidden
    >
      [+]
    </button>`

    $(rootNode, {
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

    rootNode.querySelector(`button`).click()

    await nextFrame()

    assert.equal(
      rootNode.querySelector(`button`).getAttribute("aria-expanded"),
      "true"
    )
  })

  it("initialises the attribute as part of a collection", () => {
    rootNode.innerHTML = html`<button x-node="toggleButtons.*">[+]</button>`
    $(rootNode, {
      node: {
        toggleButtons: () => ({
          ariaExpanded: false,
        }),
      },
    })

    assert.equal(
      rootNode.querySelector(`button`).getAttribute("aria-expanded"),
      "false"
    )
  })

  it("updates the attribute as part of a collection", async () => {
    rootNode.innerHTML = html`
      <button x-on="click:toggleMenuItem" x-node="menuItems.*">[+]</button>
    `

    $(rootNode, {
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

    rootNode.querySelector(`button`).click()

    await nextFrame()

    assert.equal(
      rootNode.querySelector(`button`).getAttribute("aria-expanded"),
      "true"
    )

    rootNode.querySelector(`button`).click()

    await nextFrame()

    assert.equal(
      rootNode.querySelector(`button`).getAttribute("aria-expanded"),
      "false"
    )
  })
})
