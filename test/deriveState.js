import { initialise } from "../src/initialise.js"

describe("deriveState", () => {
  let rootNode

  beforeEach(() => {
    rootNode = document.createElement("root-node")
    document.body.appendChild(rootNode)
  })

  afterEach(() => {
    document.body.removeChild(rootNode)
  })

  it("derives state from a Select element", () => {
    rootNode.innerHTML = html`
   
        <label>Sort by:
          <select name="sortBy" x-control>
        </label>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>

    `

    const state = initialise(rootNode)

    assert.equal(state.sortBy, "bestsellers")
  })

  it("derives state from a Select element with [selected]", () => {
    rootNode.innerHTML = html`
      
        <label>Sort by:
          <select name="sortBy" x-control>
        </label>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow" selected>Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
      
    `

    const state = initialise(rootNode)

    assert.deepEqual(state.sortBy, "priceHighToLow")
  })
})
