import { BlockType, Tetromino, Block } from "./types"

/**
 * Offset data for the Super Rotation System.
 * https://tetris.wiki/Super_Rotation_System
 */

type Offset = [number, number]

type OffsetData = Offset[][]

const defaultOffsetData: OffsetData = [
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

const iOffsetData: OffsetData = [
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

const oOffsetData: OffsetData = [[[0, 0]], [[0, -1]], [[-1, -1]], [[-1, 0]]]

export const Tetrominoes: Tetromino[] = [
  {
    blockType: BlockType.I,
    schema: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    offsetData: iOffsetData
  },
  {
    blockType: BlockType.J,
    schema: [1, 0, 0, 1, 1, 1, 0, 0, 0],
    offsetData: defaultOffsetData
  },
  {
    blockType: BlockType.L,
    schema: [0, 0, 1, 1, 1, 1, 0, 0, 0],
    offsetData: defaultOffsetData
  },
  {
    blockType: BlockType.O,
    schema: [0, 1, 1, 0, 1, 1, 0, 0, 0],
    offsetData: oOffsetData
  },
  {
    blockType: BlockType.S,
    schema: [0, 1, 1, 1, 1, 0, 0, 0, 0],
    offsetData: defaultOffsetData
  },
  {
    blockType: BlockType.T,
    schema: [0, 1, 0, 1, 1, 1, 0, 0, 0],
    offsetData: defaultOffsetData
  },
  {
    blockType: BlockType.Z,
    schema: [1, 1, 0, 0, 1, 1, 0, 0, 0],
    offsetData: defaultOffsetData
  }
]

interface PieceBlock extends Block {
  x: number
  y: number
}

export default class Piece {
  constructor(
    public tetromino: Tetromino,
    private _position: { x: number; y: number } = { x: 0, y: 0 },
    public rotation: number = 0
  ) {}

  get position() {
    return this._position
  }

  /**
   * Returns the schema of the piece at the current rotation
   */
  public getSchema(): number[] {
    const schema = this.tetromino.schema

    if (this.rotation === 0) return schema

    const rotatedSchema: number[] = []

    const size = this.size()

    for (let i = 0; i < schema.length; i++) {
      const x = i % size
      const y = Math.floor(i / size)

      const newX = x * -1 + (size - 1)
      const newY = y * -1 + (size - 1)

      const newIndex = newY * size + newX

      rotatedSchema[newIndex] = schema[i]
    }

    return rotatedSchema
  }

  public getBlocks(): PieceBlock[] {
    const schema = this.getSchema()

    const blocks: PieceBlock[] = []

    const size = this.size()

    for (let i = 0; i < schema.length; i++) {
      const x = i % size
      const y = Math.floor(i / size)

      if (schema[i]) blocks.push({ type: this.tetromino.blockType, x, y })
    }

    return blocks
  }

  public moveTo(x: number, y: number): void {
    this._position = { x, y }
  }

  public move(x: number, y: number): void {
    this._position.x += x
    this._position.y += y
  }

  public rotate(direction: number): void {
    this.rotation = this.rotation + direction
  }

  public size(): number {
    return Math.sqrt(this.tetromino.schema.length)
  }

  public getRotationOffsets(direction: number): Offset[] {
    const offsetData = this.tetromino.offsetData

    const curr = offsetData.at(this.rotation)
    const next = offsetData.at(this.rotation + direction)

    return curr.map(([x, y], i) => {
      const [nx, ny] = next[i]

      return [x - nx, y - ny]
    })
  }
}
