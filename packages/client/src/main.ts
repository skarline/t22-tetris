import Server from "t22-server"

const local = new Server({
  silent: false,
  countdown: 1
})

const player = local.addPlayer()

document.addEventListener("keydown", (event) => {
  const { id } = player

  switch (event.key) {
    case "ArrowLeft":
      local.dispatch("action", { id, type: "left" })
      break
    case "ArrowRight":
      local.dispatch("action", { id, type: "right" })
      break
    case "ArrowDown":
      local.dispatch("action", { id, type: "down" })
      break
    case "ArrowUp":
      local.dispatch("action", { id, type: "rotate-right" })
      break
    case " ":
      local.dispatch("action", { id, type: "drop" })
      break
    case "Shift":
      local.dispatch("action", { id, type: "hold" })
      break
  }
})

local.start()
