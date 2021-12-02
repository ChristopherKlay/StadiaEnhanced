/**
 * Minified Menu Stream Monitor
 */
class MenuStreamMonitor {
    translations;

    parentElement;
    sessionElement;
    codecElement;
    resolutionElement;
    latencyElement;
    frameDropElement;
    decodeElement;

    constructor(translations) {
        console.debug("Initializing Menu Stream Monitor...")
        this.translations = translations

        this.parentElement = this._createParent()
        this.parentElement.append(this._createSessionTime())
        this.parentElement.append(this._createCodec())
        this.parentElement.append(this._createResolution())
        this.parentElement.append(this._createLatency())
        this.parentElement.append(this._createFrameDrop())
        this.parentElement.append(this._createDecode())
    }

    getElement() {
        return this.parentElement
    }

    updateSessionTime(duration) {
        this.sessionElement.querySelector("span.Ce1Y1c").textContent = duration
    }

    updateContent(codec, resolution, latency, fps, frameDrop, decode) {
        this.codecElement.querySelector("span.Ce1Y1c").textContent = codec
        this.resolutionElement.querySelector("span.Ce1Y1c").textContent = resolution
        this.latencyElement.querySelector("span.Ce1Y1c").textContent = latency + " | " + fps
        this.frameDropElement.querySelector("span.Ce1Y1c").textContent = frameDrop
        this.decodeElement.querySelector("span.Ce1Y1c").textContent = decode
    }

    reset() {
        this.updateContent("-", "-", "-", "-", "-")
    }

    _createParent() {
        const element = document.createElement('div');
        element.style.whiteSpace = 'nowrap'

        return element
    }

    _createSessionTime() {
        const element = document.createElement('div')
        element.className = 'HPX1od'
        element.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.sessiontime}</span><span class="Ce1Y1c qFZbbe">-</span>
            </div>
        `

        this.sessionElement = element

        return element
    }

    _createCodec() {
        const element = document.createElement('div')
        element.className = 'HPX1od'
        element.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.codec}</span><span class="Ce1Y1c qFZbbe">-</span>
            </div>
        `

        this.codecElement = element

        return element
    }

    _createResolution() {
        const element = document.createElement('div')
        element.className = 'HPX1od'
        element.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.resolution}</span><span class="Ce1Y1c qFZbbe">-</span>
            </div>
        `

        this.resolutionElement = element

        return element
    }

    _createLatency() {
        const element = document.createElement('div');
        element.className = 'HPX1od'
        element.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.latency} | FPS</span><span class="Ce1Y1c qFZbbe">- | -</span>
            </div>
        `

        this.latencyElement = element

        return element
    }

    _createFrameDrop() {
        const element = document.createElement('div');
        element.className = 'HPX1od'
        element.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.framedrop}</span><span class="Ce1Y1c qFZbbe">-</span>
            </div>
        `

        this.frameDropElement = element

        return element
    }

    _createDecode() {
        const element = document.createElement('div');
        element.className = 'HPX1od'
        element.innerHTML = `
            <div class="Qg73if"><span class="zsXqkb">
                ${this.translations.decodetime}</span><span class="Ce1Y1c qFZbbe">-</span>
            </div>
        `

        this.decodeElement = element

        return element
    }
}

