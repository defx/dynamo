import { define } from "../src/define.js"

describe("list sorting", () => {
  it("sorts the list", async () => {
    mount(html`
      <sort-list>
        <label for="sort">Sort by:</label>
        <select id="sort" name="sortBy" x-o="sortBy">
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh">Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-o="products.*"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li x-o="products.*" id="f8g7r6d" data-price="5" data-rating="4.7">
            <p>second</p>
          </li>
        </ul>
      </sort-list>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.dataset.price - b.dataset.price,
      priceHighToLow: (a, b) => b.dataset.price - a.dataset.price,
    }

    define("sort-list", () => {
      return {
        getState: (state) => ({
          products: state.products.sort(sort[state.sortBy.value]),
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
        <select name="sortBy" id="sort" x-o="sortBy">
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh" selected>Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-o="products.*"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li
            x-o="products.*"
            id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>second</p>
          </li>
        </ul>
      </${name}>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.dataset.price - b.dataset.price,
      priceHighToLow: (a, b) => b.dataset.price - a.dataset.price,
    }

    define(name, () => {
      return {
        getState: (state) => ({
          products: state.products.sort(sort[state.sortBy.value]),
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
        <select name="sortBy" x-o="sortBy">
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh" selected>Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-o="products.*"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>14.99</p>
          </li>
          <li
            x-o="products.*"
            id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>5</p>
          </li>
        </ul>
      </${tagName}>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.dataset.price - b.dataset.price,
      priceHighToLow: (a, b) => b.dataset.price - a.dataset.price,
      rating: (a, b) => b.dataset.rating - a.dataset.rating,
    }

    define(tagName, () => {
      return {
        getState: (state) => {
          return {
            ...state,
            products: state.products.sort(sort[state.sortBy.value]),
          }
        },
        connectedCallback({ refs: { products }, append }) {
          requestAnimationFrame(() => {
            append(
              html`
                <li
                  x-o="products.*"
                  id="f7g649f9"
                  data-price="19.99"
                  data-rating="4.2"
                >
                  <p>19.99</p>
                </li>
                <li
                  x-o="products.*"
                  id="k7s95jg7"
                  data-price="3.99"
                  data-rating="4.7"
                >
                  <p>3.99</p>
                </li>
              `,
              products
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

  it("merges items into the list at the correct position (via middleware)", async () => {
    const tagName = createName()

    mount(html`
      <${tagName}>
        <label for="sortInput">Sort by:</label>
        <select name="sortBy" id="sortInput" x-o="sortBy">
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh" selected>Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul>
          <li
            x-o="products.*"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>14.99</p>
          </li>
          <li
            x-o="products.*"
            id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>5</p>
          </li>
          <button x-e="click:loadMore">load more</button>
        </ul>
      </${tagName}>
    `)

    const sort = {
      priceLowToHigh: (a, b) => a.dataset.price - b.dataset.price,
      priceHighToLow: (a, b) => b.dataset.price - a.dataset.price,
      rating: (a, b) => b.dataset.rating - a.dataset.rating,
    }

    define(tagName, () => {
      return {
        getState: (state) => ({
          ...state,
          products: state.products.sort(sort[state.sortBy.value]),
        }),
        middleware: {
          loadMore: (_, { refs: { products }, append }) => {
            append(
              html`
                <li
                  x-o="products.*"
                  id="f7g649f9"
                  data-price="19.99"
                  data-rating="4.2"
                >
                  <p>19.99</p>
                </li>
                <li
                  x-o="products.*"
                  id="k7s95jg7"
                  data-price="3.99"
                  data-rating="4.7"
                >
                  <p>3.99</p>
                </li>
              `,
              products
            )
          },
        },
      }
    })

    function prices() {
      return $$(`[data-price]`)
        .map((el) => el.getAttribute("data-price"))
        .map((v) => +v)
    }

    $(`[x-e="click:loadMore"]`).click()

    await nextFrame()

    assert.deepEqual(prices(), [3.99, 5, 14.99, 19.99])
  })
})
