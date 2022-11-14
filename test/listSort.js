import { define } from "../src/define.js"

describe("list mutations", () => {
  it("sorts the list", async () => {
    mount(html`
      <x-app>
        <label for="pet-select">Sort by:</label>
        <select name="pets" id="pet-select" x-bind="sortBy">
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-bind="products.*"
            data-id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li
            x-bind="products.*"
            data-id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>second</p>
          </li>
        </ul>
      </x-app>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.price - b.price,
      priceHighToLow: (a, b) => b.price - a.price,
    }

    define("x-app", () => {
      return {
        getState: (state) => ({
          products: state.products.sort(sort[state.sortBy]),
        }),
      }
    })

    $(`[id="pet-select"]`).value = "priceLowToHigh"
    $(`[id="pet-select"]`).dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    )

    function prices() {
      return $$(`[data-price]`)
        .map((el) => el.getAttribute("data-price"))
        .map((v) => +v)
    }

    await nextFrame()

    assert.deepEqual(prices(), [5, 14.99])

    $(`[id="pet-select"]`).value = "priceHighToLow"
    $(`[id="pet-select"]`).dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    )

    await nextFrame()

    assert.deepEqual(prices(), [14.99, 5])
  })
})
