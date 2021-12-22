// Version Info
var enhanced_manifest = chrome.runtime.getManifest()

// Start Up
var enhanced_timerLoadStart = window.performance.now();
var enhanced_consoleEnhanced = 'background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;'
var enhanced_local = document.querySelector("html").getAttribute('lang')

var enhanced_AccountInfo = enhanced_loadUserInfo()
if (enhanced_AccountInfo) {
    console.groupCollapsed('%cStadia Enhanced' + '%c ⚙️ - ' + enhanced_manifest.version + ': Start-Up', enhanced_consoleEnhanced, '');
    console.log('%cStadia Enhanced' + '%c ⚙️ - User: ' + enhanced_AccountInfo[0] + '#' + enhanced_AccountInfo[1] + ' (' + enhanced_AccountInfo[2] + ') (' + enhanced_local + ')', enhanced_consoleEnhanced, '')
} else {
    throw new Error("No logged in user detected.");
}
const username = enhanced_AccountInfo[0] + '#' + enhanced_AccountInfo[1]

var enhanced_extId = 'ldeakaihfnkjmelifgmbmjlphdfncbfg'
var enhanced_lang = loadTranslations(enhanced_local)

const streamDataService = new StreamDataService()

// Load existing settings
const settingsService = new SettingsService(username)
var enhanced_storedSettings = settingsService.getSettings()

// Default settings
var enhanced_settings = {
    user: username,
    version: '0.0.0',
    avatar: '',

    monitorMode: 9, // 0=Standard, 1=Compact, 2=Menu, 9=Hidden/Off
    monitorAutostart: 0, // 0=don't show on startup, 1=show on startup
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

// Merge settings
if (enhanced_storedSettings) {
    const enhanced_oldSettings = enhanced_storedSettings
    enhanced_settings.version = enhanced_oldSettings.version
    enhanced_updateSettings(enhanced_oldSettings)
    console.log('%cStadia Enhanced' + '%c ⚙️ - Profile: ' + enhanced_settings.user + ' loaded.', enhanced_consoleEnhanced, '')
} else {
    console.log('%cStadia Enhanced' + '%c ⚙️ - Profile: Not found. Generating new profile with default values.', enhanced_consoleEnhanced, '')
    settingsService.saveSettings(enhanced_settings)
}

// Check for updates
window.addEventListener('load', function () {
    window.addEventListener('click', function () {
        if (enhanced_newVersion(enhanced_settings.version, enhanced_manifest.version)) {
            switch (enhanced_settings.updateNotifications) {
                case 0:
                    enhanced_pushNotification('Update: Version ' + enhanced_manifest.version + ' - <a href="https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/changelog.md#' + enhanced_manifest.version.replaceAll(".", "") + '" target="_blank">View Changes</a>', 'https://i.imgur.com/OBav9Gt.png')
                    break
                case 1:
                    enhanced_pushNotification('Update: Version ' + enhanced_manifest.version + ' - <a href="https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/changelog.md#' + enhanced_manifest.version.replaceAll(".", "") + '" target="_blank">View Changes</a>', 'https://i.imgur.com/OBav9Gt.png', 5)
            }
            enhanced_settings.version = enhanced_manifest.version
            localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
        }
    }, {
        once: true
    })
})

/**
 *   Language Support
 * 
 *   Adds support for features not possible via DOM filtering, by using language based comparisons.
 *   Example: The "Game", or "Bundle" label in store lists.
 */
var enhanced_languageSupport = {
    supportedCodes: 'ca|da|de|en|es|fi|fr|hu|it|nl|no|pl|pt|sk|sv',
    storeFilters: {
        ca: {
            game: 'Joc',
            bundle: 'Paquet',
            addon: 'Complement',
            free: 'Gratis'
        },
        da: {
            game: 'Spil',
            bundle: 'Pakke',
            addon: 'Tilføjelse',
            free: 'DKK 0'
        },
        de: {
            game: 'Spiel',
            bundle: 'Bundle',
            addon: 'Add-on',
            free: 'Kostenlos'
        },
        en: {
            game: 'Game',
            bundle: 'Bundle',
            addon: 'Add-On',
            free: 'Free'
        },
        es: {
            game: 'Juego',
            bundle: 'Paquete',
            addon: 'Complemento',
            free: 'Gratis'
        },
        fi: {
            game: 'Peli',
            bundle: 'Paketti',
            addon: 'Laajennus',
            free: 'Maksuton'
        },
        fr: {
            game: 'Jeu',
            bundle: 'Pack',
            addon: 'Extension',
            free: 'Sans frais'
        },
        hu: {
            game: 'Játék',
            bundle: 'Csomag',
            addon: 'Kiegészítő',
            free: 'Díjmentes'
        },
        it: {
            game: 'Gioco',
            bundle: 'Bundle',
            addon: 'Contenuto aggiuntivo',
            free: 'Senza costi'
        },
        nl: {
            game: 'Game',
            bundle: 'Bundel',
            addon: 'Add-On',
            free: 'Kosteloos'
        },
        no: {
            game: 'Spill',
            bundle: 'Pakke',
            addon: 'Tillegg',
            free: 'Gratis'
        },
        pl: {
            game: 'Gra',
            bundle: 'Pakiet',
            addon: 'Dotatek',
            free: 'Bezpłatne'
        },
        pt: {
            game: 'Game',
            bundle: 'Bundle',
            addon: 'Add-On',
            free: 'Gratuito'
        },
        sk: {
            game: 'Hra',
            bundle: 'Balíček',
            addon: 'Doplnok',
            free: 'Za 0'
        },
        sv: {
            game: 'Spel',
            bundle: 'Paket',
            addon: 'Extra innehåll',
            free: 'Utan kostnad'
        }
    }
}

/**
 * CSS Changes
 * 
 * Global style changes and overwrites, as well as fixes for specific issues.
 */
var enhanced_discordActive = false
var enhanced_CSS = '.lTHVjf { padding: 0rem 1.5rem 0 1.5rem !important; }' // Remove padding above avatar
enhanced_CSS += '.VfPpkd-fmcmS-wGMbrd { text-overflow: ellipsis; }' // Fix searchbar text cutoff
enhanced_CSS += '.qE7X4e { margin-right: 0.625rem; }' // Fix searchbar margin
enhanced_CSS += '.JZQvPd { margin: 0; } .JZQvPd > .h1uihb { display: none; } .DGX7fe { width: 0; }' // Hide invite navbar icon
enhanced_CSS += '.E0Zk9b { justify-content: flex-start !important; flex-flow: row wrap; }' // Wrap menu items
enhanced_CSS += '.hxhAyf.fi8Jxd .TZ0BN { min-height: auto !important; }' // Adjust menu height
enhanced_CSS += '.GqLi4d.XUBkDd .a1l9D { margin: 0 0 .5rem .5rem !important; }' // Less padding on "Pro" lables
enhanced_CSS += '.tlZCoe { margin-right: .5rem; margin-top: .5rem !important; }' // Allow for multiple buttons on popup
enhanced_CSS += '.ozpmIc.lEPylf.sfe1Ff { padding: 4.25rem 0 4.5rem 0 !important; }' // Fix store list padding for scrollbars
enhanced_CSS += '#enhanced_showAll div { margin-left: 0 !important; }' // Fix show/hide filter margin
enhanced_CSS += '.mGdxHb.ltdNmc:hover #enhanced_shortcutLastPlayed { opacity: 1 !important; }' // Show last-played shortcut on hover only
enhanced_CSS += '#enhanced_SettingsDropContent::-webkit-scrollbar { width: 1rem; }' // Settings menu scrollbar width
enhanced_CSS += '#enhanced_SettingsDropContent::-webkit-scrollbar-thumb { background-color: #202124; border-radius: 1rem; border: 3px solid #2d2e30; }' // Settings menu scrollbar style
enhanced_CSS += '@media screen and (min-width: 1080px) { .ZjQyU { display: flex !important; } .uSz8se { display: none !important; } }' // Searchbar displayed at >1080px

// CSS Changes
enhanced_CSS += `@media screen and (max-width: 639px) {
                    #enhanced_letterBox { display: none; }
                }
                .enhanced_btnDisabled {
                    color: grey;
                    text-decoration: line-through;
                }`

// Stream Monitor
var enhanced_streamMonitorStyle = `
                #enhanced_streamMonitor {
                    color: rgba(255,255,255,0.9);
                    cursor: pointer;
                    font-family: "Roboto", sans-serif;
                    font-size: 0.6875rem;
                    position: fixed;
                    text-shadow: 1px 1px rgba(0,0,0,0.5);
                    width: fit-content;
                    z-index: 1000;
                }
                #enhanced_streamMonitor section {
                    background: rgba(32,33,36,0.8);
                    border-radius: 0.5rem 0.5rem;
                    margin-bottom: 0.4rem;
                    padding: 0 0 0.4rem 0;
                }
                #enhanced_streamMonitor section:last-of-type {
                    margin-bottom: 0;
                }
                #enhanced_streamMonitor section:only-child {
                    padding: 0 0 0.3rem 0;
                }
                #enhanced_streamMonitor .grid {
                    display: grid;
                    grid-gap: 0.2rem 0.4rem;
                    grid-template-columns: auto auto 0.8rem;
                    grid-template-rows: auto;
                    padding: 0 0.4rem 0 0.6rem;
                }
                #enhanced_streamMonitor .grid > span:nth-child(2n) {
                    text-align: end;
                }
                #enhanced_streamMonitor .connection {
                    position: relative;
                    text-align: center;
                    top: -2px;
                }
                #enhanced_streamMonitor .border {
                    border-top: 1px solid rgba(172,13,87,0.2);
                    grid-column: 1 / 4;
                }
                #enhanced_streamMonitor .split {
                    color: rgba(255,255,255,0.3);
                    display: inline-block;
                    padding: 0 0.2rem;
                }
                #enhanced_streamMonitor .tag {
                    border-radius: 0.5rem 0.5rem 0 0;  
                    background: linear-gradient(-35deg, rgba(172,13,87,0.5) 0%, rgba(252,74,31,0.5) 100%);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 900;
                    margin: 0 0 0.4rem 0;
                    padding: 0.2rem 0.4rem;
                    text-align: start;
                    text-shadow: none;
                }`

// Filter Overlay
var enhanced_filterOverlayStyle = `
                #enhanced_filterUI {
                    color: rgba(255,255,255,0.9);
                    background: rgba(32,33,36,0.8);
                    font-family: "Roboto", sans-serif;
                    font-size: 0.6875rem;
                    position: fixed;
                    margin-bottom: 0.4rem;
                    padding: 0 0 0.3rem 0;
                    border-radius: 0.5rem 0.5rem;
                    text-shadow: 1px 1px rgba(0,0,0,0.5);
                    width: fit-content;
                    z-index: 1000;
                }
                #enhanced_filterUI .grid {
                    display: grid;
                    grid-gap: 0.2rem 0.4rem;
                    grid-template-columns: auto auto;
                    grid-template-rows: auto;
                    padding: 0 0.4rem 0 0.6rem;
                }
                #enhanced_filterUI .tag {
                    border-radius: 0.5rem 0.5rem 0 0;  
                    background: linear-gradient(-35deg, rgba(172,13,87,0.5) 0%, rgba(252,74,31,0.5) 100%);
                    color: white;
                    font-size: 0.75rem;
                    font-weight: 900;
                    margin: 0 0 0.4rem 0;
                    padding: 0.2rem 0.4rem;
                    text-align: start;
                    text-shadow: none;
                }`

// Inject CSS
enhanced_injectStyle(enhanced_CSS, 'enhanced_styleGeneral')
enhanced_injectStyle(enhanced_streamMonitorStyle, 'enhanced_styleStreamMonitor')
enhanced_injectStyle(enhanced_filterOverlayStyle, 'enhanced_styleFilterOverlay')

// Stadia Hunters - Player Stats
// Source: https://stadiahunters.com/
var enhanced_stadiaHunters

function loadStadiaHunters(id) {
    chrome.runtime.sendMessage({
        action: 'stadiahunters',
        id: id
    }, function (response) {
        enhanced_stadiaHunters = JSON.parse(response)
        if (!("error" in enhanced_stadiaHunters)) {
            enhanced_huntersDropdown.querySelector('.RMEzA').textContent = enhanced_stadiaHunters.level
            enhanced_huntersDropContent.querySelector('.HDKZKb.LiQ6Hb').textContent = enhanced_lang.stadiahunterslevel + ' ' + enhanced_stadiaHunters.level
            enhanced_huntersDropContent.querySelector('.UxR5ob.m8Kzt > span').textContent = enhanced_lang.stadiahuntersworldrank + ' ' + enhanced_stadiaHunters.rank
            enhanced_huntersDropContent.querySelector('.FxJ5Tc.y2VB6d').style.width = enhanced_stadiaHunters.percentage + '%'

            enhanced_proReplace = `
                <span class="p4uZTc nLp2td" style="margin-left: 0">
                    <svg class="xduoyf" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#c1820)">
                            <path d="M16.75 5.04a.8.8 0 0 0-1.5 0l-1.54 4.2a.8.8 0 0 1-.48.47l-4.19 1.54a.8.8 0 0 0 0 1.5l4.2 1.54c.21.08.39.26.47.48l1.54 4.19a.8.8 0 0 0 1.5 0l1.54-4.2a.8.8 0 0 1 .48-.47l4.19-1.54a.8.8 0 0 0 0-1.5l-4.2-1.54a.8.8 0 0 1-.47-.48l-1.54-4.19z" fill="url(#c1821)"></path>
                            <path d="M7.47 16.28a.5.5 0 0 0-.94 0L6 17.7a.5.5 0 0 1-.3.3l-1.42.52a.5.5 0 0 0 0 .94L5.7 20a.5.5 0 0 1 .3.3l.52 1.42a.5.5 0 0 0 .94 0L8 20.3a.5.5 0 0 1 .3-.3l1.42-.52a.5.5 0 0 0 0-.94L8.3 18a.5.5 0 0 1-.3-.3l-.52-1.42z" fill="url(#c1822)"></path>
                            <path d="M5.47 3.28a.5.5 0 0 0-.94 0l-.8 2.16a.5.5 0 0 1-.3.3l-2.15.8a.5.5 0 0 0 0 .93l2.16.8a.5.5 0 0 1 .3.3l.8 2.15a.5.5 0 0 0 .93 0l.8-2.16a.5.5 0 0 1 .3-.3l2.15-.8a.5.5 0 0 0 0-.93l-2.16-.8a.5.5 0 0 1-.3-.3l-.8-2.15z" fill="url(#c1823)"></path>
                        </g>
                        <defs>
                            <linearGradient id="c1821" x1="16" y1="5.57" x2="16" y2="22.61" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FF4C1D"></stop>
                                <stop offset="1" stop-color="#9B0063"></stop>
                            </linearGradient>
                            <linearGradient id="c1822" x1="7" y1="16.14" x2="7" y2="23.71" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FF4C1D"></stop>
                                <stop offset="1" stop-color="#9B0063"></stop>
                            </linearGradient>
                            <linearGradient id="c1823" x1="5" y1="3.43" x2="5" y2="12.89" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#FF4C1D"></stop>
                                <stop offset="1" stop-color="#9B0063"></stop>
                            </linearGradient>
                            <clipPath id="c1820">
                                <path fill="#fff" transform="matrix(-1 0 0 1 24 0)" d="M0 0h24v24H0z"></path>
                            </clipPath>
                        </defs>
                    </svg>
                </span>`
        } else {
            enhanced_huntersDropContent.querySelector('.HDKZKb.LiQ6Hb').textContent = enhanced_lang.stadiahunterslogin
            enhanced_huntersDropContent.querySelector('.UxR5ob.m8Kzt > span').textContent = enhanced_lang.stadiahuntersnotfound
        }

        // Replace tag for Pro users
        if (enhanced_AccountInfo[1] == '0000') {
            enhanced_huntersDropContent.querySelector('.rmIKk.qUT0tf').outerHTML = enhanced_proReplace
        }

        // Add infos for logging
        enhanced_stadiaHunters.request = 'https://us-central1-stadiaachievements-34145.cloudfunctions.net/stadiaEnhanced?id=' + id

        console.groupCollapsed('%cStadia Enhanced' + '%c ⚙️ - Stadia Hunters: Profile Data.', enhanced_consoleEnhanced, '')
        console.table(enhanced_stadiaHunters)
        console.groupEnd()
    })
}

/**
 * Stadia Public Database
 * 
 * Author: OriginalPenguin
 * Source: https://linktr.ee/StadiaDatabase
 */
var enhanced_database = []
chrome.runtime.sendMessage({
    action: 'extdatabase'
}, function (response) {
    var data = csvToArray(response)
    for (var i = 1; i < data.length; i++) {
        var json = {
            name: data[i][0],
            maxRes: data[i][1]
                .replaceAll(' | ', ', ')
                .replace('Unsure', '')
                .replace('Not Compatible With 4K Mode', enhanced_lang.noteFive),
            fps: data[i][2]
                .replaceAll(' | ', ', ')
                .replace('30FPS', '30 FPS')
                .replace('60FPS', '60 FPS')
                .replace('60FPS in 1080p Mode', enhanced_lang.noteThree)
                .replace('30FPS in 1080p Mode', enhanced_lang.noteFour)
                .replace('30/60FPS Toggle', enhanced_lang.noteFive),
            proFeat: data[i][3]
                .replaceAll(' | ', ', ')
                .replace('4K Mode', enhanced_lang.noteOne),
            stadiaFeat: data[i][4]
                .replaceAll(' | ', ', ')
                .replace('None', enhanced_lang.unsupported),
            crossplay: data[i][5]
                .replaceAll(' | ', ', ')
                .replace('None', enhanced_lang.unsupported)
                .replace('No Cross-platform Buddy System', enhanced_lang.crossfriends),
            id: data[i][6],
            tested: data[i][7]
        }
        enhanced_database.push(json)
    }
    console.groupCollapsed('%cStadia Enhanced' + '%c ⚙️ - GitHub Database: ' + enhanced_database.length + ' entries loaded successfully.', enhanced_consoleEnhanced, '')
    console.log(enhanced_database)
    console.groupEnd()
});

// Extended Details
var enhanced_extendedDetails = document.createElement('div')
enhanced_extendedDetails.className = 'b2MCG'

// Untested Disclaimer
var enhanced_untestedDisclaimer = document.createElement('div')
enhanced_untestedDisclaimer.className = 'uM5FUc'
enhanced_untestedDisclaimer.style.marginBottom = '1.5rem'
enhanced_untestedDisclaimer.innerHTML = enhanced_lang.testdiscl

// Data Disclaimer
var enhanced_extendedDisclaimer = document.createElement('div')
enhanced_extendedDisclaimer.className = 'uM5FUc'
enhanced_extendedDisclaimer.style.marginTop = '1.5rem'
enhanced_extendedDisclaimer.innerHTML = enhanced_lang.datadiscl

/**
 * Discord Presence
 * 
 * Support for Discords "Rich Presence" feature.
 * Via DiscordRPC - https://github.com/lolamtisch/Discord-RPC-Extension/
 */

// Get presence data
var enhanced_discordPresence = {}

var enhanced_presenceData
chrome.runtime.sendMessage({
    action: 'presencedata'
}, function (response) {
    enhanced_presenceData = response
    console.groupCollapsed('%cStadia Enhanced' + '%c ⚙️ - DiscordRPC: ' + Object.keys(response).length + ' entries loaded successfully.', enhanced_consoleEnhanced, '')
    console.log(response)
    console.groupEnd()
})

// Register
chrome.runtime.sendMessage('agnaejlkbiiggajjmnpmeheigkflbnoo', {
    mode: 'active'
}, function (response) {
    if (chrome.runtime.lastError || !response) {
        console.log('%cStadia Enhanced' + '%c ⚙️ - DiscordRPC: To use the Discord presence, install: https://chrome.google.com/webstore/detail/discord-rich-presence/agnaejlkbiiggajjmnpmeheigkflbnoo', enhanced_consoleEnhanced, '');
    } else {
        console.log('%cStadia Enhanced' + '%c ⚙️ - DiscordRPC: Presence active.', enhanced_consoleEnhanced, '')
    }
})

// Wait for presence requests
chrome.runtime.onMessage.addListener(function (info, sender, sendResponse) {
    sendResponse(enhanced_discordPresence)
})

var enhanced_monitorState = 0

const monitor = new StreamMonitor(settingsService, enhanced_lang, enhanced_settings.monitorPosition)

const enhanced_streamMonitor = monitor.getElement();

enhanced_streamMonitor.addEventListener('dblclick', function () {
    // Generate new Window
    var enhanced_popMonitor = window.open('', '_blank', 'width=280,height=500,toolbar=0')
    enhanced_popMonitor.document.title = 'Stream Monitor'
    enhanced_popMonitor.document.body.style.background = "#000"
    enhanced_popMonitor.document.body.style.color = "#fff"

    // Copy styles
    var el = document.createElement('style')
    enhanced_popMonitor.document.head.appendChild(el)
    el.innerHTML = enhanced_streamMonitorStyle + '#enhanced_streamMonitor { display: block !important; }'

    // Update
    enhanced_upPop = setInterval(function () {
        if (enhanced_popMonitor.closed) {
            clearInterval(enhanced_upPop)
        } else {
            enhanced_popMonitor.document.body.innerHTML = monitor.getElement().outerHTML
        }
    }, 1000)
})

document.body.appendChild(enhanced_streamMonitor)
enhanced_dragElement(enhanced_streamMonitor)

// Streaming Monitor (Menu Icon)
var enhanced_monitorButton = monitor.iconElement

// click on menu item "stream monitor"
enhanced_monitorButton.addEventListener('click', () => {
    if (enhanced_monitorButton.disabled) {
        return
    }

    monitor.toggleMode(enhanced_settings.monitorPosition)
    enhanced_saveMonitorMode(monitor.currentMode)
});

// Update Stream Elements
setInterval(function () {
    if (!isLocation('ingame')) {
        monitor.reset(settingsService.getMonitorAutoStart())
        return
    }

    // Get local stream data
    const enhanced_streamData = streamDataService.getData();
    if (enhanced_streamData == null) {
        return;
    }

    monitor.enableIcon()

    if (enhanced_newMonitorPos != enhanced_settings.monitorPosition) {
        var enhanced_newMonitorPos = enhanced_settings.monitorPosition
        localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    }

    if (monitor.isVisible()) {
        monitor.updateValues(enhanced_streamData)
        monitor.showMode(monitor.currentMode)
    }
}, 1000)

// Filter UI
var enhanced_filterUI = {
    main: {
        frame: document.createElement('div'),
        toggle: document.createElement('div'),
        tag: document.createElement('div'),
        grid: document.createElement('div')
    },
    saturation: {
        label: document.createElement('span'),
        slider: document.createElement('input')
    },
    contrast: {
        label: document.createElement('span'),
        slider: document.createElement('input')
    },
    brightness: {
        label: document.createElement('span'),
        slider: document.createElement('input')
    },
    sharpen: {
        label: document.createElement('span'),
        slider: document.createElement('input')
    }
}

// Filter UI - Main
enhanced_filterUI.main.frame.id = 'enhanced_filterUI'
enhanced_filterUI.main.frame.style.position = 'fixed'
enhanced_filterUI.main.frame.style.bottom = '1rem'
enhanced_filterUI.main.frame.style.left = '1rem'
enhanced_filterUI.main.frame.style.display = 'none'

// Filter UI - Toggle
enhanced_filterUI.main.toggle.className = 'R2s0be'
enhanced_filterUI.main.toggle.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">movie_filter</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.filtersettings + '</span></div>'
enhanced_filterUI.main.toggle.style.cursor = 'pointer'
enhanced_filterUI.main.toggle.style.userSelect = 'none'
enhanced_filterUI.main.toggle.tabIndex = '0'
enhanced_filterUI.main.toggle.addEventListener('click', function () {
    if (enhanced_filterUI.main.frame.style.display == 'block') {
        enhanced_filterUI.main.frame.style.display = 'none'
        enhanced_injectStyle('', 'enhanced_styleDimOverlayTemp')
    } else {
        enhanced_filterUI.main.frame.style.display = 'block'
        enhanced_injectStyle('.bYYDgf { background: linear-gradient(to right, transparent 50%, rgba(0,0,0,.6) 100%) !important; }', 'enhanced_styleDimOverlayTemp')
    }
});

// Filter UI - Structure
enhanced_filterUI.main.tag.textContent = enhanced_lang.filtersettings
enhanced_filterUI.main.tag.className = 'tag'
enhanced_filterUI.main.frame.append(enhanced_filterUI.main.tag)
enhanced_filterUI.main.grid.className = 'grid'
enhanced_filterUI.main.frame.append(enhanced_filterUI.main.grid)

// Filter UI - Saturation
enhanced_filterUI.main.grid.append(enhanced_filterUI.saturation.label)
enhanced_filterUI.main.grid.append(enhanced_filterUI.saturation.slider)
enhanced_filterUI.saturation.slider.type = 'range'
enhanced_filterUI.saturation.slider.min = 0
enhanced_filterUI.saturation.slider.max = 150
enhanced_filterUI.saturation.slider.setAttribute('value', enhanced_settings.postprocess.saturation * 100)
enhanced_filterUI.saturation.slider.addEventListener("dblclick", function () {
    this.value = 100
    enhanced_updateFilters()
})
enhanced_filterUI.saturation.slider.onchange = function () {
    enhanced_updateFilters()
}

// Filter UI - Contrast
enhanced_filterUI.main.grid.append(enhanced_filterUI.contrast.label)
enhanced_filterUI.main.grid.append(enhanced_filterUI.contrast.slider)
enhanced_filterUI.contrast.slider.type = 'range'
enhanced_filterUI.contrast.slider.min = 50
enhanced_filterUI.contrast.slider.max = 150
enhanced_filterUI.contrast.slider.setAttribute('value', enhanced_settings.postprocess.contrast * 100)
enhanced_filterUI.contrast.slider.addEventListener("dblclick", function () {
    this.value = 100
    enhanced_updateFilters()
})
enhanced_filterUI.contrast.slider.onchange = function () {
    enhanced_updateFilters()
}

// Filter UI - Brightness
enhanced_filterUI.main.grid.append(enhanced_filterUI.brightness.label)
enhanced_filterUI.main.grid.append(enhanced_filterUI.brightness.slider)
enhanced_filterUI.brightness.slider.type = 'range'
enhanced_filterUI.brightness.slider.min = 50
enhanced_filterUI.brightness.slider.max = 150
enhanced_filterUI.brightness.slider.setAttribute('value', enhanced_settings.postprocess.brightness * 100)
enhanced_filterUI.brightness.slider.addEventListener("dblclick", function () {
    this.value = 100
    enhanced_updateFilters()
})
enhanced_filterUI.brightness.slider.onchange = function () {
    enhanced_updateFilters()
}

// Filter UI - Sharpen
enhanced_filterUI.main.grid.append(enhanced_filterUI.sharpen.label)
enhanced_filterUI.main.grid.append(enhanced_filterUI.sharpen.slider)
enhanced_filterUI.sharpen.slider.type = 'range'
enhanced_filterUI.sharpen.slider.min = 0
enhanced_filterUI.sharpen.slider.max = 20
enhanced_filterUI.sharpen.slider.setAttribute('value', enhanced_settings.postprocess.sharpen)
enhanced_filterUI.sharpen.slider.addEventListener("dblclick", function () {
    this.value = 0
    enhanced_updateFilters()
})
enhanced_filterUI.sharpen.slider.onchange = function () {
    enhanced_updateFilters()
}

// Filter UI - Update Settings
function enhanced_updateFilters(setup = false) {
    if (isLocation('ingame')) {
        // Get Current Game
        var enhanced_currentID = document.location.href.split('/player/')[1].split('?')[0]
        var enhanced_currentStream = document.getElementsByClassName('vvjGmc')[document.getElementsByClassName('vvjGmc').length - 1]

        // Set Transform
        if (enhanced_currentStream) {
            enhanced_currentStream.style.willChange = 'filter'
        }

        // Create Game Entry
        if (!enhanced_settings.postprocess[enhanced_currentID]) {
            enhanced_settings.postprocess[enhanced_currentID] = {
                saturation: 1,
                contrast: 1,
                brightness: 1,
                sharpen: 0
            }
        }

        // Manage user settings
        if (setup) {
            // Update with existing settings
            enhanced_filterUI.saturation.slider.value = enhanced_settings.postprocess[enhanced_currentID].saturation * 100
            enhanced_filterUI.contrast.slider.value = enhanced_settings.postprocess[enhanced_currentID].contrast * 100
            enhanced_filterUI.brightness.slider.value = enhanced_settings.postprocess[enhanced_currentID].brightness * 100
            enhanced_filterUI.sharpen.slider.value = enhanced_settings.postprocess[enhanced_currentID].sharpen
        } else {
            // Update saved settings
            enhanced_settings.postprocess[enhanced_currentID].saturation = enhanced_filterUI.saturation.slider.value / 100
            enhanced_settings.postprocess[enhanced_currentID].contrast = enhanced_filterUI.contrast.slider.value / 100
            enhanced_settings.postprocess[enhanced_currentID].brightness = enhanced_filterUI.brightness.slider.value / 100
            enhanced_settings.postprocess[enhanced_currentID].sharpen = enhanced_filterUI.sharpen.slider.value
        }

        // Update SVG Matrix
        enhanced_svgUnsharpMask.feComposite.setAttribute('k2', 1 + (0.1 * enhanced_filterUI.sharpen.slider.value))
        enhanced_svgUnsharpMask.feComposite.setAttribute('k3', 0 - (0.1 * enhanced_filterUI.sharpen.slider.value))

        // Update Filter
        if (enhanced_currentStream && enhanced_currentID) {
            var enhanced_completeFilter = ''

            if (enhanced_settings.postprocess[enhanced_currentID].saturation != 1) {
                enhanced_completeFilter += 'saturate(' + enhanced_settings.postprocess[enhanced_currentID].saturation + ') '
            }
            if (enhanced_settings.postprocess[enhanced_currentID].contrast != 1) {
                enhanced_completeFilter += 'contrast(' + enhanced_settings.postprocess[enhanced_currentID].contrast + ') '
            }
            if (enhanced_settings.postprocess[enhanced_currentID].brightness != 1) {
                enhanced_completeFilter += 'brightness(' + enhanced_settings.postprocess[enhanced_currentID].brightness + ') '
            }
            if (enhanced_settings.postprocess[enhanced_currentID].sharpen == 0) {
                enhanced_completeFilter += 'url(#)'
            } else {
                enhanced_completeFilter += 'url(#enhanced_svgUnsharpMask)'
            }
            enhanced_currentStream.style.filter = enhanced_completeFilter
        }

        // Update Labels
        enhanced_filterUI.saturation.label.textContent = enhanced_lang.saturation + ' (' + (enhanced_settings.postprocess[enhanced_currentID].saturation * 100).toFixed(0) + '%)'
        enhanced_filterUI.contrast.label.textContent = enhanced_lang.contrast + ' (' + (enhanced_settings.postprocess[enhanced_currentID].contrast * 100).toFixed(0) + '%)'
        enhanced_filterUI.brightness.label.textContent = enhanced_lang.brightness + ' (' + (enhanced_settings.postprocess[enhanced_currentID].brightness * 100).toFixed(0) + '%)'
        enhanced_filterUI.sharpen.label.textContent = enhanced_lang.sharpen + ' (' + enhanced_settings.postprocess[enhanced_currentID].sharpen + ')'

        localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    }
}

enhanced_filterApplied = false
document.body.appendChild(enhanced_filterUI.main.frame)

// Filter - SVG
var enhanced_svgNS = 'http://www.w3.org/2000/svg'
var enhanced_svg = document.createElementNS(enhanced_svgNS, 'svg')

// Unsharp Mask
var enhanced_svgUnsharpMask = {
    filter: document.createElementNS(enhanced_svgNS, 'filter'),
    feGaussianBlur: document.createElementNS(enhanced_svgNS, 'feGaussianBlur'),
    feComposite: document.createElementNS(enhanced_svgNS, 'feComposite')
}

// Filter Element
enhanced_svgUnsharpMask.filter.setAttribute('id', 'enhanced_svgUnsharpMask')
enhanced_svgUnsharpMask.filter.setAttribute('color-interpolation-filters', 'sRGB')
enhanced_svgUnsharpMask.filter.setAttribute('x', '0')
enhanced_svgUnsharpMask.filter.setAttribute('y', '0')
enhanced_svgUnsharpMask.filter.setAttribute('width', '100%')
enhanced_svgUnsharpMask.filter.setAttribute('height', '100%')

// Blur Element
enhanced_svgUnsharpMask.feGaussianBlur.setAttribute('result', 'blurOut')
enhanced_svgUnsharpMask.feGaussianBlur.setAttribute('in', 'SourceGraphic')
enhanced_svgUnsharpMask.feGaussianBlur.setAttribute('stdDeviation', '1')

// Composite
enhanced_svgUnsharpMask.feComposite.setAttribute('operator', 'arithmetic')
enhanced_svgUnsharpMask.feComposite.setAttribute('k1', 0)
enhanced_svgUnsharpMask.feComposite.setAttribute('k2', 1)
enhanced_svgUnsharpMask.feComposite.setAttribute('k3', 0)
enhanced_svgUnsharpMask.feComposite.setAttribute('k4', 0)
enhanced_svgUnsharpMask.feComposite.setAttribute('in', 'SourceGraphic')
enhanced_svgUnsharpMask.feComposite.setAttribute('in2', 'blurOut')

enhanced_svgUnsharpMask.filter.appendChild(enhanced_svgUnsharpMask.feGaussianBlur)
enhanced_svgUnsharpMask.filter.appendChild(enhanced_svgUnsharpMask.feComposite)
enhanced_svg.appendChild(enhanced_svgUnsharpMask.filter)
document.body.appendChild(enhanced_svg)

/**
 * Windowed Mode
 * 
 * Source: Mafrans - https://github.com/Mafrans/StadiaPlus
 */
var enhanced_BlockFullscreen = false
var enhanced_Windowed = document.createElement('div')
enhanced_Windowed.className = 'R2s0be'
enhanced_Windowed.id = 'enhanced_Windowed'
enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.windowed + '</span></div>'
enhanced_Windowed.style.cursor = 'pointer'
enhanced_Windowed.style.userSelect = 'none'
enhanced_Windowed.tabIndex = '0'
enhanced_Windowed.addEventListener('click', function () {
    if (enhanced_BlockFullscreen) {
        enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.windowed + '</span></div>'
        enhanced_BlockFullscreen = false
        document.documentElement.requestFullscreen()
    } else {
        enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen_exit</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.fullscreen + '</span></div>'
        enhanced_BlockFullscreen = true
        document.exitFullscreen()
    }
});
window.addEventListener('fullscreenchange', function (event) {
    if (enhanced_BlockFullscreen) {
        event.stopPropagation()
    }
}, true)

// Emoji Picker
var enhanced_emojiswitch = document.createElement('div')
enhanced_emojiswitch.innerHTML = '😃'
enhanced_emojiswitch.style.marginLeft = '1rem'
enhanced_emojiswitch.style.cursor = 'pointer'
enhanced_emojiswitch.addEventListener('click', function () {
    if (enhanced_emojiPicker.style.display == 'none') {
        enhanced_emojiPicker.style.display = 'flex'
        if (document.querySelector('div[jsname="IbgIAb"] .emG1mb')) {
            document.querySelectorAll('div[jsname="IbgIAb"] .emG1mb')[document.querySelectorAll('div[jsname="IbgIAb"] .emG1mb').length - 1].scrollIntoView(false)
        }
    } else {
        enhanced_emojiPicker.style.display = 'none'
    }
})

var enhanced_emojiPicker = document.createElement('div')
enhanced_emojiPicker.style.width = 'auto'
enhanced_emojiPicker.style.height = '10rem'
enhanced_emojiPicker.style.margin = '0 1rem 0.5rem'
enhanced_emojiPicker.style.overflowY = 'scroll'
enhanced_emojiPicker.style.overflowX = 'hidden'
enhanced_emojiPicker.style.fontSize = '1.4rem'
enhanced_emojiPicker.style.cursor = 'pointer'
enhanced_emojiPicker.style.flexWrap = 'wrap'
enhanced_emojiPicker.style.justifyContent = 'space-around'
enhanced_emojiPicker.style.userSelect = 'none'
enhanced_emojiPicker.style.borderRadius = '0.5rem'
enhanced_emojiPicker.style.display = 'none'

enhanced_emojiPicker.addEventListener('click', function (i) {
    document.querySelector('.m0BtMe').focus()
    document.execCommand('insertText', false, i.target.textContent)
})

window.addEventListener('click', function (e) {
    if (e.target != enhanced_emojiswitch && e.target != enhanced_emojiPicker && enhanced_emojiPicker.contains(e.target) === false) {
        enhanced_emojiPicker.style.display = 'none'
    }
})

var enhanced_dummy
var enhanced_emojiRange = [
    [128513, 128591],
    [9994, 9996],
    [128070, 128079],
    [128640, 128676],
    [127747, 127776],
    [127799, 127891],
    [127908, 127946],
    [128012, 128061],
    [128138, 128191],
    [128247, 128252],
    [128336, 128347]
]
for (var i = 0; i < enhanced_emojiRange.length; i++) {
    var range = enhanced_emojiRange[i];
    for (var x = range[0]; x < range[1]; x++) {
        enhanced_dummy = document.createElement('span')
        enhanced_dummy.style.width = '2rem'
        enhanced_dummy.value = x
        enhanced_dummy.innerHTML = '&#' + x + ';'
        enhanced_emojiPicker.appendChild(enhanced_dummy)
    }
}

// Clock Widget - Adds a little clock at the bottom of the friends menu
var enhanced_ClockFriends = document.createElement('div')
enhanced_ClockFriends.id = 'enhanced_ClockFriends'
enhanced_ClockFriends.innerHTML = '00:00:00'
enhanced_ClockFriends.style.backgroundColor = 'rgba(255,255,255,.06)'
enhanced_ClockFriends.style.fontFamily = '"Google Sans",sans-serif'
enhanced_ClockFriends.style.fontSize = '0.875rem'
enhanced_ClockFriends.style.lineHeight = '1.25rem'
enhanced_ClockFriends.style.fontWeight = '500'
enhanced_ClockFriends.style.userSelect = 'none'
enhanced_ClockFriends.style.padding = '0.5rem 1rem'
enhanced_ClockFriends.style.cursor = 'pointer'
enhanced_ClockFriends.style.display = 'flex'
enhanced_ClockFriends.style.alignItems = 'center'
enhanced_ClockFriends.style.justifyContent = 'center'
enhanced_ClockFriends.style.zIndex = '20'
enhanced_ClockFriends.addEventListener('click', function () {
    enhanced_settings.clockMode = (enhanced_settings.clockMode + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
})

// Overlay Clock - Adds a overlay clock element to the game stream
var enhanced_ClockOverlay = document.createElement('div')
enhanced_ClockOverlay.id = 'enhanced_ClockOverlay'
enhanced_ClockOverlay.innerHTML = '00:00:00'
enhanced_ClockOverlay.style.position = 'fixed'
enhanced_ClockOverlay.style.left = '1rem'
enhanced_ClockOverlay.style.top = '1rem'
enhanced_ClockOverlay.style.fontFamily = '"Google Sans",sans-serif'
enhanced_ClockOverlay.style.fontSize = '3.5rem'
enhanced_ClockOverlay.style.lineHeight = '5rem'
enhanced_ClockOverlay.style.fontWeight = '500'
enhanced_ClockOverlay.style.userSelect = 'none'
enhanced_ClockOverlay.style.padding = '0'
enhanced_ClockOverlay.style.cursor = 'pointer'
enhanced_ClockOverlay.style.alignItems = 'center'
enhanced_ClockOverlay.style.justifyContent = 'center'
enhanced_ClockOverlay.style.zIndex = '20'
enhanced_ClockOverlay.addEventListener('click', function () {
    enhanced_settings.clockMode = (enhanced_settings.clockMode + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
})

// Pro Games - Adds a quick access to the current list of 'Pro' titles on Stadia
var enhanced_ProGames = document.createElement('li')
enhanced_ProGames.className = 'OfFb0b R22fdd'
enhanced_ProGames.id = 'enhanced_ProGames'
var enhanced_ProGamesLink = document.createElement('a')
enhanced_ProGames.appendChild(enhanced_ProGamesLink)
enhanced_ProGamesLink.className = 'ROpnrd QAAyWd wJYinb'
enhanced_ProGamesLink.textContent = 'Pro'
enhanced_ProGamesLink.addEventListener('click', function () {
    openStadia('store/list/2001')
})
if (document.getElementsByClassName('ZECEje')[0] !== undefined) {
    document.getElementsByClassName('ZECEje')[0].append(enhanced_ProGames)
}

// Store Dropdown - Adds a dropdown menu for quick access
var enhanced_StoreContainer = document.createElement('li')
enhanced_StoreContainer.className = 'OfFb0b R22fdd'
enhanced_StoreContainer.id = 'enhanced_StoreContainer'
var enhanced_StoreDropdown = document.createElement('div')
enhanced_StoreContainer.appendChild(enhanced_StoreDropdown)
enhanced_StoreDropdown.className = 'ROpnrd QAAyWd wJYinb'
enhanced_StoreDropdown.id = 'enhanced_StoreDropdown'
enhanced_StoreDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>'
enhanced_StoreDropdown.style.position = 'relative'
enhanced_StoreDropdown.style.width = '2.5rem'
enhanced_StoreDropdown.style.padding = '0'
enhanced_StoreDropdown.style.cursor = 'pointer'
enhanced_StoreDropdown.style.userSelect = 'none'
enhanced_StoreDropdown.tabIndex = '0'
enhanced_StoreDropdown.addEventListener('click', function () {
    if (enhanced_StoreDropContent.style.display === 'none') {
        enhanced_StoreDropContent.style.display = 'block'
    } else {
        enhanced_StoreDropContent.style.display = 'none'
    }
})

var enhanced_StoreDropContent = document.createElement('div')
enhanced_StoreDropdown.append(enhanced_StoreDropContent)
enhanced_StoreDropContent.id = 'enhanced_StoreDropContent'
enhanced_StoreDropContent.className = 'us22N'
enhanced_StoreDropContent.style.position = 'absolute'
enhanced_StoreDropContent.style.width = 'auto'
enhanced_StoreDropContent.style.top = '3.5rem'
enhanced_StoreDropContent.style.boxShadow = '0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)'
enhanced_StoreDropContent.style.zIndex = '20'
enhanced_StoreDropContent.style.display = 'none'

if (document.getElementsByClassName('ZECEje')[0] !== undefined) {
    document.getElementsByClassName('ZECEje')[0].append(enhanced_StoreContainer)
}

enhanced_StoreDropdown.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        enhanced_StoreDropdown.click()
    }
})

