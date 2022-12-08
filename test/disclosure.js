import { define } from "../src/index.js"

describe("disclosure pattern", () => {
  it("unhides a hidden x-toggle", () => {
    mount(html`
      <x-toggle-test>
        <button x-toggle="foo" hidden>+</button>
      </x-toggle-test>
    `)
    define("x-toggle-test", () => ({}))

    assert.equal($(`[x-toggle]`).hidden, false)
  })
  it("initialises the relevant attributes and props (hidden)", () => {
    mount(html`
      <x-toggle-test-2>
        <button x-toggle="foo">+</button>
        <div id="foo">Hello world 👋</div>
      </x-toggle-test-2>
    `)
    define("x-toggle-test-2", () => ({}))

    assert.equal($(`[x-toggle]`).getAttribute("aria-expanded"), "false")
  })

  it("initialises the relevant attributes and props (shown)", () => {
    mount(html`
      <style></style>
      <x-toggle-test-3>
        <button x-toggle="foo" aria-expanded="true">+</button>
        <div id="foo" class="content">Hello world 👋</div>
      </x-toggle-test-3>
    `)
    define("x-toggle-test-3", () => ({}))
    assert.equal($(`[x-toggle]`).getAttribute("aria-expanded"), "true")
  })
})
