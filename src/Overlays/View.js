//
// Represents a plain 2D overlay element
//
// Useful code locations:
// - Overlay types: https://github.com/highfidelity/hifi/blob/8e214d8ee86f4ea11c5494f0159aa1d45523e895/interface/src/ui/overlays/Overlays.cpp#L178
// - Overlay properties: https://github.com/highfidelity/hifi/blob/8e214d8ee86f4ea11c5494f0159aa1d45523e895/interface/src/ui/overlays/Overlay.cpp#L58

export default class View {

    /** The High Fidelity overlay type. */
    get type() { return "text" }

    /** Constructor */
    constructor() {

        /** @private Cached overlay properties */
        this.options = {

            /** Position */
            x: 0,
            y: 0,
            width: 100,
            height: 100,

            /** Background color */
            backgroundAlpha: 0,
            backgroundColor: {
                red: 0,
                green: 0,
                blue: 0
            },

            /** Visibility */
            visible: true,
            alpha: 1.0,

        }

        /** @private Local coordinates relative to parent view */
        this._x = 0
        this._y = 0

        /** Child views */
        this.subviews = []

        /** The parent view */
        this.parentView = null

        /** @private The user's stored value for the `visible` property. When a
         *  view is a subview of another, and that other view is removed, we
         *  remove all child Overlays as well. This determines wether the view should
         *  be recreated when the parent becomes visible again. */
        this.shouldBeVisible = undefined

    }

    /** @private Get overlay property */
    getProperty(name) {
        return this.options[name]
    }

    /** @private Set overlay property */
    setProperty(name, value) {

        // Set cached value
        this.options[name] = value

        // Edit overlay if shown
        if (this._overlay) {
            var changes = {}
            changes[name] = value
            Overlays.editOverlay(this._overlay, changes)
        }

    }

    /** Layout */
    get x() { return this._x }
    get y() { return this._y }
    get width() { return this.getProperty("width") }
    get height() { return this.getProperty("height") }
    set x(v) { this._x = v ; this.layout() }
    set y(v) { this._y = v ; this.layout() }
    set width(v) { this.setProperty("width", v) ; this.layout() }
    set height(v) { this.setProperty("height", v) ; this.layout() }

    /** Get offset to use to be relative to the parent. NOTE: What's the point of parenting? Am I doing something wrong? */
    get parentOffsetX() {
        var offset = 0
        var parent = this.parentView
        while (parent) {
            offset += parent._x
            parent = parent.parentView
        }
        return offset
    }

    get parentOffsetY() {
        var offset = 0
        var parent = this.parentView
        while (parent) {
            offset += parent._y
            parent = parent.parentView
        }
        return offset
    }

    /** Background opacity */
    get backgroundAlpha() { return this.getProperty("backgroundAlpha") }
    set backgroundAlpha(v) { this.setProperty("backgroundAlpha", v) }

    /** Background color */
    get backgroundColor() { return this.getProperty("backgroundColor") }
    set backgroundColor(v) { this.setProperty("backgroundColor", v) }

    /** Foreground color */
    get color() { return this.getProperty("color") || { red: 0, green: 0, blue: 0 } }
    set color(v) { this.setProperty("color", v) }

    /** Opacity of entire element */
    get alpha() { return this.getProperty("alpha") || 0 }
    set alpha(v) { this.setProperty("alpha", v) }

    /** Border */
    get borderWidth() { return this.getProperty("borderWidth") || 0 }
    set borderWidth(v) { this.setProperty("borderWidth", v) }
    get borderAlpha() { return this.getProperty("borderAlpha") || 0 }
    set borderAlpha(v) { this.setProperty("borderAlpha", v) }
    get borderColor() { return this.getProperty("borderColor") || { red: 0, green: 0, blue: 0 } }
    set borderColor(v) { this.setProperty("borderColor", v) }

    /** Corner radius */
    get radius() { return this.getProperty("radius") || 0 }
    set radius(v) { this.setProperty("radius", v) }

    /** Shows the overlay */
    show() {

        // Check if shown
        if (this.shouldBeVisible)
            return

        // Show overlay
        this.shouldBeVisible = true
        this.updateOverlayVisibility()

    }

    /** Remove overlay */
    hide() {

        // Check if hidden
        if (!this.shouldBeVisible)
            return

        // Remove overlay
        this.shouldBeVisible = false
        this.updateOverlayVisibility()

    }

    /** Remove overlay */
    close() {
        this.hide()
    }

    /** Remove overlay */
    remove() {
        this.hide()
    }

    /** True if the overlay is visible */
    get visible() {
        return this.shouldBeVisible
    }

    /** Show or hide the overlay */
    set visible(v) {
        v ? this.show() : this.hide()
    }

    /** @private True if all views in the view heirarchy are visible (have valid Overlays) */
    get overlayShouldBeVisible() {

        // If the user has hidden us, don't show the overlay
        if (!this.shouldBeVisible) return false

        // If our parent view has no overlay, don't show the overlay
        if (this.parentView) return !!this.parentView._overlay

        // All good, create our overlay
        return true

    }

    /** @private Called when the parent view's overlay state changes */
    updateOverlayVisibility() {

        // Check if we need to create our overlay
        if (this.overlayShouldBeVisible && !this._overlay) {

            // Create overlay
            this.options.parentID = this.parentView && this.parentView._overlay || null
            this._overlay = Overlays.addOverlay(this.type, this.options)

        } else if (!this.overlayShouldBeVisible && this._overlay) {

            // Overlay should be removed
            Overlays.deleteOverlay(this._overlay)
            this._overlay = null

        }

        // Update child visibility
        for (var child of this.subviews)
            child.updateOverlayVisibility()

    }

    /** Add a subview */
    addSubview(subview) {

        // Notify
        subview.willAddToView(this)

        // If the user hasn't explicitly set the visible property yet, make it visible
        if (typeof subview.shouldBeVisible == "undefined")
            subview.visible = true

        // Set overlay parent ID, if our overlay has been created already
        if (this._overlay)
            subview.setProperty("parentID", this._overlay)

        // Add child
        this.subviews.push(subview)
        subview.parentView = this
        subview.updateOverlayVisibility()

        // Notify subview
        subview.didAddToView(this)

    }

    /** @private Called before the view is added to a parent view */
    willAddToView(parent) {

    }

    /** @private Called after the view is added to a parent view */
    didAddToView(parent) {

        // Call layout
        this.layout()

    }

    /** @private Called when the layout changed */
    layout() {

        // Reposition
        this.setProperty("x", this._x + this.parentOffsetX)
        this.setProperty("y", this._y + this.parentOffsetY)

        // Call on subviews
        for (var v of this.subviews)
            v.layout()

    }

    /** Debug function. Logs the view heirarchy to the console. */
    logViewTree(depth = 0) {

        // Log ourselves
        var str = ""
        for (var i = 0 ; i < depth ; i++) str += "-"
        str += " " + this.description
        console.log(str)

        // Log children
        for (var child of this.subviews)
            child.logViewTree(depth + 1)

    }

    /** Object description */
    get description() {
        return `${this.constructor.name} (${this.type}) : X=${this.x} Y=${this.y} Width=${this.width} Height=${this.height} Subviews=${this.subviews.length} OverlayID=${this._overlay}`
    }

}
