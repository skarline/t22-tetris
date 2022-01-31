import * as PIXI from "pixi.js"

export default class UI {
  private app: PIXI.Application

  private game: PIXI.Container

  constructor() {
    this.app = new PIXI.Application({
      width: 300,
      height: 300,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1
    })

    this.game = new PIXI.Container()
    this.app.stage.addChild(this.game)

    document.body.appendChild(this.app.view)
  }
}
