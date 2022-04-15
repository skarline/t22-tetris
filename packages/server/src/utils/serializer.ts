import Block from "../engine/block"

/*
 * For the matrix compression, we are going to use a simple
 * algorithm to group sequential blocks of the same type:
 *
 * - Letters starting from 'a' will represent each block (0 for empty, 1-... for rest
 *   of the blocks)
 *
 * - Followed by a number representing the number of times the block is repeated
 *   in the sequence.
 */

export default class Serializer {
  public static compressMatrix(blocks: Block[]): string {
    let compressed = ""

    const groups: Block[][] = []

    let currentGroup: Block[] = []

    for (let i = 0; i < blocks.length; i++) {
      const curr = blocks[i]
      const next = blocks[i + 1]

      currentGroup.push(curr)

      if (curr !== next) {
        groups.push(currentGroup)
        currentGroup = []
      }
    }

    for (const group of groups) {
      const block = group[0]
      const count = group.length

      compressed += String.fromCharCode(block + 97)

      console.log(block, compressed)

      if (count > 1) compressed += count.toString()
    }

    return compressed
  }

  public static uncompressMatrix(string: string): Block[] {
    let blocks: Block[] = []

    const regex = new RegExp(/([a-z])(\d*)/g)
    const matches = string.match(regex)

    if (!matches) throw new Error("Invalid matrix notation")

    for (const match of matches) {
      const block = match[0].charCodeAt(0) - 97
      const count = match[1] ? +match.slice(1) : 1

      blocks.push(...Array(count).fill(block))
    }

    return blocks
  }
}
