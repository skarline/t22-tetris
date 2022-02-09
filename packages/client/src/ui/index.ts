import * as PIXI from "pixi.js"

import Server, {
  PlayerJoinEvent,
  PieceMoveEvent,
  PieceLockEvent,
  NextPieceEvent
} from "t22-server"

import Playfield from "./playfield"

import Config from "./config"

export default class UI {
  private server!: Server

  private app: PIXI.Application
  private game: PIXI.Container

  private playfields: Playfield[] = []

  constructor(server: Server) {
    this.connect(server)

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x000000
    })

    window.addEventListener("resize", () => this.handleResize())

    this.game = new PIXI.Container()
    this.app.stage.addChild(this.game)

    document.body.appendChild(this.app.view)

    this.setupPlayfields()
    this.updateScale()
  }

  public connect(server: Server): void {
    this.server = server

    server.events.subscribe("player-joined", this.onPlayerJoined.bind(this))
    server.events.subscribe("next-piece", this.onNextPiece.bind(this))
    server.events.subscribe("piece-move", this.onPieceMove.bind(this))
    server.events.subscribe("piece-lock", this.onPieceLock.bind(this))
  }

  private updateScale(): void {
    const { playfieldWidth, playfieldHeight, safeZone, gap } = Config.styles

    const outterMargin = safeZone * 2

    const contentWidth = (playfieldWidth + gap) * this.playfields.length
    const contentHeight = playfieldHeight

    // Compute scale
    const scale = Math.min(
      window.innerWidth / (contentWidth + outterMargin),
      window.innerHeight / (contentHeight + outterMargin),
      1
    )

    this.game.scale.set(scale)

    // Center
    this.game.x = (window.innerWidth - contentWidth * scale) / 2
    this.game.y = (window.innerHeight - contentHeight * scale) / 2
  }

  private handleResize(): void {
    this.app.renderer.resize(window.innerWidth, window.innerHeight)

    this.updateScale()
  }

  private setupPlayfields(): void {
    const { maxPlayers, matrixWidth, matrixHeight } = this.server.options

    for (let i = 0; i < maxPlayers; i++) {
      const playfield = new Playfield(matrixWidth, matrixHeight)

      this.playfields.push(playfield)

      playfield.container.x =
        i * (Config.styles.playfieldWidth + Config.styles.gap)

      this.game.addChild(playfield.container)
    }
  }

  private onPlayerJoined(event: PlayerJoinEvent): void {
    console.log(event)
  }

  private onNextPiece(event: NextPieceEvent): void {
    this.playfields[event.slot].setActivePiece(event.piece)
  }

  private onPieceMove(event: PieceMoveEvent): void {
    this.playfields[event.slot].movePiece(event.position)
  }

  private onPieceLock(event: PieceLockEvent): void {
    const playfield = this.playfields[event.slot]

    playfield.lockPiece(event.piece)

    if (event.clearedLines.length) playfield.clearLines(event.clearedLines)
  }
}
