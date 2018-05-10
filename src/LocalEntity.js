//
//

import Entity from "./Entity"

/** The base class for the local entity. This should be subclassed and returned from
 *  your starting JS file. Do not create new instances of this class. See https://docs.highfidelity.com/api-reference/namespaces/entities#signals
 *  for other event functions which can be specified. */
export default class LocalEntity extends Entity {

    /** @private Should never be called, except by the entity subclass. */
    constructor() {
        super(null)

    }

    /** Called by HF on startup */
    preload(id) {

        // Store our entity ID
        this.id = id

    }

    /** Called by HF when the script is shutting down */
    unload() {}

}
