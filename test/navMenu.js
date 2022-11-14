import { define } from "../src/index.js"

describe("navigation menu enhancement", () => {
  it("binds click event and manages classes", async () => {
    const tagName = createName()

    mount(html`
    <style>

        .hamburger {
            transform: translate(-100%, 0);
            transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0);
        }

        .hamburger.open {
            transform: translate(0, 0);
        }

    </style>
      <${tagName}>
        <button x-onclick="toggleMenu">[=]</button>
        <nav x-class="navClasses">
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
        update: {
          toggleMenu: (state) => {
            return {
              ...state,
              menuIsOpen: !state.menuIsOpen,
            }
          },
        },
        getState(state) {
          const navClasses = {
            hamburger: true,
            open: state.menuIsOpen,
          }
          return {
            ...state,
            navClasses,
          }
        },
      }
    })

    assert.ok($("nav").classList.contains("hamburger"))
    assert.notOk($("nav").classList.contains("open"))

    $(`[x-onclick]`).click()

    await nextFrame()

    assert.ok($("nav").classList.contains("open"))
  })
})
