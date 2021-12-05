/**
 * This anonymous function hooks into the constructor of the RTCPeerConnection class, so everytime a new connection
 * instance is initialized by Stadia, the instance is pushed into a global array. This global array of connections
 * is accessed by the stream monitor code to get streaming information.
 *
 * We should avoid doing this, but we have not found another way of obtaining existing RTCPeerConnections.
 */
var peerConnections = [];

(function (original) {

    // this injects in the constructor. so everytime a new connection is opened, it gets pushed to the array
    RTCPeerConnection = function () {
        console.debug("Initialized new RTCPeerConnection")

        const connection = new original(arguments[0], arguments[1]);
        peerConnections.push(connection)

        return connection
    }
    RTCPeerConnection.prototype = original.prototype

})(RTCPeerConnection);

/**
 * Uses global peerConnection array to obtain streaming info and writes it to localstorage.
 */
class StreamInfoCollector {

    constructor() {
        console.debug("Initializing StreamInfoCollector")

        this.init()
    }

    init() {
        var enhanced_lastTime = new Date()
        var enhanced_lastBytes = 0
        var enhanced_lastFrames = 0
        var enhanced_lastFramesDecoded = 0
        var enhanced_lastQpSum = 0
        var enhanced_sessionStart = 0
        var decodingType = ''
        var enhanced_sessionActive = false

        setInterval(function () {
            const notInGame = document.location.href.indexOf('/player/') === -1
            if (notInGame) {
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

                    if (key.indexOf('RTCIceCandidatePair') != -1) {
                        var tmp4 = stats.get(key)
                    }
                    if (key.indexOf('RTCInboundRTPVideoStream') != -1) {
                        var tmp1 = stats.get(key)
                        var tmp2 = stats.get(tmp1.trackId)

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
                            var resolution = tmp2.frameWidth + 'x' + tmp2.frameHeight
                            var framesReceived = tmp2.framesReceived
                            var framesReceivedPerSecond = (framesReceived - enhanced_lastFrames) / timeSinceUpdate
                            var framesDecoded = tmp2.framesDecoded
                            var codec = tmp3.stat('googCodecName')
                            var bytesReceived = tmp4.bytesReceived
                            var bytesReceivedPerSecond = (bytesReceived - enhanced_lastBytes) / timeSinceUpdate
                            var averageData = ((((bytesReceived / sessionDuration) * 3600) / 1024) / 1024) / 1024
                            var packetsLost = tmp1.packetsLost
                            var packetsReceived = tmp1.packetsReceived
                            var framesDropped = tmp2.framesDropped
                            var framesDroppedPerc = ((framesDropped / framesReceived) * 100).toFixed(3)
                            var latency = tmp4.currentRoundTripTime * 1000
                            if (isNaN(latency)) {
                                latency = '0'
                            }
                            var jitterBufferDelay = tmp2.jitterBufferDelay * 1000
                            var jitterBufferEmittedCount = tmp2.jitterBufferEmittedCount
                            var jitterBuffer = jitterBufferDelay / jitterBufferEmittedCount
                            if (codec == 'VP9') {
                                var compression = (tmp1.qpSum - enhanced_lastQpSum) / (framesDecoded - enhanced_lastFramesDecoded)
                                compression = compression.toFixed(1)
                                if (isNaN(compression)) {
                                    compression = '-'
                                }
                            }
                            var decodingTime = (tmp1.totalDecodeTime / tmp2.framesDecoded) * 1000
                            if (tmp3.stat('codecImplementationName') == 'ExternalDecoder') {
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
                                    sessiontime: _formatTime(sessionDuration),
                                    codec: decodingType + ' ' + codec,
                                    resolution: resolution,
                                    fps: framesReceivedPerSecond.toFixed(1),
                                    compression: compression,
                                    decode: decodingTime.toFixed(2),
                                    framedrop: framesDropped + ' (' + framesDroppedPerc + '%)',
                                    framedropPerc: framesDroppedPerc,
                                    sessionTraffic: _formatBytes(bytesReceived, 2),
                                    currentTraffic: _formatBytes(bytesReceivedPerSecond * 8, 2).slice(0, -1) + 'b',
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
            })
        }, 500)
    }
}

function collectStreamInfo() {

}

function _formatTime(seconds) {
    var hours = Math.floor(seconds / 3600)
    seconds -= hours * 3600
    var minutes = Math.floor(seconds / 60)
    seconds -= minutes * 60
    return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + Math.floor(seconds)
}

function _formatBytes(a, b) {
    if (0 == a) return '0 Bytes'
    var c = 1024,
        d = b || 2,
        e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        f = Math.floor(Math.log(a) / Math.log(c))
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}

new StreamInfoCollector().init()

