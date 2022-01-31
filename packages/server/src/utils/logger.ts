export default class Logger {
  public static silent: boolean = false

  public static log(...args: any[]): void {
    if (Logger.silent) return

    console.log(...args)
  }
}
