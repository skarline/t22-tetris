import * as PIXI from "pixi.js"

import Piece from "t22-server/src/engine/piece"

import Config from "./config"

const BlockColors = [
  0x000000, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
  0xffffff, 0xff8800
]

export default class Playfield {
  public container = new PIXI.Container()

  private matrix = new PIXI.Container()
  private activePiece?: PIXI.Container

  constructor(private matrixWidth: number, private matrixHeight: number) {
    const { container, matrix } = this

    container.width = Config.styles.playfieldWidth
    container.height = Config.styles.playfieldHeight

    matrix.width = this.matrixWidth * Config.styles.blockSize
    matrix.height = this.matrixHeight * Config.styles.blockSize

    container.addChild(matrix)
  }

  public setActivePiece(piece: Piece): void {
    this.activePiece?.destroy()

    this.activePiece = this.createPiece(piece)

    this.matrix.addChild(this.activePiece)
  }

  public movePiece(position: { x: number; y: number }): void {
    if (!this.activePiece) return

    const { x, y } = this.getPositionInMatrix(position.x, position.y)

    this.activePiece.x = x
    this.activePiece.y = y
  }

  public lockPiece(piece: Piece): void {
    this.activePiece?.destroy()

    for (const block of piece.getBlocks()) {
      const blockSprite = this.getBlockSprite(piece.tetromino.blockType)

      const { x, y } = this.getPositionInMatrix(
        block.x + piece.position.x,
        block.y + piece.position.y
      )

      blockSprite.x = x
      blockSprite.y = y

      this.matrix.addChild(blockSprite)
    }
  }

  public clearLines(lines: number[]): void {
    console.log(lines) // TODO
  }

  private getPositionInMatrix(x: number, y: number): { x: number; y: number } {
    return {
      x: x * Config.styles.blockSize,
      y: (y - this.matrixHeight) * Config.styles.blockSize
    }
  }

  private getBlockSprite(type: number): PIXI.Sprite {
    const blockSprite = new PIXI.Sprite(PIXI.Texture.WHITE)

    blockSprite.tint = BlockColors[type]

    blockSprite.width = Config.styles.blockSize
    blockSprite.height = Config.styles.blockSize

    return blockSprite
  }

  private createPiece(piece: Piece): PIXI.Container {
    const container = new PIXI.Container()

    const { blockSize } = Config.styles

    for (const block of piece.getBlocks()) {
      const blockSprite = this.getBlockSprite(piece.tetromino.blockType)

      blockSprite.x = block.x * blockSize
      blockSprite.y = block.y * blockSize

      container.addChild(blockSprite)
    }

    const { x, y } = this.getPositionInMatrix(
      piece.position.x,
      piece.position.y
    )

    container.x = x
    container.y = y

    return container
  }
}
