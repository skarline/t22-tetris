export enum BlockType {
  Empty,
  Garbage,
  J,
  I,
  L,
  O,
  S,
  T,
  Z
}

export enum TetrominoSchemaElement {
  Empty,
  Block
}

export type TetrominoSchema = TetrominoSchemaElement[]

export type Tetromino = {
  blockType: BlockType
  schema: TetrominoSchema
  offsetData: [number, number][][]
}
