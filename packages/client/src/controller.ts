import Server, { ActionPressedEvent, ActionReleasedEvent } from "t22-server"

type InputMap = {
  [key: string]: {
    slot: number
    action: string
  }
}

export default class Controller {
  private pressedKeys: { [key: string]: boolean } = {}

  private inputMap: InputMap = {
    ARROWLEFT: {
      slot: 0,
      action: "move-left"
    },
    ARROWRIGHT: {
      slot: 0,
      action: "move-right"
    },
    ARROWDOWN: {
      slot: 0,
      action: "soft-drop"
    },
    Z: {
      slot: 0,
      action: "rotate-left"
    },
    X: {
      slot: 0,
      action: "rotate-right"
    }
  }

  constructor(private server: Server) {
    window.addEventListener("keydown", this.onKeyDown.bind(this))
    window.addEventListener("keyup", this.onKeyUp.bind(this))
  }

  private onKeyDown(event: KeyboardEvent): void {
    const key = event.key.toUpperCase()

    if (this.pressedKeys[key]) return

    this.pressedKeys[key] = true

    const input = this.inputMap[key]

    if (input) {
      this.server.events.dispatch<ActionPressedEvent>("action-pressed", {
        ...input
      })
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    const key = event.key.toUpperCase()

    this.pressedKeys[key] = false

    const input = this.inputMap[key]

    if (input) {
      this.server.events.dispatch<ActionReleasedEvent>("action-released", {
        ...input
      })
    }
  }
}
