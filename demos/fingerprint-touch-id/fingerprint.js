function fingerprint(callback) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(cb) {
            setTimeout(cb, 1000 / 60)
        }
    }

    const TIME_TO_FILL_FPRINT = 700 // ms
    const TIME_TO_REMOVE_FPRINT = 250
    const fprintPaths = []
    const fprintPathsFirstHalf = []
    const fprintPathsSecondHalf = []

    const fprintPathSelector = '.fprint-path'
    const $fprint = document.querySelector('.fingerprint')
    const $fprintPaths = document.querySelectorAll(fprintPathSelector)
    const $endingPaths = document.querySelectorAll('.fprint-ending-path')

    let isFprintAnimationInProgress = false
    let isFprintAnimationOver = false
    let curFprintPathsOffset = -1
    let fprintProgressionDirection = 1
    let lastRafCallTimestamp = 0
    let fprintTick = getPropertyIncrement(0, 1, TIME_TO_FILL_FPRINT)

    // init
    for (let i = 0; i < $fprintPaths.length; i++) {
        fprintPaths.push(new Path(fprintPathSelector, i))
        fprintPaths[i].offset(-1).makeVisible()
        if (fprintPaths[i].removesForwards) {
            fprintPathsSecondHalf.push(fprintPaths[i])
        } else {
            fprintPathsFirstHalf.push(fprintPaths[i])
        }
    }

    // add events
    $fprint.addEventListener('mousedown', onTouchStart)
    $fprint.addEventListener('touchstart', onTouchStart)
    document.addEventListener('mouseup', onTouchEnd)
    document.addEventListener('touchend', onTouchEnd)

    function onTouchStart() {
        fprintProgressionDirection = 1
        if (!isFprintAnimationInProgress && !isFprintAnimationOver)
            window.requestAnimationFrame(fprintFrame)
    }

    function onTouchEnd() {
        fprintProgressionDirection = -1
        if (!isFprintAnimationInProgress && !isFprintAnimationOver)
            window.requestAnimationFrame(fprintFrame)
    }

    // helpers
    function addClasses(elements, className) {
        elements.forEach(el => el.classList.add(className))
    }

    function getPropertyIncrement(startValue, endValue, transitionDuration) {
        const TICK_TIME = 1000 / 60
        const ticksToComplete = transitionDuration / TICK_TIME
        return (endValue - startValue) / ticksToComplete
    }

    function offsetAllFprintPaths(ratio) {
        fprintPaths.forEach(path => path.offset(ratio))
    }

    function offsetFprintPathsByHalves(ratio) {
        fprintPathsFirstHalf.forEach(path => path.offset(ratio))
        fprintPathsSecondHalf.forEach(path => path.offset(-ratio))
    }

    // animations for filling fingerprint path
    function fprintFrame(timestamp) {
        if (timestamp - lastRafCallTimestamp >= 1000 / 65) {
            lastRafCallTimestamp = timestamp
            curFprintPathsOffset += fprintTick * fprintProgressionDirection
            offsetAllFprintPaths(curFprintPathsOffset)
        }

        if (curFprintPathsOffset >= -1 && curFprintPathsOffset <= 0) {
            isFprintAnimationInProgress = true
            window.requestAnimationFrame(fprintFrame)
        } else if (curFprintPathsOffset > 0) {
            curFprintPathsOffset = 0
            offsetAllFprintPaths(curFprintPathsOffset)
            isFprintAnimationInProgress = false
            isFprintAnimationOver = true
            $fprint.classList.remove('bg')
            fprintTick = getPropertyIncrement(0, 1, TIME_TO_REMOVE_FPRINT)
            window.requestAnimationFrame(removeFprint)
        } else if (curFprintPathsOffset < -1) {
            curFprintPathsOffset = -1
            offsetAllFprintPaths(curFprintPathsOffset)
            isFprintAnimationInProgress = false
        }
    }

    // animations for removing fingerprint path
    function removeFprint() {
        addClasses($endingPaths, 'removed')
        fprintProgressionDirection = -1
        setTimeout(() => addClasses($endingPaths, 'fadeout'), TIME_TO_REMOVE_FPRINT * 0.9)
        window.requestAnimationFrame(removeFprintFrame)
    }

    function removeFprintFrame(timestamp) {
        if (timestamp - lastRafCallTimestamp >= 1000 / 65) {
            curFprintPathsOffset += fprintTick * fprintProgressionDirection
            offsetFprintPathsByHalves(curFprintPathsOffset)
            lastRafCallTimestamp = timestamp
        }
        if (curFprintPathsOffset >= -1) {
            window.requestAnimationFrame(removeFprintFrame)
        } else {
            curFprintPathsOffset = -1
            offsetAllFprintPaths(curFprintPathsOffset)
            setTimeout(callback, 500)
        }
    }
}

class Path {
    constructor(selector, index) {
        this.index = index
        this.el = document.querySelectorAll(selector)[index]
        this.length = this.el.getTotalLength()
        this.setDasharray()
        this.removesForwards = this.el.classList.contains('removes-forwards')
    }
    setDasharray() {
        // + 2 hack just fixes weird firefox bug (classic)
        this.el.style['stroke-dasharray'] = `${this.length} ${this.length + 2}`
        return this
    }
    offset(ratio) {
        // + 1 hack just fixes weird firefox bug (classic)
        this.el.style['stroke-dashoffset'] = -this.length * ratio + 1
        return this
    }
    makeVisible() {
        this.el.style.visibility = 'visible'
        return this
    }
}