window.addEventListener('click', function (e) {
    if (e.target != enhanced_StoreDropdown && enhanced_StoreDropdown.contains(e.target) === false) {
        enhanced_StoreDropContent.style.display = 'none'
    }
})

// On Sale - Quick access to the list of deals available for 'Base' users
var enhanced_OnSale = document.createElement('div')
enhanced_OnSale.className = 'pBvcyf QAAyWd'
enhanced_OnSale.id = 'enhanced_OnSale'
enhanced_OnSale.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">local_offer</i><span class="mJVLwb">' + enhanced_lang.onsale + '</span>'
enhanced_OnSale.style.cursor = 'pointer'
enhanced_OnSale.style.userSelect = 'none'
enhanced_OnSale.style.paddingRight = '2rem'
enhanced_OnSale.tabIndex = '0'
enhanced_OnSale.addEventListener('click', function () {
    openStadia('store/list/14')
});
enhanced_StoreDropContent.append(enhanced_OnSale)

// Pro Deals - Quick access to the list of deals available for 'Pro' users
var enhanced_ProDeals = document.createElement('div')
enhanced_ProDeals.className = 'pBvcyf QAAyWd'
enhanced_ProDeals.id = 'enhanced_ProDeals'
enhanced_ProDeals.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">loyalty</i><span class="mJVLwb">' + enhanced_lang.prodeals + '</span>'
enhanced_ProDeals.style.cursor = 'pointer'
enhanced_ProDeals.style.userSelect = 'none'
enhanced_ProDeals.style.paddingRight = '2rem'
enhanced_ProDeals.tabIndex = '0'
enhanced_ProDeals.addEventListener('click', function () {
    openStadia('store/list/45')
})
enhanced_StoreDropContent.append(enhanced_ProDeals)

// Leaving Pro - Quick access to a list of games leaving Pro soon
var enhanced_leavePro = document.createElement('div')
enhanced_leavePro.className = 'pBvcyf QAAyWd'
enhanced_leavePro.id = 'enhanced_leavePro'
enhanced_leavePro.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">event</i><span class="mJVLwb">' + enhanced_lang.leavepro + '</span>'
enhanced_leavePro.style.cursor = 'pointer'
enhanced_leavePro.style.userSelect = 'none'
enhanced_leavePro.style.paddingRight = '2rem'
enhanced_leavePro.tabIndex = '0'
enhanced_leavePro.addEventListener('click', function () {
    openStadia('store/list/36')
})
enhanced_StoreDropContent.append(enhanced_leavePro)

