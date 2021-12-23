/**
 * Stream Monitor
 * 
 * Credits to the base by AquaRegia
 * Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
 */
class StreamMonitor {

    ELEMENT_ID = "enhanced_streamMonitor";

    ELEMENT_CODEC_SELECTOR = ".monitor-codec"
    ELEMENT_LATENCY_SELECTOR = ".monitor-latency"

    // Stadias Color Coding
    COLOR_VERY_BAD = "#FF7070" // red
    COLOR_BAD = "#FFB83D" // yellow
    COLOR_GOOD = "#00E0BA" // green
    COLOR_PERFECT = "#44BBD8" // blue

    /**
     * Enum for available monitor modes.
     * @readonly
     * @enum {string}
     */
    MODE = {
        STANDARD: "Standard",
        COMPACT: "Compact",
        MENU: "Menu",
        HIDDEN: "Hidden"
    }

    _settingsService;
    _translations;
    element;

    _currentMode;
    _currentData; // convert to array for chart
    _isInGame = false; // holds current state

    /**
     * @typedef {Object} Translations
     * @property {string} hardware
     * @property {string} software
     * @property {string} stream
     * @property {string} codec
     * @property {string} resolution
     * @property {string} decodetime
     * @property {string} framedrop
     * @property {string} session
     * @property {string} date
     * @property {string} time
     * @property {string} sessiontime
     * @property {string} network
     * @property {string} trafficsession
     * @property {string} trafficcurrent
     * @property {string} trafficaverage
     * @property {string} packetloss
     * @property {string} latency
     * @property {string} jitter
     * @property {string} streammonmodestandard
     * @property {string} streammonmodecompact
     * @property {string} streammonmodemenu
     */

    /**
     * @param {SettingsService} settingsService - used for persisting monitor-related settings
     * @param {Translations} translations
     * @param {string} initialPosition - position on screen where the monitor should be shown
     */
    constructor(settingsService, translations, initialPosition) {
        console.debug("Initializing Stream Monitor...")
        this._settingsService = settingsService
        this._translations = translations

        this.element = this._createElement()
        this._menuElement = new MenuStreamMonitor(translations)
        this._menuElement.hide()

        this._iconElement = this._createIconElement()

        this._setPositionFromString(initialPosition)

        const autoStartMode = settingsService.getMonitorAutoStart()
        this.reset(autoStartMode)

        const initialMode = this._settingsService.getMonitorMode();
        const isLegacyMode = Number.isInteger(initialMode)

        if (isLegacyMode && autoStartMode !== this.MODE.HIDDEN) {
            const legacyMode = this._modeFromSettingsNumber(initialMode)
            this._currentMode = legacyMode

            return
        }

        this._currentMode = initialMode
        if (initialMode === this.MODE.HIDDEN && autoStartMode !== this.MODE.HIDDEN) {
            this.showMode(autoStartMode)
        }

        this._updateIcon(this._currentMode)

        console.debug("Setting initial mode to: " + this.currentMode)
    }

    // Used as monitorPosition (stored in settings)
    getCurrentPosition() {
        return this._positionAsString()
    }

    // Position can be changed, due to dragging
    showAt(positionString) {
        this._setPositionFromString(positionString)

        this._switchToStandard(positionString)

        // Not sure if this is needed
        this.element.style.right = ''
        this.element.style.bottom = ''
    }

    hide() {
        this.element.style.display = 'none'
    }

    /**
     * @param {("Standard"|"Compact"|"Menu"|"Hidden")} autoStartMode
     */
    reset(autoStartMode) {
        if (!this._isInGame) { // already reset, no need to do it again
            return
        }

        this.updateValues(null)

        this._menuElement.reset()

        // overwrite mode for next game startup if autoStart option has been set
        if (autoStartMode !== this.MODE.HIDDEN) {
            console.debug(`Overwriting monitor mode to "${autoStartMode}" because of enabled autostart`)
            this.showMode(autoStartMode)
        }

        this._disableIcon()
        this._isInGame = false
    }

    toggleMode() {
        switch (this._currentMode) {
            case this.MODE.HIDDEN:
                this._switchToStandard()
                break
            case this.MODE.STANDARD:
                this._switchToCompact()
                break
            case this.MODE.COMPACT:
                this._switchToMenu()
                break
            case this.MODE.MENU:
                this._switchToHidden()
                break
        }
    }

