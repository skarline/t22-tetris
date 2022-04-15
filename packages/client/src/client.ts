import Thread from "./engine/threading"
import ServerWorker from "./engine/server?worker"

import "./engine/gui"

export default class Client {
  private threads = {
    server: new Thread(ServerWorker)
  }

  public getServerThread(): Thread {
    return this.threads.server
  }

  constructor() {
    const server = this.getServerThread()

    server.post("setup", {
      isHost: true,
      maxPlayers: 1,
      game: {
        countdown: 1
      }
    })

    server.post("player-join", {
      slot: 0
    })

    server.post("start")
  }
}
