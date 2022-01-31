import { BlockType, Tetromino, TetrominoSchemaElement } from "./types"

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
    blockType: BlockType.I,
    schema: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    offsetData: I_OFFSET_DATA
  },
  {
    blockType: BlockType.J,
    schema: [1, 0, 0, 1, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: BlockType.L,
    schema: [0, 0, 1, 1, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: BlockType.O,
    schema: [0, 1, 1, 0, 1, 1, 0, 0, 0],
    offsetData: O_OFFSET_DATA
  },
  {
    blockType: BlockType.S,
    schema: [0, 1, 1, 1, 1, 0, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: BlockType.T,
    schema: [0, 1, 0, 1, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  },
  {
    blockType: BlockType.Z,
    schema: [1, 1, 0, 0, 1, 1, 0, 0, 0],
    offsetData: JLSTZ_OFFSET_DATA
  }
]

interface Block {
  x: number
  y: number
}

export default class Piece {
  constructor(
    public tetromino: Tetromino,
    public position: { x: number; y: number } = { x: 0, y: 0 },
    public rotation: number = 0
  ) {}

  get size(): number {
    return Math.sqrt(this.tetromino.schema.length)
  }

  public getBlocks(): Block[] {
    const { size, rotation } = this

    const schema = this.tetromino.schema

    const blocks: Block[] = []

    for (let i = 0; i < schema.length; i++) {
      if (schema[i] === TetrominoSchemaElement.Empty) continue

      const px = i % size
      const py = Math.floor(i / size)

      const [x, y] = this.rotateAxes(px, py, rotation)

      blocks.push({ x, y })
    }

    return blocks
  }

  private rotateAxes(x: number, y: number, rotation: number): [number, number] {
    if (rotation === 1) return [y, -x]
    if (rotation === 2) return [-x, -y]
    if (rotation === 3) return [-y, x]

    return [x, y]
  }

  public moveTo(x: number, y: number): void {
    this.position = { x, y }
  }

  public move(x: number, y: number): void {
    this.position.x += x
    this.position.y += y
  }

  public rotate(direction: number): void {
    this.rotation = (((this.rotation + direction) % 4) + 4) % 4
  }

  public getRotationOffsets(direction: number): Offset[] {
    const offsetData = this.tetromino.offsetData

    const curr = offsetData.at(this.rotation)
    const next = offsetData.at((this.rotation + direction) % 4)

    return curr.map(([x, y], i) => {
      const [nx, ny] = next?.[i] || [0, 0]

      return [x - nx, y - ny]
    })
  }
}
