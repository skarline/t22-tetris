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

export type Action = "move" | "down" | "rotate" | "drop" | "hold"

export enum BlockType {
  Empty,
  J,
  I,
  L,
  O,
  S,
  T,
  Z
}

export type Tetromino = {
  blockType: BlockType
  schema: number[]
}

export interface Block {
  type: BlockType
}