// Ubisoft+
var enhanced_ubiPlus = document.createElement('div')
enhanced_ubiPlus.className = 'pBvcyf QAAyWd'
enhanced_ubiPlus.id = 'enhanced_ubiPlus'
enhanced_ubiPlus.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subscriptions</i><span class="mJVLwb">Ubisoft+</span>'
enhanced_ubiPlus.style.cursor = 'pointer'
enhanced_ubiPlus.style.userSelect = 'none'
enhanced_ubiPlus.style.paddingRight = '2rem'
enhanced_ubiPlus.tabIndex = '0'
enhanced_ubiPlus.addEventListener('click', function () {
    openStadia('store/list/2002')
})
enhanced_StoreDropContent.append(enhanced_ubiPlus)

// All games - Quick access to a list of all games currently available on Stadia
var enhanced_AllGames = document.createElement('div')
enhanced_AllGames.className = 'pBvcyf QAAyWd'
enhanced_AllGames.id = 'enhanced_AllGames'
enhanced_AllGames.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">list</i><span class="mJVLwb">' + enhanced_lang.allgames + '</span>'
enhanced_AllGames.style.cursor = 'pointer'
enhanced_AllGames.style.userSelect = 'none'
enhanced_AllGames.style.paddingRight = '2rem'
enhanced_AllGames.tabIndex = '0'
enhanced_AllGames.addEventListener('click', function () {
    openStadia('store/list/3')
})
enhanced_StoreDropContent.append(enhanced_AllGames)

// Language Dropdown - Adds a dropdown menu for language switching
var enhanced_langContainer = document.createElement('li')
enhanced_langContainer.className = 'OfFb0b tj2D'
enhanced_langContainer.style.margin = '0 0 0 0.625rem'
enhanced_langContainer.id = 'enhanced_langContainer'
var enhanced_langDropdown = document.createElement('div')
enhanced_langContainer.appendChild(enhanced_langDropdown)
enhanced_langDropdown.className = 'ROpnrd QAAyWd wJYinb'
enhanced_langDropdown.id = 'enhanced_langDropdown'
enhanced_langDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">language</i>'
enhanced_langDropdown.style.position = 'relative'
enhanced_langDropdown.style.width = '2.5rem'
enhanced_langDropdown.style.padding = '0'
enhanced_langDropdown.style.cursor = 'pointer'
enhanced_langDropdown.style.userSelect = 'none'
enhanced_langDropdown.tabIndex = '0'
enhanced_langDropdown.addEventListener('click', function () {
    if (enhanced_langDropContent.style.display === 'none') {
        enhanced_langDropContent.style.display = 'block'
        enhanced_langDropContent.scrollTop = 0
        enhanced_langDropdown.firstElementChild.style.color = '#ff773d'
    } else {
        enhanced_langDropContent.style.display = 'none'
        enhanced_langDropdown.firstElementChild.style.color = ''
    }
})

var enhanced_langDropContent = document.createElement('div')
enhanced_langDropdown.append(enhanced_langDropContent)
enhanced_langDropContent.id = 'enhanced_langDropContent'
enhanced_langDropContent.className = 'us22N'
enhanced_langDropContent.style.position = 'absolute'
enhanced_langDropContent.style.width = 'auto'
enhanced_langDropContent.style.height = '20rem'
enhanced_langDropContent.style.overflowY = 'scroll'
enhanced_langDropContent.style.top = '3.5rem'
enhanced_langDropContent.style.boxShadow = '0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)'
enhanced_langDropContent.style.zIndex = '20'
enhanced_langDropContent.style.display = 'none'

// Language Select - Default
var enhanced_langDefault = document.createElement('div')
enhanced_langDefault.className = 'pBvcyf QAAyWd'
enhanced_langDefault.innerHTML = '<span class="mJVLwb" style="padding: 0.5rem 0;">' + enhanced_lang.default+'</span>'
enhanced_langDefault.style.cursor = 'pointer'
enhanced_langDefault.style.userSelect = 'none'
enhanced_langDefault.style.padding = '0 2rem'
enhanced_langDefault.style.textAlign = 'center'
enhanced_langDefault.tabIndex = '0'
enhanced_langDefault.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_langDefault.addEventListener('click', function () {
    enhanced_urlGoal = document.location.pathname.substring(1).replace(/u\/[0-9]\//, '')
    enhanced_urlBase = new URL(window.location.href)
    enhanced_urlBase.searchParams.delete('hl')
    history.replaceState(null, null, '?' + enhanced_urlBase.searchParams);
    openStadia(enhanced_urlGoal)
});
enhanced_langDropContent.append(enhanced_langDefault)

// Language Select - Options
var enhanced_langCodes = {
    Catalan: 'ca',
    Danish: 'da',
    Dutch: 'nl',
    English: 'en',
    French: 'fr',
    German: 'de',
    Hungary: 'hu',
    Italian: 'it',
    Portuguese: 'pt',
    Spanish: 'es',
    Slovak: 'sk',
    Swedish: 'sv',
    Esperanto: 'eo'
}

for (const [key, value] of Object.entries(enhanced_langCodes)) {
    if (value != enhanced_local) {
        var enhanced_langOption = document.createElement('div')
        enhanced_langOption.className = 'pBvcyf QAAyWd'
        enhanced_langOption.innerHTML = '<span class="mJVLwb" style="padding: 0.5rem 0;">' + key + '</span>'
        enhanced_langOption.style.cursor = 'pointer'
        enhanced_langOption.style.userSelect = 'none'
        enhanced_langOption.style.padding = '0 2rem'
        enhanced_langOption.style.textAlign = 'center'
        enhanced_langOption.tabIndex = '0'
        enhanced_langOption.addEventListener('click', function () {
            enhanced_urlGoal = document.location.pathname.substring(1).replace(/u\/[0-9]\//, '')
            enhanced_urlBase = new URL(window.location.href)
            enhanced_urlBase.searchParams.set('hl', value)
            history.replaceState(null, null, '?' + enhanced_urlBase.searchParams);
            openStadia(enhanced_urlGoal)
        });
        enhanced_langDropContent.append(enhanced_langOption);
    }
}

secureInsert(enhanced_langContainer, 'ZECEje', 1)

enhanced_langDropdown.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        enhanced_langDropdown.click()
    }
});

window.addEventListener('click', function (e) {
    if (e.target != enhanced_langDropdown && enhanced_langDropdown.contains(e.target) === false) {
        enhanced_langDropContent.style.display = 'none'
        enhanced_langDropdown.firstElementChild.style.color = ''
    }
})

// Settings Dropdown - Adds a dropdown menu for quick access
var enhanced_SettingsContainer = document.createElement('li')
enhanced_SettingsContainer.className = 'OfFb0b tj2D'
enhanced_SettingsContainer.style.margin = '0 0 0 0.625rem'
enhanced_SettingsContainer.id = 'enhanced_SettingsContainer'
var enhanced_SettingsDropdown = document.createElement('div')
enhanced_SettingsContainer.appendChild(enhanced_SettingsDropdown)
enhanced_SettingsDropdown.className = 'ROpnrd QAAyWd wJYinb'
enhanced_SettingsDropdown.id = 'enhanced_SettingsDropdown'
enhanced_SettingsDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">menu</i>'
enhanced_SettingsDropdown.style.cursor = 'pointer'
enhanced_SettingsDropdown.style.width = '2.5rem'
enhanced_SettingsDropdown.style.padding = '0'
enhanced_SettingsDropdown.style.userSelect = 'none'
enhanced_SettingsDropdown.tabIndex = '0'
enhanced_SettingsDropdown.addEventListener('click', function (e) {
    if (document.querySelector('.X1asv.ahEBEd.LJni0').style.opacity == '1') {
        document.querySelector('.hBNsYe.QAAyWd.wJYinb.YySNWc').click()
    }
    if (e.path.indexOf(enhanced_settingsFrame) == -1) {
        if (enhanced_settingsFrame.style.display === 'none') {
            enhanced_settingsFrame.style.display = 'flex'
            enhanced_SettingsDropdown.firstElementChild.style.color = '#ff773d'
        } else {
            enhanced_settingsFrame.style.display = 'none'
            enhanced_SettingsDropdown.firstElementChild.style.color = ''
        }
    }
})

enhanced_SettingsDropdown.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        enhanced_SettingsDropdown.click()
    }
})

window.addEventListener('click', function (e) {
    if (e.path.indexOf(enhanced_SettingsDropdown) == -1) {
        enhanced_settingsFrame.style.display = 'none'
        enhanced_SettingsDropdown.firstElementChild.style.color = ''
    }
})

// Settings - Frame
var enhanced_settingsFrame = document.createElement('div')
enhanced_settingsFrame.style.display = 'none'
enhanced_settingsFrame.style.position = 'fixed'
enhanced_settingsFrame.style.top = '4rem'
enhanced_settingsFrame.style.right = '1.5rem'
enhanced_settingsFrame.style.width = '40rem'
enhanced_settingsFrame.style.maxWidth = 'calc(100% - 3rem)'
enhanced_settingsFrame.style.height = '19.8rem'
enhanced_settingsFrame.style.color = 'rgba(255,255,255,.9)'
enhanced_settingsFrame.style.borderRadius = '0.5rem'
enhanced_settingsFrame.style.overflow = 'hidden'
enhanced_settingsFrame.style.boxShadow = '0 0.125rem 0.75rem rgb(0 0 0 / 32%), 0 0.0625rem 0.375rem rgb(0 0 0 / 18%)'

// Settings - Navigation
var enhanced_settingsNav = document.createElement('div')
enhanced_settingsNav.className = 'us22N';
enhanced_settingsNav.style.display = 'flex'
enhanced_settingsNav.style.width = '12rem'
enhanced_settingsNav.style.flexDirection = 'column'
enhanced_settingsNav.style.alignItems = 'stretch'
enhanced_settingsNav.style.flexWrap = 'nowrap'
enhanced_settingsNav.style.borderRadius = '0'
enhanced_settingsNav.style.background = '#212224'
enhanced_settingsNav.style.borderRight = '1px solid rgba(255, 255, 255, 0.06)'
enhanced_settingsFrame.append(enhanced_settingsNav)

// Settings - Content
var enhanced_settingsContent = document.createElement('div')
enhanced_settingsContent.className = 'us22N';
enhanced_settingsContent.style.width = '100%'
enhanced_settingsContent.style.cursor = 'default'
enhanced_settingsContent.style.overflowY = 'auto'
enhanced_settingsContent.style.overflowX = 'hidden'
enhanced_settingsContent.style.background = '#2d2e30'
enhanced_settingsContent.style.borderRadius = '0'
enhanced_settingsFrame.append(enhanced_settingsContent)

enhanced_SettingsDropdown.append(enhanced_settingsFrame)
secureInsert(enhanced_SettingsContainer, 'ZECEje', 1)

// Settings - Groups
var enhanced_settingsShortcut = document.createElement('div')
var enhanced_settingsStream = document.createElement('div')
var enhanced_settingsGeneral = document.createElement('div')
var enhanced_settingsMessages = document.createElement('div')
var enhanced_settingsComFeat = document.createElement('div')
var enhanced_settingsEnhanced = document.createElement('div')
enhanced_settingsContent.appendChild(enhanced_settingsShortcut)

// Navigation - Shortcuts
var enhanced_settingsShortcutTitle = document.createElement('div')
enhanced_settingsShortcutTitle.className = 'pBvcyf QAAyWd'
enhanced_settingsShortcutTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.quickaccess + '</span>'
enhanced_settingsShortcutTitle.style.cursor = 'pointer'
enhanced_settingsShortcutTitle.style.userSelect = 'none'
enhanced_settingsShortcutTitle.style.textAlign = 'center'
enhanced_settingsShortcutTitle.style.padding = '0 1rem'
enhanced_settingsShortcutTitle.style.borderBottom = '1px solid rgba(255, 255, 255, 0)'
enhanced_settingsShortcutTitle.addEventListener('click', function () {
    enhanced_settingsContent.innerHTML = ''
    enhanced_settingsContent.scrollTop = 0
    enhanced_settingsContent.append(enhanced_settingsShortcut)
})
enhanced_settingsNav.append(enhanced_settingsShortcutTitle)

// Navigation - Streaming
var enhanced_settingsStreamTitle = document.createElement('div')
enhanced_settingsStreamTitle.className = 'pBvcyf QAAyWd'
enhanced_settingsStreamTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.stream + '</span>'
enhanced_settingsStreamTitle.style.cursor = 'pointer'
enhanced_settingsStreamTitle.style.userSelect = 'none'
enhanced_settingsStreamTitle.style.textAlign = 'center'
enhanced_settingsStreamTitle.style.padding = '0 1rem'
enhanced_settingsStreamTitle.style.borderBottom = '1px solid rgba(255, 255, 255, 0)'
enhanced_settingsStreamTitle.addEventListener('click', function () {
    enhanced_settingsContent.innerHTML = ''
    enhanced_settingsContent.scrollTop = 0
    enhanced_settingsContent.append(enhanced_settingsStream)
})
enhanced_settingsNav.append(enhanced_settingsStreamTitle)

// Navigation - Interface
var enhanced_settingsGeneralTitle = document.createElement('div')
enhanced_settingsGeneralTitle.className = 'pBvcyf QAAyWd'
enhanced_settingsGeneralTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.interface + '</span>'
enhanced_settingsGeneralTitle.style.cursor = 'pointer'
enhanced_settingsGeneralTitle.style.userSelect = 'none'
enhanced_settingsGeneralTitle.style.textAlign = 'center'
enhanced_settingsGeneralTitle.style.padding = '0 1rem'
enhanced_settingsGeneralTitle.style.borderBottom = '1px solid rgba(255, 255, 255, 0)'
enhanced_settingsGeneralTitle.addEventListener('click', function () {
    enhanced_settingsContent.innerHTML = ''
    enhanced_settingsContent.scrollTop = 0
    enhanced_settingsContent.append(enhanced_settingsGeneral)
})
enhanced_settingsNav.append(enhanced_settingsGeneralTitle)

// Navigation - Messages
var enhanced_settingsMessagesTitle = document.createElement('div')
enhanced_settingsMessagesTitle.className = 'pBvcyf QAAyWd'
enhanced_settingsMessagesTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.messages + '</span>'
enhanced_settingsMessagesTitle.style.cursor = 'pointer'
enhanced_settingsMessagesTitle.style.userSelect = 'none'
enhanced_settingsMessagesTitle.style.textAlign = 'center'
enhanced_settingsMessagesTitle.style.padding = '0 1rem'
enhanced_settingsMessagesTitle.style.borderBottom = '1px solid rgba(255, 255, 255, 0)'
enhanced_settingsMessagesTitle.addEventListener('click', function () {
    enhanced_settingsContent.innerHTML = ''
    enhanced_settingsContent.scrollTop = 0
    enhanced_settingsContent.append(enhanced_settingsMessages)
})
enhanced_settingsNav.append(enhanced_settingsMessagesTitle)

// Navigation - Community Features
var enhanced_settingsComFeatTitle = document.createElement('div')
enhanced_settingsComFeatTitle.className = 'pBvcyf QAAyWd'
enhanced_settingsComFeatTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.comfeature + '</span>'
enhanced_settingsComFeatTitle.style.cursor = 'pointer'
enhanced_settingsComFeatTitle.style.userSelect = 'none'
enhanced_settingsComFeatTitle.style.textAlign = 'center'
enhanced_settingsComFeatTitle.style.padding = '0 1rem'
enhanced_settingsComFeatTitle.style.borderBottom = '1px solid rgba(255, 255, 255, 0)'
enhanced_settingsComFeatTitle.addEventListener('click', function () {
    enhanced_settingsContent.innerHTML = ''
    enhanced_settingsContent.scrollTop = 0
    enhanced_settingsContent.append(enhanced_settingsComFeat)
})
enhanced_settingsNav.append(enhanced_settingsComFeatTitle)

// Navigation - Project Shortcuts
var enhanced_settingsEnhancedTitle = document.createElement('div')
enhanced_settingsEnhancedTitle.className = 'pBvcyf QAAyWd'
enhanced_settingsEnhancedTitle.innerHTML = '<span class="mJVLwb">Stadia Enhanced</span>'
enhanced_settingsEnhancedTitle.style.cursor = 'pointer'
enhanced_settingsEnhancedTitle.style.userSelect = 'none'
enhanced_settingsEnhancedTitle.style.textAlign = 'center'
enhanced_settingsEnhancedTitle.style.padding = '0 1rem'
enhanced_settingsEnhancedTitle.style.borderBottom = '1px solid rgba(255, 255, 255, 0)'
enhanced_settingsEnhancedTitle.addEventListener('click', function () {
    enhanced_settingsContent.innerHTML = ''
    enhanced_settingsContent.scrollTop = 0
    enhanced_settingsContent.append(enhanced_settingsEnhanced)
})
enhanced_settingsNav.append(enhanced_settingsEnhancedTitle)

// My Profile - Shortcut to the users profile
var enhanced_UserProfile = document.createElement('div')
enhanced_UserProfile.className = 'pBvcyf QAAyWd'
enhanced_UserProfile.id = 'enhanced_UserProfile'
enhanced_UserProfile.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb">' + enhanced_lang.userprofile + '</span>'
enhanced_UserProfile.style.cursor = 'pointer'
enhanced_UserProfile.style.userSelect = 'none'
enhanced_UserProfile.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_UserProfile.tabIndex = '0'
enhanced_UserProfile.addEventListener('click', function () {
    openStadia('profile/' + enhanced_AccountInfo[2])
})
enhanced_settingsShortcut.append(enhanced_UserProfile)

// Captures - A shortcut to the screenshots & videos of the current user
var enhanced_UserMedia = document.createElement('div')
enhanced_UserMedia.className = 'pBvcyf QAAyWd'
enhanced_UserMedia.id = 'enhanced_UserMedia'
enhanced_UserMedia.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">camera_alt</i><span class="mJVLwb">' + enhanced_lang.usermedia + '</span>'
enhanced_UserMedia.style.cursor = 'pointer'
enhanced_UserMedia.style.userSelect = 'none'
enhanced_UserMedia.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_UserMedia.tabIndex = '0'
enhanced_UserMedia.addEventListener('click', function () {
    openStadia('captures')
})
enhanced_settingsShortcut.append(enhanced_UserMedia)

// Speedtest - Shortcut to M-Lab test
var enhanced_speedTest = document.createElement('div')
enhanced_speedTest.className = 'pBvcyf QAAyWd'
enhanced_speedTest.id = 'enhanced_speedTest'
enhanced_speedTest.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speed</i><span class="mJVLwb">' + enhanced_lang.speedtest + '</span>'
enhanced_speedTest.style.cursor = 'pointer'
enhanced_speedTest.style.userSelect = 'none'
enhanced_speedTest.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_speedTest.tabIndex = '0'
enhanced_speedTest.addEventListener('click', function () {
    window.open('https://projectstream.google.com/speedtest', '_blank')
})
enhanced_settingsShortcut.append(enhanced_speedTest)

// Community - Shortcut to community page
var enhanced_communityPage = document.createElement('div')
enhanced_communityPage.className = 'pBvcyf QAAyWd'
enhanced_communityPage.id = 'enhanced_communityPage'
enhanced_communityPage.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">forum</i><span class="mJVLwb">' + enhanced_lang.community + '</span>'
enhanced_communityPage.style.cursor = 'pointer'
enhanced_communityPage.style.userSelect = 'none'
enhanced_communityPage.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_communityPage.tabIndex = '0'
enhanced_communityPage.addEventListener('click', function () {
    window.open('https://community.stadia.com/', '_blank')
})
enhanced_settingsShortcut.append(enhanced_communityPage)

// GitHub - Shortcut to GitHub project
var enhanced_GitHubLink = document.createElement('div')
enhanced_GitHubLink.className = 'pBvcyf QAAyWd'
enhanced_GitHubLink.id = 'enhanced_GitHubLink'
enhanced_GitHubLink.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">code</i><span class="mJVLwb">GitHub</span>'
enhanced_GitHubLink.style.cursor = 'pointer'
enhanced_GitHubLink.style.userSelect = 'none'
enhanced_GitHubLink.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_GitHubLink.tabIndex = '0'
enhanced_GitHubLink.addEventListener('click', function () {
    window.open('https://github.com/ChristopherKlay/StadiaEnhanced', '_blank')
})
enhanced_settingsEnhanced.append(enhanced_GitHubLink)

// Changelog - Shortcut to changelog
var enhanced_ChangelogLink = document.createElement('div')
enhanced_ChangelogLink.className = 'pBvcyf QAAyWd'
enhanced_ChangelogLink.id = 'enhanced_ChangelogLink'
enhanced_ChangelogLink.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">description</i><span class="mJVLwb">Changelog</span>'
enhanced_ChangelogLink.style.cursor = 'pointer'
enhanced_ChangelogLink.style.userSelect = 'none'
enhanced_ChangelogLink.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_ChangelogLink.tabIndex = '0'
enhanced_ChangelogLink.addEventListener('click', function () {
    window.open('https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/changelog.md', '_blank')
})
enhanced_settingsEnhanced.append(enhanced_ChangelogLink)

// Bug Report
var enhanced_ReportIssue = document.createElement('div')
enhanced_ReportIssue.className = 'pBvcyf QAAyWd'
enhanced_ReportIssue.id = 'enhanced_ReportIssue'
enhanced_ReportIssue.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">bug_report</i><span class="mJVLwb">' + enhanced_lang.reportbug + '</span>'
enhanced_ReportIssue.style.cursor = 'pointer'
enhanced_ReportIssue.style.userSelect = 'none'
enhanced_ReportIssue.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_ReportIssue.tabIndex = '0'
enhanced_ReportIssue.addEventListener('click', function () {
    window.open('https://github.com/ChristopherKlay/StadiaEnhanced/issues', '_blank')
})
enhanced_settingsEnhanced.append(enhanced_ReportIssue)

// Ko-fi - Shortcut to donations
var enhanced_CoffeeLink = document.createElement('div')
enhanced_CoffeeLink.className = 'pBvcyf QAAyWd'
enhanced_CoffeeLink.id = 'enhanced_ChangelogLink'
enhanced_CoffeeLink.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">coffee</i><span class="mJVLwb">' + enhanced_lang.donations + '</span>'
enhanced_CoffeeLink.style.cursor = 'pointer'
enhanced_CoffeeLink.style.userSelect = 'none'
enhanced_CoffeeLink.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_CoffeeLink.tabIndex = '0'
enhanced_CoffeeLink.addEventListener('click', function () {
    window.open('https://ko-fi.com/christopherklay', '_blank')
})
enhanced_settingsEnhanced.append(enhanced_CoffeeLink)

// Codec - Control element for the stream codec
var enhanced_Codec = document.createElement('div')
enhanced_Codec.className = 'pBvcyf QAAyWd'
enhanced_Codec.id = 'enhanced_Codec'
enhanced_Codec.style.cursor = 'pointer'
enhanced_Codec.style.userSelect = 'none'
enhanced_Codec.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_Codec.tabIndex = '0'
enhanced_Codec.addEventListener('click', function () {
    enhanced_settings.codec = (enhanced_settings.codec + 1) % 3
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('codec', enhanced_settings.codec)
})
enhanced_settingsStream.append(enhanced_Codec)

