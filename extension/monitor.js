/**
 * Stream Monitor
 * Credits to the base by AquaRegia
 * Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
 */
class StreamMonitor {
    ELEMENT_ID = "enhanced_streamMonitor"

    translations;
    element;

    constructor(translations) {
        console.log("Initializing Stream Monitor...")
        this.translations = translations

        this.element = this._createElement()
        this.reset()
    }

    getElement() {
        return this.element
    }

    // used as monitorPosition (stored in settings)
    getCurrentPosition() {
        return this.element.style.top + '|' + this.element.style.left
    }

    // is this different than getELment???
    getOuterHtml() {
        return this.element.outerHTML
    }

    init() {
        this.element.style.position = 'fixed'
        this.element.style.top = enhanced_settings.monitorPosition.split("|")[0]
        this.element.style.left = enhanced_settings.monitorPosition.split("|")[1]
        this.element.style.display = 'block'
    }

    // position can be changed, due to dragging
    show(monitorPosition) {
        this.element.style.top = monitorPosition.split('|')[0]
        this.element.style.left = monitorPosition.split('|')[1]
        this.element.style.display = 'block'

        // not sure if this is needed
        this.element.style.right = ''
        this.element.style.bottom = ''
    }

    hide() {
        this.element.style.display = 'none'
    }

    toggle(monitorPosition) {
        this._isHidden()
            ? this.show(monitorPosition)
            : this.hide()
    }

    reset() {
        this.element.innerHTML = `
            <section>
                <div class="grid">
                    <span style="grid-column: 1 / 4;">Loading stream data.</span>
                </div>
            </section>`
    }

    toggleMode() {
        this._simpleModeIsActive() ? this.refreshContent(true) : this.refreshContent(false)
    }

    refreshContent(showFull) {
        const data = this._getData()

        this.updateStyle();

        data.codec = data.codec
            .replace('Hardware', this.translations.hardware)
            .replace('Software', this.translations.software)

        this.element.innerHTML = showFull
            ? this._createFull(data)
            : this._createSimple(data)
    }

    updateStyle() {
        const boundingBox = this.element.getBoundingClientRect();
        if (boundingBox.top <= 0
            && boundingBox.left <= 0
            && boundingBox.bottom >= window.availHeight
            && boundingBox.right >= window.availWidth
        ) {
            this.element.style.top = '1rem'
            this.element.style.left = '1rem'
        }
    }

