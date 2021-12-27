export default class Logger {
  constructor(public silent: boolean = false) {
    if (silent) {
      Logger.log = () => {}
    }
  }

  public static log(...args: any[]): void {
    console.log(...args)
  }
}
