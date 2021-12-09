/**
 * Stream Monitor
 * Credits to the base by AquaRegia
 * Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
 */
class StreamMonitor {
    ELEMENT_ID = "enhanced_streamMonitor";

    COLOR_VERY_BAD = "#FF7070"; // red
    COLOR_BAD =  "#FFB83D"; // yellow
    COLOR_GOOD = "#00E0BA" // green
    COLOR_PERFECT = "#44BBD8" // blue

    translations;
    element;

    constructor(translations, initialPosition) {
        console.debug("Initializing Stream Monitor...")
        this.translations = translations

        this.element = this._createElement()
        this._setPositionFromString(initialPosition)
        this.reset()
    }

    // used as monitorPosition (stored in settings)
    getCurrentPosition() {
        return this._positionAsString()
    }

    // position can be changed, due to dragging
    show(positionString) {
        this._setPositionFromString(positionString)

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
            </section>
        `
    }

    toggleMode() {
        this._simpleModeIsActive() ? this.refreshContent(true) : this.refreshContent(false)
    }

    refreshContent(showFull) {
        const data = this._getData()

        this.ensurePosition();

        data.codec = data.codec
            .replace("Hardware", this.translations.hardware)
            .replace("Software", this.translations.software)

        this.element.innerHTML = showFull
            ? this._createFull(data)
            : this._createSimple(data)
    }

    // reposition if outside of visible area
    ensurePosition() {
        const boundingBox = this.element.getBoundingClientRect();
        if (boundingBox.top <= 0
            && boundingBox.left <= 0
            && boundingBox.bottom >= window.availHeight
            && boundingBox.right >= window.availWidth
        ) {
            this._setPosition('1rem', '1rem')
        }
    }

    getElement() {
        return this.element
    }

    _createFull(data) {
        return `
            ${this._createSessionSection(data.date, data.time, data.sessiontime)}
            ${this._createStreamSection(data)}
            ${this._createNetworkSection(data)}
        `
    }

    _createSimple(data) {
        return `
            <section id="monitor_simple">
                <div class="grid">
                    <span style="grid-column: 1 / 4;">
                    
                        <!-- Codec -->
                        ${data.codec}
                        <div class="split">|</div>

                        <!-- Resolution -->
                        ${data.resolution}
                        <div class="split">|</div>

                        <!-- FPS -->                        
                        ${data.fps} fps
                         <div class="split">|</div>

                        <!-- Latency -->
                        ${data.latency} ms
                        <div class="split">|</div>

                        <!-- Decoding time -->                        
                        ${data.decode} ms
                        <div class="split">|</div>

                        <!-- Connection -->
                        <span style="color: ${(this._calculateConnectionColor(data.fps, data.decode, data.framedropPerc, data.latency))};">⬤</span>
                    </span>
                </div>
            </section>
        `
    }

    _calculateConnectionColor(fps, decode, frameDropPerc, latency) {
        if (parseInt(fps) < 1) {
            return 'white'
        }

        if (decode > 12 || frameDropPerc > 1 || latency > 100) {
            return this.COLOR_VERY_BAD
        }

        if (decode > 10 || frameDropPerc > 0.5 || latency > 75) {
            return this.COLOR_BAD
        }

        if (decode > 8.33 || frameDropPerc > 0.2 || latency > 40) {
            return this.COLOR_GOOD
        }

        return this.COLOR_PERFECT
    }
    
    _calculateDecodeColor(decode) {
        if (decode > 12) {
            return this.COLOR_VERY_BAD
        } 
        
        if (decode > 10) {
            return this.COLOR_BAD
        }
        
        if (decode > 8.33) {
           return this.COLOR_GOOD
        } 
        
        return this.COLOR_PERFECT
    }

    _calculateFrameDropColor(frameDropPerc) {
        if (frameDropPerc > 1) {
            return this.COLOR_VERY_BAD
        }

        if (frameDropPerc > 0.5) {
            return this.COLOR_BAD
        }

        if (frameDropPerc > 0.2) {
            return this.COLOR_GOOD
        }

        return this.COLOR_PERFECT
    }

    _calculateLatencyColor(latency) {
        if (latency > 100) {
            return this.COLOR_VERY_BAD;
        }

        if (latency > 75) {
            return this.COLOR_BAD
        }

        if (latency > 40) {
            return this.COLOR_GOOD
        }

        return this.COLOR_PERFECT
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

    _createStreamSection(data) {
        return `
            <section>
                <!-- Header -->
                <div class="tag">${this.translations.stream}</div>
                
                <div class="grid">
                    <!-- Codec -->
                    <span>${this.translations.codec}</span><span>${data.codec}</span>
                    <span></span>
                    
                    <!-- Resolution -->
                    <div class="border"></div>
                    <span>${this.translations.resolution}</span>
                    <span>${data.resolution}</span>
                    <span></span>
                    
                    <!-- FPS -->
                    <div class="border"></div>
                    <span>FPS</span>
                    <span>${data.fps}</span>
                    <span></span>
                    
                    <!-- Compression (if VP9 ) -->
                    ${this._createCompression(data)}

                    <!-- Decode -->
                    <div class="border"></div>
                    <span>${this.translations.decodetime}</span>
                    <span>${data.decode} ms</span>
                    <span class="connection" style="color: ${(this._calculateDecodeColor(data.decode))};">⬤</span>
                    
                    <!-- Framedrop -->
                    <div class="border"></div>
                    <span>${this.translations.framedrop}</span>
                    <span>${data.framedrop}</span>
                    <span class="connection" style="color: ${(this._calculateFrameDropColor(data.framedropPerc))};">⬤</span>
                    
                 </div>
            </section>
        `
    }

    _createSessionSection(date, time, sessionDuration) {
        return `
            <section>           
                <!-- Header -->    
                <div class="tag">${this.translations.session}</div>
                
                <div class="grid">
                    <!-- Date -->
                    <span>${this.translations.date}</span><span>${date}</span>
                    <span></span>
                    
                    <!-- Time -->
                    <div class="border"></div>                    
                    <span>${this.translations.time}</span><span>${time}</span>
                    <span></span>

                    <!-- Session time -->
                    <div class="border"></div>
                    <span>${this.translations.sessiontime}</span><span>${sessionDuration}</span>
                    <span></span>
                    
                </div>
            </section>
        `
    }

    _createNetworkSection(data) {
        return `
            <section>
                <!-- Header -->
                <div class="tag">${this.translations.network}</div>

                <div class="grid">
                    <!-- Session Traffic -->
                    <span>${this.translations.trafficsession}</span>
                    <span>${data.sessionTraffic}</span>
                    <span></span>
                    
                    <!-- Current Traffic -->
                    <div class="border"></div>
                    <span>${this.translations.trafficcurrent}</span>
                    <span>${data.currentTraffic}</span>
                    <span></span>
                    
                    <!-- Avg Traffic -->
                    <div class="border"></div>
                    <span>${this.translations.trafficaverage}</span>
                    <span>${data.averageTraffic}</span>
                    <span></span>
                    
                    <!-- Packetloss -->
                    <div class="border"></div>
                    <span>${this.translations.packetloss}</span>
                    <span>${data.packetloss}</span>
                    <span></span>
                    
                    <!-- Latency -->
                    <div class="border"></div>
                    <span>${this.translations.latency}</span><span>${data.latency} ms</span><span class="connection" style="color: ${(this._calculateLatencyColor(data.latency))};">⬤</span>
                    
                    <!-- Jitter -->
                    <div class="border"></div>
                    <span>${this.translations.jitter}</span>
                    <span>${data.jitter}</span>
                    <span></span>
                   
                </div>
            </section>
        `
    }

    _createCompression(data) {
        if (!data.codec.includes('VP9')) {
            return ""
        }

        return `
            <div class="border"></div>
            <span>${this.translations.compression}</span>
            <span>${data.compression}</span>
            <span></span>
        `
    }

    _setPositionFromString(positionString) {
        const positionTokens = positionString.split('|')

        this._setPosition(positionTokens[0], positionTokens[1])
    }

    _setPosition(top, left) {
        this.element.style.top = top
        this.element.style.left = left
    }

    _positionAsString() {
        return this.element.style.top + '|' + this.element.style.left
    }
}


