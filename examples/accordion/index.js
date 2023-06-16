import { define } from "/dynamo.js"

define("x-accordion", () => ({
  state: {
    openPanel: 0,
  },
  action: {
    togglePanel: (state, { index }) => ({
      ...state,
      openPanel: state.openPanel === index ? -1 : index,
    }),
  },
  elements: [
    {
      select: "button",
      attribute: (state, i) => ({
        id: `trigger_${i}`,
        ariaControls: `panel_${i}`,
        ariaExpanded: state.openPanel === i,
      }),
      on: {
        click: "togglePanel",
      },
    },
    {
      select: "[accordion-panel]",
      attribute: (state, i) => ({
        id: `panel_${i}`,
        ariaLabelledby: `trigger_${i}`,
        hidden: state.openPanel !== i,
      }),
    },
  ],
}))
