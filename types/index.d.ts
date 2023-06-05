export = dynamo

export as namespace dynamo

declare namespace dynamo {
  function Dynamo(rootNode: HTMLElement, configuration: DynamoConfig): void

  type Primitive = string | boolean | number | null

  type SerialisableObject = { [key: string]: Primitive | SerialisableObject }

  type State = SerialisableObject

  type StateUpdateFunction = {
    (currentState: State, action: Action): State
  }

  type NodeProperties = {
    value?: Primitive
    textContent?: string
  }

  type NodeAttributes = {
    [key: string]: string | { [key: string]: boolean }
  }

  type NodeConfig = NodeAttributes & NodeProperties

  type NodeUpdateFunction = {
    (currentState: State): NodeConfig
  }

  type DynamoConfig = {
    state: SerialisableObject
    action: { [key: string]: StateUpdateFunction }
    node: { [key: string]: NodeUpdateFunction }
    middleware?: { [key: string]: MiddlewareFunction }
  }

  type ActionInput = {
    type: string
    payload: SerialisableObject
  }

  type Action = {
    type: string
    payload?: SerialisableObject
    event?: Event
  }

  type ActionHandler = {
    (currentState: State, action: Action): State
  }

  type Store = {
    getState(): State
    dispatch(action: ActionInput): void
  }

  type MiddlewareFunction = {
    /**
     * A function that intercepts an action before it reaches its ActionHandler (if any),
     * providing the opportunity to execute side effect(s),
     * re-route actions, and dispatch new actions
     */
    (action: ActionInput, store: Store): void
  }
}
