//
// Represents a label component

import View from './View'

export default class Label extends View {

    /** The High Fidelity overlay type */
    get type() { return "text" }

    /** Text shown in the label */
    get text() { return this.getProperty("text") || "" }
    set text(v) { this.setProperty("text", v) }

    /** Text margins */
    get leftMargin() { return this.getProperty("leftMargin") || 0 }
    set leftMargin(v) { this.setProperty("leftMargin", v) }
    get topMargin() { return this.getProperty("topMargin") || 0 }
    set topMargin(v) { this.setProperty("topMargin", v) }

    /** Font information */
    get font() { return this.getProperty("font") || { size: 17 } }
    set font(v) { this.setProperty("font", v) }

}
