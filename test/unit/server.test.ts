import Server from "t22-server"

describe("Server", () => {
  it("should create a new server", () => {
    const server = new Server()

    expect(server).toBeDefined()
  })

  it("should let players join and leave", () => {
    const server = new Server()

    server.addPlayer("1")
    server.addPlayer("2")
    server.addPlayer("3")

    server.removePlayer("1")

    expect(server.getPlayers().size).toBe(2)
  })

  it("should not let players join if the server is full", () => {
    const server = new Server({
      maxPlayers: 3
    })

    server.addPlayer()
    server.addPlayer()
    server.addPlayer()

    expect(() => {
      server.addPlayer()
    }).toThrowError()
  })

  it("should not let players join twice", () => {
    const server = new Server()

    expect(() => {
      server.addPlayer("1")
      server.addPlayer("1")
    }).toThrowError()
  })

  it("should not let players leave twice", () => {
    const server = new Server()

    server.addPlayer("1")
    server.addPlayer("2")
    server.addPlayer("3")

    expect(() => {
      server.removePlayer("1")
      server.removePlayer("1")
    }).toThrowError()
  })

  it("should not start a game if there are no players", () => {
    const server = new Server()

    expect(() => {
      server.start()
    }).toThrowError()
  })
})
