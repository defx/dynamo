const isWhitespace = (node) => {
  return node.nodeType === node.TEXT_NODE && node.nodeValue.trim() === ""
};

const walk = (node, callback, deep = true) => {
  if (!node) return

  if (!isWhitespace(node)) {
    let v = callback(node);
    if (v === false) return
    if (v?.nodeName) return walk(v, callback, deep)
  }
  if (deep) walk(node.firstChild, callback, deep);
  walk(node.nextSibling, callback, deep);
};

const serializable = (o) => JSON.parse(JSON.stringify(o));

function cast(v) {
  return isNaN(v) ? v : +v
}

function castAll(o) {
  return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, cast(v)]))
}

const isPrimitive = (v) => v === null || typeof v !== "object";

function xInput$1(node, state = {}) {
  let k = node.getAttribute("name");
  if (!k) return state
  let v = cast(node.value);
  state[k] = v;
}

function xList$1(node, state = {}) {
  let k = node.getAttribute("x-each");
  if (!k) return state

  state[k] = state[k] || [];
  state[k].push({
    id: node.id,
    ...castAll(node.dataset),
  });
}

const pascalToKebab = (string) =>
  string.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + "-" + m[1].toLowerCase()
  });

const kebabToPascal = (string) =>
  string.replace(/[\w]-([\w])/g, function (m) {
    return m[0] + m[2].toUpperCase()
  });

const objectToClasses = (v = {}) => {
  return Object.entries(v)
    .reduce((c, [k, v]) => {
      if (v) c.push(k);
      return c
    }, [])
    .join(" ")
};

const write = (node, attrs) => {
  for (let [k, v] of Object.entries(attrs || {})) {
    k = pascalToKebab(k);

    if (k === "class") {
      v = objectToClasses(v);
    }

    if (typeof v === "boolean") {
      if (k.startsWith("aria-")) {
        v = "" + v;
      } else if (v) {
        v = "";
      }
    }

    if (isPrimitive(v) === false) {
      // NB: trying to set dataset this way will error, but that's not something i currently want to support
      node[kebabToPascal(k)] = v;
    }

    let current = node.getAttribute(k);

    if (v === current) continue

    if (typeof v === "string" || typeof v === "number") {
      node.setAttribute(k, v);
    } else {
      node.removeAttribute(k);
    }
  }
  return node
};

// @todo: understand what happens when there's no node.id

function listSync(nodes, curr, next, template) {
  // check if anything has changed
  const currIds = curr.map(({ id }) => id);
  const nextIds = next.map(({ id }) => id);

  if (currIds.toString() === nextIds.toString()) return

  // removals
  curr
    .filter((c) => {
      return next.find((n) => c.id === n.id) === false
    })
    .forEach(({ id }) => nodes.find((node) => node.id === id)?.remove());

  const [first, ...rest] = next;

  let t = nodes.find((node) => node.id === first.id);

  // @todo: check if template is required + present

  if (!t) {
    t = nodeFromString(template(first));
    nodes[0].before(t);
  }

  rest.forEach((d) => {
    let node =
      nodes.find((node) => node.id === d.id) || nodeFromString(template(d));

    if (node) {
      if (t.nextElementSibling !== node) {
        // is t.after already a no-op in this case?
        t.after(node);
      }
      t = node;
    }
  });
}

function apply(o, node) {
  Object.entries(o).forEach(([k, v]) => {
    switch (k) {
      case "class": {
        node.setAttribute("class", objectToClasses(v));
        break
      }
      case "style": {
        break
      }
      case "textContent": {
        node.textContent = v;
        break
      }
      default: {
        write(node, { [k]: v });
        break
      }
    }
  });
}

function xNode(rootNode, node, subscribe) {
  const callback = (state, config) => {
    let k = node.getAttribute("x-node");

    let index;

    const collection = [...rootNode.querySelectorAll(`[x-node="${k}"]`)];
    index = collection.findIndex((n) => n === node);

    const fn = config.node?.[k];

    if (!fn) return

    const props = fn(state, index);

    apply(props, node);
  };
  subscribe(callback);
}

function xList(k, parentNode, subscribe) {
  subscribe((state) => {
    const listNodes = [...parentNode.querySelectorAll(`[x-each="${k}"]`)];
    const listData = listNodes.map((node) => ({
      id: node.id,
      ...castAll(node.dataset),
    }));

    listSync(listNodes, listData, state[k]);
  });
}

