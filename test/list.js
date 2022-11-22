import { define } from "../src/define.js"

describe("list sorting", () => {
  it("sorts the list", async () => {
    mount(html`
      <x-app>
        <label for="sort">Sort by:</label>
        <select id="sort" name="sortBy" x-input>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-list="products"
            data-id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li
            x-list="products"
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

    $(`[id="sort"]`).value = "priceLowToHigh"
    $(`[id="sort"]`).dispatchEvent(
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

    $(`[id="sort"]`).value = "priceHighToLow"
    $(`[id="sort"]`).dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    )

    await nextFrame()

    assert.deepEqual(prices(), [14.99, 5])
  })

  it("sorts the list with correct default", async () => {
    const name = createName()

    mount(html`
      <${name}>
        <label for="sort">Sort by:</label>
        <select name="sortBy" id="sort" x-input>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh" selected>Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-list="products"
            data-id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li
            x-list="products"
            data-id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>second</p>
          </li>
        </ul>
      </${name}>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.price - b.price,
      priceHighToLow: (a, b) => b.price - a.price,
    }

    define(name, () => {
      return {
        getState: (state) => ({
          products: state.products.sort(sort[state.sortBy]),
        }),
      }
    })

    function prices() {
      return $$(`[data-price]`)
        .map((el) => el.getAttribute("data-price"))
        .map((v) => +v)
    }

    assert.deepEqual(prices(), [5, 14.99])
  })
})

describe("list merge", () => {
  it("merges items into the list at the correct position (via connectedCallback)", async () => {
    const tagName = createName()

    mount(html`
      <${tagName}>
        <label for="pet-select">Sort by:</label>
        <select name="sortBy" x-input>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh" selected>Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-list="products"
            data-id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>14.99</p>
          </li>
          <li
            x-list="products"
            data-id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>5</p>
          </li>
        </ul>
      </${tagName}>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.price - b.price,
      priceHighToLow: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    }

    define(tagName, () => {
      return {
        getState: (state) => ({
          products: state.products.sort(sort[state.sortBy]),
        }),
        connectedCallback({ mergeHTML }) {
          requestAnimationFrame(() => {
            mergeHTML(
              `[x-list="products"]`,
              html`
                <li
                  x-list="products"
                  data-id="f7g649f9"
                  data-price="19.99"
                  data-rating="4.2"
                >
                  <p>19.99</p>
                </li>
                <li
                  x-list="products"
                  data-id="k7s95jg7"
                  data-price="3.99"
                  data-rating="4.7"
                >
                  <p>3.99</p>
                </li>
              `
            )
          })
        },
      }
    })

    function prices() {
      return $$(`[data-price]`)
        .map((el) => el.getAttribute("data-price"))
        .map((v) => +v)
    }

    await nextFrame()

    assert.deepEqual(prices(), [3.99, 5, 14.99, 19.99])
  })
})