    showMode(mode) {
        switch (mode) {
            case this.MODE.STANDARD:
                this._switchToStandard()
                break
            case this.MODE.COMPACT:
                this._switchToCompact()
                break
            case this.MODE.MENU:
                this._switchToMenu()
                break
            case this.MODE.HIDDEN:
                this._switchToHidden()
                break
        }
    }

    get currentMode() {
        return this._currentMode;
    }

    // every second or so
    updateValues(data) {
        this._currentData = data

        if (data == null) {
            this._isInGame = false
            return
        }
        this._isInGame = true

        this.ensurePosition();

        data.codec = data.codec
            .replace("Hardware", this._translations.hardware)
            .replace("Software", this._translations.software)

        switch (this._currentMode) {
            case this.MODE.STANDARD:
                this.element.innerHTML = this._createFull(data)
                break

            case this.MODE.COMPACT:
                this.element.innerHTML = this._createSimple(data)
                break

            case this.MODE.MENU:
                this._menuElement.updateContent(
                    data.codec,
                    data.resolution,
                    data.latency + " ms",
                    data.fps,
                    data.framedrop,
                    data.decode + " ms"
                )
                break

            default:
                break
        }
    }

    // Reposition if outside of visible area
    ensurePosition() {
        const boundingBox = this.element.getBoundingClientRect();
        if (boundingBox.top <= 0 &&
            boundingBox.left <= 0 &&
            boundingBox.bottom >= window.availHeight &&
            boundingBox.right >= window.availWidth
        ) {
            this._setPosition('1rem', '1rem')
        }
    }

    isVisible() {
        return this._currentMode !== this.MODE.HIDDEN
    }

    getElement() {
        return this.element
    }

    get menuElement() {
        return this._menuElement.getElement();
    }

    get iconElement() {
        return this._iconElement;
    }

    // legacy support, TODO: remove as soon as possible
    updateSessionTime(duration) {
        this._menuElement.updateSessionTime(duration)
    }

    _switchToStandard() {
        this.ensurePosition();
        this._showStandard()
        this._updateIcon(this.MODE.STANDARD)
        this._settingsService.saveMonitorMode(this.MODE.STANDARD)

        this._currentMode = this.MODE.STANDARD
    }

    _switchToCompact() {
        this.ensurePosition();
        this._showCompact(this._currentData)
        this._updateIcon(this.MODE.COMPACT)
        this._settingsService.saveMonitorMode(this.MODE.COMPACT)

        this._currentMode = this.MODE.COMPACT
    }

    _switchToMenu() {
        this.hide()
        this._showMenu(this._currentData)
        this._updateIcon(this.MODE.MENU)
        this._settingsService.saveMonitorMode(this.MODE.MENU)

        this._currentMode = this.MODE.MENU
    }

    _switchToHidden() {
        this.hide()
        this._menuElement.hide()
        this._updateIcon(this.MODE.HIDDEN)
        this._settingsService.saveMonitorMode(this.MODE.HIDDEN)

        this._currentMode = this.MODE.HIDDEN
    }

    _showStandard() {
        this.ensurePosition();

        this.element.innerHTML = this._createFull(this._currentData)
        this.element.style.display = "block"
    }

    _showCompact(data) {
        this.ensurePosition();

        this.element.innerHTML = this._createSimple(data)
        this.element.style.display = "block"
    }

    _showMenu(data) {
        if (data == null) {
            this._menuElement.reset()
        } else {
            this._menuElement.updateContent(
                data.codec,
                data.resolution,
                data.latency + " ms",
                data.fps,
                data.framedrop,
                data.decode + " ms"
            )
        }

        this._menuElement.show()
    }

    /**
     * @param {Object|null} data
     * @param {("Hardware H264"|"Hardware VP9"|"Software VP9")} data.codec - The video compression standard used
     * @param {string} data.resolution
     * @param {number} data.fps
     * @param {number} data.latency
     * @param {number} data.decode
     * @param {number} data.frameDropPerc
     */
    _createFull(data) {
        if (data == null) {
            return ""
        }

        return `
            ${this._createSessionSection(data.date, data.time, data.sessiontime)}
            ${this._createStreamSection(data)}
            ${this._createNetworkSection(data)}
        `
    }

