import { Vector2 } from "../lib/math"
import Serializer from "../utils/serializer"
import Block from "./block"

export enum TetrominoSchemaElement {
  Empty = 0,
  Block
}

export type TetrominoSchema = TetrominoSchemaElement[]

export type Tetromino = {
  blockType: Block
  schema: TetrominoSchema
  offsetData: [number, number][][]
}

/**
 * Offset data for the Super Rotation System.
 * https://tetris.wiki/Super_Rotation_System
 */

type Offset = [number, number]

type OffsetData = Offset[][]

const JLSTZ_OFFSET_DATA: OffsetData = [
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2]
  ],
  [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ],
  [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2]
  ]
]

const I_OFFSET_DATA: OffsetData = [
  [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, 0],
    [2, 0]
  ],
  [
    [-1, 0],
    [0, 0],
    [0, 0],
    [0, 1],
    [0, -2]
  ],
  [
    [-1, 1],
    [1, 1],
    [-2, 1],
    [1, 0],
    [-2, 0]
  ],
  [
    [0, 1],
    [0, 1],
    [0, 1],
    [0, -1],
    [0, 2]
  ]
]

const O_OFFSET_DATA: OffsetData = [[[0, 0]], [[0, -1]], [[-1, -1]], [[-1, 0]]]

export const Tetrominoes: Tetromino[] = [
  {
    blockType: Block.I,
    schema: [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    offsetData: I_OFFSET_DATA
  },
  {
    blockType: Block.J,
    schema: [1, 0, 0, 1, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: Block.L,
    schema: [0, 0, 1, 1, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: Block.O,
    schema: [0, 1, 1, 0, 1, 1, 0, 0, 0],
    offsetData: O_OFFSET_DATA
  },
  {
    blockType: Block.S,
    schema: [0, 1, 1, 1, 1, 0, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: Block.T,
    schema: [0, 1, 0, 1, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: Block.Z,
    schema: [1, 1, 0, 0, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  }
]

export default class Piece {
  private _blocksPositions: Vector2[]

  constructor(
    public tetromino: Tetromino,
    public position: Vector2 = Vector2.ZERO,
    public rotation: number = 0
  ) {}

  public size(): number {
    return Math.sqrt(this.tetromino.schema.length)
  }

  private computeBlocksPositions(): Vector2[] {
    const positions: Vector2[] = []

    const schema = this.tetromino.schema

    for (let i = 0; i < schema.length; i++) {
      if (schema[i] === TetrominoSchemaElement.Empty) continue

      const x = i % this.size()
      const y = Math.floor(i / this.size())

      const rotated = new Vector2(x, y).rotate(this.rotation * Math.PI * -0.5)

      positions.push(rotated)
    }

    this._blocksPositions = positions

    return positions
  }

  public getBlocksPositions(): Vector2[] {
    return this._blocksPositions ?? this.computeBlocksPositions()
  }

  public moveTo(position: Vector2): void {
    this.position = position
  }

  public move(direction: Vector2): void {
    this.position = this.position.add(direction)
  }

  public rotate(direction: number): void {
    this.rotation = this.rotation + direction
    this.computeBlocksPositions()
  }

  public getTetrominoOffsets(direction: number): Vector2[] {
    const offsetData = this.tetromino.offsetData

    const curr = offsetData.at(this.rotation)
    const next = offsetData.at((this.rotation + direction) % 4)

    return curr.map(([x, y], i) => {
      const [nx, ny] = next?.[i] || [0, 0]

      return new Vector2(x - nx, y - ny)
    })
  }

  public serialize(): string {
    let matrix = Array(this.size() ** 2).fill(0)

    for (const block of this.getBlocksPositions()) {
      matrix[block.x + block.y * this.size()] = this.tetromino.blockType
    }

    console.log(Serializer.compressMatrix(matrix))

    return Serializer.compressMatrix(matrix)
  }
}