// Resolution - Control element for the stream resolution
var enhanced_Resolution = document.createElement('div')
enhanced_Resolution.className = 'pBvcyf QAAyWd'
enhanced_Resolution.id = 'enhanced_Resolution'
enhanced_Resolution.style.cursor = 'pointer'
enhanced_Resolution.style.userSelect = 'none'
enhanced_Resolution.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_UserMedia.tabIndex = '0'
enhanced_Resolution.addEventListener('click', function () {
    enhanced_settings.resolution = (enhanced_settings.resolution + 1) % 3
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('resolution', enhanced_settings.resolution)
})
enhanced_settingsStream.append(enhanced_Resolution)

var enhanced_resolutionPopup = document.createElement('div')
enhanced_resolutionPopup.id = 'enhanced_resolutionPopup'
enhanced_resolutionPopup.className = 'HP4yJd heSpB'
enhanced_resolutionPopup.style.cursor = 'pointer'
enhanced_resolutionPopup.addEventListener('click', function () {
    enhanced_settings.resolution = (enhanced_settings.resolution + 1) % 3
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('resolution', enhanced_settings.resolution)
})

// Stream Monitor Autostart
var enhanced_monitorAutostart = document.createElement('div')
enhanced_monitorAutostart.className = 'pBvcyf QAAyWd'
enhanced_monitorAutostart.id = 'enhanced_monitorAutostart'
enhanced_monitorAutostart.style.cursor = 'pointer'
enhanced_monitorAutostart.style.userSelect = 'none'
enhanced_monitorAutostart.tabIndex = '0'
enhanced_monitorAutostart.addEventListener('click', function () {
    const autoStartMode = settingsService.getMonitorAutoStart()
    let option
    if (autoStartMode === 0 || autoStartMode === monitor.MODE.HIDDEN) {
        option = monitor.MODE.STANDARD
    } else if (autoStartMode === 1 || autoStartMode === monitor.MODE.STANDARD) {
        option = monitor.MODE.COMPACT
    } else if (autoStartMode === monitor.MODE.COMPACT) {
        option = monitor.MODE.MENU
    } else {
        option = monitor.MODE.HIDDEN
    }

    enhanced_settings.monitorAutostart = option // updates current settings, used in other parts of the code
    settingsService.saveMonitorAutoStart(option)

    // update ui
    enhanced_applySettings('monitorautostart', option)
})
enhanced_settingsStream.append(enhanced_monitorAutostart)

// Grid - Control element for the homescreen library grid
var enhanced_Grid = document.createElement('div')
enhanced_Grid.className = 'pBvcyf QAAyWd'
enhanced_Grid.id = 'enhanced_Grid'
enhanced_Grid.style.cursor = 'pointer'
enhanced_Grid.style.userSelect = 'none'
enhanced_Grid.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_Grid.tabIndex = '0'
enhanced_Grid.addEventListener('click', function () {
    enhanced_settings.gridSize = (enhanced_settings.gridSize + 1) % 6
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('gridsize', enhanced_settings.gridSize)
})
enhanced_settingsGeneral.append(enhanced_Grid)

// Clock - Control element for the clock specific settings
var enhanced_Clock = document.createElement('div')
enhanced_Clock.className = 'pBvcyf QAAyWd'
enhanced_Clock.id = 'enhanced_Clock'
enhanced_Clock.style.cursor = 'pointer'
enhanced_Clock.style.userSelect = 'none'
enhanced_Clock.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_Clock.tabIndex = '0'
enhanced_Clock.addEventListener('click', function () {
    enhanced_settings.clockOption = (enhanced_settings.clockOption + 1) % 4
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('clock', enhanced_settings.clockOption)
})
enhanced_settingsGeneral.append(enhanced_Clock)

