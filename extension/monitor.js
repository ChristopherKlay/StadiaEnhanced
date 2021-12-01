/**
 * Stream Monitor
 * Credits to the base by AquaRegia
 * Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
 */
class StreamMonitor {
    ELEMENT_ID = "enhanced_streamMonitor"

    element; // full monitor element (doesnt contain quick menu)

    constructor() {
        console.log("Initializing Stream Monitor...")

        this.element = this._createElement()
        this.init()
    }

    getElement() {
        return this.element
    }

    // is this different than getELment???
    getOuterHtml() {
        return this.element.outerHTML
    }

    init() {
        this.element.style.position = 'fixed'
        this.element.style.top = enhanced_settings.monitorPosition.split("|")[0]
        this.element.style.left = enhanced_settings.monitorPosition.split("|")[1]
        this.element.style.display = 'block'
    }

    show() {
        this.element.style.top = enhanced_settings.monitorPosition.split('|')[0]
        this.element.style.left = enhanced_settings.monitorPosition.split('|')[1]
        this.element.style.display = 'block'

        // not sure if this is needed
        this.element.style.right = ''
        this.element.style.bottom = ''
    }

    hide() {
        this.element.style.display = 'none'
    }

    setPlaceholderContent() {
        this.element.innerHTML = `
            <section>
                <div class="grid">
                    <span style="grid-column: 1 / 4;">Loading stream data.</span>
                </div>
            </section>`
    }

    _createElement() {
        const element = document.createElement('div');
        element.id = this.ELEMENT_ID
        element.style.position = 'fixed'

        return element
    }
}

