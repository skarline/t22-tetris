interface WorkerConstructor {
  new (): Worker
}

type Callback = (data: any) => void

export interface Message {
  type: string
  data: any
}

export default class WorkerThread {
  private worker: Worker

  private subscribers: { [key: string]: Callback[] } = {}

  constructor(worker: WorkerConstructor) {
    this.worker = new worker()

    this.worker.onmessage = (event) => {
      const message = event.data as Message

      console.log("[WORKER]", message.type)

      if (!this.subscribers[message.type]) return

      for (const callback of this.subscribers[message.type]) {
        callback(message.data)
      }
    }
  }

  public post(type: string, data?: any): void {
    this.worker.postMessage({ type, data })
  }

  public on(type: string, callback: (data: any) => void): void {
    ;(this.subscribers[type] ??= []).push(callback)
  }
}