    /**
     * @param {Object|null} data
     * @param {("Hardware H264"|"Hardware VP9"|"Software VP9")} data.codec - The video compression standard used
     * @param {string} data.resolution
     * @param {number} data.fps
     * @param {number} data.latency
     * @param {number} data.decode
     * @param {number} data.frameDropPerc
     */
    _createSimple(data) {
        return `
            <section id="monitor_simple">
                <div class="grid">
                    <span style="grid-column: 1 / 4;">
                    
                        <!-- Codec -->
                        <span class="monitor-codec">${ data != null ? data.codec : ""}</span>
                        <div class="split">|</div>

                        <!-- Resolution -->
                        ${data != null ? data.resolution : ""}
                        <div class="split">|</div>

                        <!-- FPS -->                        
                        ${data != null ? data.fps : ""} fps
                         <div class="split">|</div>

                        <!-- Latency -->
                        <span class="monitor-latency">${data != null ? data.latency : ""}</span> ms
                        <div class="split">|</div>

                        <!-- Decoding time -->                        
                        ${data != null ? data.decode : ""} ms
                        <div class="split">|</div>

                        <!-- Connection -->
                        <span style="color: ${data != null ? (this._calculateConnectionColor(data.fps, data.decode, data.framedropPerc, data.latency)) : ""};">⬤</span>
                    </span>
                </div>
            </section>
        `
    }

