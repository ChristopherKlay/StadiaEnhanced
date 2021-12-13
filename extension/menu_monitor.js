/**
 * Menu-attached Stream Monitor
 */
class MenuStreamMonitor {
    CODEC_ID = "menu-monitor-codec";
    SESSION_TIME_ID = "menu-monitor-sessiontime";
    RESOLUTION_ID = "menu-monitor-resolution";
    LATENCY_ID = "menu-monitor-latency";
    FRAME_DROP_ID = "menu-monitor-framedrop";
    DECODE_ID = "menu-monitor-decode";

    translations;
    element;

    constructor(translations) {
        console.debug("Initializing Menu Stream Monitor...")
        this.translations = translations
        this.element = this._createElement()

        // insert
        // document.querySelector(".FTrnxe:not(.qRvogc) > .OWVtN:not(.YgM2X)").append(this.element)
        // secureInsert(monitor.menuElement, '.FTrnxe:not(.qRvogc) > .OWVtN:not(.YgM2X)', 0)
    }

    updateSessionTime(duration) {
        this._updateValue(this.SESSION_TIME_ID, duration)
    }

    updateContent(codec, resolution, latency, fps, frameDrop, decode) {
        this._updateValue(this.CODEC_ID, codec)
        this._updateValue(this.RESOLUTION_ID, resolution)
        this._updateValue(this.LATENCY_ID, latency + " | " + fps)
        this._updateValue(this.FRAME_DROP_ID, frameDrop)
        this._updateValue(this.DECODE_ID, decode)
    }

    reset() {
        this.updateContent("-", "-", "-", "-", "-")
    }

    show() {
        this.element.style.display = "block"
    }

    hide() {
        this.element.style.display = "none"
    }

    getElement() {
        return this.element
    }

    _createElement() {
        const element = document.createElement("div");
        element.style.whiteSpace = "nowrap"

        element.innerHTML = `
            ${this._createMenuEntry(this.SESSION_TIME_ID, this.translations.sessiontime, "-")}
            ${this._createMenuEntry(this.CODEC_ID, this.translations.codec, "-")}
            ${this._createMenuEntry(this.RESOLUTION_ID, this.translations.resolution, "-")}
            ${this._createMenuEntry(this.LATENCY_ID, this.translations.latency + " | FPS", "- | -")}
            ${this._createMenuEntry(this.FRAME_DROP_ID, this.translations.framedrop, "-")}
            ${this._createMenuEntry(this.DECODE_ID, this.translations.decodetime, "-")}
        `

        return element
    }

    _createMenuEntry(id, label, value) {
        return `
            <div class="HPX1od">
                <div class="Qg73if">
                    <span class="zsXqkb">${label}</span>
                    <span id="${id}" class="Ce1Y1c qFZbbe">${value}</span>
                </div>
            </div>
        `
    }

    _updateValue(id, value) {
        this.element.querySelector("#" + id).textContent = value
    }
}
