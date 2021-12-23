/**
 * Element in the main extension menu for configuring the streaming monitor on startup.
 */
class MonitorAutoStartOption {
    _COLOR_ACTIVE = "#00e0ba"

    _translations;
    _element;

    /**
     *
     * @param {Object} translations
     * @param {string} translations.streammon
     * @param {string} translations.streammondesc
     * @param {string} translations.manual
     * @param {string} translations.default
     */
    constructor(translations) {
        this._translations = translations
        this._element = this._createElement()
    }

    /**
     * @returns {HTMLDivElement}
     */
    get element() {
        return this._element;
    }

    setInactive() {
        this._updateColor("")
        this._updateContent(
            `  
                <!-- Icon -->
                <i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i>
                
                <span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">
                    <!-- Title -->
                    ${this._translations.streammon}: ${this._translations.manual}<br>
                    
                    <!-- Description -->
                    <span style="color: #fff;font-size: 0.7rem;">${this._translations.streammondesc}</span><br>

                    <!-- Default -->
                    <span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">${this._translations.default}: ${this._translations.manual}</span>
                </span>
            `
        )
    }

    /**
     * @param {string} modeTranslation
     */
    setActive(modeTranslation) {
        this._updateColor(this._COLOR_ACTIVE)
        this._updateContent(
            `
                <!-- Icon -->
                <i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i>
                
                <span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">
                    <!-- Title -->
                    ${this._translations.streammon}: ${modeTranslation}<br>
                
                    <!-- Description -->
                    <span style="color: #fff;font-size: 0.7rem;">${this._translations.streammondesc}</span><br>
    
                    <!-- Default -->
                    <span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">${this._translations.default}: ${this._translations.manual}</span>
                </span>
            `
        )
    }

    /**
     *
     * @param {function(): void} fn
     */
    onClick(fn) {
        this._element.addEventListener("click", fn)
    }

    _createElement() {
        const element = document.createElement('div');
        element.id = 'enhanced_monitorAutostart'
        element.className = 'pBvcyf QAAyWd'
        element.style.cursor = 'pointer'
        element.style.userSelect = 'none'
        element.tabIndex = '0'

        return element
    }

    _updateColor(color) {
        this._element.style.color = color
    }

    _updateContent(html) {
        this._element.innerHTML = html
    }
}
