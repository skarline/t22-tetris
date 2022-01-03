export interface ServerOptions {
  silent?: boolean
  seed?: number
  minBagItems?: number
  maxPlayers?: number
  countdown?: number
  fallSpeed?: number
  playfieldWidth?: number
  playfieldHeight?: number
}

export type Action =
  | "left"
  | "right"
  | "down"
  | "rotate-right"
  | "rotate-left"
  | "drop"
  | "hold"

export interface ActionEvent {
  id: string
  type: Action
}

export interface ServerDispatchEventMap {
  action: ActionEvent
}

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
