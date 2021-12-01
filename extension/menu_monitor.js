/**
 * Minified Menu Stream Monitor
 */
class MenuMonitor {
    translations;

    parentElement;
    sessionElement;
    codecElement;
    resolutionElement;
    latencyElement;
    frameDropElement;
    decodeElement;

    constructor(translations) {
        console.log("Initializing Menu Stream Monitor...")
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

    getSessionElement() {
        return this.sessionElement
    }

    updateContent(codec, resolution, latency, fps, frameDrop, decode) {
        this.codecElement.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.codec}</span><span class="Ce1Y1c qFZbbe">${codec}</span>
            </div>
        `

        this.resolutionElement.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.resolution}</span><span class="Ce1Y1c qFZbbe">${resolution}</span>
            </div>
        `

        this.latencyElement.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.latency} | FPS</span><span class="Ce1Y1c qFZbbe">${latency} | ${fps}</span>
            </div>
        `

         this.frameDropElement.innerHTML = `
            <div class="Qg73if">
                <span class="zsXqkb">${this.translations.framedrop}</span><span class="Ce1Y1c qFZbbe">${frameDrop}</span>
            </div>
        `

        this.decodeElement.innerHTML = `
            <div class="Qg73if"><span class="zsXqkb">
                ${this.translations.decodetime}</span><span class="Ce1Y1c qFZbbe">${decode || "-"}</span>
            </div>
        `
    }

    _createParent() {
        const element = document.createElement('div');
        element.style.whiteSpace = 'nowrap'

        return element
    }

    _createSessionTime() {
        const element = document.createElement('div')
        element.id = 'enhanced_menuMonitorCodec'
        element.className = 'HPX1od'

        this.sessionElement = element

        return element
    }

    _createCodec() {
        const element = document.createElement('div')
        element.id = 'enhanced_menuMonitorCodec'
        element.className = 'HPX1od'

        this.codecElement = element

        return element
    }

    _createResolution() {
        const element = document.createElement('div')
        element.id = 'enhanced_menuMonitorRes'
        element.className = 'HPX1od'

        this.resolutionElement = element

        return element
    }

    _createLatency() {
        const element = document.createElement('div');
        element.id = 'enhanced_menuMonitorLatFps'
        element.className = 'HPX1od'

        this.latencyElement = element

        return element
    }

    _createFrameDrop() {
        const element = document.createElement('div');
        element.id = 'enhanced_menuMonitorFDrop'
        element.className = 'HPX1od'

        this.frameDropElement = element

        return element
    }

    _createDecode() {
        const element = document.createElement('div');
        element.id = 'enhanced_menuMonitorDecode'
        element.className = 'HPX1od'

        this.decodeElement = element

        return element
    }
}