// Game Filter
var enhanced_useFilter = document.createElement('div')
enhanced_useFilter.className = 'pBvcyf QAAyWd'
enhanced_useFilter.id = 'enhanced_useFilter'
enhanced_useFilter.style.cursor = 'pointer'
enhanced_useFilter.style.userSelect = 'none'
enhanced_useFilter.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_useFilter.tabIndex = '0'
enhanced_useFilter.addEventListener('click', function () {
    enhanced_settings.filter = (enhanced_settings.filter + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('filter', enhanced_settings.filter)
})
enhanced_settingsGeneral.append(enhanced_useFilter)

// Invite Link
var enhanced_InviteURL = 'https://stadia.com/link/home?si_rid=' + enhanced_AccountInfo[2]
var enhanced_Invite = document.createElement('div')
enhanced_Invite.className = 'pBvcyf QAAyWd'
enhanced_Invite.id = 'enhanced_Invite'
enhanced_Invite.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_add</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.invitebase + '</span>'
enhanced_Invite.style.cursor = 'pointer'
enhanced_Invite.style.userSelect = 'none'
enhanced_Invite.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_Invite.tabIndex = '0'
enhanced_Invite.addEventListener('click', function () {
    navigator.clipboard.writeText(enhanced_InviteURL)
    enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb" >' + enhanced_lang.inviteactive + '</span>'
    enhanced_Invite.style.color = '#ff773d'
    setTimeout(function () {
        enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb">' + enhanced_lang.invitebase + '</span>'
        enhanced_Invite.style.color = ''
    }, 1000)
})
enhanced_settingsShortcut.append(enhanced_Invite)

// Export settings
var enhanced_exportSettings = document.createElement('div')
enhanced_exportSettings.className = 'pBvcyf QAAyWd'
enhanced_exportSettings.id = 'enhanced_exportSettings'
enhanced_exportSettings.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">file_download</i><span class="mJVLwb">' + enhanced_lang.exportset + '</span>'
enhanced_exportSettings.style.cursor = 'pointer'
enhanced_exportSettings.style.userSelect = 'none'
enhanced_exportSettings.tabIndex = '0'
enhanced_exportSettings.addEventListener('click', function () {
    var enhanced_exportContent = JSON.stringify(enhanced_settings)
    enhanced_downloadFile('enhanced_' + enhanced_settings.user, 'json', enhanced_exportContent)
})
enhanced_settingsEnhanced.append(enhanced_exportSettings)

// Import settings
var enhanced_importDummy = document.createElement('input')
enhanced_importDummy.type = 'file'
enhanced_importDummy.addEventListener('change', function () {
    let files = enhanced_importDummy.files
    if (files.length == 0) {
        return
    }
    var file = files[0]
    let reader = new FileReader()

    // File Validation
    if (file.name.includes('enhanced_') && file.type == 'application/json') {
        // Accepted
        reader.onload = (e) => {
            enhanced_updateSettings(JSON.parse(e.target.result))
            enhanced_applySettings('updateall')
        };
        reader.readAsText(file)
    } else {
        // Rejected
        alert(enhanced_lang.importerror)
    }
})

var enhanced_importSettings = document.createElement('div')
enhanced_importSettings.className = 'pBvcyf QAAyWd'
enhanced_importSettings.id = 'enhanced_importSettings'
enhanced_importSettings.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">file_upload</i><span class="mJVLwb">' + enhanced_lang.importset + '</span>'
enhanced_importSettings.style.cursor = 'pointer'
enhanced_importSettings.style.userSelect = 'none'
enhanced_importSettings.tabIndex = '0'
enhanced_importSettings.addEventListener('click', function () {
    enhanced_importDummy.click()
})
enhanced_settingsEnhanced.append(enhanced_importSettings)

// Reset Settings
var enhanced_resetSettings = document.createElement('div')
enhanced_resetSettings.className = 'pBvcyf QAAyWd'
enhanced_resetSettings.id = 'enhanced_resetSettings'
enhanced_resetSettings.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings</i><span class="mJVLwb">' + enhanced_lang.resetsettings + '</span>'
enhanced_resetSettings.style.cursor = 'pointer'
enhanced_resetSettings.style.userSelect = 'none'
enhanced_resetSettings.tabIndex = '0'
enhanced_resetSettings.addEventListener('click', function () {
    if (confirm(enhanced_lang.confirmreset)) {
        enhanced_applySettings('resetall')
    }
})
enhanced_settingsEnhanced.append(enhanced_resetSettings)

// Message Preview
var enhanced_hidePreview = document.createElement('div')
enhanced_hidePreview.className = 'pBvcyf QAAyWd'
enhanced_hidePreview.id = 'enhanced_hidePreview'
enhanced_hidePreview.style.cursor = 'pointer'
enhanced_hidePreview.style.userSelect = 'none'
enhanced_hidePreview.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_hidePreview.tabIndex = '0'
enhanced_hidePreview.addEventListener('click', function () {
    enhanced_settings.hideMessagePreview = (enhanced_settings.hideMessagePreview + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('messagepreview', enhanced_settings.hideMessagePreview)
})
enhanced_settingsMessages.append(enhanced_hidePreview)

// Quick Reply
var enhanced_quickReply = document.createElement('div')
enhanced_quickReply.className = 'pBvcyf QAAyWd'
enhanced_quickReply.id = 'enhanced_quickReply'
enhanced_quickReply.style.cursor = 'pointer'
enhanced_quickReply.style.userSelect = 'none'
enhanced_quickReply.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_quickReply.tabIndex = '0'
enhanced_quickReply.addEventListener('click', function () {
    enhanced_settings.hideQuickReply = (enhanced_settings.hideQuickReply + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('quickreply', enhanced_settings.hideQuickReply)
})
enhanced_settingsMessages.append(enhanced_quickReply)

// In-line image preview
var enhanced_inlineConvert = document.createElement('div')
enhanced_inlineConvert.className = 'pBvcyf QAAyWd'
enhanced_inlineConvert.id = 'enhanced_inlineConvert'
enhanced_inlineConvert.style.cursor = 'pointer'
enhanced_inlineConvert.style.userSelect = 'none'
enhanced_inlineConvert.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_inlineConvert.tabIndex = '0'
enhanced_inlineConvert.addEventListener('click', function () {
    enhanced_settings.hideInlinePreview = (enhanced_settings.hideInlinePreview + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('inlinepreview', enhanced_settings.hideInlinePreview)
})
enhanced_settingsMessages.append(enhanced_inlineConvert)

// Hide: Offline Users
var enhanced_offlineUser = document.createElement('div')
enhanced_offlineUser.className = 'pBvcyf QAAyWd'
enhanced_offlineUser.id = 'enhanced_lastMessage'
enhanced_offlineUser.style.cursor = 'pointer'
enhanced_offlineUser.style.userSelect = 'none'
enhanced_offlineUser.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_offlineUser.tabIndex = '0'
enhanced_offlineUser.addEventListener('click', function () {
    enhanced_settings.hideOfflineUsers = (enhanced_settings.hideOfflineUsers + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('offlineusers', enhanced_settings.hideOfflineUsers)
})
enhanced_settingsMessages.append(enhanced_offlineUser)

// Hide: Invisible Users
var enhanced_invisibleUser = document.createElement('div')
enhanced_invisibleUser.className = 'pBvcyf QAAyWd'
enhanced_invisibleUser.id = 'enhanced_lastMessage'
enhanced_invisibleUser.style.cursor = 'pointer'
enhanced_invisibleUser.style.userSelect = 'none'
enhanced_invisibleUser.tabIndex = '0'
enhanced_invisibleUser.addEventListener('click', function () {
    enhanced_settings.hideInvisibleUsers = (enhanced_settings.hideInvisibleUsers + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('invisibleusers', enhanced_settings.hideInvisibleUsers)
})
enhanced_settingsMessages.append(enhanced_invisibleUser)

// Hide Labels
var enhanced_gameLabel = document.createElement('div')
enhanced_gameLabel.className = 'pBvcyf QAAyWd'
enhanced_gameLabel.id = 'enhanced_gameLabel'
enhanced_gameLabel.style.cursor = 'pointer'
enhanced_gameLabel.style.userSelect = 'none'
enhanced_gameLabel.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_gameLabel.tabIndex = '0'
enhanced_gameLabel.addEventListener('click', function () {
    enhanced_settings.hideLabels = (enhanced_settings.hideLabels + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('gamelabel', enhanced_settings.hideLabels)
})
enhanced_settingsGeneral.append(enhanced_gameLabel)

// Hide Dimmed Overlay
var enhanced_dimOverlay = document.createElement('div')
enhanced_dimOverlay.className = 'pBvcyf QAAyWd'
enhanced_dimOverlay.id = 'enhanced_dimOverlay'
enhanced_dimOverlay.style.cursor = 'pointer'
enhanced_dimOverlay.style.userSelect = 'none'
enhanced_dimOverlay.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_dimOverlay.tabIndex = '0'
enhanced_dimOverlay.addEventListener('click', function () {
    enhanced_settings.dimOverlay = (enhanced_settings.dimOverlay + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('dimoverlay', enhanced_settings.dimOverlay)
})
enhanced_settingsGeneral.append(enhanced_dimOverlay)

// Hide User Media on Homescreen
var enhanced_mediaPreview = document.createElement('div')
enhanced_mediaPreview.className = 'pBvcyf QAAyWd'
enhanced_mediaPreview.id = 'enhanced_mediaPreview'
enhanced_mediaPreview.style.cursor = 'pointer'
enhanced_mediaPreview.style.userSelect = 'none'
enhanced_mediaPreview.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_mediaPreview.tabIndex = '0'
enhanced_mediaPreview.addEventListener('click', function () {
    enhanced_settings.hideUserMedia = (enhanced_settings.hideUserMedia + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('mediapreview', enhanced_settings.hideUserMedia)
})
enhanced_settingsGeneral.append(enhanced_mediaPreview)

// Category Preview
var enhanced_categoryPreview = document.createElement('div')
enhanced_categoryPreview.className = 'pBvcyf QAAyWd'
enhanced_categoryPreview.id = 'enhanced_categoryPreview'
enhanced_categoryPreview.style.cursor = 'pointer'
enhanced_categoryPreview.style.userSelect = 'none'
enhanced_categoryPreview.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_categoryPreview.tabIndex = '0'
enhanced_categoryPreview.addEventListener('click', function () {
    enhanced_settings.hideCategories = (enhanced_settings.hideCategories + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('categorypreview', enhanced_settings.hideCategories)
})
enhanced_settingsGeneral.append(enhanced_categoryPreview)

// Store-List Split
var enhanced_storeList = document.createElement('div')
enhanced_storeList.className = 'pBvcyf QAAyWd'
enhanced_storeList.id = 'enhanced_storeList'
enhanced_storeList.style.cursor = 'pointer'
enhanced_storeList.style.userSelect = 'none'
enhanced_storeList.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_storeList.tabIndex = '0'
enhanced_storeList.addEventListener('click', function () {
    enhanced_settings.splitStore = (enhanced_settings.splitStore + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('storelist', enhanced_settings.splitStore)
})
enhanced_settingsGeneral.append(enhanced_storeList)

// Family Sharing Elements
var enhanced_hideFamilyElements = document.createElement('div')
enhanced_hideFamilyElements.className = 'pBvcyf QAAyWd'
enhanced_hideFamilyElements.id = 'enhanced_storeList'
enhanced_hideFamilyElements.style.cursor = 'pointer'
enhanced_hideFamilyElements.style.userSelect = 'none'
enhanced_hideFamilyElements.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_hideFamilyElements.tabIndex = '0'
enhanced_hideFamilyElements.addEventListener('click', function () {
    enhanced_settings.hideFamilySharing = (enhanced_settings.hideFamilySharing + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('familysharing', enhanced_settings.hideFamilySharing)
})
enhanced_settingsGeneral.append(enhanced_hideFamilyElements)

// Shortcuts
var enhanced_showShortcut = document.createElement('div')
enhanced_showShortcut.className = 'pBvcyf QAAyWd'
enhanced_showShortcut.id = 'enhanced_showShortcut'
enhanced_showShortcut.style.cursor = 'pointer'
enhanced_showShortcut.style.userSelect = 'none'
enhanced_showShortcut.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_showShortcut.tabIndex = '0'
enhanced_showShortcut.addEventListener('click', function () {
    enhanced_settings.enableShortcuts = (enhanced_settings.enableShortcuts + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('shortcuts', enhanced_settings.enableShortcuts)
})
enhanced_settingsComFeat.append(enhanced_showShortcut)

// Stadia Database - By OriginalPenguin
// https://twitter.com/OriginaIPenguin
var enhanced_showStadiaDatabase = document.createElement('div')
enhanced_showStadiaDatabase.className = 'pBvcyf QAAyWd'
enhanced_showStadiaDatabase.id = 'enhanced_showStadiaDatabase'
enhanced_showStadiaDatabase.style.cursor = 'pointer'
enhanced_showStadiaDatabase.style.userSelect = 'none'
enhanced_showStadiaDatabase.tabIndex = '0'
enhanced_showStadiaDatabase.addEventListener('click', function () {
    enhanced_settings.enableStadiaDatabase = (enhanced_settings.enableStadiaDatabase + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('stadiadatabase', enhanced_settings.enableStadiaDatabase)
})
enhanced_settingsComFeat.append(enhanced_showStadiaDatabase)

// Stadia Hunters - By Endeavour
// https://stadiahunters.com/
var enhanced_showStadiaHunters = document.createElement('div')
enhanced_showStadiaHunters.className = 'pBvcyf QAAyWd'
enhanced_showStadiaHunters.id = 'enhanced_showStadiaHunters'
enhanced_showStadiaHunters.style.cursor = 'pointer'
enhanced_showStadiaHunters.style.userSelect = 'none'
enhanced_showStadiaHunters.tabIndex = '0'
enhanced_showStadiaHunters.addEventListener('click', function () {
    enhanced_settings.enableStadiaHunters = (enhanced_settings.enableStadiaHunters + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('stadiahunters', enhanced_settings.enableStadiaHunters)
})
enhanced_settingsComFeat.append(enhanced_showStadiaHunters)

// Show Notifications
var enhanced_setNotification = document.createElement('div')
enhanced_setNotification.className = 'pBvcyf QAAyWd'
enhanced_setNotification.id = 'enhanced_setNotification'
enhanced_setNotification.style.cursor = 'pointer'
enhanced_setNotification.style.userSelect = 'none'
enhanced_setNotification.style.borderBottom = '1px solid rgba(255,255,255,.06)'
enhanced_setNotification.tabIndex = '0'
enhanced_setNotification.addEventListener('click', function () {
    enhanced_settings.updateNotifications = (enhanced_settings.updateNotifications + 1) % 3
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('notification', enhanced_settings.updateNotifications)
})
enhanced_settingsGeneral.append(enhanced_setNotification)

// Stream Mode
var enhanced_streamMode = document.createElement('div')
enhanced_streamMode.className = 'pBvcyf QAAyWd'
enhanced_streamMode.id = 'enhanced_streamMode'
enhanced_streamMode.style.cursor = 'pointer'
enhanced_streamMode.style.userSelect = 'none'
enhanced_streamMode.tabIndex = '0'
enhanced_streamMode.addEventListener('click', function () {
    enhanced_settings.streamMode = (enhanced_settings.streamMode + 1) % 2
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
    enhanced_applySettings('streammode', enhanced_settings.streamMode)
})
enhanced_settingsGeneral.append(enhanced_streamMode)

// Avatar - Allows the user to set a custom avatar
var enhanced_customAvatar = document.createElement('div')
enhanced_customAvatar.className = 'CTvDXd QAAyWd Pjpac GShPJb edaWcd'
enhanced_customAvatar.id = 'enhanced_customAvatar'
enhanced_customAvatar.role = 'button'
enhanced_customAvatar.innerHTML = '<div class="KEaHo"><span class="X5peoe"><i class="google-material-icons lS1Wre Ce1Y1c xT8eqd" aria-hidden="true">face</i></span><span class="caSJV snByac">' + enhanced_lang.avatar + '</span></div>'
enhanced_customAvatar.tabIndex = '0'
enhanced_customAvatar.addEventListener('click', function () {
    enhanced_avatarURL = prompt(enhanced_lang.avatarpopup)
    if (enhanced_avatarURL != null) {
        if (enhanced_avatarURL.length < 1) {
            enhanced_applySettings('avatar', document.querySelector('.ksZYgc.VGZcUb').style.backgroundImage.replace(/(url\(|\)|')/g, ''))
            enhanced_settings.avatar = ''
        } else {
            enhanced_settings.avatar = enhanced_avatarURL
            localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
            enhanced_applySettings('avatar', enhanced_avatarURL)
        }
    }
})

// Stadia Hunters - Profile Popup
var enhanced_huntersContainer = document.createElement('li')
enhanced_huntersContainer.className = 'OfFb0b tj2D'
enhanced_huntersContainer.style.margin = '0 0 0 0.625rem'
enhanced_huntersContainer.id = 'enhanced_huntersContainer'
var enhanced_huntersDropdown = document.createElement('div')
enhanced_huntersContainer.appendChild(enhanced_huntersDropdown)
enhanced_huntersDropdown.className = 'ROpnrd QAAyWd wJYinb'
enhanced_huntersDropdown.id = 'enhanced_huntersDropdown'
enhanced_huntersDropdown.innerHTML = `
    <div class="yNQThc">
        <span class="jtYd1">
            <img class="xduoyf" src="` + chrome.runtime.getURL('/media/included/hunters_logo.png') + `" style="width: 24px; height: 24px; border-radius: 50%;" >
        </span>
    </div>
    <div class="RMEzA">
        <span>0</span>
    </div>`
enhanced_huntersDropdown.style.position = 'relative'
enhanced_huntersDropdown.style.padding = '0'
enhanced_huntersDropdown.style.cursor = 'pointer'
enhanced_huntersDropdown.style.userSelect = 'none'
enhanced_huntersDropdown.tabIndex = '0'
enhanced_huntersDropdown.addEventListener('click', function () {
    if (enhanced_huntersDropContent.style.display === 'none') {
        enhanced_huntersDropContent.style.display = 'block'
    } else {
        enhanced_huntersDropContent.style.display = 'none'
    }
})

var enhanced_huntersDropContent = document.createElement('div')
enhanced_huntersDropdown.append(enhanced_huntersDropContent)
enhanced_huntersDropContent.id = 'enhanced_huntersDropContent'
enhanced_huntersDropContent.className = 'us22N'
enhanced_huntersDropContent.innerHTML = `
    <img src="` + chrome.runtime.getURL('/media/included/hunters_banner.png') + `" style="width: 200px; padding-top: 0.5rem;">
    <div class="WTRpgf">
        <div class="d50Cgd VwFGMb" style="padding: 0 0.5rem 0.5rem 0.5rem; height: 0.375rem;" title="` + enhanced_lang.stadiahuntersxphover + `">
            <div class="hPTRZ Jc3yuc" style="border-radius: 0.5rem; height: 100%; width: 100%; background-color: rgba(232,234,237,0.122); overflow: hidden;">
                <div class="FxJ5Tc y2VB6d" style="width: 0%; height: 100%; background-color: #00e0ba;"></div>
            </div>
        </div>
    </div>
    <div class="TZ0BN" style="">
        <div class="lTHVjf QAAyWd RjcqTc AGhbCb" tabindex="0" style="border-radius: 0;">
            <div class="uKRpKb">
                <div class="rybUIf"></div>
            </div>
            <div class="Uwaqdf" style="text-align: left;">
                <div class="DlMyQd q3yMEf">
                    <span class="VY8blf fSorq">` + enhanced_AccountInfo[0] + `<span class="rmIKk qUT0tf">` + '#' + enhanced_AccountInfo[1] + `</span></span>
                </div>
                <div>
                    <div class="UxR5ob m8Kzt" style="align-items: flex-start; flex-direction: column;">
                        <div class="HDKZKb LiQ6Hb">` + enhanced_lang.stadiahunterslevel + ` 0</div>
                        <span style="font-size: 0.8rem; color: rgba(255,255,255,.4);">` + enhanced_lang.stadiahuntersworldrank + ` 0</span>
                    </div>
                </div>
            </div>
        </div>
    </div>`

enhanced_huntersDropContent.querySelector('.rybUIf').style.backgroundImage = document.getElementsByClassName('ksZYgc VGZcUb')[0].style.backgroundImage
enhanced_huntersDropContent.style.position = 'absolute'
enhanced_huntersDropContent.style.width = 'auto'
enhanced_huntersDropContent.style.height = 'auto'
enhanced_huntersDropContent.style.top = '3.5rem'
enhanced_huntersDropContent.style.cursor = 'default'
enhanced_huntersDropContent.style.textAlign = 'center'
enhanced_huntersDropContent.style.boxShadow = '0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)'
enhanced_huntersDropContent.style.overflow = 'hidden'
enhanced_huntersDropContent.style.zIndex = '20'
enhanced_huntersDropContent.style.display = 'none'

enhanced_huntersDropContent.querySelector('.TZ0BN').addEventListener('click', function () {
    if (Object.keys(enhanced_stadiaHunters).length < 2) {
        window.open('https://stadiahunters.com/login', '_blank')
    } else {
        if (enhanced_AccountInfo[1] == '0000') {
            window.open('https://stadiahunters.com/user/' + enhanced_AccountInfo[0], '_blank')
        } else {
            window.open('https://stadiahunters.com/user/' + enhanced_AccountInfo[0] + '-' + enhanced_AccountInfo[1], '_blank')
        }
    }
})

window.addEventListener('click', function (e) {
    if (e.target != enhanced_huntersDropdown && enhanced_huntersDropdown.contains(e.target) === false) {
        enhanced_huntersDropContent.style.display = 'none'
    }
})

secureInsert(enhanced_huntersContainer, 'ZECEje', 1)

// Store Container - Container to display store buttons
var enhanced_StoreContainer = document.createElement('div')
enhanced_StoreContainer.id = 'enhanced_ButtonBox'
enhanced_StoreContainer.style.display = 'flex'
enhanced_StoreContainer.style.justifyContent = 'space-around'
enhanced_StoreContainer.style.gap = '1.5rem'

// Youtube Search
var enhanced_YouTube = document.createElement('div')
enhanced_YouTube.id = 'enhanced_YouTube'
enhanced_YouTube.className = 'CTvDXd QAAyWd Fjy05d ATH3sf wJYinb rOskPc rpgZzc'
enhanced_YouTube.innerHTML = '<span class="COTyRb">' + enhanced_lang.searchbtnbase + ' YouTube</span>'
enhanced_YouTube.style.cursor = 'pointer'
enhanced_YouTube.style.userSelect = 'none'
enhanced_YouTube.tabIndex = '0'
enhanced_YouTube.style.backgroundColor = '#c00'
enhanced_YouTube.style.color = 'white'
enhanced_YouTube.style.marginTop = '1.5rem'
enhanced_YouTube.addEventListener('click', function () {
    enhanced_GameTitle = document.querySelectorAll('.UG7HXc')[document.querySelectorAll('.UG7HXc').length - 1].textContent
    window.open('https://www.youtube.com/results?search_query=' + enhanced_GameTitle, '_blank')
})
enhanced_StoreContainer.append(enhanced_YouTube)

// Metacritic Search
var enhanced_Metacritic = document.createElement('div')
enhanced_Metacritic.id = 'enhanced_Metacritic'
enhanced_Metacritic.className = 'CTvDXd QAAyWd Fjy05d ATH3sf wJYinb rOskPc rpgZzc'
enhanced_Metacritic.innerHTML = '<span class="COTyRb">' + enhanced_lang.searchbtnbase + ' <span style="color: #fc3;">Metacritic</span></span>'
enhanced_Metacritic.style.cursor = 'pointer'
enhanced_Metacritic.style.userSelect = 'none'
enhanced_Metacritic.tabIndex = '0'
enhanced_Metacritic.style.backgroundColor = '#131416'
enhanced_Metacritic.style.color = 'white'
enhanced_Metacritic.style.marginTop = '1.5rem'
enhanced_Metacritic.addEventListener('click', function () {
    enhanced_GameTitle = document.querySelectorAll('.UG7HXc')[document.querySelectorAll('.UG7HXc').length - 1].textContent;
    window.open('https://www.metacritic.com/search/game/' + enhanced_GameTitle + '/results', '_blank')
})
enhanced_StoreContainer.append(enhanced_Metacritic)

// Wishlisting
var enhanced_wishlistContainer = document.createElement('li')
enhanced_wishlistContainer.className = 'OfFb0b tj2D'
enhanced_wishlistContainer.id = 'enhanced_wishlistContainer'
enhanced_wishlistContainer.style.display = 'none'
var enhanced_wishlistHeart = document.createElement('div')
enhanced_wishlistContainer.appendChild(enhanced_wishlistHeart)
enhanced_wishlistHeart.className = 'ROpnrd QAAyWd wJYinb'
enhanced_wishlistHeart.id = 'enhanced_WishlistHeart'
enhanced_wishlistHeart.innerHTML = ''
enhanced_wishlistHeart.style.width = '2.5rem'
enhanced_wishlistHeart.style.padding = '0'
enhanced_wishlistHeart.style.cursor = 'pointer'
enhanced_wishlistHeart.style.userSelect = 'none'
enhanced_wishlistHeart.tabIndex = '0'
enhanced_wishlistHeart.addEventListener('click', function () {
    var enhanced_currentSKU = document.location.href.split('sku/')[1].split('?')[0]

    if (enhanced_settings.wishlist.includes(enhanced_currentSKU)) {
        enhanced_settings.wishlist = enhanced_settings.wishlist.replace('(' + enhanced_currentSKU + ')', '')
        enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite_border</i>'
        enhanced_wishlistHeart.style.color = ''
    } else {
        enhanced_settings.wishlist += '(' + enhanced_currentSKU + ')'
        enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite</i>'
        enhanced_wishlistHeart.style.color = '#ff773d'
    }
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
})
if (document.getElementsByClassName('ZECEje')[0] !== undefined) {
    // Currently deactivated, due to store changes
    // document.getElementsByClassName('ZECEje')[0].append(enhanced_wishlistContainer)
}

// Account Menu - Changes to the account menu behaviour
enhanced_AccountMenu = document.querySelector('.Zxyh9c')
enhanced_AccountMenu.setAttribute('data-close-if-content-clicked', 'false')

// Session Time
var enhanced_sessionTimer = document.createElement('div')
enhanced_sessionTimer.className = 'HPX1od'
enhanced_sessionTimer.id = 'enhanced_sessionTimer'
enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">00:00:00</span></div>'

// Visibility Filter
var enhanced_showState = false
enhanced_showAll = document.createElement('span')
enhanced_showAll.id = 'enhanced_showAll'
enhanced_showAll.className = 't7ctZ'
enhanced_showAll.innerHTML = '<div role="button" tabindex="0" class="CTvDXd QAAyWd JkRlwc"><i class="material-icons-extended" aria-hidden="true">visibility_off</i></div>'
enhanced_showAll.style.cursor = 'pointer'
enhanced_showAll.style.flexGrow = '0'
enhanced_showAll.style.webkitFlexGrow = '0'
enhanced_showAll.addEventListener('click', function () {
    switch (enhanced_showState) {
        case true:
            enhanced_showAll.innerHTML = '<div role="button" style="color: white" tabindex="0" class="CTvDXd QAAyWd JkRlwc"><i class="material-icons-extended" aria-hidden="true">visibility_off</i></div>'
            enhanced_showState = false
            break
        case false:
            enhanced_showAll.innerHTML = '<div role="button" style="color: #00e0ba" tabindex="0" class="CTvDXd QAAyWd JkRlwc"><i class="material-icons-extended" aria-hidden="true">visibility</i></div>'
            enhanced_showState = true
            break
    }
})

// List Type Filter [Language Supported]
enhanced_activeListFilter = 0
enhanced_listFilter = document.createElement('div')
enhanced_listFilter.style.display = 'flex'

enhanced_listFilterGames = document.createElement('div')
enhanced_listFilterGames.innerHTML = enhanced_languageSupport.storeFilters[enhanced_local].game
enhanced_listFilterGames.className = 'Adwm6c'
enhanced_listFilterGames.style.userSelect = 'none'
enhanced_listFilterGames.style.marginLeft = '0.75rem'
enhanced_listFilter.append(enhanced_listFilterGames)
enhanced_listFilterGames.addEventListener('click', function () {
    enhanced_switchListFilter(1)
})

enhanced_listFilterBundles = document.createElement('div')
enhanced_listFilterBundles.innerHTML = enhanced_languageSupport.storeFilters[enhanced_local].bundle
enhanced_listFilterBundles.className = 'Adwm6c'
enhanced_listFilterBundles.style.userSelect = 'none'
enhanced_listFilterBundles.style.marginLeft = '0.75rem'
enhanced_listFilter.append(enhanced_listFilterBundles)
enhanced_listFilterBundles.addEventListener('click', function () {
    enhanced_switchListFilter(2)
})

enhanced_listFilterAddOns = document.createElement('div')
enhanced_listFilterAddOns.innerHTML = enhanced_languageSupport.storeFilters[enhanced_local].addon
enhanced_listFilterAddOns.className = 'Adwm6c'
enhanced_listFilterAddOns.style.userSelect = 'none'
enhanced_listFilterAddOns.style.marginLeft = '0.75rem'
enhanced_listFilter.append(enhanced_listFilterAddOns)
enhanced_listFilterAddOns.addEventListener('click', function () {
    enhanced_switchListFilter(3)
})

enhanced_listFilterPro = document.createElement('div')
enhanced_listFilterPro.innerHTML = enhanced_languageSupport.storeFilters[enhanced_local].free
enhanced_listFilterPro.className = 'Adwm6c'
enhanced_listFilterPro.style.userSelect = 'none'
enhanced_listFilterPro.style.marginLeft = '0.75rem'
enhanced_listFilter.append(enhanced_listFilterPro)
enhanced_listFilterPro.addEventListener('click', function () {
    enhanced_switchListFilter(4)
})

function enhanced_switchListFilter(type) {
    if (enhanced_activeListFilter != type) {
        switch (type) {
            case 1:
                enhanced_activeListFilter = 1
                enhanced_listFilterGames.classList.remove("enhanced_btnDisabled")
                enhanced_listFilterBundles.classList.add("enhanced_btnDisabled")
                enhanced_listFilterAddOns.classList.add("enhanced_btnDisabled")
                enhanced_listFilterPro.classList.add("enhanced_btnDisabled")
                break
            case 2:
                enhanced_activeListFilter = 2
                enhanced_listFilterGames.classList.add("enhanced_btnDisabled")
                enhanced_listFilterBundles.classList.remove("enhanced_btnDisabled")
                enhanced_listFilterAddOns.classList.add("enhanced_btnDisabled")
                enhanced_listFilterPro.classList.add("enhanced_btnDisabled")
                break
            case 3:
                enhanced_activeListFilter = 3
                enhanced_listFilterGames.classList.add("enhanced_btnDisabled")
                enhanced_listFilterBundles.classList.add("enhanced_btnDisabled")
                enhanced_listFilterAddOns.classList.remove("enhanced_btnDisabled")
                enhanced_listFilterPro.classList.add("enhanced_btnDisabled")
                break
            case 4:
                enhanced_activeListFilter = 4
                enhanced_listFilterGames.classList.add("enhanced_btnDisabled")
                enhanced_listFilterBundles.classList.add("enhanced_btnDisabled")
                enhanced_listFilterAddOns.classList.add("enhanced_btnDisabled")
                enhanced_listFilterPro.classList.remove("enhanced_btnDisabled")
                break

        }
    } else {
        enhanced_activeListFilter = 0
        enhanced_listFilterGames.classList.remove("enhanced_btnDisabled")
        enhanced_listFilterBundles.classList.remove("enhanced_btnDisabled")
        enhanced_listFilterAddOns.classList.remove("enhanced_btnDisabled")
        enhanced_listFilterPro.classList.remove("enhanced_btnDisabled")
    }
}

// Achievements Filter
enhanced_achievementsFilter = document.createElement('div')
enhanced_achievementsFilter.style.display = 'flex'

enhanced_unlockedFilter = document.createElement('div')
enhanced_unlockedFilter.state = 0
enhanced_unlockedFilter.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.all
enhanced_unlockedFilter.className = 'Adwm6c'
enhanced_unlockedFilter.style.userSelect = 'none'
enhanced_unlockedFilter.style.marginLeft = '0.75rem'
enhanced_unlockedFilter.addEventListener('click', function () {
    if (this.state == 0) {
        enhanced_injectStyle('.h6J22d.cWe8yc.QAAyWd { display: none !important } .h6J22d.cWe8yc.GIh6Af.QAAyWd { display: grid !important }', 'unlockedfilter')
        this.state = 1
        this.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.locked
    } else {
        enhanced_injectStyle('', 'unlockedfilter')
        this.state = 0
        this.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.all
    }
})
enhanced_achievementsFilter.append(enhanced_unlockedFilter)

// Stadia Hunters - Achievements Link
enhanced_huntersLinkContainer = document.createElement('div')
enhanced_huntersLinkContainer.style.display = 'flex'

enhanced_huntersLink = document.createElement('div')
enhanced_huntersLink.innerHTML = '<img src="' + chrome.runtime.getURL('/media/included/hunters_banner.png') + '" style="height: 1.25rem;">'
enhanced_huntersLink.className = 'Adwm6c'
enhanced_huntersLink.style.userSelect = 'none'
enhanced_huntersLink.style.marginLeft = '0.75rem'
enhanced_huntersLink.addEventListener('click', function () {
    window.open('https://stadiahunters.com/games/' + enhanced_huntersLink.gameID, '_blank')
})
enhanced_huntersLinkContainer.append(enhanced_huntersLink)

// Gamelist Filter
enhanced_gamelistFilter = document.createElement('div')
enhanced_gamelistFilter.style.display = 'flex'

enhanced_gameStateFilter = document.createElement('div')
enhanced_gameStateFilter.state = 0
enhanced_gameStateFilter.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.all
enhanced_gameStateFilter.className = 'Adwm6c'
enhanced_gameStateFilter.style.userSelect = 'none'
enhanced_gameStateFilter.style.marginLeft = '0.75rem'
enhanced_gameStateFilter.addEventListener('click', function () {
    this.state = (this.state + 1) % 3
    switch (this.state) {
        case 0:
            this.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.all
            break
        case 1:
            this.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.complete
            break
        case 2:
            this.innerHTML = enhanced_lang.show + ': ' + enhanced_lang.incomplete
            break
    }
})
enhanced_gamelistFilter.append(enhanced_gameStateFilter)

// Shortcut - General
var enhanced_installShortcut = document.createElement('div')
enhanced_installShortcut.className = 'CTvDXd QAAyWd Fjy05d ivWUhc wJYinb x8t73b tlZCoe rpgZzc'
enhanced_installShortcut.id = 'enhanced_installShortcut'
enhanced_installShortcut.tabIndex = '0'
enhanced_installShortcut.addEventListener('click', function () {
    window.open('https://stadiaicons.web.app/' + enhanced_installShortcut.gameID + '/?fullName=' + encodeURIComponent(enhanced_installShortcut.gameName), '_blank')
})

// Shortcut - Stadia Hunters
var enhanced_stadiaHuntersShortcut = document.createElement('div')
enhanced_stadiaHuntersShortcut.className = 'CTvDXd QAAyWd Fjy05d ivWUhc wJYinb x8t73b tlZCoe rpgZzc'
enhanced_stadiaHuntersShortcut.id = 'enhanced_stadiaHuntersShortcut'
enhanced_stadiaHuntersShortcut.tabIndex = '0'
enhanced_stadiaHuntersShortcut.addEventListener('click', function () {
    window.open('https://stadiahunters.com/games/' + enhanced_stadiaHuntersShortcut.gameID, '_blank')
})

// Shortcut - Last Played
var enhanced_shortcutLastPlayed = document.createElement('div')
enhanced_shortcutLastPlayed.id = 'enhanced_shortcutLastPlayed'
enhanced_shortcutLastPlayed.innerHTML = '<i class="material-icons-extended" aria-hidden="true">get_app</i>'
enhanced_shortcutLastPlayed.tabIndex = '0'
enhanced_shortcutLastPlayed.style.display = 'flex'
enhanced_shortcutLastPlayed.style.opacity = '0'
enhanced_shortcutLastPlayed.style.transition = 'opacity .23s ease-out'
enhanced_shortcutLastPlayed.style.position = 'absolute'
enhanced_shortcutLastPlayed.style.top = '0.5rem'
enhanced_shortcutLastPlayed.style.left = '0.5rem'
enhanced_shortcutLastPlayed.style.background = '#202124'
enhanced_shortcutLastPlayed.style.borderRadius = '50%'
enhanced_shortcutLastPlayed.style.padding = '0.2rem'
enhanced_shortcutLastPlayed.style.cursor = 'pointer'
enhanced_shortcutLastPlayed.style.zIndex = '2'
enhanced_shortcutLastPlayed.addEventListener('click', function () {
    window.open('https://stadiaicons.web.app/' + enhanced_shortcutLastPlayed.gameID + '/?fullName=' + encodeURIComponent(enhanced_shortcutLastPlayed.gameName), '_blank')
})

// Stats Container
var enhanced_statOverview = document.createElement('div')
enhanced_statOverview.className = 'MDSsFe URhE4b'
enhanced_statOverview.style.marginBottom = '3.5rem'

// Achievement Statistics
var enhanced_statAchievements = document.createElement('div')
enhanced_statOverview.append(enhanced_statAchievements)

// Playtime Statistics
var enhanced_statPlaytime = document.createElement('div')
enhanced_statOverview.append(enhanced_statPlaytime)

// Capture Filters
var enhanced_activeCapFilter = 'none'
enhanced_captureFilters = document.createElement('div')
enhanced_captureFilters.style.display = 'flex'

enhanced_captureScreenshot = document.createElement('div')
enhanced_captureScreenshot.id = 'enhanced_captureScreenshot'
enhanced_captureScreenshot.className = 'ROpnrd QAAyWd wJYinb'
enhanced_captureScreenshot.innerHTML = '<i class="material-icons-extended" aria-hidden="true">image</i>'
enhanced_captureScreenshot.tabIndex = '0'
enhanced_captureScreenshot.style.width = '2.5rem'
enhanced_captureScreenshot.style.padding = '0px'
enhanced_captureScreenshot.style.marginRight = '1rem'
enhanced_captureScreenshot.style.userSelect = 'none'
enhanced_captureScreenshot.addEventListener('click', function () {
    if (enhanced_activeCapFilter != 'image') {
        enhanced_activeCapFilter = 'image'
        enhanced_captureScreenshot.style.color = '#ff773d'
        enhanced_captureClip.style.color = 'rgba(255,255,255,.9)'
        enhanced_injectStyle('.au9T5d.lEPylf.sfe1Ff div[data-is-photo="false"] { display: none }', 'enhanced_styleCaptureFilter')
    } else {
        enhanced_activeCapFilter = 'none'
        enhanced_captureScreenshot.style.color = 'rgba(255,255,255,.9)'
        enhanced_injectStyle('', 'enhanced_styleCaptureFilter')
    }
})
enhanced_captureFilters.append(enhanced_captureScreenshot)

enhanced_captureClip = document.createElement('div')
enhanced_captureClip.id = 'enhanced_captureClip'
enhanced_captureClip.className = 'ROpnrd QAAyWd wJYinb'
enhanced_captureClip.innerHTML = '<i class="material-icons-extended" aria-hidden="true">movie</i>'
enhanced_captureClip.tabIndex = '0'
enhanced_captureClip.style.width = '2.5rem'
enhanced_captureClip.style.padding = '0px'
enhanced_captureClip.style.userSelect = 'none'
enhanced_captureClip.addEventListener('click', function () {
    if (enhanced_activeCapFilter != 'movie') {
        enhanced_activeCapFilter = 'movie'
        enhanced_captureScreenshot.style.color = 'rgba(255,255,255,.9)'
        enhanced_captureClip.style.color = '#ff773d'
        enhanced_injectStyle('.au9T5d.lEPylf.sfe1Ff div[data-is-photo="true"] { display: none }', 'enhanced_styleCaptureFilter')
    } else {
        enhanced_activeCapFilter = 'none'
        enhanced_captureClip.style.color = 'rgba(255,255,255,.9)'
        enhanced_injectStyle('', 'enhanced_styleCaptureFilter')
    }
})
enhanced_captureFilters.append(enhanced_captureClip)

// All Payments
var enhanced_allpayments = document.createElement('span')
enhanced_allpayments.style.position = 'absolute'
enhanced_allpayments.style.right = '1.5rem'
enhanced_allpayments.style.color = 'rgba(255,255,255,.6)'
enhanced_allpayments.style.fontFamily = '"Google Sans",sans-serif'
enhanced_allpayments.style.fontSize = '1rem'
enhanced_allpayments.style.lineHeight = '1.25rem'
enhanced_allpayments.style.fontWeight = '500'

// Game Count
var enhanced_gameCounter = document.createElement('span')
enhanced_gameCounter.id = 'enhanced_gameCounter'
enhanced_gameCounter.style.fontFamily = '"Roboto",sans-serif'
enhanced_gameCounter.style.fontSize = '1.25rem'
enhanced_gameCounter.style.lineHeight = '2rem'
enhanced_gameCounter.style.fontWeight = '400'
enhanced_gameCounter.style.color = '#a8adb3'

// Total Friend Count
var enhanced_friendCount = document.createElement('span')
enhanced_friendCount.style.color = 'rgba(255,255,255,.6)'
enhanced_friendCount.style.marginLeft = '0'

// Letter Box
var enhanced_activeLetter = false
var enhanced_letterBox = document.createElement('div')
enhanced_letterBox.id = 'enhanced_letterBox'
enhanced_letterBox.className = 'jkwub bJBQjf'
enhanced_letterBox.style.marginRight = 'auto'
enhanced_letterBox.style.textIndent = '-0.5rem'

var enhanced_letters = []
for (var i = 0; i < 26; i++) {
    var el = document.createElement('span')
    el.textContent = String.fromCharCode(65 + i)
    el.letter = i
    el.state = 0
    if (i < 25) {
        el.style.padding = '0 0.5rem'
    } else {
        el.style.padding = '0 0 0 0.5rem'
    }
    el.style.cursor = 'pointer'
    el.style.userSelect = 'none'
    el.addEventListener('click', function () {
        enhanced_applySettings('letterbox', this.letter + ',' + this.state)
    })
    enhanced_letters.push(el)
    enhanced_letterBox.append(el)
}

// Favorites
var enhanced_favorite = document.createElement('div')
enhanced_favorite.innerHTML = '<i class="material-icons-extended" aria-hidden="true">star</i>'
enhanced_favorite.id = 'enhanced_favorite'
enhanced_favorite.style.position = 'absolute'
enhanced_favorite.style.display = 'flex'
enhanced_favorite.style.left = '0.5rem'
enhanced_favorite.style.top = '0.5rem'
enhanced_favorite.style.margin = '0.2rem'
enhanced_favorite.style.borderRadius = '50%'
enhanced_favorite.style.padding = '0.2rem'
enhanced_favorite.style.cursor = 'pointer'
enhanced_favorite.style.background = '#202124'
enhanced_favorite.style.zIndex = '2'
enhanced_favorite.active = false
enhanced_favorite.addEventListener('click', function () {
    if (this.active) {
        enhanced_favorite.active = false
        enhanced_favorite.style.color = ''
    } else {
        enhanced_favorite.active = true
        enhanced_favorite.style.color = '#00e0ba'
    }
    enhanced_applySettings('favorite', this.sku)
})

// Show/Hide Filter
var enhanced_visibility = document.createElement('div')
enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>'
enhanced_visibility.id = 'enhanced_visibility'
enhanced_visibility.style.position = 'absolute'
enhanced_visibility.style.display = 'flex'
enhanced_visibility.style.left = '3rem'
enhanced_visibility.style.top = '0.5rem'
enhanced_visibility.style.margin = '0.2rem'
enhanced_visibility.style.borderRadius = '50%'
enhanced_visibility.style.padding = '0.2rem'
enhanced_visibility.style.cursor = 'pointer'
enhanced_visibility.style.background = '#202124'
enhanced_visibility.style.zIndex = '2'
enhanced_visibility.active = false
enhanced_visibility.addEventListener('click', function () {
    if (this.active) {
        this.active = false
        this.style.color = ''
        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>'
    } else {
        this.active = true
        this.style.color = '#FF7070'
        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>'
    }

    if (enhanced_settings.gameFilter.includes(this.sku)) {
        enhanced_settings.gameFilter = enhanced_settings.gameFilter.replace('(' + this.sku + ')', '')
        this.title = enhanced_lang.hide + ' ' + this.name
    } else {
        enhanced_settings.gameFilter += '(' + this.sku + ')';
        this.title = enhanced_lang.show + ' ' + this.name
    }
    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
})

// Apply settings
enhanced_applySettings('updateall');

// After Setup
var enhanced_timerLoadEnd = window.performance.now() - enhanced_timerLoadStart
console.log('%cStadia Enhanced' + '%c ⏲️ - Start Up: Loaded in ' + enhanced_timerLoadEnd.toFixed(3) + 'ms.', enhanced_consoleEnhanced, '')
console.groupEnd()
var enhanced_loopCount = 0
var enhanced_loopTotal = 0
var enhanced_timerLoopTotal = 0
var enhanced_sessionStart = 0
var enhanced_wrappers = []

// Main Loop
setInterval(function () {
    // Location - Home & Library
    if (isLocation('home') || isLocation('library')) {

        // Game List
        var enhanced_gameList = document.getElementsByClassName('GqLi4d')

        // Resolution change on pop-ups
        secureInsert(enhanced_resolutionPopup, 'EcfBLd', 3)

        // Shortcuts
        if (enhanced_settings.enableShortcuts == 1) {
            enhanced_installShortcut.style.display = 'inline-flex'
            enhanced_shortcutLastPlayed.style.display = 'flex'

            // Popup - Stadia Icons
            if (document.getElementById(enhanced_installShortcut) === null && document.querySelector('.CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc')) {
                if (enhanced_installShortcut.gameName != document.querySelector('.Wq73hb').textContent) {
                    enhanced_installShortcut.gameName = document.querySelector('.Wq73hb').textContent
                    enhanced_installShortcut.gameID = document.getElementsByClassName('n4qZSd')[document.getElementsByClassName('n4qZSd').length - 1].getAttribute('data-app-id')
                    enhanced_installShortcut.innerHTML = '<div class="tYJnXb">' + enhanced_lang.shortcuttitle + ' ' + enhanced_installShortcut.gameName + '</div>'
                }
                secureInsert(enhanced_installShortcut, 'div[jsaction="JIbuQc:qgRaKd;"]', 0)
            }

            // Popup - Stadia Hunters
            if (enhanced_settings.enableStadiaHunters && document.getElementById(enhanced_stadiaHuntersShortcut) === null && document.querySelector('.CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc')) {
                var enhanced_popupID = document.getElementsByClassName('n4qZSd')[document.getElementsByClassName('n4qZSd').length - 1].getAttribute('data-app-id')
                if (enhanced_stadiaHuntersShortcut.gameID != enhanced_popupID) {
                    enhanced_stadiaHuntersShortcut.gameName = document.querySelector('.Wq73hb').textContent
                    enhanced_stadiaHuntersShortcut.gameID = enhanced_popupID
                    enhanced_stadiaHuntersShortcut.innerHTML = '<div class="tYJnXb">' + enhanced_installShortcut.gameName + ' ' + enhanced_lang.stadiahunterstitle + '</div>'
                }
                secureInsert(enhanced_stadiaHuntersShortcut, 'div[jsaction="JIbuQc:qgRaKd;"]', 0)
            }

            // Last Played
            var enhanced_selector = document.getElementsByClassName('mGdxHb ltdNmc')
            if (enhanced_selector[enhanced_selector.length - 1] !== undefined) {
                if (enhanced_selector[enhanced_selector.length - 1].contains(enhanced_shortcutLastPlayed) === false) {
                    enhanced_shortcutLastPlayed.gameName = enhanced_selector[enhanced_selector.length - 1].getAttribute('aria-label').split(': ')[1]
                    enhanced_shortcutLastPlayed.gameID = document.querySelector('.UiBYIe > c-wiz').getAttribute('data-app-id')
                    enhanced_shortcutLastPlayed.title = enhanced_lang.shortcuttitle + ' ' + enhanced_shortcutLastPlayed.gameName
                    enhanced_selector[enhanced_selector.length - 1].append(enhanced_shortcutLastPlayed)
                }
            }
        } else {
            enhanced_installShortcut.style.display = 'none'
            enhanced_shortcutLastPlayed.style.display = 'none'
        }
    }

    // Location - Home
    if (isLocation('home')) {
        // Remove filter elements
        for (var i = 0; i < enhanced_gameList.length; i++) {
            if (enhanced_gameList[i].style.display = 'none') {
                enhanced_gameList[i].style.display = ''
            }
            if (enhanced_gameList[i].style.order = '-1') {
                enhanced_gameList[i].style.order = ''
            }
            var enhanced_hasEmbed = enhanced_gameList[i].getElementsByClassName('enhanced_favIcon')
            if (enhanced_hasEmbed.length != 0) {
                enhanced_hasEmbed[0].remove()
            }
        }
    }

    // Location - Library
    if (isLocation('library')) {

        // Enable grid size option
        enhanced_Grid.style.display = 'block'

        // Game Count
        var enhanced_homescreenGrids = document.getElementsByClassName('lEPylf KnM5Wc')
        if (enhanced_homescreenGrids.length > 0) {
            enhanced_homescreenGrids = enhanced_homescreenGrids[enhanced_homescreenGrids.length - 1].querySelectorAll('.GqLi4d').length
            enhanced_gameCounter.textContent = ' ' + enhanced_homescreenGrids
            secureInsert(enhanced_gameCounter, 'div[jsname="HXYfLc"] .HZ5mJ', 0)
        }

        // Letter Box
        if (enhanced_languageSupport.supportedCodes.includes(enhanced_local)) {
            secureInsert(enhanced_letterBox, 'w83WBe URhE4b', 1)
        }

        // Add Show-All Button
        secureInsert(enhanced_showAll, 'w83WBe URhE4b', 0)
        if (enhanced_settings.filter == 0) {
            enhanced_showAll.style.display = 'none'
            enhanced_showState = false
        } else {
            enhanced_showAll.style.display = 'inline-block'
        }

        // Favorite - Last Played
        if (document.querySelector('.CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc')) {
            if (enhanced_favorite.name != document.querySelector('.Wq73hb').textContent) {
                enhanced_favorite.name = document.querySelector('.Wq73hb').textContent
                enhanced_favorite.sku = document.getElementsByClassName('n4qZSd')[document.getElementsByClassName('n4qZSd').length - 1].getAttribute('data-sku-id')

                if (enhanced_settings.favoriteList.includes(enhanced_favorite.sku)) {
                    enhanced_favorite.active = true
                    enhanced_favorite.style.color = '#00e0ba'
                } else {
                    enhanced_favorite.active = false
                    enhanced_favorite.style.color = ''
                }
            }
            secureInsert(enhanced_favorite, 'div[jsaction="JIbuQc:qgRaKd;"]', 0)
        }

        // Show/Hide Filter - Last Played
        if (document.querySelector('.CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc') && enhanced_settings.filter == 1) {
            var enhanced_launchSKU = document.getElementsByClassName('n4qZSd')[document.getElementsByClassName('n4qZSd').length - 1].getAttribute('data-sku-id')

            if (enhanced_visibility.sku != enhanced_launchSKU) {
                enhanced_visibility.sku = enhanced_launchSKU
                enhanced_visibility.name = document.querySelector('.Wq73hb').textContent

                if (enhanced_settings.gameFilter.includes(enhanced_visibility.sku)) {
                    enhanced_visibility.active = true
                    enhanced_visibility.style.color = '#FF7070'
                    enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>'
                } else {
                    enhanced_visibility.active = false
                    enhanced_visibility.style.color = ''
                    enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>'
                }
            }
            secureInsert(enhanced_visibility, 'div[jsaction="JIbuQc:qgRaKd;"]', 0)
        }

        // Loop through game tiles
        for (var i = 0; i < enhanced_gameList.length; i++) {

            // Favorite - Order
            var enhanced_hasEmbed = enhanced_gameList[i].getElementsByClassName('enhanced_favIcon')
            if (enhanced_settings.favoriteList.includes(enhanced_gameList[i].getAttribute('jsdata').split(';')[1])) {
                enhanced_gameList[i].style.order = '-1';

                if (enhanced_hasEmbed.length == 0) {
                    var enhanced_favIcon = document.createElement('div')
                    enhanced_favIcon.className = 'enhanced_favIcon'
                    enhanced_favIcon.innerHTML = '<i class="google-material-icons" style="transform: scale(.7); vertical-align: middle; color: #202124;" aria-hidden="true">star</i>'
                    enhanced_favIcon.style.display = 'inline-flex'
                    enhanced_favIcon.style.position = 'absolute'
                    enhanced_favIcon.style.width = '1.125rem'
                    enhanced_favIcon.style.height = '1.125rem'
                    enhanced_favIcon.style.top = '0.5rem'
                    enhanced_favIcon.style.backgroundColor = 'rgba(255,255,255,.9)'
                    enhanced_favIcon.style.right = '0.5rem'
                    enhanced_favIcon.style.border = '0.125rem solid rgba(255,255,255,.9)'
                    enhanced_favIcon.style.borderRadius = '50%'
                    enhanced_favIcon.style.boxShadow = '0 0.125rem 0.75rem rgb(0 0 0 / 32%), 0 0.0625rem 0.375rem rgb(0 0 0 / 18%)'
                    enhanced_favIcon.style.alignItems = 'center'
                    enhanced_favIcon.style.justifyContent = 'center'
                    enhanced_gameList[i].append(enhanced_favIcon)
                }
            } else {
                enhanced_gameList[i].style.order = '';
                if (enhanced_hasEmbed.length != 0) {
                    enhanced_hasEmbed[0].remove()
                }
            }

            // Filter order/visibility
            if (enhanced_settings.gameFilter.includes(enhanced_gameList[i].getAttribute('jsdata').split(';')[1]) && enhanced_showState === false && enhanced_settings.filter == 1) {
                enhanced_gameList[i].style.display = 'none';
            } else {
                // Letterbox
                if (enhanced_activeLetter) {
                    enhanced_ariaLabel = enhanced_gameList[i].getAttribute('aria-label')
                    if ('en|sv|fr|it|es|da|ca|pt|no|fi'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.split(' ')[1].charAt(0).toUpperCase()
                    } else if ('pl'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.split(' ')[2].charAt(0).toUpperCase()
                    } else if ('sk'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.split(' ')[3].charAt(0).toUpperCase()
                    } else if ('de|hu|nl'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.charAt(0).toUpperCase()
                    }

                    if (enhanced_ariaLetter == String.fromCharCode(65 + parseInt(enhanced_activeLetter)).toUpperCase()) {
                        enhanced_gameList[i].style.display = ''
                    } else {
                        enhanced_gameList[i].style.display = 'none'
                    }
                } else {
                    enhanced_gameList[i].style.display = ''
                }
            }

            // Set brightness of filtered items
            if (enhanced_settings.gameFilter.includes(enhanced_gameList[i].getAttribute('jsdata').split(';')[1]) && enhanced_settings.filter == 1) {
                enhanced_gameList[i].style.filter = 'brightness(40%) grayscale(100%)'
            } else {
                enhanced_gameList[i].style.filter = 'none'
            }
        }
    } else {
        enhanced_Grid.style.display = 'none'
    }

    // Location - In-Game
    if (isLocation('ingame')) {

        // Currrent Game Info
        var enhanced_currentID = document.location.href.split('/player/')[1].split('?')[0]
        var enhanced_currentStream = document.getElementsByClassName('vvjGmc')[document.getElementsByClassName('vvjGmc').length - 1]

        enhanced_Windowed.style.display = 'flex'
        enhanced_monitorButton.style.display = 'flex'
        secureInsert(enhanced_Windowed, 'E0Zk9b', 0)
        secureInsert(enhanced_monitorButton, 'E0Zk9b', 0)
        secureInsert(enhanced_filterUI.main.toggle, 'E0Zk9b', 0)

        // Filter Setup
        if (enhanced_currentStream && enhanced_currentStream.style.filter == 'url("#")') {
            enhanced_updateFilters()
        }
        if (!enhanced_filterApplied) {
            enhanced_updateFilters(true)
            enhanced_filterApplied = true
        }

        // Clock
        if (enhanced_settings.clockOption == 2 || enhanced_settings.clockOption == 3) {
            secureInsert(enhanced_ClockOverlay, 'bYYDgf', 0)
            enhanced_ClockOverlay.style.display = 'flex'
        }

        // Session Time
        if (enhanced_sessionStart == 0) {
            enhanced_sessionStart = Date.now()
        } else {
            var enhanced_sessionDur = Date.now()
            enhanced_sessionDur = enhanced_formatTime((enhanced_sessionDur - enhanced_sessionStart) / 1000)

            monitor.updateSessionTime(enhanced_sessionDur)
        }

        // Discord Presence
        var enhanced_currentStatus = document.querySelectorAll('.hxhAyf.OzUE7e.XY6ZL .TZ0BN .HDKZKb.LiQ6Hb')[0]
        if (enhanced_currentStatus && enhanced_presenceData) {
            if (enhanced_presenceData[enhanced_currentID]) {
                enhanced_presenceLargeImage = enhanced_presenceData[enhanced_currentID]
            } else {
                enhanced_presenceLargeImage = 'stadialogo'
            }

            enhanced_discordPresence = {
                clientId: '667381280656064544',
                presence: {
                    state: enhanced_currentStatus.textContent.replace(/[™®]/g, ' '),
                    largeImageKey: enhanced_presenceLargeImage,
                    startTimestamp: enhanced_sessionStart,
                    instance: true,
                    buttons: [{
                        label: 'Open Stadia',
                        url: 'https://stadia.google.com/home'
                    }, {
                        label: 'Get Stadia Enhanced',
                        url: 'https://github.com/ChristopherKlay/StadiaEnhanced'
                    }]
                }
            }
        }

        // Menu Monitor
        secureInsert(monitor.menuElement, '.FTrnxe:not(.qRvogc) > .OWVtN:not(.YgM2X)', 0)
    } else {
        enhanced_discordPresence = {}
        enhanced_Windowed.style.display = 'none'
        enhanced_monitorButton.style.display = 'none'
        enhanced_ClockOverlay.style.display = 'none'

        if (enhanced_filterUI.main.frame.style.display == 'block') {
            enhanced_filterUI.main.frame.style.display = 'none'
            enhanced_injectStyle('', 'enhanced_styleDimOverlayTemp')
        }

        enhanced_filterApplied = false
        enhanced_monitorState = 0
        enhanced_sessionStart = 0

        enhanced_monitorState === 0 ?
            monitor.hide() :
            monitor.showAt(enhanced_settings.monitorPosition)
    }

    // Location - Captures
    if (isLocation('captures')) {
        // Captures Filter
        secureInsert(enhanced_captureFilters, 'dwGRGd', 0)
    }

    // Location - Profile Details
    if (isLocation('profiledetails')) {
        // Stadia Hunters - Logo Link
        if (enhanced_settings.enableStadiaHunters) {
            enhanced_huntersLink.gameID = document.location.href.split('/detail/')[1].split('?')[0]
            secureInsert(enhanced_huntersLinkContainer, 'dwGRGd', 3)
        }

        secureInsert(enhanced_achievementsFilter, 'dwGRGd', 2)
    }

    // Location - Store Details
    if (isLocation('storedetails')) {

        // Database Infos
        if (enhanced_database && enhanced_settings.enableStadiaDatabase == 1) {
            for (var i = 0; i < enhanced_database.length; i++) {
                if (enhanced_database[i].id == document.location.href.split('details/')[1].split('/')[0]) {

                    // Check for empty entry
                    var enhanced_fullEntry = enhanced_database[i].maxRes + enhanced_database[i].fps + enhanced_database[i].proFeat + enhanced_database[i].crossplay
                    if (enhanced_fullEntry != '') {

                        // Section Header
                        var enhanced_databaseDetails = '<div class="CVVXfc"><h2 class="HZ5mJ">' + enhanced_lang.extdetail + '</h2></div>'

                        // Entry - Resolution
                        if (enhanced_database[i].maxRes != '') {
                            enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">' + enhanced_lang.maxresolution + '</div><div class="tM4Phe">' + enhanced_database[i].maxRes + '</div></div>'
                        }

                        // Entry - Framerate
                        if (enhanced_database[i].fps != '') {
                            enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">' + enhanced_lang.fps + '</div><div class="tM4Phe">' + enhanced_database[i].fps + '</div></div>'
                        }

                        // Entry - Pro Features
                        if (enhanced_database[i].proFeat != '') {
                            enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">Pro Features</div><div class="tM4Phe">' + enhanced_database[i].proFeat + '</div></div>'
                        }

                        // Entry - Stadia Features
                        if (enhanced_database[i].stadiaFeat != '') {
                            enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">Stadia Features</div><div class="tM4Phe">' + enhanced_database[i].stadiaFeat + '</div></div>'
                        }

                        // Entry - Crossplay
                        if (enhanced_database[i].crossplay != '') {
                            enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">Crossplay</div><div class="tM4Phe">' + enhanced_database[i].crossplay + '</div></div>'
                        }

                        // Check for changes
                        if (enhanced_extendedDetails.innerHTML != enhanced_databaseDetails) {
                            enhanced_extendedDetails.innerHTML = enhanced_databaseDetails
                        }

                        secureInsert(enhanced_extendedDetails, 'Dbr3vb URhE4b bqgeJc wGziQb', 0)

                        // Disclaimers
                        if (enhanced_database[i].tested != '') {
                            secureInsert(enhanced_untestedDisclaimer, 'Dbr3vb URhE4b bqgeJc wGziQb', 0)
                        }

                        secureInsert(enhanced_extendedDisclaimer, 'Dbr3vb URhE4b bqgeJc wGziQb', 0)
                    }
                }
            }
        }

        // Wishlist Startup
        if (enhanced_wishlistHeart.innerHTML == '') {
            var enhanced_currentSKU = document.location.href.split('sku/')[1].split('?')[0]
            if (enhanced_settings.wishlist.includes(enhanced_currentSKU)) {
                enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite</i>'
                enhanced_wishlistHeart.style.color = '#ff773d'
            } else {
                enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite_border</i>'
                enhanced_wishlistHeart.style.color = ''
            }
            enhanced_wishlistContainer.style.display = 'inline-block'
        }

        secureInsert(enhanced_StoreContainer, 'WjVJKd', 0)
    } else {
        // Reset extended game info
        enhanced_extendedDetails.innerHTML = ''

        // Wishlist Startup
        enhanced_wishlistContainer.style.display = 'none'
        enhanced_wishlistHeart.innerHTML = ''
    }

    // Location - Store List
    if (isLocation('storelist')) {
        // Add class for page segements in split view
        if (enhanced_settings.splitStore != 0) {
            enhanced_loadedLists = document.getElementsByClassName('xPDr9b')[document.getElementsByClassName('xPDr9b').length - 1].querySelectorAll('div:not(.pW7Dlc) > streamable')
            for (var i = 0; i < enhanced_loadedLists.length; i++) {
                enhanced_loadedLists[i].parentNode.classList.add("splitstorefull")
            }
        }

        // Filter by Store tags

        // Set label
        switch (enhanced_activeListFilter) {
            case 1:
                var enhanced_storeFilterOption = enhanced_languageSupport.storeFilters[enhanced_local].game
                break
            case 2:
                var enhanced_storeFilterOption = enhanced_languageSupport.storeFilters[enhanced_local].bundle
                break
            case 3:
                var enhanced_storeFilterOption = enhanced_languageSupport.storeFilters[enhanced_local].addon
                break
            case 4:
                var enhanced_storeFilterOption = enhanced_languageSupport.storeFilters[enhanced_local].free
                break
        }

        // Filter items
        var enhanced_listElements = document.getElementsByClassName('xPDr9b')[document.getElementsByClassName('xPDr9b').length - 1].getElementsByClassName('pW7Dlc')
        if (enhanced_activeListFilter != 0) {
            if (enhanced_activeListFilter < 4) {
                for (var i = 0; i < enhanced_listElements.length; i++) {
                    if (enhanced_listElements[i].querySelector('.gDRPLd').lastChild.textContent != enhanced_storeFilterOption) {
                        enhanced_listElements[i].parentNode.style.display = 'none'
                    } else {
                        enhanced_listElements[i].parentNode.style.display = 'block'
                    }
                }
            } else {
                for (var i = 0; i < enhanced_listElements.length; i++) {
                    if (enhanced_listElements[i].querySelector('.Ndt9Fc') && enhanced_listElements[i].querySelector('.Ndt9Fc').textContent.includes(enhanced_storeFilterOption)) {
                        enhanced_listElements[i].parentNode.style.display = 'block'
                    } else {
                        enhanced_listElements[i].parentNode.style.display = 'none'
                    }
                }
            }
        } else {
            for (var i = 0; i < enhanced_listElements.length; i++) {
                enhanced_listElements[i].parentNode.style.display = 'block'
            }
        }

        // List Filters
        if (enhanced_languageSupport.supportedCodes.includes(enhanced_local)) {
            secureInsert(enhanced_listFilter, 'B22Hnf', 3)
        }
    } else if (enhanced_activeListFilter != 0) {
        enhanced_switchListFilter(enhanced_activeListFilter)
    }

    // Location - Pro Games
    if (isLocation('progames')) {

        // UI changes and count of currently unclaimed games
        document.querySelector('.ZECEje > li:nth-child(3) > a').classList.remove('YySNWc')
        enhanced_ProGamesLink.classList.add('YySNWc')
        if (document.querySelector('.alEDLe') !== null) {
            count = document.querySelector('.alEDLe').querySelectorAll('.X5624d').length
            if (count != 0 && enhanced_ProGames.innerHTML.indexOf(count) == -1) {
                enhanced_ProGamesLink.textContent = 'Pro (' + count + ')'
            }
        }
    } else {
        enhanced_ProGamesLink.classList.remove('YySNWc')
        if (enhanced_ProGamesLink.textContentL != 'Pro') {
            enhanced_ProGamesLink.textContent = 'Pro'
        }
    }

    // Location - Personal Profile
    if (isLocation('profile')) {

        // Add avatar option on own profile
        secureInsert(enhanced_customAvatar, '.R1HPhd.bYsRUc.bqgeJc.wGziQb .hX4jqb', 0)
    }

    // Location - Player Statistics
    if (isLocation('playerstats')) {

        // Game Statistics
        if (document.querySelector('.MDSsFe') !== null) {

            // Gamelist Filter
            secureInsert(enhanced_gamelistFilter, 'dwGRGd', 2)

            var enhanced_gameListBaseQuery = document.querySelectorAll('div[jsname="jlb53b"]')[document.querySelectorAll('div[jsname="jlb53b"]').length - 1]
            var enhanced_gameListRatioQuery = enhanced_gameListBaseQuery.querySelectorAll('.kPtFV')

            for (var i = 0; i < enhanced_gameListRatioQuery.length; i++) {
                var enhanced_compRatio = enhanced_gameListRatioQuery[i].querySelector('.bn3lwc').textContent / enhanced_gameListRatioQuery[i].querySelector('.IBMKhc').textContent.substring(1)
                switch (enhanced_gameStateFilter.state) {
                    case 0:
                        enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = 'block'
                        break
                    case 1:
                        if (enhanced_compRatio != 1) {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = 'none'
                        } else {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = 'block'
                        }
                        break
                    case 2:
                        if (enhanced_compRatio == 1) {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = 'none'
                        } else {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = 'block'
                        }
                        break
                }
            }

            var enhanced_noAchievements = document.querySelectorAll('c-wiz[jsrenderer="XBSGie"]')
            for (var i = 0; i < enhanced_noAchievements.length; i++) {
                if (enhanced_noAchievements[i].querySelectorAll('.kPtFV').length == 0) {
                    if (enhanced_gameStateFilter.state > 0) {
                        enhanced_noAchievements[i].style.display = 'none'
                    } else {
                        enhanced_noAchievements[i].style.display = 'block'
                    }
                }
            }

            // Container
            secureInsert(enhanced_statOverview, 'dkZt0b qRvogc', 2)

            // Statistics
            var enhanced_loadStats

            // Playtime Calculation
            var enhanced_statsBaseQuery = document.querySelectorAll('div[jsname="jlb53b"]')[document.querySelectorAll('div[jsname="jlb53b"]').length - 1]
            var enhanced_timeQuery = enhanced_statsBaseQuery.querySelectorAll('.eUhXn')
            var enhanced_statsPlaytime = 0
            var enhanced_timesAvailable = false

            for (var i = 0; i < enhanced_timeQuery.length; i++) {
                var split = enhanced_timeQuery[i].textContent.split(/[\s]/)
                if (split.length == 4) {
                    var enhanced_hoursLabel = split[1]
                    var enhanced_minutesLabel = split[3]
                    enhanced_timesAvailable = true
                    break
                }
            }

            if (enhanced_timesAvailable) {
                for (var i = 0; i < enhanced_timeQuery.length; i++) {
                    var enhanced_titlePlaytime = enhanced_timeQuery[i].textContent.replace('.', '').split(/[\s]/)

                    switch (enhanced_titlePlaytime.length) {
                        case 2:
                            if (enhanced_titlePlaytime[1] == enhanced_minutesLabel) {
                                enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0] * 60)
                            } else if (enhanced_titlePlaytime[1] == enhanced_hoursLabel) {
                                enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0] * 3600)
                            } else {
                                enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0])
                            }
                            break
                        case 4:
                            enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0] * 3600)
                            enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[2] * 60)
                            break
                    }
                }
                enhanced_statsPlaytime = enhanced_secondsToHms(enhanced_statsPlaytime)

                enhanced_loadStats = `
                    <div class="xsbfy" style="margin-bottom: 1rem;">
                        <div class="qKSMec">
                            <i class="google-material-icons QxsLuc" aria-hidden="true">schedule</i>
                            <div class="kPtFV">
                                <span class="bn3lwc">` + enhanced_statsPlaytime[0] + ' ' + enhanced_hoursLabel + `</span>
                                <span class="IBMKhc">/` + enhanced_statsPlaytime[1] + ' ' + enhanced_minutesLabel + ' ' + enhanced_lang.totalPlayTime + `</span>
                            </div>
                        </div>
                    </div>`

                if (enhanced_statPlaytime.innerHTML != enhanced_loadStats) {
                    enhanced_statPlaytime.innerHTML = enhanced_loadStats
                }
            }

            // Achievements
            var enhanced_statsBaseQuery = document.querySelectorAll('div[jsname="jlb53b"]')[document.querySelectorAll('div[jsname="jlb53b"]').length - 1]
            var enhanced_statsOwned = enhanced_statsBaseQuery.childElementCount
            var enhanced_statsAchievementQuery = enhanced_statsBaseQuery.querySelectorAll('.kPtFV')

            if (enhanced_statsAchievementQuery.length > 0) {
                var enhanced_statsUnlock = 0
                var enhanced_statsTotal = 0
                var enhanced_statsFinished = 0
                for (var i = 0; i < enhanced_statsAchievementQuery.length; i++) {
                    var enhanced_statsTitleUnlock = parseInt(enhanced_statsAchievementQuery[i].firstChild.textContent)
                    var enhanced_statsTitleTotal = parseInt(enhanced_statsAchievementQuery[i].lastChild.textContent.substring(1))
                    if (enhanced_statsTitleUnlock == enhanced_statsTitleTotal) {
                        enhanced_statsFinished++
                    }
                    enhanced_statsUnlock += enhanced_statsTitleUnlock
                    enhanced_statsTotal += enhanced_statsTitleTotal

                }
                var enhanced_statsUnlockRate = (enhanced_statsUnlock * 100) / enhanced_statsTotal
                var enhanced_statsFinishRate = (enhanced_statsFinished * 100) / enhanced_statsOwned

                enhanced_loadStats = `
                    <div class="HZ5mJ">` + enhanced_lang.statistics + `</div>
                    <div class="xsbfy" style="margin-bottom: 1rem;">
                        <div class="qKSMec">
                            <i class="google-material-icons QxsLuc" aria-hidden="true">stars</i>
                            <div class="kPtFV">
                                <span class="bn3lwc">` + enhanced_statsFinished + `</span>
                                <span class="IBMKhc">/` + enhanced_statsOwned + ' ' + enhanced_lang.gamesfinished + `</span>
                            </div>
                        </div>
                        <div class="WTRpgf">
                            <div class="d50Cgd VwFGMb">
                                <div class="hPTRZ Jc3yuc">
                                    <div class="FxJ5Tc y2VB6d" style="width: ` + enhanced_statsFinishRate + `%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="xsbfy" style="margin-bottom: 1rem;">
                        <div class="qKSMec">
                            <i class="google-material-icons QxsLuc" aria-hidden="true">trophy</i>
                            <div class="kPtFV">
                                <span class="bn3lwc">` + enhanced_statsUnlock + `</span>
                                <span class="IBMKhc">/` + enhanced_statsTotal + ' ' + enhanced_lang.achievementsunlocked + `</span>
                            </div>
                        </div>
                        <div class="WTRpgf">
                            <div class="d50Cgd VwFGMb">
                                <div class="hPTRZ Jc3yuc">
                                    <div class="FxJ5Tc y2VB6d" style="width: ` + enhanced_statsUnlockRate + `%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>`
                if (enhanced_statAchievements.innerHTML != enhanced_loadStats) {
                    enhanced_statAchievements.innerHTML = enhanced_loadStats
                }
            }
        }
    } else {
        enhanced_statPlaytime.innerHTML = ''
    }

    // Location - Stadia Menu
    if (isLocation('stadiamenu')) {

        // Offline Users
        var enhanced_statusList = document.querySelectorAll('.eXdFqc .rtsndf.WTetv .DfyMcd');
        for (var i = 0; i < enhanced_statusList.length; i++) {
            if (enhanced_settings.hideOfflineUsers == 1) {
                enhanced_statusList[i].closest('.Y1rZWd.PuD06d').setAttribute('style', 'display: none !important')
            } else {
                enhanced_statusList[i].closest('.Y1rZWd.PuD06d').setAttribute('style', 'display: flex')
            }
        }

        // Invisible Users
        var enhanced_statusList = document.querySelectorAll('.eXdFqc .UxR5ob.m8Kzt')
        for (var i = 0; i < enhanced_statusList.length; i++) {
            if (enhanced_statusList[i].childElementCount == 1) {
                if (enhanced_settings.hideInvisibleUsers == 1) {
                    enhanced_statusList[i].closest('.Y1rZWd.PuD06d').setAttribute('style', 'display: none !important')
                } else {
                    enhanced_statusList[i].closest('.Y1rZWd.PuD06d').setAttribute('style', 'display: flex')
                }
            }
        }

        // Total Friend Count
        var i = document.getElementsByClassName('Y1rZWd  PuD06d').length
        if (i > 0) {
            var enhanced_friendStatus = document.querySelector('.VE7aje')
            if (enhanced_friendStatus.textContent.slice(-1) == ')') {
                enhanced_friendStatus.textContent = enhanced_friendStatus.textContent.slice(0, -1)
            }

            enhanced_friendCount.textContent = ', ' + i + ' ' + enhanced_lang.total.toLowerCase() + ')'
            secureInsert(enhanced_friendCount, 'VE7aje', 2)
        }

        // Links 2 Images
        if (enhanced_settings.hideInlinePreview == 1) {
            var enhanced_linkedURL = document.querySelectorAll('.lwvtBe a')
            for (var i = 0; i < enhanced_linkedURL.length; i++) {
                if (enhanced_linkedURL[i].href.match(/\.(jpeg|jpg|gif|png)$/) != null && enhanced_linkedURL[i].childElementCount == 0) {
                    var enhanced_imagePreview = document.createElement('img')
                    enhanced_imagePreview.src = enhanced_linkedURL[i].href
                    enhanced_imagePreview.style.width = '100%'
                    var enhanced_imagePrevLink = document.createElement('a')
                    enhanced_imagePrevLink.href = enhanced_linkedURL[i].href
                    enhanced_imagePrevLink.target = '_blank'
                    enhanced_imagePrevLink.append(enhanced_imagePreview)

                    if (enhanced_linkedURL[i].parentNode.textContent.replace(enhanced_linkedURL[i].href, '') != '') {
                        enhanced_imagePreview.style.borderRadius = '0.5rem'
                        enhanced_linkedURL[i].innerHTML = enhanced_imagePreview.outerHTML
                    } else {
                        enhanced_imagePreview.style.borderRadius = '0.5rem 0.5rem 0 0.5rem'
                        enhanced_linkedURL[i].closest('.wJVlXc').prepend(enhanced_imagePrevLink)
                        enhanced_linkedURL[i].closest('.FPgvD').remove()
                    }
                }
            }
        }

        // Emoji Picker
        secureInsert(enhanced_emojiswitch, 'IRyDt', 0)
        secureInsert(enhanced_emojiPicker, 'pwUBOe t7snHe', 2)

        // Clock
        secureInsert(enhanced_ClockFriends, 'hxhAyf OzUE7e XY6ZL', 0)
    }

    // Location - Settings
    if (isLocation('settings')) {

        // Resolution - Enable 'Up to 4K' option
        var enhanced_selector = document.getElementsByClassName('sx2eZe QAAyWd aKIhz OWB6Me')
        if (enhanced_selector.length != 0) {
            enhanced_selector[0].setAttribute('data-disabled', 'false')
            enhanced_selector[0].classList.remove('OWB6Me')
        }

        // Total Payments
        var enhanced_purchaseList = document.getElementsByClassName('kgmzdc')[document.getElementsByClassName('kgmzdc').length - 1]
        if (enhanced_purchaseList) {
            var enhanced_purchaseEntries = enhanced_purchaseList.getElementsByClassName('l6cQMc')
            if (enhanced_purchaseEntries.length != 0) {
                var enhanced_currency = enhanced_purchaseEntries[0].querySelector('.o2NwGe').textContent.replace(/[0-9].*[0-9]/, 'CUR')
                var enhanced_payments = []

                for (var i = 0; i < enhanced_purchaseEntries.length; i++) {
                    if (enhanced_purchaseEntries[i].querySelector('.v3rApc.Wh3gGb') == null) {
                        var enhanced_purchaseAmount = enhanced_purchaseEntries[i].querySelector('.o2NwGe')
                        if (enhanced_purchaseAmount.textContent.match(/[,].*[.]/)) {
                            enhanced_payments.push(parseFloat(enhanced_purchaseAmount.textContent.replace(/[^0-9,. ]+/, '').replace(',', '')))
                        } else {
                            enhanced_payments.push(parseFloat(enhanced_purchaseAmount.textContent.replace(/[^0-9,. ]+/, '').replace(',', '.')))
                        }
                    }
                }

                var enhanced_paytotal = enhanced_payments.reduce((a, b) => a + b, 0).toFixed(2)
                enhanced_paytotal = enhanced_lang.total + ' ' + enhanced_currency.replace('CUR', enhanced_paytotal)

                enhanced_allpayments.textContent = enhanced_paytotal
                secureInsert(enhanced_allpayments, 'Ca4K1', 0)
            }
        }
    }

    // Location - Always active

    // Update monitor position
    enhanced_settings.monitorPosition = monitor.getCurrentPosition()

    // Codec - Set codec preference
    switch (enhanced_settings.codec) {
        case 0:
            if (isLocation('home')) {
                localStorage.removeItem('video_codec_implementation_by_codec_key')
            }
            break
        case 1:
            localStorage.setItem('video_codec_implementation_by_codec_key', '{"vp9":"ExternalDecoder"}')
            localStorage.setItem('video_codec_implementation_by_codec_key_using_local_check', '{"vp9":"ExternalDecoder"}')
            localStorage.setItem('video_codec_implementation_by_codec_key_using_media_capabilities', '{"vp9":"ExternalDecoder"}')
            break
        case 2:
            localStorage.setItem('video_codec_implementation_by_codec_key', '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}')
            localStorage.setItem('video_codec_implementation_by_codec_key_using_local_check', '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}')
            localStorage.setItem('video_codec_implementation_by_codec_key_using_media_capabilities', '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}')
            break
    }

    // Clock Widget - Update to current time / display option
    var enhanced_Date = new Date()
    switch (enhanced_settings.clockMode) {
        case 0:
            var enhanced_CurrentTime = enhanced_Date.toLocaleTimeString('en-GB')
            break
        case 1:
            var enhanced_CurrentTime = enhanced_Date.toLocaleTimeString('en-US')
            break
    }
    if (enhanced_ClockFriends.innerHTML != enhanced_CurrentTime) {
        enhanced_ClockFriends.innerHTML = '<i class="material-icons-extended" aria-hidden="true" style="margin-right: 0.5rem;">schedule</i>' + enhanced_CurrentTime
        enhanced_ClockOverlay.innerHTML = enhanced_CurrentTime
    }
}, 200)

/**
 * Updates the home menu option corresponding to the specified "set" parameter.
 *
 * @param {string} set - Setting identifier: "codec", "resolution", "monitorautostart", ...
 * @param {number} opt - Option state represented by an integer
 */
function enhanced_applySettings(set, opt) {
    switch (set) {
        case 'codec':
            switch (opt) {
                case 0:
                    enhanced_Codec.style.color = ''
                    enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.codec + ': ' + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Codec Preference: Set to "Automatic".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_Codec.style.color = '#00e0ba'
                    enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.codec + ': VP9<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Codec Preference: Set to "VP9".', enhanced_consoleEnhanced, '')
                    break
                case 2:
                    enhanced_settings.resolution = 0
                    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
                    enhanced_applySettings('resolution', enhanced_settings.resolution)
                    enhanced_Codec.style.color = '#00e0ba'
                    enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.codec + ': H264<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Codec Preference: Set to "H264".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'resolution':
            switch (opt) {
                case 0:
                    enhanced_Resolution.style.color = ''
                    enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.resolution + ': ' + enhanced_lang.native + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>'
                    enhanced_resolutionPopup.innerHTML = '<div class="oOMRTd"><i class="material-icons-extended STPv1" aria-hidden="true" style="vertical-align: bottom;">monitor</i></div><div class="zvRH1b">' + enhanced_lang.resolution + ': ' + enhanced_lang.native + '</div>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Resolution: Set to "Native".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_settings.codec = 1
                    localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
                    enhanced_applySettings('codec', enhanced_settings.codec)
                    enhanced_Resolution.style.color = '#00e0ba'
                    enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.resolution + ': 1440p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>'
                    enhanced_resolutionPopup.innerHTML = '<div class="oOMRTd"><i class="material-icons-extended STPv1" aria-hidden="true" style="vertical-align: bottom;">monitor</i></div><div class="zvRH1b">' + enhanced_lang.resolution + ': 1440p</div>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Resolution: Set to "2560x1440".', enhanced_consoleEnhanced, '')
                    break
                case 2:
                    enhanced_settings.codec = 1
                    localStorage.setItem("enhanced_" + enhanced_settings.user, JSON.stringify(enhanced_settings))
                    enhanced_applySettings("codec", enhanced_settings.codec)
                    enhanced_Resolution.style.color = "#00e0ba"
                    enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.resolution + ': 2160p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>'
                    enhanced_resolutionPopup.innerHTML = '<div class="oOMRTd"><i class="material-icons-extended STPv1" aria-hidden="true" style="vertical-align: bottom;">monitor</i></div><div class="zvRH1b">' + enhanced_lang.resolution + ': 2160p</div>'
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '3840x2160'.", enhanced_consoleEnhanced, "")
                    break
            }
            break
        case 'monitorautostart': // stadia menu (home)
            _applyMonitorAutoStart(enhanced_lang, opt)
            break
        case 'notification':
            switch (opt) {
                case 0:
                    enhanced_setNotification.style.color = "#00e0ba"
                    enhanced_setNotification.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">notifications</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.notification + ": " + enhanced_lang.manual + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.notificationdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Notifications: Set to "Manual".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_setNotification.style.color = "#00e0ba"
                    enhanced_setNotification.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">notifications</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.notification + ": " + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.notificationdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Notifications: Set to "Auto".', enhanced_consoleEnhanced, '')
                    break
                case 2:
                    enhanced_setNotification.style.color = ''
                    enhanced_setNotification.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">notifications_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.notification + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.notificationdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Notifications: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'gridsize':
            switch (opt) {
                case 0:
                    enhanced_Grid.style.color = ''
                    enhanced_CSS = ''
                    break;
                case 1:
                    enhanced_Grid.style.color = '#00e0ba'
                    enhanced_CSS = '.lEPylf.KnM5Wc { grid-template-columns: repeat(15,minmax(auto,7.8125rem)) !important; }'
                    break;
                case 2:
                    enhanced_Grid.style.color = '#00e0ba'
                    enhanced_CSS = '.lEPylf.KnM5Wc { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; }'
                    break;
                case 3:
                    enhanced_Grid.style.color = '#00e0ba'
                    enhanced_CSS = '.lEPylf.KnM5Wc { grid-template-columns: repeat(21,minmax(auto,7.8125rem)) !important; }'
                    break;
                case 4:
                    enhanced_Grid.style.color = '#00e0ba'
                    enhanced_CSS = '.lEPylf.KnM5Wc { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; }'
                    break;
                case 5:
                    enhanced_Grid.style.color = '#00e0ba'
                    enhanced_CSS = '.lEPylf.KnM5Wc { grid-template-columns: repeat(12,minmax(auto,7.8125rem)) !important; }'
                    enhanced_CSS += '@media (min-width: 1280px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(15,minmax(auto,7.8125rem)) !important; } }'
                    enhanced_CSS += '@media (min-width: 1920px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; } }'
                    enhanced_CSS += '@media (min-width: 2560px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(21,minmax(auto,7.8125rem)) !important; } }'
                    enhanced_CSS += '@media (min-width: 3840px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; } }'
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleGrid')

            if (opt < 1) {
                enhanced_gridOption = enhanced_lang.default
            } else if (opt < 5) {
                enhanced_gridOption = enhanced_settings.gridSize + 4
            } else {
                enhanced_gridOption = enhanced_lang.responsive
            }

            enhanced_Grid.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_comfy</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.gridsize + ': ' + enhanced_gridOption + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.griddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': 4</span></span>'
            console.log('%cStadia Enhanced' + '%c ⚙️ - Library Grid Size: Set to ' + enhanced_gridOption + '.', enhanced_consoleEnhanced, '');
            break
        case 'clock':
            switch (opt) {
                case 0:
                    enhanced_Clock.style.color = ''
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    enhanced_ClockFriends.style.display = 'none'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Clock Option: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_Clock.style.color = '#00e0ba'
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.friendslist + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    enhanced_ClockFriends.style.display = 'flex'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Clock Option: Set to "Friendlist".', enhanced_consoleEnhanced, '')
                    break
                case 2:
                    enhanced_Clock.style.color = "#00e0ba"
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.igoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    enhanced_ClockFriends.style.display = 'none'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Clock Option: Set to "In-Game Overlay".', enhanced_consoleEnhanced, '')
                    break
                case 3:
                    enhanced_Clock.style.color = "#00e0ba"
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.listoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    enhanced_ClockFriends.style.display = 'flex'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Clock Option: Set to "Menu & Overlay".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'filter':
            switch (opt) {
                case 0:
                    enhanced_useFilter.style.color = ''
                    enhanced_useFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Filter Option: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_useFilter.style.color = '#00e0ba'
                    enhanced_useFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Filter Option: Set to "Enabled".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'messagepreview':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_hidePreview.style.color = ''
                    enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Message Preview: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.lzIqJf .DvD76d { display: none; } .lzIqJf .xzJkDf { display: none; }'
                    enhanced_hidePreview.style.color = '#00e0ba'
                    enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Message Preview: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleMsgPreview")
            break
        case 'quickreply':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_quickReply.style.color = ''
                    enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Quick Reply: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.bbVL5c { display: none !important; }'
                    enhanced_quickReply.style.color = '#00e0ba'
                    enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Quick Reply: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleQuickReply')
            break
        case 'inlinepreview':
            switch (opt) {
                case 0:
                    enhanced_inlineConvert.style.color = ''
                    enhanced_inlineConvert.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">insert_photo</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.inlineimage + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.inlinedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - In-line Image Preview: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_inlineConvert.style.color = '#00e0ba'
                    enhanced_inlineConvert.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">insert_photo</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.inlineimage + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.inlinedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - In-line Image Preview: Set to "Enabled".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'offlineusers':
            switch (opt) {
                case 0:
                    enhanced_offlineUser.style.color = ''
                    enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Offline Users: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_offlineUser.style.color = '#00e0ba'
                    enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Offline Users: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'invisibleusers':
            switch (opt) {
                case 0:
                    enhanced_invisibleUser.style.color = ''
                    enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Invisible Users: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_invisibleUser.style.color = '#00e0ba'
                    enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Invisible Users: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'gamelabel':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_gameLabel.style.color = ''
                    enhanced_gameLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.gamelabel + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.gamelabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Game Labels: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.lEPylf.YOW9Fd .a1l9D, .X9cRic, .lEPylf.YOW9Fd .D01DPc, .lEPylf.KnM5Wc .a1l9D, .lEPylf.KnM5Wc .D01DPc { display: none; }'
                    enhanced_gameLabel.style.color = '#00e0ba'
                    enhanced_gameLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.gamelabel + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.gamelabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Game Labels: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleGameLabel')
            break
        case 'dimoverlay':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_dimOverlay.style.color = ''
                    enhanced_dimOverlay.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">layers</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.dimoverlay + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.dimoverlaydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Dimmed Overlay: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.bYYDgf { background: linear-gradient(to right, transparent 50%, rgba(0,0,0,.6) 100%); }'
                    enhanced_dimOverlay.style.color = '#00e0ba'
                    enhanced_dimOverlay.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">layers_clear</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.dimoverlay + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.dimoverlaydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Dimmed Overlay: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleDimOverlay')
            break
        case 'mediapreview':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_mediaPreview.style.color = ''
                    enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Media Preview: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.ctThpb.lEPylf { display: none; }'
                    enhanced_mediaPreview.style.color = '#00e0ba'
                    enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Media Preview: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleMediaPreview');
            break
        case 'categorypreview':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_categoryPreview.style.color = ''
                    enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Category Preview: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.lEPylf.YOW9Fd .ssR8Bc { display: none !important; }'
                    enhanced_categoryPreview.style.color = '#00e0ba'
                    enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Category Preview: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleCategoryPreview")
            break
        case 'storelist':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_storeList.style.color = ''
                    enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Split Store Lists: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '@media screen and (min-width: 1080px) { .splitstorefull { grid-column: 1 / -1; } .xPDr9b .OTiBA { margin-top: 0; padding-top: 1rem; border-top: 2px solid rgba(255,255,255,.06); display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-gap: 0 1rem; } .Md1Yte.URhE4b .xPDr9b[jsname="azRXlc"] { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); min-height: auto; grid-gap: 0 1rem; }'
                    enhanced_storeList.style.color = '#00e0ba'
                    enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Split Store Lists: Set to "Enabled".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleStoreSplit')
            break
        case 'familysharing':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_hideFamilyElements.style.color = ''
                    enhanced_hideFamilyElements.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">family_restroom</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.familyelements + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.familyelementsdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Family Sharing Elements: Set to "Visible".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.HP4yJd.heSpB, .HP4yJd.AQVgjb, .oYqfsf.heSpB, .lEPylf.qtpabb { display: none; } #enhanced_resolutionPopup { display: flex !important; }'
                    enhanced_hideFamilyElements.style.color = '#00e0ba'
                    enhanced_hideFamilyElements.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">family_restroom</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.familyelements + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.familyelementsdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Family Sharing Elements: Set to "Hidden".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleFamilyElements')
            break
        case 'shortcuts':
            switch (opt) {
                case 0:
                    enhanced_showShortcut.style.color = ''
                    enhanced_showShortcut.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">get_app</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.shortcut + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.shortcutdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Shortcuts: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_showShortcut.style.color = '#00e0ba'
                    enhanced_showShortcut.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">get_app</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.shortcut + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.shortcutdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Shortcuts: Set to "Enabled".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'stadiadatabase':
            switch (opt) {
                case 0:
                    enhanced_showStadiaDatabase.style.color = ''
                    enhanced_showStadiaDatabase.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">table_chart</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.stadiadatabase + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.stadiadatabasedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.enabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Stadia Database: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_showStadiaDatabase.style.color = '#00e0ba'
                    enhanced_showStadiaDatabase.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">table_chart</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.stadiadatabase + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.stadiadatabasedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.enabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Stadia Database: Set to "Enabled".', enhanced_consoleEnhanced, '')
                    break
            }
            break
        case 'stadiahunters':
            switch (opt) {
                case 0:
                    enhanced_showStadiaHunters.style.color = ''
                    enhanced_huntersContainer.style.display = 'none'
                    enhanced_showStadiaHunters.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">emoji_events</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.stadiahunters + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.stadiahuntersdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Stadia Hunters: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_showStadiaHunters.style.color = '#00e0ba'
                    enhanced_huntersContainer.style.display = 'block'
                    enhanced_showStadiaHunters.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">emoji_events</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.stadiahunters + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.stadiahuntersdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Stadia Hunters: Set to "Enabled".', enhanced_consoleEnhanced, '')

                    if (enhanced_stadiaHunters == null) {
                        loadStadiaHunters(enhanced_AccountInfo[2])
                    }
                    break
            }
            break
        case 'streammode':
            switch (opt) {
                case 0:
                    enhanced_CSS = ''
                    enhanced_streamMode.style.color = ''
                    enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Streaming Mode: Set to "Disabled".', enhanced_consoleEnhanced, '')
                    break
                case 1:
                    enhanced_CSS = '.lzIqJf .Y1rZWd, .gI3hkd, .Uwaqdf, .KW2hBe, .DlMyQd.cAx65e, .DlMyQd.KPQoWd, .kBJKIf span, .CVhnkf, .h6J22d.BM7p1d.QAAyWd > .zRamU { filter: blur(0.25rem) brightness(1.2); text-shadow: 0.5rem 0px; }'
                    enhanced_streamMode.style.color = '#00e0ba'
                    enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>'
                    console.log('%cStadia Enhanced' + '%c ⚙️ - Streaming Mode: Set to "Enabled".', enhanced_consoleEnhanced, '')
                    break
            }
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleStreamMode')
            break
        case 'letterbox':
            var opt = opt.split(',')
            for (var i = 0; i < enhanced_letters.length; i++) {
                if (opt[1] < 2) {
                    if (i == opt[0]) {
                        enhanced_letters[i].style.color = ''
                        enhanced_letters[i].state = 2
                        enhanced_activeLetter = opt[0]
                    } else {
                        enhanced_letters[i].style.color = 'rgba(255,255,255,.2)'
                        enhanced_letters[i].state = 1
                    }
                } else {
                    enhanced_letters[i].style.color = ''
                    enhanced_letters[i].state = 0
                    enhanced_activeLetter = false
                }
            }
            break
        case 'avatar':
            enhanced_CSS = '.ksZYgc.VGZcUb { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.rybUIf { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.dOyvbe { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.RUdg0d { background-image: url("' + opt + '") !important; }' // Livestream Overview
            enhanced_CSS += '.Nv1Sab[alt$="' + enhanced_AccountInfo[0] + '"] { content: url("' + opt + '") !important; }'
            enhanced_CSS += 'c-wiz[data-p*="' + enhanced_AccountInfo[2] + '"] .XZRzG { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.SAPaEd.bYsRUc div[jsdata*="' + enhanced_AccountInfo[2] + '"] .PwtJse { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.Tidcwc > .Y1rZWd.mZLJyd .Fnd1Pd.rnWGL { background-image: url("' + opt + '") !important; }' // Group Avatar
            enhanced_CSS += '.mcaxA.ZmeF9 div:first-child { background-image: url("' + opt + '") !important; }'
            enhanced_injectStyle(enhanced_CSS, 'enhanced_styleAvatar');
            console.log('%cStadia Enhanced' + '%c ⚙️ - Avatar changed to: ' + opt, enhanced_consoleEnhanced, '')
            break
        case 'favorite':
            if (enhanced_settings.favoriteList.includes(opt)) {
                enhanced_settings.favoriteList = enhanced_settings.favoriteList.replace('(' + opt + ')', '')
            } else {
                enhanced_settings.favoriteList += '(' + opt + ')'
            }
            localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
            break
        case 'resetall':
            localStorage.removeItem('enhanced_' + enhanced_settings.user)
            location.reload()
            break
        case 'updateall':
            monitor.hide()
            enhanced_applySettings('gridsize', enhanced_settings.gridSize)
            enhanced_applySettings('clock', enhanced_settings.clockOption)
            enhanced_applySettings('filter', enhanced_settings.filter)
            enhanced_applySettings('resolution', enhanced_settings.resolution)
            enhanced_applySettings('codec', enhanced_settings.codec)
            enhanced_applySettings('messagepreview', enhanced_settings.hideMessagePreview)
            enhanced_applySettings('gamelabel', enhanced_settings.hideLabels)
            enhanced_applySettings('dimoverlay', enhanced_settings.dimOverlay)
            enhanced_applySettings('quickreply', enhanced_settings.hideQuickReply)
            enhanced_applySettings('offlineusers', enhanced_settings.hideOfflineUsers)
            enhanced_applySettings('invisibleusers', enhanced_settings.hideInvisibleUsers)
            enhanced_applySettings('usermedia', enhanced_settings.hideUserMedia)
            enhanced_applySettings('streammode', enhanced_settings.streamMode)
            enhanced_applySettings('categorypreview', enhanced_settings.hideCategories)
            enhanced_applySettings('monitorautostart', enhanced_settings.monitorAutostart)
            enhanced_applySettings('storelist', enhanced_settings.splitStore)
            enhanced_applySettings('shortcuts', enhanced_settings.enableShortcuts)
            enhanced_applySettings('stadiadatabase', enhanced_settings.enableStadiaDatabase)
            enhanced_applySettings('stadiahunters', enhanced_settings.enableStadiaHunters)
            enhanced_applySettings('inlinepreview', enhanced_settings.hideInlinePreview)
            enhanced_applySettings('familysharing', enhanced_settings.hideFamilySharing)
            enhanced_applySettings('mediapreview', enhanced_settings.hideUserMedia)
            enhanced_applySettings('notification', enhanced_settings.updateNotifications)
            if (enhanced_settings.avatar != '') {
                enhanced_applySettings('avatar', enhanced_settings.avatar)
            }
            break
    }

    /**
     * @param {Object} translations
     * @param {string} translations.streammon
     * @param {string} translations.streammondesc
     * @param {string} translations.default
     * @param {string} translations.manual
     * @param {string} translations.streammonmodestandard - Standard mode translation
     * @param {string} translations.streammonmodecompact - Compact mode translation
     * @param {string} translations.streammonmodemenu - Menu mode translation
     * @param {string|number} option - Option state represented by a string value (e.g. "Standard", "Compact") or an
     * integer value of 0 or 1 (legacy)
     */
    function _applyMonitorAutoStart(translations, option) {
        const COLOR_ACTIVE = "#00e0ba"

        switch (option) {
            case 0: // legacy support
            case "Hidden":
                showInactive();
                break
            case 1: // legacy support
            case "Standard":
                showActive(translations.streammonmodestandard || "Standard")
                break
            case "Compact":
                showActive(translations.streammonmodecompact || "Compact")
                break
            case "Menu":
                showActive(translations.streammonmodemenu || "Menu")
                break
        }

        monitor.showMode(option)

        enhanced_log(`Stream Monitor Start: Set to "${option}".`)

        function showInactive() {
            enhanced_monitorAutostart.style.color = ''
            enhanced_monitorAutostart.innerHTML = `
                
                <!-- Icon -->
                <i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i>
                
                <span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">
                    <!-- Title -->
                    ${translations.streammon}: ${translations.manual}<br>
                    
                    <!-- Description -->
                    <span style="color: #fff;font-size: 0.7rem;">${translations.streammondesc}</span><br>

                    <!-- Default -->
                    <span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">${translations.default}: ${translations.manual}</span>
                </span>
            `
        }

        function showActive(modeTranslation) {
            enhanced_monitorAutostart.style.color = COLOR_ACTIVE
            enhanced_monitorAutostart.innerHTML = `
                
                <!-- Icon -->
                <i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i>
                
                <span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">
                    <!-- Title -->
                    ${translations.streammon}: ${modeTranslation}<br>
                
                    <!-- Description -->
                    <span style="color: #fff;font-size: 0.7rem;">${translations.streammondesc}</span><br>
    
                    <!-- Default -->
                    <span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">${translations.default}: ${translations.manual}</span>
                </span>
            `
        }
    }
}

function enhanced_injectStyle(content, id) {
    if (content) {
        if (document.getElementById(id)) {
            var el = document.getElementById(id);
        } else {
            var el = document.createElement('style')
            document.head.appendChild(el)
        }
        el.type = 'text/css'
        el.id = id
        if (el.innerHTML != content) {
            el.innerHTML = content
        }
    } else {
        if (document.getElementById(id)) {
            var el = document.getElementById(id)
            el.parentNode.removeChild(el)
        }
    }
}

function openStadia(url) {
    // Keep hl parameter
    enhanced_urlBase = document.querySelector('head > base').getAttribute('href')
    enhanced_urlHL = new URL(window.location.href).searchParams.get('hl')
    if (enhanced_urlHL) {
        enhanced_urlBase = new URL(enhanced_urlBase + url);
        enhanced_urlBase.searchParams.set('hl', enhanced_urlHL)
        window.open(enhanced_urlBase, '_self')
    } else {
        window.open(enhanced_urlBase + url, '_self')
    }
}

// Insert elements
function secureInsert(el, sel, opt = 0) {
    if (/^[a-z 0-9]+$/i.test(sel)) {
        var selector = document.getElementsByClassName(sel)
    } else {
        var selector = document.querySelectorAll(sel)
    }
    var target = selector[selector.length - 1]
    if (target && el) {
        switch (opt) {
            case 0: // Append
                if (el.parentNode != target) {
                    target.append(el)
                }
                break
            case 1: // Prepend
                if (el.parentNode != target) {
                    target.prepend(el)
                }
                break
            case 2: // Insert After
                if (target.parentNode != el.parentNode) {
                    target.parentNode.insertBefore(el, target.nextSibling)
                }
                break
            case 3: // Insert Before
                if (target.parentNode != el.parentNode) {
                    target.parentNode.insertBefore(el, target)
                }
                break
        }
    }
}

// Load user settings
function enhanced_loadUserInfo() {
    var enhanced_scriptLoad = document.querySelectorAll('script[nonce]')
    var info = []
    for (var i = 0; i < enhanced_scriptLoad.length; i++) {
        if (enhanced_scriptLoad[i].text.includes('AF_initDataCallback({key: \'ds:1\'')) {
            var nametag = enhanced_scriptLoad[i].text.split('[["').pop().split('"]')[0].split('","')
            var id = enhanced_scriptLoad[i].text.split('false,null,"').pop().split('"')[0]
            info.push(nametag[0])
            info.push(nametag[1])
            info.push(id)
            return info
        }
    }
}

// Convert Time
function enhanced_secondsToHms(sec) {
    var h = Math.floor(sec / 3600)
    var m = Math.floor(sec % 3600 / 60)
    var s = Math.floor(sec % 3600 % 60)
    return [h, m, s]
}

function enhanced_formatTime(seconds) {
    var hours = Math.floor(seconds / 3600)
    seconds -= hours * 3600
    var minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60
    return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds)
}

// Version Difference
function enhanced_newVersion(installed, current) {
    const oldParts = installed.split('.')
    const newParts = current.split('.')
    for (var i = 0; i < newParts.length; i++) {
        const a = ~~newParts[i]
        const b = ~~oldParts[i]
        if (a > b) return true
        if (a < b) return false
    }
    return false
}

// Notifications
function enhanced_pushNotification(content, image, dura) {
    // Audio
    this.sound = new Audio('https://ssl.gstatic.com/stadia/gamers/assets/sound_notification_v3.ogg')
    this.sound.volume = 0.25

    // Define Notification
    this.activeNotification = document.getElementById('enhanced_notification')
    if (this.activeNotification) {
        this.notification = this.activeNotification
    } else {
        this.notification = document.createElement('div')
        this.notification.id = 'enhanced_notification'
        this.notification.className = 'OFe4V'
        this.notification.style.position = 'fixed'
        this.notification.style.bottom = 0
        this.notification.style.left = 0
        this.notification.style.zIndex = 1004
        this.notification.style.marginBottom = '4rem'
        this.notification.style.transition = 'all 0.7s'
        this.notification.style.opacity = 0
        this.notification.style.visibility = 'inherit'
        this.notification.style.pointerEvents = 'none'
        document.body.append(this.notification)
    }

    // Set Content
    this.notification.innerHTML = `
        <div class="lWnUzb">
            <div class="NbJOkd">` + content + `</div>
        </div>
        <div class="dyknFc BYsype">
            <div class="zHwKDd" style="background-image:url(` + image + `)"></div>
        </div>`

    setTimeout(function () {
        // State - Show
        this.notification.className = 'OFe4V kVaHpd'
        this.notification.style.visibility = 'visible'
        this.notification.style.opacity = 1
        this.notification.style.pointerEvents = 'auto'
        this.active = true
        this.sound.play()
    }, 1000)

    if (dura) {
        setTimeout(function () {
            // State - Hide
            this.notification.className = 'OFe4V'
            this.notification.style.opacity = 0
            this.notification.style.visibility = 'inherit'
            this.notification.style.pointerEvents = 'none'
            this.active = false
        }, (dura * 1000) + 1000)
    } else {
        window.addEventListener('click', function (e) {
            if (e.path.indexOf(this.notification) == -1 && this.active) {
                // State - Hide
                this.notification.className = 'OFe4V'
                this.notification.style.opacity = 0
                this.notification.style.visibility = 'inherit'
                this.notification.style.pointerEvents = 'none'
                this.active = false
            }
        })
    }
}

// Download files
function enhanced_downloadFile(filename, type, text) {
    // Create dummy element
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
    element.setAttribute('download', filename + "." + type)
    element.style.display = 'none'
    // Process in page context
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

// CSV2Array
// https://stackoverflow.com/questions/8493195/
function csvToArray(text) {
    let p = '',
        row = [''],
        ret = [row],
        i = 0,
        r = 0,
        s = !0,
        l
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l
            s = !s
        } else if (',' === l && s) l = row[++i] = ''
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1)
            row = ret[++r] = [l = ''];
            i = 0
        } else row[i] += l
        p = l
    }
    return ret
}

// Dragable Objects
function enhanced_dragElement(el) {
    var pos = [0, 0, 0, 0]
    if (document.getElementById(el.id)) {
        document.getElementById(el.id).onmousedown = enhanced_dragMouseDown
    } else {
        el.onmousedown = enhanced_dragMouseDown
    }

    function enhanced_dragMouseDown(e) {
        e = e || window.event
        e.preventDefault()
        pos[2] = e.clientX
        pos[3] = e.clientY
        document.onmouseup = enhanced_closeDragElement
        document.onmousemove = enhanced_elementDrag
    }

    function enhanced_elementDrag(e) {
        e = e || window.event
        e.preventDefault()
        pos[0] = pos[2] - e.clientX
        pos[1] = pos[3] - e.clientY
        pos[2] = e.clientX
        pos[3] = e.clientY
        el.style.top = Math.min(Math.max(el.offsetTop - pos[1], 0), screen.availHeight - el.offsetHeight) + "px"
        el.style.left = Math.min(Math.max(el.offsetLeft - pos[0], 0), screen.availWidth - el.offsetWidth) + "px"
    }

    function enhanced_closeDragElement() {
        document.onmouseup = null
        document.onmousemove = null
    }
}

// Updates values existing variable "enhanced_settings" and persists the new state to localstorage
function enhanced_updateSettings(obj) {
    var ign = 'user|version|desktopHeight|desktopWidth'
    for (var key in enhanced_settings) {
        if (obj.hasOwnProperty(key) && !ign.includes(key)) {
            enhanced_settings[key] = obj[key]
        }
    }
    settingsService.saveSettings(enhanced_settings)
}

function enhanced_saveMonitorMode(mode) {
    console.debug(`Saving monitor mode '${mode}'`)

    enhanced_settings.monitorMode = mode

    settingsService.saveSettings(enhanced_settingsEnhanced)
}

// Get active content
function isLocation(loc) {
    switch (loc) {
        case 'home':
            return document.location.href.indexOf('/home') != -1
        case 'library':
            return document.location.href.indexOf('/library') != -1
        case 'ingame':
            return document.location.href.indexOf('/player') != -1
        case 'captures':
            return document.location.href.indexOf('/captures') != -1
        case 'profiledetails':
            return document.location.href.match('profile.[0-9]+.detail') != null
        case 'storedetails':
            return document.location.href.indexOf('/store/details/') != -1
        case 'storelist':
            return document.location.href.indexOf('/list') != -1
        case 'progames':
            return document.location.href.indexOf('/store/list/2001') != -1
        case 'profile':
            return document.location.href.indexOf('/profile/' + enhanced_AccountInfo[2]) != -1
        case 'playerstats':
            return document.location.href.indexOf('/gameactivities/all') != -1
        case 'stadiamenu':
            return document.querySelector('.X1asv.ahEBEd.LJni0').style.opacity != '0'
        case 'settings':
            return document.location.href.indexOf('/settings') != -1
    }
}

function enhanced_log(log) {
    console.log(`%cStadia Enhanced%c ⚙️ - ${log}`, enhanced_consoleEnhanced, '')
}
