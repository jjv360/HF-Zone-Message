//
// Entry point for the script

import LocalEntity from './LocalEntity'
import { View, Label, ImageView, animate } from 'hf-ui'

/** This is the entity class for the entity this script is attached to. */
export default class MyEntity extends LocalEntity {

    preload(id) {
        super.preload(id)

        // Check if the user is in this zone
        var zoneProps = this.getProperties(["position", "dimensions"])
        if (MyAvatar.position.x > zoneProps.position.x - zoneProps.dimensions.x/2 && MyAvatar.position.x < zoneProps.position.x + zoneProps.dimensions.x/2
         && MyAvatar.position.y > zoneProps.position.y - zoneProps.dimensions.y/2 && MyAvatar.position.y < zoneProps.position.y + zoneProps.dimensions.y/2
         && MyAvatar.position.z > zoneProps.position.z - zoneProps.dimensions.z/2 && MyAvatar.position.z < zoneProps.position.z + zoneProps.dimensions.z/2) {

            // We are already inside the entity, trigger event
            this.enterEntity(this.id)

        }

    }

    /** Called when the script is unloaded */
    unload() {
        super.unload()

        // Remove all overlays
        this.overlay.remove()

    }

    /** Called when user enters an entity */
    enterEntity(id) {

        // Check if ours
        if (id != this.id)
            return

        // Show overlay if there's a message
        this.showOverlayIfNeeded()

    }

    /** Called when user leaves an entity */
    leaveEntity(id) {

        // Check if ours
        if (id != this.id)
            return

        // Remove overlay
        this.removeOverlay()

    }

    /** Fethes the current zone message, and shows the overlay */
    showOverlayIfNeeded() {

        // Stop if already created overlay
        if (this.overlay)
            return

        // Get entity properties
        var info = this.getUserData("com.jjv360.hf-zone-alert.current")
        if (!info)
            return this.removeOverlay()

        // Get alert information
        var icon = info.icon
        var title = info.title
        var text = info.text
        var footer = info.footer

        // Replace built-in icons with their URLs NOTE: These images are from flaticon.com
        if (icon == "info")
            icon = require("./info.png")
        else if (icon == "question")
            icon = require("./question.png")
        else if (icon == "warning")
            icon = require("./warning.png")
        else if (icon == "error")
            icon = require("./error.png")

        // Create overlay
        console.log("[Zone Alert] Fetching message...")
        this.overlay = new View()
        this.overlay.x = -400
        this.overlay.y = 100
        this.overlay.width = 400
        this.overlay.height = 100
        this.overlay.alpha = 0
        this.overlay.backgroundAlpha = 0.75
        this.overlay.backgroundColor = { red: 0, green: 0, blue: 10 }
        this.overlay.show()

        // Create icon
        this.icon = new ImageView()
        this.icon.x = 10
        this.icon.y = 10
        this.icon.width = 32
        this.icon.height = 32
        this.icon.imageURL = icon
        this.overlay.addSubview(this.icon)

        // Create title label
        this.title = new Label()
        this.title.x = 10 + 32 + 10
        this.title.y = 10
        this.title.width = this.overlay.width - 10 - 32 - 10
        this.title.height = 20
        this.title.color = { red: 255, green: 255, blue: 255 }
        this.title.font = { size: 17 }
        this.title.text = title
        this.overlay.addSubview(this.title)

        // Create subtitle label
        this.subtitle = new Label()
        this.subtitle.x = 10 + 32 + 10
        this.subtitle.y = this.title.y + this.title.height + 10
        this.subtitle.width = this.overlay.width - 10 - 32 - 10
        this.subtitle.height = text.split("\n").length * 18
        this.subtitle.color = { red: 200, green: 200, blue: 200 }
        this.subtitle.font = { size: 13 }
        this.subtitle.text = text
        this.overlay.addSubview(this.subtitle)

        // Create footer view
        this.footer = new Label()
        this.footer.x = 0
        this.footer.y = this.subtitle.y + this.subtitle.height + 10
        this.footer.width = this.overlay.width
        this.footer.height = footer ? 24 : 0
        this.footer.color = { red: 100, green: 100, blue: 100 }
        this.footer.font = { size: 11 }
        this.footer.text = footer
        this.footer.topMargin = 5
        this.footer.leftMargin = 10
        this.footer.backgroundAlpha = 0.5
        this.footer.backgroundColor = { red: 0, green: 0, blue: 0 }
        this.overlay.addSubview(this.footer)

        // Set overlay size
        this.overlay.height = this.footer.y + this.footer.height

        // Animate in
        // animate(this.overlay, { alpha: 1, x: 20 })
        this.overlay.alpha = 1
        this.overlay.x = 20

    }

    /** Removes any overlay */
    removeOverlay() {

        // Stop if overlay has been removed already
        if (!this.overlay)
            return

        console.log("[Zone Alert] Removing overlay...")
        this.overlay.remove()
        this.overlay = null

    }

}
