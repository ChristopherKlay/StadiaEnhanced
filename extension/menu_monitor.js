/**
 * Minified Menu Stream Monitor
 */
class MenuMonitor {
    element;

    constructor() {
        this.element = this._createElement()
    }

    getElement() {
        return this.element
    }

    appendElement(el) {
        this.element.append(el)
    }

    _createElement() {
        const element = document.createElement('div');
        element.style.whiteSpace = 'nowrap'

        return element
    }
}

