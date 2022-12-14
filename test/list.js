import { define } from "../src/define.js"

describe("list sorting", () => {
  it("sorts the list", async () => {
    const name = createName()

    mount(html`
      <${name}>
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
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li x-list="products" id="f8g7r6d" data-price="5" data-rating="4.7">
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
        lists: {
          products: (state, products) => products.sort(sort[state.sortBy]),
        },
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
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>first</p>
          </li>
          <li
            x-list="products"
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
      priceLowToHigh: (a, b) => a.price - b.price,
      priceHighToLow: (a, b) => b.price - a.price,
    }

    define(name, () => {
      return {
        lists: {
          products: (state, products) => {
            return products.sort(sort[state.sortBy])
          },
        },
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
        <ul x-ref="productList">
          <li
            x-list="products"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>14.99</p>
          </li>
          <li
            x-list="products"
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
      priceLowToHigh: (a, b) => a.price - b.price,
      priceHighToLow: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
    }

    define(tagName, () => {
      return {
        lists: {
          products: (state, products) => products.sort(sort[state.sortBy]),
        },
        connectedCallback({ refs: { productList }, append }) {
          requestAnimationFrame(() => {
            append(
              html`
                <li
                  x-list="products"
                  id="f7g649f9"
                  data-price="19.99"
                  data-rating="4.2"
                >
                  <p>19.99</p>
                </li>
                <li
                  x-list="products"
                  id="k7s95jg7"
                  data-price="3.99"
                  data-rating="4.7"
                >
                  <p>3.99</p>
                </li>
              `,
              productList
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
        <select name="sortBy" id="sortInput" x-input>
          <option value="bestsellers">Bestsellers</option>
          <option value="priceLowToHigh" selected>Price (low - high)</option>
          <option value="priceHighToLow">Price (high - low)</option>
          <option value="rating">Rating</option>
        </select>
        <ul x-ref="productList">
          <li
            x-list="products"
            id="afd56erg"
            data-price="14.99"
            data-rating="4.2"
          >
            <p>14.99</p>
          </li>
          <li
            x-list="products"
            id="f8g7r6d"
            data-price="5"
            data-rating="4.7"
          >
            <p>5</p>
          </li>
          <button x-on="click:loadMore">load more</button>
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
        lists: {
          products: (state, products) => products.sort(sort[state.sortBy]),
        },
        middleware: {
          loadMore: (_, { refs: { productList }, append }) => {
            append(
              html`
                <li
                  x-list="products"
                  id="f7g649f9"
                  data-price="19.99"
                  data-rating="4.2"
                >
                  <p>19.99</p>
                </li>
                <li
                  x-list="products"
                  id="k7s95jg7"
                  data-price="3.99"
                  data-rating="4.7"
                >
                  <p>3.99</p>
                </li>
              `,
              productList
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

    $(`[x-on="click:loadMore"]`).click()

    await nextFrame()

    assert.deepEqual(prices(), [3.99, 5, 14.99, 19.99])
  })
})
