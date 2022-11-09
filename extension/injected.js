/*
 * Injected Functions
 * 
 * Due to security measurements in Chrome, these functions have to be injected into the page
 * and can't be injected via script tags from the extension directly.
 */
var enhanced_AccountInfo = enhanced_getAccountInfo()
var enhanced_consoleEnhanced = 'background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;'

/**
 * Resolution Changer (4K Support)
 * 
 * Listens for forced resolution via home > enhanced-menu > Stream > Resolution
 * and updates the window.screen properties accordingly. Available options are:
 * 0 = Native
 * 1 = 1440p
 * 2 = 2160p (4K)
 *
 * This script has to be placed at the end of the page, since reads content from other scripts placed on the site.
 */
function enhanced_setResolution() {
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
enhanced_setResolution()

/**
 * Force Focus
 * 
 * Forces the page to have focus, even if the user has closed the tab.
 * This allows games to keep running while the window isn't active.
 */
function enhanced_focus() {
    setInterval(function () {
        var enhanced_settings = JSON.parse(localStorage.getItem('enhanced_' + enhanced_AccountInfo[0] + '#' + enhanced_AccountInfo[1]))
        if (enhanced_settings.forceFocus != 0) {
            document.hasFocus = function () {
                return true
            }
        } else {
            document.hasFocus = document.prototype.hasFocus
        }
    }, 1000)
}
enhanced_focus()

/**
 * WebRTC Injection
 * 
 * The anonymous function hooks into the constructor of the RTCPeerConnection class, so everytime a new connection
 * instance is initialized by Stadia, the instance is pushed into a global array. This global array of connections
 * is accessed by the stream monitor code to get streaming information.
 *
 * We should avoid doing this, but we have not found another way of obtaining existing RTCPeerConnections.
 */
var peerConnections = [];

(function (original) {
    RTCPeerConnection = function () {
        var connection = new original(arguments[0], arguments[1])
        peerConnections.push(connection)
        return connection
    }
    RTCPeerConnection.prototype = original.prototype
})(RTCPeerConnection);

function enhanced_collectStreamInfo() {
    var enhanced_lastTime = new Date()
    var enhanced_lastBytes = 0
    var enhanced_lastFrames = 0
    var enhanced_lastFramesDecoded = 0
    var enhanced_lastQpSum = 0
    var enhanced_sessionStart = 0
    var decodingType = ''
    var enhanced_sessionActive = false

    setInterval(function () {
        if (document.location.href.indexOf('/player') == -1) {
            peerConnections = []
            enhanced_lastBytes = 0
            enhanced_lastFrames = 0
            enhanced_sessionActive = false
            localStorage.removeItem('enhanced_streamData')
            return
        }

        if (peerConnections.length < 2) {
            return
        }

        if (!enhanced_sessionActive) {
            enhanced_sessionStart = new Date()
            enhanced_sessionActive = true
        }
        const openConnections = peerConnections.filter(x => x.connectionState == 'connected')
        openConnections[1].getStats().then(function (stats) {

            for (var key of stats.keys()) {

                if (key.indexOf('CP') != -1) {
                    var tmp4 = stats.get(key)
                }
                if (key.indexOf('DEPRECATED_TI') != -1) {
                    var tmp1 = stats.get(key)

                    if (tmp1.trackIdentifier == 'video_label') {

                        openConnections[1].getStats(function (stats) {

                            var tmp3 = stats.result().find(function (f) {
                                return 'ssrc' == f.type && f.id.endsWith('recv') && f.names().includes('mediaType') && 'video' == f.stat('mediaType')
                            });

                            // Stream Data
                            var time = new Date()
                            var timeSinceUpdate = (time - enhanced_lastTime) / 1000
                            enhanced_lastTime = time
                            var sessionDuration = (time - enhanced_sessionStart) / 1000
                            time = new Date(time - time.getTimezoneOffset() * 60 * 1000).toISOString().replace("T", " ").split(".")[0]
                            var resolution = tmp1.frameWidth + 'x' + tmp1.frameHeight
                            var framesReceived = tmp1.framesReceived
                            var framesReceivedPerSecond = (framesReceived - enhanced_lastFrames) / timeSinceUpdate
                            var framesDecoded = tmp1.framesDecoded
                            var codec = tmp3.stat('googCodecName')
                            var bytesReceived = tmp4.bytesReceived
                            var bytesReceivedPerSecond = (bytesReceived - enhanced_lastBytes) / timeSinceUpdate
                            var averageData = ((((bytesReceived / sessionDuration) * 3600) / 1024) / 1024) / 1024
                            var packetsLost = tmp1.packetsLost
                            var packetsReceived = tmp1.packetsReceived
                            var framesDropped = tmp1.framesDropped
                            var framesDroppedPerc = ((framesDropped / framesReceived) * 100).toFixed(3)
                            var latency = tmp4.currentRoundTripTime * 1000
                            if (isNaN(latency)) {
                                latency = '0'
                            }

                            var jitterBufferDelay = tmp1.jitterBufferDelay * 1000
                            var jitterBufferEmittedCount = tmp1.jitterBufferEmittedCount
                            var jitterBuffer = jitterBufferDelay / jitterBufferEmittedCount
                            if (codec == 'VP9') {
                                var compression = (tmp1.qpSum - enhanced_lastQpSum) / (framesDecoded - enhanced_lastFramesDecoded)
                                compression = compression.toFixed(1)
                                if (isNaN(compression)) {
                                    compression = '-'
                                }
                            }

                            var decodingTime = (tmp1.totalDecodeTime / tmp1.framesDecoded) * 1000
                            if (tmp3.stat('codecImplementationName').includes('ExternalDecoder')) {
                                decodingType = 'Hardware'
                            } else {
                                decodingType = 'Software'
                            }

                            enhanced_lastFrames = framesReceived
                            enhanced_lastFramesDecoded = framesDecoded
                            enhanced_lastBytes = bytesReceived
                            enhanced_lastQpSum = tmp1.qpSum

                            if (framesReceived > 0) {

                                // Store stream data
                                const enhanced_streamData = {
                                    date: time.split(' ')[0],
                                    time: time.split(' ')[1],
                                    sessiontime: enhanced_formatTime(sessionDuration),
                                    codec: decodingType + ' ' + codec,
                                    resolution: resolution,
                                    fps: framesReceivedPerSecond.toFixed(1),
                                    compression: compression,
                                    decode: decodingTime.toFixed(2),
                                    framedrop: framesDropped + ' (' + framesDroppedPerc + '%)',
                                    framedropPerc: framesDroppedPerc,
                                    sessionTraffic: enhanced_formatBytes(bytesReceived, 2),
                                    currentTraffic: enhanced_formatBytes(bytesReceivedPerSecond * 8, 2).slice(0, -1) + 'b',
                                    currentTrafficMbps: (bytesReceivedPerSecond * 8 / 1024 / 1024).toFixed(2),
                                    averageTraffic: averageData.toFixed(2) + ' GB/h',
                                    packetloss: packetsLost + ' (' + ((packetsLost / packetsReceived) * 100).toFixed(3) + '%)',
                                    latency: latency,
                                    jitter: jitterBuffer.toPrecision(4) + ' ms'
                                }

                                localStorage.setItem('enhanced_streamData', JSON.stringify(enhanced_streamData))
                            }
                        })
                    }
                }
            }
        })
    }, 500)
}
enhanced_collectStreamInfo()

/**
 * Debugging Functions
 * 
 * These functions are used for debugging purposes. Available options are:
 * 'profile' = Profile data of the currently logged in user
 * 'resolution' = Resolution information
 * 'translation' = Translation data for the current language
 */
function enhanced_debug(opt) {
    if (opt == null) {
        console.log(`
        Welcome to the Stadia Enhanced debug utility!
        ----------------------------------------------
         
        Please specify one of the following options:
            profile         (Prints user information and settings)
            resolution      (Prints your current and maximum browser resolution)
            translation     (Prints all available translations)
                         
        For example, if you want to see all available translations use the following command: 
            enhanced_debug('translation')
        `)
        return
    }

    switch (opt) {
        case 'profile':
            console.log('Username: ' + enhanced_AccountInfo[0] + '#' + enhanced_AccountInfo[1])
            console.table(JSON.parse(localStorage.getItem('enhanced_' + enhanced_AccountInfo[0] + '#' + enhanced_AccountInfo[1])))
            break
        case 'resolution':
            console.log('Your current browser resolution is set to: ' + window.screen.availWidth + 'x' + window.screen.availHeight)
            break
        default:
            console.log('Unknown option ' + opt + '. Run enhanced_debug() to see supported options.')
    }
}

function enhanced_getAccountInfo() {
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

function enhanced_formatTime(seconds) {
    var hours = Math.floor(seconds / 3600)
    seconds -= hours * 3600
    var minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + Math.floor(seconds)
}

function enhanced_formatBytes(a, b) {
    if (0 == a) return '0 Bytes'
    var c = 1024,
        d = b || 2,
        e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        f = Math.floor(Math.log(a) / Math.log(c))
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}