const xInput = (node, dispatch) => {
  const name = node.getAttribute(`name`);

  if (!name) {
    console.warn(`Missing name attribute on x-control`, node);
    return
  }

  node.addEventListener("input", () => {
    let value =
      node.getAttribute("type") === "checkbox" ? node.checked : node.value;

    if (value.trim?.().length && !isNaN(value)) value = +value;

    dispatch({
      type: "MERGE",
      payload: {
        [name]: value,
      },
    });
  });
};

const xOn = (rootNode, node, dispatch) => {
  const attrValue = node.getAttribute("x-on");
  const [eventType, k] = attrValue.split(":").map((v) => v.trim());

  node.addEventListener(eventType, (event) => {
    event.stopPropagation();

    let index;
    let type = k;

    const collection = [...rootNode.querySelectorAll(`[x-on="${attrValue}"]`)];
    index = collection.findIndex((n) => n === node);

    const action = {
      type,
      event,
      index,
    };

    if (eventType === "submit" && node.nodeName === "FORM") {
      action.payload = Object.fromEntries(new FormData(node));
    }

    dispatch(action);
  });
};

/* skip any custom elements  */
const cwalk = (node, callback) => {
  callback(node);
  walk(node.firstChild, (node) => {
    if (node.nodeName.includes("-")) {
      return node.nextSibling || node.parentNode.nextSibling
    }
    callback(node);
  });
};

function initialise(rootNode, subscribe, dispatch) {
  const state = {};
  const listKeys = {};

  cwalk(rootNode, (node) => {
    const listKey = node.getAttribute?.("x-each");
    if (listKey && !(listKey in listKeys)) {
      // @todo list updates should be registered on the parent as items can be removed
      xList(listKey, node.parentNode, subscribe);
      xList$1(node, state);
    }
    if (node.hasAttribute?.("x-control")) {
      xInput$1(node, state);
      xInput(node, dispatch);
    }
    if (node.hasAttribute?.("x-on")) {
      xOn(rootNode, node, dispatch);
    }
    if (node.hasAttribute?.("x-node")) {
      xNode(rootNode, node, subscribe);
    }
  });

  return state
}

function Store({
  action: actionHandlers = {},
  middleware = [],
  getState: getStateWrapper = (v) => v,
  onChangeCallback,
  api = {},
}) {
  let state;

  function transition(o) {
    state = getStateWrapper({ ...o });

    onChangeCallback(getState());
  }

  function getState() {
    return { ...state }
  }

  function dispatch(_action) {
    const { type, payload = {}, event, index } = _action;
    const action = { type, payload: serializable(payload), event, index };

    if (type === "MERGE") {
      transition({
        ...getState(),
        ...action.payload,
      });
      return
    }

    if (action.type in middleware) {
      middleware[action.type]?.(action, {
        getState,
        dispatch,
        ...api,
      });
      return
    }

    if (action.type in actionHandlers) {
      const x = actionHandlers[action.type](getState(), action);
      transition({ ...state, ...x });
    }
  }

  return {
    dispatch, // dispatch an action to the reducers
    getState, // optionally provide a wrapper function to derive additional properties in state
    setState: transition,
    ...api,
  }
}

const Message = (callbacks) => {
  const subscribers = [];
  return {
    subscribe(fn) {
      subscribers.push(fn);
    },
    publish(...args) {
      subscribers.forEach((fn) => fn(...args));
      callbacks.postPublish?.();
    },
  }
};

const Dynamo = (node, config) => {
  let nextTickSubscribers = [];

  const api = {
    nextTick: (fn) => nextTickSubscribers.push(fn),
  };

  const message = Message({
    postPublish: () => {
      nextTickSubscribers.forEach((fn) => fn(state));
      nextTickSubscribers = [];
    },
  });

  const { dispatch, getState, setState } = Store({
    ...config,
    api,
    onChangeCallback: (state) => message.publish(state, config),
  });

  const initialState = initialise(node, message.subscribe, dispatch);

  const store = {
    dispatch,
    getState,
    ...api,
  };

  setState({
    ...initialState,
    ...((state) => (typeof state === "function" ? state(initialState) : state))(
      config.state || {}
    ),
  });

  return store
};

const $ = Dynamo;

export { $, Dynamo };
