export interface Callable {
  [key: string]: Function
}

export interface Subscriber {
  [key: string]: Callable
}

export default class EventBus {
  private subscribers: Subscriber = {}

  public dispatch<T>(event: string, arg?: T): void {
    const subscriber = this.subscribers[event]

    if (!subscriber) return

    Object.keys(subscriber).forEach((key) => subscriber[key](arg))
  }

  public subscribe(event: string, callback: Function): void {
    const id = this.idGenerator().next().value

    if (!this.subscribers[event]) this.subscribers[event] = {}

    this.subscribers[event][id] = callback
  }

  private *idGenerator(): Generator<number> {
    let id = 0

    while (true) yield id++
  }
}
