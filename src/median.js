export const Median = (callbacks) => {
  const subscribers = []
  return {
    subscribe(fn) {
      subscribers.push(fn)
    },
    publish(...args) {
      subscribers.forEach((fn) => fn(...args))
      callbacks.postPublish?.()
    },
  }
}
