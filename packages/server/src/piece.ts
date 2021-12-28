import { BlockType, Tetromino, Block } from "./types"

export const Tetrominoes: Tetromino[] = [
  {
    blockType: BlockType.I,
    schema: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]
  },
  {
    blockType: BlockType.J,
    schema: [0, 0, 0, 0, 0, 1, 1, 1, 1]
  },
  {
    blockType: BlockType.L,
    schema: [0, 0, 0, 1, 1, 1, 1, 0, 0]
  },
  {
    blockType: BlockType.O,
    schema: [1, 1, 1, 1]
  },
  {
    blockType: BlockType.S,
    schema: [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0]
  },
  {
    blockType: BlockType.T,
    schema: [0, 1, 0, 1, 1, 1, 0, 0, 0]
  },
  {
    blockType: BlockType.Z,
    schema: [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]
  }
]

interface PieceBlock extends Block {
  x: number
  y: number
}

export default class Piece {
  constructor(
    public tetromino: Tetromino,
    public position: { x: number; y: number } = { x: 0, y: 0 },
    public rotation: number = 0
  ) {}

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
      const newY = y

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

  public size(): number {
    return Math.sqrt(this.tetromino.schema.length)
  }
}
