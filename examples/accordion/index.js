import { Dynamo } from "/dynamo.js"

export const Accordion = (rootNode) =>
  Dynamo(rootNode, {
    state: {
      openPanel: 0,
    },
    action: {
      togglePanel: (state, { index }) => ({
        ...state,
        openPanel: state.openPanel === index ? -1 : index,
      }),
    },
    node: {
      trigger: (state, i) => ({
        id: `trigger_${i}`,
        ariaControls: `panel_${i}`,
        ariaExpanded: state.openPanel === i,
      }),
      panel: (state, i) => ({
        id: `panel_${i}`,
        ariaLabelledby: `trigger_${i}`,
        hidden: state.openPanel !== i,
      }),
    },
  })