function showInGameMonitor() {
    console.log("Showing in-game monitor...")

    // Get local stream data
    enhanced_streamData = localStorage.getItem('enhanced_streamData')
    if (enhanced_streamData != null) {
        enhanced_streamData = JSON.parse(enhanced_streamData)

        // Reset outside of viewport
        var enhanced_boundingBox = this.element.getBoundingClientRect()
        if (enhanced_boundingBox.top <= 0 && enhanced_boundingBox.left <= 0 && enhanced_boundingBox.bottom >= window.availHeight && enhanced_boundingBox.right >= window.availWidth) {
            this.element.style.top = '1rem'
            this.element.style.left = '1rem'
        }

        // Update Position
        enhanced_newMonitorPos = this.element.style.top + '|' + this.element.style.left
        if (enhanced_newMonitorPos != enhanced_settings.monitorPosition) {
            enhanced_newMonitorPos = enhanced_settings.monitorPosition
            localStorage.setItem('enhanced_' + enhanced_settings.user, JSON.stringify(enhanced_settings))
        }

        // Quick Overview
        enhanced_menuMonitorCodec.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.codec + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_streamData.codec + '</span></div>'
        enhanced_menuMonitorRes.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.resolution + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_streamData.resolution + '</span></div>'
        enhanced_menuMonitorLatFps.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.latency + ' | FPS</span><span class="Ce1Y1c qFZbbe">' + enhanced_streamData.latency + ' ms | ' + enhanced_streamData.fps + '</span></div>'
        enhanced_menuMonitorFDrop.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.framedrop + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_streamData.framedrop + '</span></div>'
        enhanced_menuMonitorDecode.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.decodetime + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_streamData.decode + ' ms</span></div>'


        // Translation
        enhanced_streamData.codec = enhanced_streamData.codec
            .replace('Hardware', enhanced_lang.hardware)
            .replace('Software', enhanced_lang.software)

        // Full Monitor
        switch (enhanced_settings.monitorMode) {
            case 0:
                enhanced_streamInfo = `
                    <section>
                        <div class="tag">` + enhanced_lang.session + `</div>
                        <div class="grid">
                            <span>` + enhanced_lang.date + `</span>
                            <span>` + enhanced_streamData.date + `</span>
                            <span></span>
                            <div class="border"></div>
                            <span>` + enhanced_lang.time + `</span>
                            <span>` + enhanced_streamData.time + `</span>
                            <span></span>
                            <div class="border"></div>
                            <span>` + enhanced_lang.sessiontime + `</span>
                            <span>` + enhanced_streamData.sessiontime + `</span>
                            <span></span>
                        </div>
                    </section>
                    <section>
                        <div class="tag">` + enhanced_lang.stream + `</div>
                        <div class="grid">
                            <span>` + enhanced_lang.codec + `</span><span>` + enhanced_streamData.codec + `</span>
                            <span></span>
                            <div class="border"></div>
                            <span>` + enhanced_lang.resolution + `</span>
                            <span>` + enhanced_streamData.resolution + `</span>
                            <span></span>
                            <div class="border"></div>
                            <span>FPS</span>
                            <span>` + enhanced_streamData.fps + `</span>
                            <span></span>`

                if (enhanced_streamData.codec.includes('VP9')) {
                    enhanced_streamInfo += '<div class="border"></div><span>' + enhanced_lang.compression + '</span><span>' + enhanced_streamData.compression + '</span><span></span>'
                }

                enhanced_streamInfo += '<div class="border"></div>'

                if (enhanced_streamData.decode > 12) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.decodetime + '</span><span>' + enhanced_streamData.decode + ' ms</span><span class="connection" style="color: #FF7070;">⬤</span>'
                } else if (enhanced_streamData.decode > 10) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.decodetime + '</span><span>' + enhanced_streamData.decode + ' ms</span><span class="connection" style="color: #FFB83D;">⬤</span>'
                } else if (enhanced_streamData.decode > 8.33) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.decodetime + '</span><span>' + enhanced_streamData.decode + ' ms</span><span class="connection" style="color: #00E0BA;">⬤</span>'
                } else {
                    enhanced_streamInfo += '<span>' + enhanced_lang.decodetime + '</span><span>' + enhanced_streamData.decode + ' ms</span><span class="connection" style="color: #44BBD8;">⬤</span>'
                }

                enhanced_streamInfo += '<div class="border"></div>'

                if (enhanced_streamData.framedropPerc > 1) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.framedrop + '</span><span>' + enhanced_streamData.framedrop + '</span><span class="connection" style="color: #FF7070;">⬤</span>'
                } else if (enhanced_streamData.framedropPerc > 0.5) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.framedrop + '</span><span>' + enhanced_streamData.framedrop + '</span><span class="connection" style="color: #FFB83D;">⬤</span>'
                } else if (enhanced_streamData.framedropPerc > 0.2) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.framedrop + '</span><span>' + enhanced_streamData.framedrop + '</span><span class="connection" style="color: #00E0BA;">⬤</span>'
                } else {
                    enhanced_streamInfo += '<span>' + enhanced_lang.framedrop + '</span><span>' + enhanced_streamData.framedrop + '</span><span class="connection" style="color: #44BBD8;">⬤</span>'
                }

                enhanced_streamInfo += `
                    </div>
                </section>
                <section>
                    <div class="tag">` + enhanced_lang.network + `</div>
                    <div class="grid">
                        <span>` + enhanced_lang.trafficsession + `</span>
                        <span>` + enhanced_streamData.sessionTraffic + `</span>
                        <span></span>
                        <div class="border"></div>
                        <span>` + enhanced_lang.trafficcurrent + `</span>
                        <span>` + enhanced_streamData.currentTraffic + `</span>
                        <span></span>
                        <div class="border"></div>
                        <span>` + enhanced_lang.trafficaverage + `</span>
                        <span>` + enhanced_streamData.averageTraffic + `</span>
                        <span></span>
                        <div class="border"></div>
                        <span>` + enhanced_lang.packetloss + `</span>
                        <span>` + enhanced_streamData.packetloss + `</span>
                        <span></span>
                        <div class="border"></div>`

                if (enhanced_streamData.latency > 100) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.latency + '</span><span>' + enhanced_streamData.latency + ' ms</span><span class="connection" style="color: #FF7070;">⬤</span>'
                } else if (enhanced_streamData.latency > 75) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.latency + '</span><span>' + enhanced_streamData.latency + ' ms</span><span class="connection" style="color: #FFB83D;">⬤</span>'
                } else if (enhanced_streamData.latency > 40) {
                    enhanced_streamInfo += '<span>' + enhanced_lang.latency + '</span><span>' + enhanced_streamData.latency + ' ms</span><span class="connection" style="color: #00E0BA;">⬤</span>'
                } else {
                    enhanced_streamInfo += '<span>' + enhanced_lang.latency + '</span><span>' + enhanced_streamData.latency + ' ms</span><span class="connection" style="color: #44BBD8;">⬤</span>'
                }

                enhanced_streamInfo += `
                                <div class="border"></div>
                                <span>` + enhanced_lang.jitter + `</span>
                                <span>` + enhanced_streamData.jitter + `</span>
                                <span></span>
                            </div>
                        </div>
                    </section>`
                break
            case 1:
                // Connection Check
                if (parseInt(enhanced_streamData.fps) < 1) {
                    enhanced_connectionStatus = 'white'
                } else if (enhanced_streamData.decode > 12 || enhanced_streamData.framedropPerc > 1 || enhanced_streamData.latency > 100) {
                    enhanced_connectionStatus = 'FF7070' // Red
                } else if (enhanced_streamData.decode > 10 || enhanced_streamData.framedropPerc > 0.5 || enhanced_streamData.latency > 75) {
                    enhanced_connectionStatus = 'FFB83D' // Yellow
                } else if (enhanced_streamData.decode > 8.33 || enhanced_streamData.framedropPerc > 0.2 || enhanced_streamData.latency > 40) {
                    enhanced_connectionStatus = '00E0BA' // Green
                } else {
                    enhanced_connectionStatus = '#44BBD8' // Blue
                }

                enhanced_streamInfo = `
                <section>
                    <div class="grid">
                        <span style="grid-column: 1 / 4;">` + enhanced_streamData.codec + `<div class="split">|</div>` + enhanced_streamData.resolution + `<div class="split">|</div>` + enhanced_streamData.fps + ` fps<div class="split">|</div>` + enhanced_streamData.latency + `ms<div class="split">|</div>` + enhanced_streamData.decode + `ms<div class="split">|</div><span style="color: ` + enhanced_connectionStatus + `;">⬤</span></span>
                    </div>
                </section>`
                break
        }

        this.element.innerHTML = enhanced_streamInfo
    }
}

