/**
 * Function that can be called from the browser console to get debug information for the
 * extension.
 *
 * Example usage: debugEnhanced('translation');
 */

const HELP_TEXT = `
Welcome to the Stadia Enhanced debug utility!
----------------------------------------------

Please specify one of the following options:
    profile         (Prints user information and settings)
    resolution      (Prints your current and maximum browser resolution)
    restorelists    (Restores user's gameFilter, favlist and wishlist)
    translation     (Prints all available translations)
                
For example, if you want to see all available translations use the following command: 
    debugEnhanced('translation');

`;

function debugEnhanced(opt) {
    if (opt == null) {
        console.log(HELP_TEXT)
        return
    }

    switch (opt) {

        case 'profile':
            _printProfile()
            break

        case 'resolution':
            _printResolution()
            break

        case 'restorelists':
            _restoreLists();
            break

        case 'translation':
            enhanced_logTranslations()
            break

        default:
            console.log(`Unknown option '${opt}'. Run debugEnhanced(); to see supported options.`)
    }

    function _printProfile() {
        const username = _getStadiaUsername();
        const settings = _getSettings(username)
        console.table(settings)
    }

    function _printResolution() {
        const dimensions = window.screen

        let description = "Native"
        if (dimensions.availHeight === 1440) {
            description = "1440p"
        } else if (dimensions.availHeight === 2160) {
            description = "2160p / 4K"
        }

        console.log(`Your current browser resolution is set to: ${dimensions.availWidth}x${dimensions.availHeight} (${description})`)
    }

    function _restoreLists() {
        const username = _getStadiaUsername()
        const settings = _getSettings(username)

        // overwrite user's game-filter
        const gameFilter = localStorage.getItem('enhanced_gameFilter');
        if (gameFilter) {
            settings.gameFilter = gameFilter
        }

        // overwrite user's favlist
        const favlist = localStorage.getItem('enhanced_favlist');
        if (favlist) {
            settings.favoriteList = favlist
        }

        // overwrite user's wishlist
        const wishList = localStorage.getItem('enhanced_wishlist');
        if (wishList) {
            settings.wishlist = wishList
        }

        _updateSettings(username, settings)

        location.reload()
    }

    function _getStadiaUsername() {
        return document.getElementsByClassName('DlMyQd NTLMMc')[0].textContent
    }

    function _getSettings(username) {
        return JSON.parse(localStorage.getItem('enhanced_' + username))
    }

    function _updateSettings(username, settings) {
        localStorage.setItem('enhanced_' + username, JSON.stringify(settings))
    }
}
