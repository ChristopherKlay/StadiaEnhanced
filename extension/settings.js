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
    _storageKey

    constructor(username) {
        this._storageKey = "enhanced_" + username
    }

    getSettings() {
        const json = localStorage.getItem(this._storageKey);
        return JSON.parse(json)
    }

    saveSettings(settings) {
        let json = JSON.stringify(settings);
        localStorage.setItem(this._storageKey, json)
    }

    getMonitorMode() {
        const settings = this.getSettings()
        return settings.monitorMode
    }

    /**
     * @param {string} mode
     */
    saveMonitorMode(mode) {
        const settings = this.getSettings()
        settings.monitorMode = mode
        this.saveSettings(settings)
    }
}