    /**
     * @param {number} fps
     * @param {number} decode
     * @param {number} frameDropPerc
     * @param {number} latency
     */
    _calculateConnectionColor(fps, decode, frameDropPerc, latency) {
        if (fps < 1) {
            return "white"
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

    /**
     * @param {number} decode
     */
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

    /**
     * @param {number} frameDropPerc
     */
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

    /**
     * @param {number} latency
     */
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

    _isHidden() {
        return this.element.style.display === "none"
    }

    /**
     * @param {Object|null} data
     * @param {("Hardware H264"|"Hardware VP9"|"Software VP9")} data.codec - The video compression standard used
     * @param {string} data.resolution
     * @param {number} data.fps
     * @param {number} data.latency
     * @param {number} data.decode
     * @param {string} data.framedrop
     * @param {number} data.framedropPerc
     * @param {string} data.compression
     */
    _createStreamSection(data) {
        return `
            <section>
                <!-- Header -->
                <div class="tag">${this._translations.stream}</div>
                
                <div class="grid">
                    <!-- Codec -->
                    <span>${this._translations.codec}</span><span>${data.codec || "-"}</span>
                    <span></span>
                    
                    <!-- Resolution -->
                    <div class="border"></div>
                    <span>${this._translations.resolution}</span>
                    <span>${data.resolution}</span>
                    <span></span>
                    
                    <!-- FPS -->
                    <div class="border"></div>
                    <span>FPS</span>
                    <span>${data.fps}</span>
                    <span></span>
                    
                    <!-- Compression (if VP9 ) -->
                    ${this._createCompression(data.codec, data.compression)}

                    <!-- Decode -->
                    <div class="border"></div>
                    <span>${this._translations.decodetime}</span>
                    <span>${data.decode} ms</span>
                    <span class="connection" style="color: ${(this._calculateDecodeColor(data.decode))};">⬤</span>
                    
                    <!-- Framedrop -->
                    <div class="border"></div>
                    <span>${this._translations.framedrop}</span>
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
                <div class="tag">${this._translations.session}</div>
                
                <div class="grid">
                    <!-- Date -->
                    <span>${this._translations.date}</span><span>${date}</span>
                    <span></span>
                    
                    <!-- Time -->
                    <div class="border"></div>                    
                    <span>${this._translations.time}</span><span>${time}</span>
                    <span></span>

                    <!-- Session time -->
                    <div class="border"></div>
                    <span>${this._translations.sessiontime}</span><span>${sessionDuration}</span>
                    <span></span>
                    
                </div>
            </section>
        `
    }

    _createNetworkSection(data) {
        return `
            <section>
                <!-- Header -->
                <div class="tag">${this._translations.network}</div>

                <div class="grid">
                    <!-- Session Traffic -->
                    <span>${this._translations.trafficsession}</span>
                    <span>${data.sessionTraffic}</span>
                    <span></span>
                    
                    <!-- Current Traffic -->
                    <div class="border"></div>
                    <span>${this._translations.trafficcurrent}</span>
                    <span>${data.currentTraffic}</span>
                    <span></span>
                    
                    <!-- Avg Traffic -->
                    <div class="border"></div>
                    <span>${this._translations.trafficaverage}</span>
                    <span>${data.averageTraffic}</span>
                    <span></span>
                    
                    <!-- Packetloss -->
                    <div class="border"></div>
                    <span>${this._translations.packetloss}</span>
                    <span>${data.packetloss}</span>
                    <span></span>
                    
                    <!-- Latency -->
                    <div class="border"></div>
                    <span>${this._translations.latency}</span><span>${data.latency} ms</span><span class="connection" style="color: ${(this._calculateLatencyColor(data.latency))};">⬤</span>
                    
                    <!-- Jitter -->
                    <div class="border"></div>
                    <span>${this._translations.jitter}</span>
                    <span>${data.jitter}</span>
                    <span></span>
                   
                </div>
            </section>
        `
    }

    /**
     * @param {string} codec
     * @param {string} compression
     */
    _createCompression(codec, compression) {
        if (!codec.includes("VP9")) {
            return ""
        }

        return `
            <div class="border"></div>
            <span>${this._translations.compression}</span>
            <span>${compression}</span>
            <span></span>
        `
    }

    /**
     * @param {string} positionString - Top and left pixels divided by a pipe (e.g "1rem|1rem")
     */
    _setPositionFromString(positionString) {
        const positionTokens = positionString.split("|")

        this._setPosition(positionTokens[0], positionTokens[1])
    }

    _setPosition(top, left) {
        this.element.style.top = top
        this.element.style.left = left
    }

    _positionAsString() {
        return this.element.style.top + '|' + this.element.style.left
    }

    _modeFromSettingsNumber(settingsNumber) {
        switch (settingsNumber) {
            case 0:
                return this.MODE.STANDARD
            case 1:
                return this.MODE.COMPACT
            case 2:
                return this.MODE.MENU
            default:
                return this.MODE.HIDDEN
        }
    }

    _createIconElement() {
        const element = document.createElement('div');
        element.className = 'R2s0be'
        element.id = 'enhanced_Monitor'
        element.innerHTML = `
            <style>
              .loading {
                pointer-events: none !important;
                opacity: 0.3;
              }
              
            </style>
            <div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX loading">
        
                <!-- Icon -->
                <span class="X5peoe" jsname="pYFhU">
                    <i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">analytics</i>
                </span>
                
                <!-- Text -->
                <span class="caSJV" jsname="V67aGc">${enhanced_lang.streammon}</span>
                
                <span id="monitor-type" style="color: rgba(255,255,255,.4);font-size: 0.7rem; height: 0.5rem;"></span>        
            </div>
        `

        element.disabled = true
        element.style.cursor = 'pointer'
        element.style.userSelect = 'none'
        element.tabIndex = '0'

        return element
    }

    /**
     * @param {string} mode
     */
    _updateIcon(mode) {
        const $icon = this._iconElement.querySelector("span.X5peoe")
        const $typeDescription = this._iconElement.querySelector("#monitor-type")

        $icon.style.color = mode === this.MODE.HIDDEN ? "" : "#00e0ba"
        $typeDescription.textContent = this._textForMode(mode)
    }

    _textForMode(mode) {
        switch (mode) {
            case this.MODE.STANDARD: return this._translations.streammonmodestandard || "Standard";
            case this.MODE.COMPACT: return this._translations.streammonmodecompact || "Compact";
            case this.MODE.MENU: return this._translations.streammonmodemenu || "Menu";
            default: return "";
        }
    }

    _disableIcon() {
        this._iconElement.disabled = true
        const button = this._iconElement.querySelector("div.CTvDXd")
        button.classList.add("loading")
    }

    // TODO: make private
    enableIcon() {
        this._iconElement.disabled = false
        const loadingElements = this._iconElement.querySelectorAll(".loading")
        loadingElements.forEach(el => el.classList.remove("loading"))
    }
}
