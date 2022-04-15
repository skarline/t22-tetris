type Subscriber = (data: any) => void
type Meddler = (event: string, args?: any) => void

export default class EventBus {
  private subscribers: { [key: string]: Subscriber[] } = {}
  private meddlers: Meddler[] = []

  /**
   * Dispatch an event to all subscribers and meddlers
   * @param event event name
   * @param args arguments
   */
  public post<T>(event: string, args?: T): void {
    for (const meddler of this.meddlers) {
      meddler(event, args)
    }

    this.dispatch(event, args)
  }

  /**
   * Dispatch an event to all subscribers
   * @param event event name
   * @param args arguments
   */
  public dispatch<T>(event: string, args?: T): void {
    const subscribers = this.subscribers[event]

    if (subscribers) {
      for (const key in subscribers) {
        subscribers[key](args)
      }
    }
  }

  /**
   * Subscribe to an event
   * @param event event name
   * @param callback
   */
  public on(event: string, callback: Subscriber): void {
    ;(this.subscribers[event] ??= []).push(callback)
  }

  /**
   * Intercept all posted events
   * @param callback
   */
  public meddle(callback: Meddler): void {
    this.meddlers.push(callback)
  }
}
