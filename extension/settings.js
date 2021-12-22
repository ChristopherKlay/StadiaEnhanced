/**
 * Handles the retrieval and persistence of user information to local storage.
 *
 * Persisting and retrieval of user settings via localStorage is done in many different parts of the content scripts.
 * The primary purpose of this class is to store the associated methods in a single place and make them discoverable for
 * all content scripts. By adding methods for retrieving or persisting single setting values, we encapsulate the
 * specifics of the storage mechanism and prevent corrupting the settings json by accident. In addition, if the
 * persistence mechanism changes in the future, for example by using chrome storage instead of local storage, all
 * required changes can be made in this file.
 */
class SettingsService {
    _DEFAULTS = {
        version: '0.0.0',
        avatar: '',

        monitorMode: "Hidden",
        monitorAutostart: "Hidden",
        monitorPosition: '1rem|1rem', // top + "|" + left

        clockMode: 0,
        clockOption: 0,
        codec: 0,
        resolution: 0,
        gridSize: 0,
        desktopWidth: screen.width,
        desktopHeight: screen.height,
        filter: 0,
        hideMessagePreview: 0,
        hideQuickReply: 0,
        hideInlinePreview: 0,
        hideOfflineUsers: 0,
        hideInvisibleUsers: 0,
        hideLabels: 0,
        dimOverlay: 0,
        hideUserMedia: 0,
        hideCategories: 0,
        splitStore: 0,
        hideFamilySharing: 0,
        enableShortcuts: 0,
        enableStadiaDatabase: 1,
        enableStadiaHunters: 0,
        updateNotifications: 0,
        streamMode: 0,
        wishlist: "",
        gameFilter: "",
        favoriteList: "",
        postprocess: {}
    }

    _storageKey;
    _username;

    constructor(username) {
        this._username = username
        this._storageKey = "enhanced_" + username
    }

    getDefaultSettings() {
        const settings = this._DEFAULTS
        settings.user = this._username

        return settings
    }

    getSettings() {
        const json = localStorage.getItem(this._storageKey);
        return JSON.parse(json)
    }

    saveSettings(settings) {
        let json = JSON.stringify(settings);
        localStorage.setItem(this._storageKey, json)
    }

    /**
     * @returns {("Standard"|"Compact"|"Menu"|"Hidden")} - Monitor mode
     */
    getMonitorMode() {
        const settings = this.getSettings()
        return settings.monitorMode
    }

    /**
     * @param {("Standard"|"Compact"|"Menu"|"Hidden")} mode
     */
    saveMonitorMode(mode) {
        const settings = this.getSettings()
        settings.monitorMode = mode
        this.saveSettings(settings)
    }

    /**
     * Get the streaming monitor mode that should be be automatically applied on game start.
     *
     * @returns {("Standard"|"Compact"|"Menu"|"Hidden")} - Monitor mode
     */
    getMonitorAutoStart() {
        const settings = this.getSettings()
        const monitorAutoStart = settings.monitorAutostart

        // Legacy support. Possible legacy values were 0 (manual) and 1 (autostart). This will only happen on first
        // start of the new version.
        if (monitorAutoStart === 0) {
            return "Hidden"
        } else if (monitorAutoStart === 1) {
            return "Standard"
        }

        return monitorAutoStart
    }

    /**
     * Save the streaming monitor mode that should be be automatically applied on game start.
     *
     * @param {("Standard"|"Compact"|"Menu"|"Hidden")} mode - Monitor mode
     */
    saveMonitorAutoStart(mode) {
        const settings = this.getSettings()
        settings.monitorAutostart = mode
        this.saveSettings(settings)
    }
}
