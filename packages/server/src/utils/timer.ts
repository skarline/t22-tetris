export default class Timer {
  private timeout?: ReturnType<typeof setTimeout>

  private nextExpectedTime: number

  public isRunning(): boolean {
    return this.timeout !== undefined
  }

  constructor(
    public callback: () => void,
    public interval: number,
    public oneShot = false
  ) {}

  public start(time: number = this.interval): void {
    this.stop()

    this.nextExpectedTime = Date.now() + time

    if (time > 0) {
      this.timeout = setTimeout(() => this.step(), time)
    } else this.step()
  }

  public stop(): void {
    clearTimeout(this.timeout)
    this.timeout = undefined
  }

  private step(): void {
    new Promise(this.callback)

    if (this.oneShot) this.stop()
    else if (this.isRunning) {
      let drift = Date.now() - this.nextExpectedTime

      this.nextExpectedTime += this.interval

      this.timeout = setTimeout(() => this.step(), this.interval - drift)
    }
  }
}
