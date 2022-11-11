import { deriveState } from "../src/deriveState.js"

describe("deriveState", () => {
  it("derives state from a list of elements", () => {
    mount(html`
      <x-app>
        <ul>
          <li
            x-bind="products.*"
            data-id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <img src="https://sdf76sdfhsdfj.cloudfront.com/ert987wer87u8.jpg" />
            <a href="//bbc.co.uk"></a>
          </li>
          <li
            x-bind="products.*"
            data-id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <img src="https://sdf76sdfhsdfj.cloudfront.com/ert987wer87u8.jpg" />
            <a href="//bbc.co.uk"></a>
          </li>
        </ul>
      </x-app>
    `)

    const state = deriveState($("x-app"))

    assert.deepEqual(state, {
      products: [
        {
          id: "afd56erg",
          price: 14.99,
          rating: 4.2,
        },
        {
          id: "f8g7r6d",
          price: 5,
          rating: 4.7,
        },
      ],
    })
  })

  it("derives state from a Select element", () => {
    mount(html`
      <x-app>
        <label for="pet-select">Sort by:</label>
        <select name="pets" id="pet-select" x-bind="sortBy">
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
      </x-app>
    `)

    const state = deriveState($("x-app"))

    assert.deepEqual(state, {
      sortBy: "bestsellers",
    })
  })
})
