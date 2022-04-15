import { Match } from "@game/server"

import { Message } from "../threading"

let match = new Match()

match.bus.meddle((event, args) => {
  self.postMessage({ type: event, data: args })
})

self.addEventListener("message", (event: Message) => {
  const { type, data } = event.data

  if (type === "setup") {
    match.setup(data)
  } else {
    if (!match) {
      throw new Error("Match not set up")
    }

    match.bus.dispatch("@" + type, data)
  }
})
