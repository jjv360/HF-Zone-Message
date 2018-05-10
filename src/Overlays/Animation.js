//
// Helper functions for animating views

import TWEEN from '@tweenjs/tween.js'

// Fix TWEEN's attempt to use process.hrtime()
TWEEN.now = Date.now

class Animation {

    constructor() {



    }

    /** @private Starts or stops the update loop, depending if there are any running animations */
    checkLoop() {

        // Check if loop should start
        if (!this.loopRunning && TWEEN.getAll().length > 0) {

            // Start loop
            Script.update.connect(TWEEN.update)
            this.loopRunning = true
            console.log("TWEEN loop started")

        } else if (this.loopRunning && TWEEN.getAll().length == 0) {

            // Start loop
            Script.update.disconnect(TWEEN.update)
            this.loopRunning = false
            console.log("TWEEN loop stopped")

        }

    }

    /** Create an animation on a view */
    animate(view, to, easing = TWEEN.Easing.Quadratic.InOut) {

        // Create tween
        var tween = new TWEEN.Tween(view).to(to).onComplete(e => {

            // Stop loop if needed
            this.checkLoop()

        }).start()

        // Start tween update loop if needed
        this.checkLoop()

    }

}

var cls = new Animation()
export var animate = cls.animate.bind(cls)
