import { initialise } from "../src/initialise.js"

describe("deriveState", () => {
  it("derives state from a Select element", () => {
    const tagName = createName()
    mount(html`
      <${tagName}>
        <label>Sort by:
          <select name="sortBy" x-input>
        </label>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
      </${tagName}>
    `)

    const state = initialise($(tagName))

    assert.equal(state.sortBy, "bestsellers")
  })

  it("derives state from a Select element with [selected]", () => {
    const tagName = createName()
    mount(html`
      <${tagName}>
        <label>Sort by:
          <select name="sortBy" x-input>
        </label>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow" selected>Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
      </${tagName}>
    `)

    const state = initialise($(tagName))

    assert.deepEqual(state.sortBy, "priceHighToLow")
  })
})
