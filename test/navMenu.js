import { define } from "../src/index.js"

describe("navigation menu enhancement", () => {
  it("binds click event and manages classes", async () => {
    const tagName = createName()

    mount(html`
    <style>

        .hamburger {
            transform: translate(-100%, 0);
            transition: transform 0.5s ease-in-out;
        }

        .hamburger.open {
            transform: translate(0, 0);
        }

    </style>
      <${tagName}>
        <button x-on="click:toggleMenu">[=]</button>
        <nav x-class="nav">
            <ul>
                <li>New In</li>
                <li>Bestsellers</li>
                <li>Skincare</li>
                <li>Makeup</li>
            </ul>
        </nav>
      </${tagName}>
    `)

    define(tagName, () => {
      return {
        state: {
          menuIsOpen: false,
        },
        classes: {
          nav: (state, classes) => {
            return {
              ...classes,
              hamburger: true,
              open: state.menuIsOpen,
            }
          },
        },
        update: {
          toggleMenu: (state) => {
            return {
              ...state,
              menuIsOpen: !state.menuIsOpen,
            }
          },
        },
      }
    })

    assert.ok($("nav").classList.contains("hamburger"))
    assert.notOk($("nav").classList.contains("open"))

    $(`[x-on="click:toggleMenu"]`).click()

    await nextFrame()

    assert.ok($("nav").classList.contains("open"))
  })
})
