import { update } from "../src/update.js"

describe("deriveState", () => {
  it("derives state from a list of elements", () => {
    const tagName = createName()

    mount(html`
      <${tagName}>
        <ul>
          <li
            x-node="products.*"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <img src="https://sdf76sdfhsdfj.cloudfront.com/ert987wer87u8.jpg" />
            <a href="//bbc.co.uk"></a>
          </li>
          <li
            x-node="products.*"
            id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <img src="https://sdf76sdfhsdfj.cloudfront.com/ert987wer87u8.jpg" />
            <a href="//bbc.co.uk"></a>
          </li>
        </ul>
      </${tagName}>
    `)

    const state = update($(tagName))

    assert.deepEqual(state.products, [
      {
        dataset: {
          price: 14.99,
          rating: 4.2,
        },
        id: "afd56erg",
      },
      {
        dataset: {
          price: 5,
          rating: 4.7,
        },
        id: "f8g7r6d",
      },
    ])
  })

  it("derives state from a Select element", () => {
    const tagName = createName()
    mount(html`
      <${tagName}>
        <label>Sort by:
          <select name="sortBy" x-node="sortBy">
        </label>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
      </${tagName}>
    `)

    const state = update($(tagName))

    assert.equal(state.sortBy.value, "bestsellers")
  })

  it("derives state from a Select element with [selected]", () => {
    const tagName = createName()
    mount(html`
      <${tagName}>
        <label>Sort by:
          <select name="sortBy" x-node="sortBy">
        </label>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow" selected>Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
      </${tagName}>
    `)

    const state = update($(tagName))

    assert.deepEqual(state.sortBy.value, "priceHighToLow")
  })
})
