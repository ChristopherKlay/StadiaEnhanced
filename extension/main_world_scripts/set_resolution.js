/**
 * Listens for forced resolution via home > enhanced-menu > Stream > Resolution
 * and updates the window.screen properties accordingly. Available options are:
 * 0 = native
 * 1 = 1440p
 * 2 = 2160 aka 4K
 *
 * This script has to be placed at the end of the page, since reads content from other scripts placed on the site.
 */
function pollAndSetResolution() {
    const enhanced_AccountInfo = _getAccountInfo()

    var x, y

    setInterval(function () {
        var enhanced_settings = JSON.parse(localStorage.getItem('enhanced_' + enhanced_AccountInfo[0] + '#' + enhanced_AccountInfo[1]))

        switch (enhanced_settings.resolution) {
            case 0: // native
                x = enhanced_settings.desktopWidth
                y = enhanced_settings.desktopHeight
                break

            case 1: // 1440p
                x = 2560
                y = 1440
                break

            case 2: // 2160p / 4K
                x = 3840
                y = 2160
                break
        }

        Object.defineProperties(window.screen, {
            "availWidth": {
                value: x,
                configurable: true
            },
            "width": {
                value: x,
                configurable: true
            },
            "availHeight": {
                value: y,
                configurable: true
            },
            "height": {
                value: y,
                configurable: true
            }
        })

    }, 1000)
}

function _getAccountInfo() {
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

pollAndSetResolution()
