export default class Vector2 {
  public static ZERO = new Vector2(0, 0)
  public static LEFT = new Vector2(-1, 0)
  public static RIGHT = new Vector2(1, 0)
  public static UP = new Vector2(0, -1)
  public static DOWN = new Vector2(0, 1)

  constructor(public readonly x: number = 0, public readonly y: number = 0) {}

  public add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y)
  }

  public subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y)
  }

  public multiply(vector: Vector2): Vector2 {
    return new Vector2(this.x * vector.x, this.y * vector.y)
  }

  public divide(vector: Vector2): Vector2 {
    return new Vector2(this.x / vector.x, this.y / vector.y)
  }

  public rotate(degrees: number): Vector2 {
    return new Vector2(
      this.x * Math.cos(degrees) - this.y * Math.sin(degrees),
      this.x * Math.sin(degrees) + this.y * Math.cos(degrees)
    )
  }

  public copy(): Vector2 {
    return new Vector2(this.x, this.y)
  }
}