    _createFull(data) {
        let html = `
            <!-- Session -->
            <section>               
                <div class="tag">${this.translations.session}</div>
                <div class="grid">
                    <span>${this.translations.date}</span><span>${data.date}</span>
                    <span></span>
                    <div class="border"></div>                    
                    <span>${this.translations.time}</span><span>${data.time}</span>
                    <span></span>
                    <div class="border"></div>
                    <span>${this.translations.sessiontime}</span><span>${data.sessiontime}</span>
                    <span></span>
                </div>
            </section>
            
            <!-- Stream -->            
            <section>
                <div class="tag">` + this.translations.stream + `</div>
                <div class="grid">
                    <span>${this.translations.codec}</span><span>${data.codec}</span>
                    <span></span>
                    <div class="border"></div>
                    <span>${this.translations.resolution}</span>
                    <span>${data.resolution}</span>
                    <span></span>
                    <div class="border"></div>
                    <span>FPS</span>
                    <span>${data.fps}</span>
                    <span></span>
        `

        if (data.codec.includes('VP9')) {
            html += `
                <div class="border"></div>
                <span>${this.translations.compression}</span>
                <span>${data.compression}</span>
                <span></span>
            `
        }

        const decodeColor = this._calculateDecodeColor(data.decode);
        html += `
            <div class="border"></div>
            <span>${this.translations.decodetime}</span>
            <span>${data.decode} ms</span>
            <span class="connection" style="color: ${decodeColor};">⬤</span>
        `

        const framedropColor = this._calculateFrameDropColor(data.framedropPerc)
        html += `
            <div class="border"></div>
            <span>${this.translations.framedrop}</span>
            <span>${data.framedrop}</span>
            <span class="connection" style="color: ${framedropColor};">⬤</span>
        `

        html += `
                </div>
            </section>
            <section>
                <div class="tag">` + this.translations.network + `</div>
                <div class="grid">
                    <span>` + this.translations.trafficsession + `</span>
                    <span>` + data.sessionTraffic + `</span>
                    <span></span>
                    <div class="border"></div>
                    <span>` + this.translations.trafficcurrent + `</span>
                    <span>` + data.currentTraffic + `</span>
                    <span></span>
                    <div class="border"></div>
                    <span>` + this.translations.trafficaverage + `</span>
                    <span>` + data.averageTraffic + `</span>
                    <span></span>
                    <div class="border"></div>
                    <span>` + this.translations.packetloss + `</span>
                    <span>` + data.packetloss + `</span>
                    <span></span>
                    <div class="border"></div>`

        if (data.latency > 100) {
            html += '<span>' + this.translations.latency + '</span><span>' + data.latency + ' ms</span><span class="connection" style="color: #FF7070;">⬤</span>'
        } else if (data.latency > 75) {
            html += '<span>' + this.translations.latency + '</span><span>' + data.latency + ' ms</span><span class="connection" style="color: #FFB83D;">⬤</span>'
        } else if (data.latency > 40) {
            html += '<span>' + this.translations.latency + '</span><span>' + data.latency + ' ms</span><span class="connection" style="color: #00E0BA;">⬤</span>'
        } else {
            html += '<span>' + this.translations.latency + '</span><span>' + data.latency + ' ms</span><span class="connection" style="color: #44BBD8;">⬤</span>'
        }

        html += `
                        <div class="border"></div>
                        <span>` + this.translations.jitter + `</span>
                        <span>` + data.jitter + `</span>
                        <span></span>
                    </div>
                </div>
            </section>
        `

        return html
    }

    _createSimple(data) {
        const color =  this._calculateConnectionStatusColor(data.fps, data.decode, data.framedropPerc, data.latency)

        return `
            <section id="monitor_simple">
                <div class="grid">
                    <span style="grid-column: 1 / 4;">
                        ${data.codec}
                        <div class="split">|</div>
                        ${data.resolution}
                        <div class="split">|</div>
                        ${data.fps} fps
                         <div class="split">|</div>
                        ${data.latency} ms
                        <div class="split">|</div>
                        ${data.decode} ms
                        <div class="split">|</div>
                        <span style="color: ${color};">⬤</span>
                    </span>
                </div>
            </section>
        `
    }

    _calculateConnectionStatusColor(fps, decode, framedropPerc, latency) {
        if (parseInt(fps) < 1) {
            return 'white'
        }

        if (decode > 12 || framedropPerc > 1 || latency > 100) {
            return '#FF7070' // Red
        }

        if (decode > 10 || framedropPerc > 0.5 || latency > 75) {
            return '#FFB83D' // Yellow
        }

        if (decode > 8.33 || framedropPerc > 0.2 || latency > 40) {
            return '#00E0BA' // Green
        }

        return '#44BBD8' // Blue
    }
    
    _calculateDecodeColor(decode) {
        if (decode > 12) {
            return "#FF7070"
        } 
        
        if (decode > 10) {
            return "#FFB83D"
        }
        
        if (decode > 8.33) {
           return "#00E0BA"
        } 
        
        return "#44BBD8"
    }

    _calculateFrameDropColor(framedropPerc) {
        if (framedropPerc > 1) {
            return "#FF7070"
        }

        if (framedropPerc > 0.5) {
            return "#FFB83D"
        }

        if (framedropPerc > 0.2) {
            return "#00E0BA"
        }

        return "#44BBD8"
    }

    _createElement() {
        const element = document.createElement('div');
        element.id = this.ELEMENT_ID
        element.style.position = 'fixed'

        return element
    }

    _simpleModeIsActive() {
        return this.element.querySelector("#monitor_simple") != null
    }

    _getData() {
        const data = localStorage.getItem('enhanced_streamData');
        if (data == null) {
            throw new Error("Unable to get stream data from local storage");
        }

        return JSON.parse(data)
    }

    _isHidden() {
        return this.element.style.display === "none"
    }
}


