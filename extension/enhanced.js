// Start Up
console.groupCollapsed("Stadia Enhanced: Start-Up");

var enhanced_timerLoadStart = window.performance.now();
var enhanced_supportedLang = "en|sv|fr|it|es|da|ca|pt|de|hu|nl|pl|no|fi"
var enhanced_local = document.querySelector("html").getAttribute("lang");
var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
var enhanced_AccountInfo = enhanced_loadUserInfo();
if (enhanced_AccountInfo) {
    console.log("%cStadia Enhanced" + "%c ⚙️ - User: " + enhanced_AccountInfo[0] + "#" + enhanced_AccountInfo[1] + " (" + enhanced_AccountInfo[2] + ") (" + enhanced_local + ")", enhanced_consoleEnhanced, "");
}
var enhanced_lang = enhancedTranslate(enhanced_local, true);

// CSS Changes - Global styles and overwrites
enhanced_CSS = ".lTHVjf { padding: 0rem 1.5rem 0 1.5rem !important; }" // Remove padding above avatar
enhanced_CSS += ".DGX7fe { display: none }" // Hide the invite menu
enhanced_CSS += ".VfPpkd-fmcmS-wGMbrd { text-overflow: ellipsis; }" // Fix searchbar text cutoff
enhanced_CSS += ".qE7X4e { margin-right: 0.625rem; }" // Fix searchbar margin
enhanced_CSS += ".E0Zk9b { justify-content: flex-start !important; flex-flow: row wrap; }" // Wrap menu items
enhanced_CSS += ".hxhAyf.fi8Jxd .TZ0BN { min-height: auto !important; }" // Adjust menu height
enhanced_CSS += ".GqLi4d.XUBkDd .a1l9D { margin: 0 0 .5rem .5rem !important; }" // Less padding on "Pro" lables
enhanced_CSS += ".tlZCoe { margin-right: .5rem; margin-top: .5rem !important; }" // Allow for multiple buttons on popup
enhanced_CSS += ".ozpmIc.lEPylf.sfe1Ff { padding: 4.25rem 0 4.5rem 0 !important; }" // Fix store list padding for scrollbars
enhanced_CSS += "#enhanced_showAll div { margin-left: 0 !important; }" // Fix show/hide filter margin
enhanced_CSS += ".mGdxHb.ltdNmc:hover #enhanced_shortcutLastPlayed { opacity: 1 !important; }" // Show last-played shortcut on hover only
enhanced_CSS += "#enhanced_SettingsDropContent::-webkit-scrollbar { width: 1rem; }" // Settings menu scrollbar width
enhanced_CSS += "#enhanced_SettingsDropContent::-webkit-scrollbar-thumb { background-color: #202124; border-radius: 1rem; border: 3px solid #2d2e30; }" // Settings menu scrollbar style

// CSS Changes - Mobile Mode
enhanced_CSS += "@media screen and (max-width: 639px) {\
                    #enhanced_letterBox { display: none; }\
                }"

// Inject CSS
enhanced_injectStyle(enhanced_CSS, "enhanced_styleGeneral");

// Stadia Public Database by OriginalPenguin
// Source: https://airtable.com/shr32bmiOThVvSGar/tblAeJTnP2bzZyews
var enhanced_database;
fetch('https://raw.githubusercontent.com/ChristopherKlay/StadiaEnhanced/master/database.csv')
    .then(response => response.text())
    .then(result => enhanced_loadDatabase(result));

// Extended Details
var enhanced_extendedDetails = document.createElement("div")
enhanced_extendedDetails.className = "b2MCG"

var enhanced_extendedDisclaimer = document.createElement("div")
enhanced_extendedDisclaimer.className = "uM5FUc"
enhanced_extendedDisclaimer.innerHTML = enhanced_lang.datadiscl

// Stream Monitor by AquaRegia
// Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
var enhanced_monitorState = 0;
var enhanced_monitorMode = parseInt(localStorage.getItem("enhanced_monitorMode") || 0);
var enhanced_monitorPos = localStorage.getItem("enhanced_monitorPosition") || "1rem|1rem";
var enhanced_streamMonitor = document.createElement("div");
enhanced_streamMonitor.id = "enhanced_streamMonitor";
enhanced_streamMonitor.style.position = "fixed";
enhanced_streamMonitor.style.width = "auto";
enhanced_streamMonitor.style.top = enhanced_monitorPos.split("|")[0];
enhanced_streamMonitor.style.left = enhanced_monitorPos.split("|")[1];
enhanced_streamMonitor.style.zIndex = 1000;
enhanced_streamMonitor.style.borderRadius = "0.5rem";
enhanced_streamMonitor.style.background = "rgba(32,33,36,0.7)";
enhanced_streamMonitor.style.padding = "0.5rem";
enhanced_streamMonitor.style.fontSize = "0.7rem";
enhanced_streamMonitor.style.cursor = "pointer";
enhanced_streamMonitor.style.display = "block";
enhanced_streamMonitor.addEventListener("dblclick", function() {
    enhanced_monitorMode = (enhanced_monitorMode + 1) % 2;
    localStorage.setItem("enhanced_monitorMode", enhanced_monitorMode);
});
document.body.appendChild(enhanced_streamMonitor);
enhanced_dragElement(enhanced_streamMonitor);

// Minified Menu Monitor
var enhanced_menuMonitor = document.createElement("div");
enhanced_menuMonitor.style.whiteSpace = "nowrap"

// Codec
var enhanced_menuMonitorCodec = document.createElement("div");
enhanced_menuMonitorCodec.id = "enhanced_menuMonitorCodecRes"
enhanced_menuMonitorCodec.className = "HPX1od";
enhanced_menuMonitorCodec.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.codec + '</span><span class="Ce1Y1c qFZbbe">' + "-" + '</span></div>';
enhanced_menuMonitor.append(enhanced_menuMonitorCodec);

// Resolution
var enhanced_menuMonitorRes = document.createElement("div");
enhanced_menuMonitorRes.id = "enhanced_menuMonitorRes"
enhanced_menuMonitorRes.className = "HPX1od";
enhanced_menuMonitorRes.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.resolution + '</span><span class="Ce1Y1c qFZbbe">' + "-" + '</span></div>';
enhanced_menuMonitor.append(enhanced_menuMonitorRes);

// Latency + Fps
var enhanced_menuMonitorLatFps = document.createElement("div");
enhanced_menuMonitorLatFps.id = "enhanced_menuMonitorLatFps"
enhanced_menuMonitorLatFps.className = "HPX1od";
enhanced_menuMonitorLatFps.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.latency + ' | FPS</span><span class="Ce1Y1c qFZbbe">' + "- | -" + '</span></div>';
enhanced_menuMonitor.append(enhanced_menuMonitorLatFps);

// Frame Drop
var enhanced_menuMonitorFDrop = document.createElement("div");
enhanced_menuMonitorFDrop.id = "enhanced_menuMonitorFDrop"
enhanced_menuMonitorFDrop.className = "HPX1od";
enhanced_menuMonitorFDrop.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.framedrop + '</span><span class="Ce1Y1c qFZbbe">' + "-" + '</span></div>';
enhanced_menuMonitor.append(enhanced_menuMonitorFDrop);

// Decode
var enhanced_menuMonitorDecode = document.createElement("div");
enhanced_menuMonitorDecode.id = "enhanced_menuMonitorDecode"
enhanced_menuMonitorDecode.className = "HPX1od";
enhanced_menuMonitorDecode.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.decodetime + '</span><span class="Ce1Y1c qFZbbe">' + "-" + '</span></div>';
enhanced_menuMonitor.append(enhanced_menuMonitorDecode)

function enhanced_updateMonitor(opt) {
    switch (opt) {
        case 0:
            enhanced_streamMonitor.style.display = "none";
            break
        case 1:
            enhanced_streamMonitor.style.top = localStorage.getItem("enhanced_monitorPosition").split("|")[0] || "1rem"
            enhanced_streamMonitor.style.left = localStorage.getItem("enhanced_monitorPosition").split("|")[1] || "1rem"
            enhanced_streamMonitor.style.right = "";
            enhanced_streamMonitor.style.bottom = "";
            enhanced_streamMonitor.style.display = "block";
            break;
    }
}

function enhanced_RTCMonitor() {
    'use strict';
    var enhanced_streamMonitor = document.getElementById("enhanced_streamMonitor");
    var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
    var enhanced_local = document.querySelector("html").getAttribute("lang");
    var enhanced_lang = enhancedTranslate(enhanced_local);

    // RTC Stream Inject
    var peerConnections = [];
    (function(original) {
        RTCPeerConnection = function() {
            var connection = new original(arguments[0], arguments[1]);
            peerConnections.push(connection);
            return connection;
        };
        RTCPeerConnection.prototype = original.prototype;
    })(RTCPeerConnection);
    console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Monitor: Successfully injected.", enhanced_consoleEnhanced, "");

    // Setup
    var enhanced_lastTime = new Date();
    var enhanced_lastBytes = 0;
    var enhanced_lastFrames = 0;
    var enhanced_lastFramesDecoded = 0;
    var enhanced_lastBufferDelay = 0;
    var enhanced_lastBufferEmitted = 0;
    var enhanced_lastQpSum = 0;
    var enhanced_sessionStart;
    var enhanced_sessionActive = false;

    function enhanced_formatBytes(a, b) {
        if (0 == a) return "0 Bytes";
        var c = 1024,
            d = b || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    function enhanced_formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds);
    }

    setInterval(function() {
        if (document.location.href.indexOf("/player/") == -1) {
            peerConnections = [];
            enhanced_lastBytes = 0;
            enhanced_lastFrames = 0;
            enhanced_sessionActive = false;
        } else if (peerConnections.length >= 2) {
            if (!enhanced_sessionActive) {
                enhanced_sessionStart = new Date();
                enhanced_streamMonitor.innerHTML = "Waiting for game detection.";
                enhanced_sessionActive = true;
            }
            const openConnections = peerConnections.filter(x => x.connectionState == "connected");
            openConnections[1].getStats().then(function(stats) {
                for (var key of stats.keys()) {
                    if (key.indexOf("RTCIceCandidatePair") != -1) {
                        var tmp4 = stats.get(key);
                    }
                    if (key.indexOf("RTCInboundRTPVideoStream") != -1) {
                        var tmp1 = stats.get(key);
                        var tmp2 = stats.get(tmp1.trackId);

                        openConnections[1].getStats(function(stats) {
                            var tmp3 = stats.result().find(function(f) {
                                return "ssrc" == f.type && f.id.endsWith("recv") && f.names().includes("mediaType") && "video" == f.stat("mediaType");
                            });

                            var time = new Date();
                            var timeSinceUpdate = (time - enhanced_lastTime) / 1000;
                            enhanced_lastTime = time;
                            var sessionDuration = (time - enhanced_sessionStart) / 1000;
                            time = new Date(time - time.getTimezoneOffset() * 60 * 1000).toISOString().replace("T", " ").split(".")[0];
                            var resolution = tmp2.frameWidth + "x" + tmp2.frameHeight;
                            var framesReceived = tmp2.framesReceived;
                            var framesReceivedPerSecond = (framesReceived - enhanced_lastFrames) / timeSinceUpdate;
                            var framesDecoded = tmp2.framesDecoded;
                            var codec = tmp3.stat("googCodecName");
                            var bytesReceived = tmp1.bytesReceived;
                            var bytesReceivedPerSecond = (bytesReceived - enhanced_lastBytes) / timeSinceUpdate;
                            var averageData = ((((bytesReceived / sessionDuration) * 3600) / 1024) / 1024) / 1024;
                            var packetsLost = tmp1.packetsLost;
                            var packetsReceived = tmp1.packetsReceived;
                            var framesDropped = tmp2.framesDropped;
                            var framesDroppedPerc = ((framesDropped / framesReceived) * 100).toFixed(3)
                            var latency = tmp4.currentRoundTripTime * 1000;
                            if (isNaN(latency)) {
                                latency = "0";
                            }
                            var jitterBufferDelay = tmp2.jitterBufferDelay * 1000;
                            var jitterBufferEmittedCount = tmp2.jitterBufferEmittedCount;
                            var jitterBuffer = jitterBufferDelay / jitterBufferEmittedCount;

                            if (codec == "VP9") {
                                var compression = (tmp1.qpSum - enhanced_lastQpSum) / (framesDecoded - enhanced_lastFramesDecoded);
                                compression = compression.toFixed(1)
                                if (isNaN(compression)) {
                                    compression = "-";
                                }
                            }
                            var decodingTime = (tmp1.totalDecodeTime / tmp2.framesDecoded) * 1000;
                            if (tmp3.stat("codecImplementationName") == "ExternalDecoder") {
                                var decodingType = enhanced_lang.hardware;
                            } else {
                                var decodingType = enhanced_lang.software;
                            }

                            enhanced_lastFrames = framesReceived;
                            enhanced_lastFramesDecoded = framesDecoded;
                            enhanced_lastBytes = bytesReceived;
                            enhanced_lastQpSum = tmp1.qpSum;
                            var enhanced_connectionStatus = "white";
                            var enhanced_monitorMode = parseInt(localStorage.getItem("enhanced_monitorMode") || 0);

                            var enhanced_streamData = "Loading stream data.";
                            if (framesReceived > 0) {

                                // Connection Check
                                if (parseInt(framesReceivedPerSecond) < 1) {
                                    enhanced_connectionStatus = "white";
                                } else if (decodingTime > 12 || framesDroppedPerc > 1 || latency > 100) {
                                    enhanced_connectionStatus = "#FF7070"; // Red
                                } else if (decodingTime > 10 || framesDroppedPerc > 0.5 || latency > 75) {
                                    enhanced_connectionStatus = "#FFB83D"; // Yellow
                                } else if (decodingTime > 8.33 || framesDroppedPerc > 0.2 || latency > 40) {
                                    enhanced_connectionStatus = "#00E0BA"; // Green
                                } else {
                                    enhanced_connectionStatus = "#44BBD8"; // Blue
                                }

                                switch (enhanced_monitorMode) {
                                    case 0:
                                        enhanced_streamData = '<center><svg height="30" width="45" viewBox="0 0 120 80" fill="white"><path d="M1.00857143,23.3413856 C0.362857143,23.8032807 0.00285714286,24.5360402 0,25.2901838 L0,25.2901838 L0,25.3201215 C0.00285714286,25.6380308 0.0685714286,25.9602169 0.204285714,26.2667213 L0.204285714,26.2667213 L11.69,52.2882388 C12.1985714,53.441551 13.5114286,54.0060895 14.7014286,53.5841112 L14.7014286,53.5841112 C22.2214286,50.9025535 48.2628571,42.4187946 65.1157143,46.9949777 L65.1157143,46.9949777 C65.1157143,46.9949777 48.21,47.9729409 32.9228571,59.96083 L32.9228571,59.96083 C32.0614286,60.6379911 31.7742857,61.8155385 32.2157143,62.8163113 L32.2157143,62.8163113 C33.4571429,65.6204709 35.9485714,71.2573021 37.3585714,74.4435231 L37.3585714,74.4435231 L39.3385714,79.0881351 C39.81,80.1901256 41.3157143,80.3227066 41.98,79.3247851 L41.98,79.3247851 C45.5471429,73.9531159 51.5614286,71.2701325 57.3385714,68.927868 L57.3385714,68.927868 C63.2571429,66.5300051 69.4328571,64.7408743 75.7328571,63.6759494 L75.7328571,63.6759494 C82.4457143,62.54117 89.3,62.2375168 96.0842857,62.8376953 L96.0842857,62.8376953 C97.2142857,62.9374875 98.2628571,62.2446448 98.6,61.1640383 L98.6,61.1640383 L103.788571,44.5814332 C104.094286,43.6006188 103.742857,42.528566 102.908571,41.9255362 L102.908571,41.9255362 C97.1228571,37.7342657 74.2042857,23.6564437 33.9014286,29.3118077 L33.9014286,29.3118077 C33.9014286,29.3118077 68.2928571,9.55581202 111.954286,31.2577547 L111.954286,31.2577547 C113.277143,31.916383 114.874286,31.2249659 115.315714,29.8193221 L115.315714,29.8193221 L119.89,15.1954944 C119.961429,14.9688237 119.995714,14.7393017 120,14.512631 L120,14.512631 L120,14.4427765 C119.987143,13.6102248 119.541429,12.8204411 118.784286,12.3913349 L118.784286,12.3913349 C113.304286,9.29065 94.7514286,2.79222317e-07 69.23,2.79222317e-07 L69.23,2.79222317e-07 C49.6685714,-0.00142532301 26.0157143,5.45578001 1.00857143,23.3413856"/></svg><br/>'
                                        enhanced_streamData += "<b>" + time + "</b><br/>" + enhanced_lang.sessiontime + ": " + enhanced_formatTime(sessionDuration) + "</center><br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.resolution + ":</b> " + resolution + "<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.codec + ":</b> " + decodingType + " " + codec + "<br/>";
                                        if (codec == "VP9") {
                                            enhanced_streamData += "<b>" + enhanced_lang.compression + ":</b> " + compression;
                                            enhanced_streamData += "<br/>";
                                        }
                                        enhanced_streamData += "<b>FPS:</b> " + framesReceivedPerSecond.toFixed(1) + "<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.trafficsession + ":</b> " + enhanced_formatBytes(bytesReceived, 2) + "<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.trafficcurrent + ":</b> " + enhanced_formatBytes(bytesReceivedPerSecond * 8, 2).slice(0, -1) + "b/s<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.trafficaverage + ":</b> " + averageData.toFixed(2) + " GB/h<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.packetloss + ":</b> " + packetsLost + " (" + ((packetsLost / packetsReceived) * 100).toFixed(3) + "%)<br/>";

                                        if (framesDroppedPerc > 1) {
                                            enhanced_streamData += "<b>" + enhanced_lang.framedrop + ":</b><span style='color: #FF7070;'> " + framesDropped + " (" + framesDroppedPerc + "%)</span><br/>";
                                        } else if (framesDroppedPerc > 0.5) {
                                            enhanced_streamData += "<b>" + enhanced_lang.framedrop + ":</b><span style='color: #FFB83D;'> " + framesDropped + " (" + framesDroppedPerc + "%)</span><br/>";
                                        } else if (framesDroppedPerc > 0.2) {
                                            enhanced_streamData += "<b>" + enhanced_lang.framedrop + ":</b><span style='color: #00E0BA;'> " + framesDropped + " (" + framesDroppedPerc + "%)</span><br/>";
                                        } else {
                                            enhanced_streamData += "<b>" + enhanced_lang.framedrop + ":</b><span style='color: #44BBD8;'> " + framesDropped + " (" + framesDroppedPerc + "%)</span><br/>";
                                        }

                                        if (decodingTime > 12) {
                                            enhanced_streamData += "<b>" + enhanced_lang.decodetime + ": </b><span style='color: #FF7070;'> " + decodingTime.toFixed(2) + " ms</span><br/>";
                                        } else if (decodingTime > 10) {
                                            enhanced_streamData += "<b>" + enhanced_lang.decodetime + ": </b><span style='color: #FFB83D;'> " + decodingTime.toFixed(2) + " ms</span><br/>";
                                        } else if (decodingTime > 8.33) {
                                            enhanced_streamData += "<b>" + enhanced_lang.decodetime + ": </b><span style='color: #00E0BA;'> " + decodingTime.toFixed(2) + " ms</span><br/>";
                                        } else {
                                            enhanced_streamData += "<b>" + enhanced_lang.decodetime + ": </b><span style='color: #44BBD8;'> " + decodingTime.toFixed(2) + " ms</span><br/>";
                                        }

                                        if (latency > 100) {
                                            enhanced_streamData += "<b>" + enhanced_lang.latency + ":</b><span style='color: #FF7070;'> " + latency + " ms</span><br/>";
                                        } else if (latency > 75) {
                                            enhanced_streamData += "<b>" + enhanced_lang.latency + ":</b><span style='color: #FFB83D;'> " + latency + " ms</span><br/>";
                                        } else if (latency > 40) {
                                            enhanced_streamData += "<b>" + enhanced_lang.latency + ":</b><span style='color: #00E0BA;'> " + latency + " ms</span><br/>";
                                        } else {
                                            enhanced_streamData += "<b>" + enhanced_lang.latency + ":</b><span style='color: #44BBD8;'> " + latency + " ms</span><br/>";
                                        }

                                        enhanced_streamData += "<b>" + enhanced_lang.jitter + ":</b> " + jitterBuffer.toPrecision(4) + " ms<br/>";
                                        enhanced_streamData += "<hr style='height: 4px; border: none; border-radius: 0.5rem; background: " + enhanced_connectionStatus + ";'></hr>";
                                        break
                                    case 1:
                                        enhanced_streamData = decodingType + " " + codec + "&ensp;|&ensp;" + resolution + "&ensp;|&ensp;" + framesReceivedPerSecond.toFixed(1) + "fps&ensp;|&ensp;" + latency + "ms&ensp;|&ensp;" + decodingTime.toFixed(1) + "ms&ensp;|&ensp;<span style='color: " + enhanced_connectionStatus + ";'>⬤</span>";
                                        break
                                }

                                // Menu Monitor
                                document.getElementById("enhanced_menuMonitorCodecRes").innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.codec + '</span><span class="Ce1Y1c qFZbbe">' + decodingType + " " + codec + '</span></div>';
                                document.getElementById("enhanced_menuMonitorRes").innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.resolution + '</span><span class="Ce1Y1c qFZbbe">' + resolution + '</span></div>';
                                document.getElementById("enhanced_menuMonitorLatFps").innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.latency + ' | FPS</span><span class="Ce1Y1c qFZbbe">' + latency + 'ms | ' + framesReceivedPerSecond.toFixed(1) + '</span></div>';
                                document.getElementById("enhanced_menuMonitorFDrop").innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.framedrop + '</span><span class="Ce1Y1c qFZbbe">' + framesDropped + ' (' + framesDroppedPerc + '%)</span></div>';
                                document.getElementById("enhanced_menuMonitorDecode").innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.decodetime + '</span><span class="Ce1Y1c qFZbbe">' + decodingTime.toFixed(2) + 'ms</span></div>';
                            }

                            // Reset outside of viewport
                            var enhanced_boundingBox = enhanced_streamMonitor.getBoundingClientRect()
                            if (enhanced_boundingBox.top <= 0 && enhanced_boundingBox.left <= 0 && enhanced_boundingBox.bottom >= window.availHeight && enhanced_boundingBox.right >= window.availWidth) {
                                document.getElementById("enhanced_streamMonitor").style.top = "1rem";
                                document.getElementById("enhanced_streamMonitor").style.left = "1rem";
                            }

                            localStorage.setItem("enhanced_monitorPosition", enhanced_streamMonitor.style.top + "|" + enhanced_streamMonitor.style.left);
                            enhanced_streamMonitor.innerHTML = enhanced_streamData;
                        });
                    }
                }

            });
        }
    }, 1000);
}
embed(enhancedTranslate, false);
embed(enhanced_RTCMonitor);

// Streaming Monitor
var enhanced_Monitor = document.createElement("div");
enhanced_Monitor.className = "R2s0be";
enhanced_Monitor.id = "enhanced_Monitor";
enhanced_Monitor.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">analytics</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.streammon + '</span></div>'
enhanced_Monitor.style.cursor = "pointer";
enhanced_Monitor.style.userSelect = "none";
enhanced_Monitor.tabIndex = "0";
enhanced_Monitor.addEventListener("click", function() {
    enhanced_monitorState = (enhanced_monitorState + 1) % 2;
    enhanced_updateMonitor(enhanced_monitorState);
});
enhanced_Monitor.addEventListener("dblclick", function() {
    var enhanced_popMonitor = window.open('', '_blank', 'width=350,height=350,toolbar=0');
    enhanced_popMonitor.document.body.style.background = "#000"
    enhanced_popMonitor.document.body.style.color = "#fff"
    enhanced_upPop = setInterval(function() {
        if (enhanced_popMonitor.closed) {
            clearInterval(enhanced_upPop);
        } else {
            enhanced_popMonitor.document.body.innerHTML = enhanced_streamMonitor.innerHTML
        }
    }, 1000);
});

// Windowed Mode
// Source: Mafrans - https://github.com/Mafrans/StadiaPlus
var enhanced_BlockFullscreen = false;
var enhanced_Windowed = document.createElement("div");
enhanced_Windowed.className = "R2s0be";
enhanced_Windowed.id = "enhanced_Windowed";
enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.windowed + '</span></div>'
enhanced_Windowed.style.cursor = "pointer";
enhanced_Windowed.style.userSelect = "none";
enhanced_Windowed.tabIndex = "0";
enhanced_Windowed.addEventListener("click", function() {
    if (enhanced_BlockFullscreen) {
        enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.windowed + '</span></div>'
        enhanced_BlockFullscreen = false;
        document.documentElement.requestFullscreen();
    } else {
        enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen_exit</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.fullscreen + '</span></div>'
        enhanced_BlockFullscreen = true;
        document.exitFullscreen();
    }
});
window.addEventListener('fullscreenchange', function(event) {
    if (enhanced_BlockFullscreen) {
        event.stopPropagation();
    }
}, true);

// Emoji Picker
var enhanced_emojiswitch = document.createElement("div");
enhanced_emojiswitch.innerHTML = "😃";
enhanced_emojiswitch.style.marginLeft = "1rem";
enhanced_emojiswitch.style.cursor = "pointer";
enhanced_emojiswitch.addEventListener("click", function() {
    if (enhanced_emojiPicker.style.display == "none") {
        enhanced_emojiPicker.style.display = "flex";
        if (document.querySelector('div[jsname="IbgIAb"] .emG1mb')) {
            document.querySelectorAll('div[jsname="IbgIAb"] .emG1mb')[document.querySelectorAll('div[jsname="IbgIAb"] .emG1mb').length - 1].scrollIntoView(false);
        }
    } else {
        enhanced_emojiPicker.style.display = "none";
    }
});

var enhanced_emojiPicker = document.createElement("div");
enhanced_emojiPicker.style.width = "auto";
enhanced_emojiPicker.style.height = "10rem";
enhanced_emojiPicker.style.margin = "0 1rem 0.5rem";
enhanced_emojiPicker.style.overflowY = "scroll";
enhanced_emojiPicker.style.overflowX = "hidden";
enhanced_emojiPicker.style.fontSize = "1.4rem";
enhanced_emojiPicker.style.cursor = "pointer";
enhanced_emojiPicker.style.flexWrap = "wrap";
enhanced_emojiPicker.style.justifyContent = "space-around";
enhanced_emojiPicker.style.userSelect = "none";
enhanced_emojiPicker.style.borderRadius = "0.5rem";
enhanced_emojiPicker.style.display = "none";

enhanced_emojiPicker.addEventListener("click", function(i) {
    document.querySelector(".m0BtMe").focus();
    document.execCommand('insertText', false, i.target.textContent);
});

window.addEventListener("click", function(e) {
    if (e.target != enhanced_emojiswitch && e.target != enhanced_emojiPicker && enhanced_emojiPicker.contains(e.target) === false) {
        enhanced_emojiPicker.style.display = "none";
    }
});

var enhanced_dummy;
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
];
for (var i = 0; i < enhanced_emojiRange.length; i++) {
    var range = enhanced_emojiRange[i];
    for (var x = range[0]; x < range[1]; x++) {
        enhanced_dummy = document.createElement('span');
        enhanced_dummy.style.width = "2rem";
        enhanced_dummy.value = x;
        enhanced_dummy.innerHTML = "&#" + x + ";";
        enhanced_emojiPicker.appendChild(enhanced_dummy);
    }
}

// Clock Widget - Adds a little clock at the bottom of the friends menu
var enhanced_ClockMode = parseInt(localStorage.getItem("enhanced_ClockMode") || 0);
var enhanced_ClockFriends = document.createElement("div");
enhanced_ClockFriends.id = "enhanced_ClockFriends";
enhanced_ClockFriends.innerHTML = "00:00:00";
enhanced_ClockFriends.style.backgroundColor = "rgba(255,255,255,.06)";
enhanced_ClockFriends.style.fontFamily = "'Google Sans',sans-serif";
enhanced_ClockFriends.style.fontSize = "0.875rem";
enhanced_ClockFriends.style.lineHeight = "1.25rem";
enhanced_ClockFriends.style.fontWeight = "500";
enhanced_ClockFriends.style.userSelect = "none";
enhanced_ClockFriends.style.padding = "0.5rem 1rem";
enhanced_ClockFriends.style.cursor = "pointer";
enhanced_ClockFriends.style.display = "flex";
enhanced_ClockFriends.style.alignItems = "center";
enhanced_ClockFriends.style.justifyContent = "center";
enhanced_ClockFriends.style.zIndex = "20";
enhanced_ClockFriends.addEventListener("click", function() {
    enhanced_ClockMode = (enhanced_ClockMode + 1) % 2;
    localStorage.setItem("enhanced_ClockMode", enhanced_ClockMode);
});

// Overlay Clock - Adds a overlay clock element to the game stream
var enhanced_ClockOverlay = document.createElement("div");
enhanced_ClockOverlay.id = "enhanced_ClockOverlay";
enhanced_ClockOverlay.innerHTML = "00:00:00";
enhanced_ClockOverlay.style.position = "fixed";
enhanced_ClockOverlay.style.left = "1rem";
enhanced_ClockOverlay.style.top = "1rem";
enhanced_ClockOverlay.style.fontFamily = "'Google Sans',sans-serif";
enhanced_ClockOverlay.style.fontSize = "3.5rem";
enhanced_ClockOverlay.style.lineHeight = "5rem";
enhanced_ClockOverlay.style.fontWeight = "500";
enhanced_ClockOverlay.style.userSelect = "none";
enhanced_ClockOverlay.style.padding = "0";
enhanced_ClockOverlay.style.cursor = "pointer";
enhanced_ClockOverlay.style.alignItems = "center";
enhanced_ClockOverlay.style.justifyContent = "center";
enhanced_ClockOverlay.style.zIndex = "20";
enhanced_ClockOverlay.addEventListener("click", function() {
    enhanced_ClockMode = (enhanced_ClockMode + 1) % 2;
    localStorage.setItem("enhanced_ClockMode", enhanced_ClockMode);
});

// Pro Games - Adds a quick access to the current list of "Pro" titles on Stadia
var enhanced_ProGames = document.createElement("li");
enhanced_ProGames.className = "OfFb0b R22fdd";
enhanced_ProGames.id = "enhanced_ProGames";
var enhanced_ProGamesLink = document.createElement("a");
enhanced_ProGames.appendChild(enhanced_ProGamesLink);
enhanced_ProGamesLink.className = "ROpnrd QAAyWd wJYinb";
enhanced_ProGamesLink.textContent = 'Pro';
enhanced_ProGamesLink.addEventListener("click", function() {
    openStadia("store/list/2001")
});
if (document.getElementsByClassName("ZECEje")[0] !== undefined) {
    document.getElementsByClassName("ZECEje")[0].append(enhanced_ProGames);
}

// Store Dropdown - Adds a dropdown menu for quick access
var enhanced_StoreContainer = document.createElement("li");
enhanced_StoreContainer.className = "OfFb0b R22fdd";
enhanced_StoreContainer.id = "enhanced_StoreContainer";
var enhanced_StoreDropdown = document.createElement("div");
enhanced_StoreContainer.appendChild(enhanced_StoreDropdown);
enhanced_StoreDropdown.className = "ROpnrd QAAyWd wJYinb";
enhanced_StoreDropdown.id = "enhanced_StoreDropdown";
enhanced_StoreDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_StoreDropdown.style.width = "2.5rem";
enhanced_StoreDropdown.style.padding = "0";
enhanced_StoreDropdown.style.cursor = "pointer";
enhanced_StoreDropdown.style.userSelect = "none";
enhanced_StoreDropdown.tabIndex = "0";
enhanced_StoreDropdown.addEventListener("click", function() {
    if (enhanced_StoreDropContent.style.display === "none") {
        enhanced_StoreDropContent.style.display = "block";
    } else {
        enhanced_StoreDropContent.style.display = "none";
    }
});

var enhanced_StoreDropContent = document.createElement("div");
enhanced_StoreDropdown.append(enhanced_StoreDropContent);
enhanced_StoreDropContent.id = "enhanced_StoreDropContent";
enhanced_StoreDropContent.className = "us22N";
enhanced_StoreDropContent.style.position = "absolute";
enhanced_StoreDropContent.style.width = "auto";
enhanced_StoreDropContent.style.top = "4.25rem";
enhanced_StoreDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_StoreDropContent.style.zIndex = "20";
enhanced_StoreDropContent.style.display = "none";

if (document.getElementsByClassName("ZECEje")[0] !== undefined) {
    document.getElementsByClassName("ZECEje")[0].append(enhanced_StoreContainer);
}

enhanced_StoreDropdown.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        enhanced_StoreDropdown.click();
    }
});

window.addEventListener("click", function(e) {
    if (e.target != enhanced_StoreDropdown && enhanced_StoreDropdown.contains(e.target) === false) {
        enhanced_StoreDropContent.style.display = "none";
    }
});

// On Sale - Quick access to the list of deals available for "Base" users
var enhanced_OnSale = document.createElement("div");
enhanced_OnSale.className = "pBvcyf QAAyWd";
enhanced_OnSale.id = "enhanced_OnSale";
enhanced_OnSale.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">local_offer</i><span class="mJVLwb">' + enhanced_lang.onsale + '</span>';
enhanced_OnSale.style.cursor = "pointer";
enhanced_OnSale.style.userSelect = "none";
enhanced_OnSale.style.paddingRight = "2rem";
enhanced_OnSale.tabIndex = "0";
enhanced_OnSale.addEventListener("click", function() {
    openStadia("store/list/14");
});
enhanced_StoreDropContent.append(enhanced_OnSale);

// Pro Deals - Quick access to the list of deals available for "Pro" users
var enhanced_ProDeals = document.createElement("div");
enhanced_ProDeals.className = "pBvcyf QAAyWd";
enhanced_ProDeals.id = "enhanced_ProDeals";
enhanced_ProDeals.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">loyalty</i><span class="mJVLwb">' + enhanced_lang.prodeals + '</span>';
enhanced_ProDeals.style.cursor = "pointer";
enhanced_ProDeals.style.userSelect = "none";
enhanced_ProDeals.style.paddingRight = "2rem";
enhanced_ProDeals.tabIndex = "0";
enhanced_ProDeals.addEventListener("click", function() {
    openStadia("store/list/45");
});
enhanced_StoreDropContent.append(enhanced_ProDeals);

// Leaving Pro - Quick access to a list of games leaving Pro soon
var enhanced_leavePro = document.createElement("div");
enhanced_leavePro.className = "pBvcyf QAAyWd";
enhanced_leavePro.id = "enhanced_leavePro";
enhanced_leavePro.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">event</i><span class="mJVLwb">' + enhanced_lang.leavepro + '</span>';
enhanced_leavePro.style.cursor = "pointer";
enhanced_leavePro.style.userSelect = "none";
enhanced_leavePro.style.paddingRight = "2rem";
enhanced_leavePro.tabIndex = "0";
enhanced_leavePro.addEventListener("click", function() {
    openStadia("store/list/36");
});
enhanced_StoreDropContent.append(enhanced_leavePro);

// Ubisoft+
var enhanced_ubiPlus = document.createElement("div");
enhanced_ubiPlus.className = "pBvcyf QAAyWd";
enhanced_ubiPlus.id = "enhanced_ubiPlus";
enhanced_ubiPlus.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subscriptions</i><span class="mJVLwb">Ubisoft+</span>';
enhanced_ubiPlus.style.cursor = "pointer";
enhanced_ubiPlus.style.userSelect = "none";
enhanced_ubiPlus.style.paddingRight = "2rem";
enhanced_ubiPlus.tabIndex = "0";
enhanced_ubiPlus.addEventListener("click", function() {
    openStadia("store/list/2002");
});
enhanced_StoreDropContent.append(enhanced_ubiPlus);

// All games - Quick access to a list of all games currently available on Stadia
var enhanced_AllGames = document.createElement("div");
enhanced_AllGames.className = "pBvcyf QAAyWd";
enhanced_AllGames.id = "enhanced_AllGames";
enhanced_AllGames.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">list</i><span class="mJVLwb">' + enhanced_lang.all + ' ' + enhanced_lang.games + '</span>';
enhanced_AllGames.style.cursor = "pointer";
enhanced_AllGames.style.userSelect = "none";
enhanced_AllGames.style.paddingRight = "2rem";
enhanced_AllGames.tabIndex = "0";
enhanced_AllGames.addEventListener("click", function() {
    openStadia("store/list/3");
});
enhanced_StoreDropContent.append(enhanced_AllGames);

// Language Dropdown - Adds a dropdown menu for language switching
var enhanced_langContainer = document.createElement("li");
enhanced_langContainer.className = "OfFb0b";
enhanced_langContainer.id = "enhanced_langContainer";
var enhanced_langDropdown = document.createElement("div");
enhanced_langContainer.appendChild(enhanced_langDropdown);
enhanced_langDropdown.className = "ROpnrd QAAyWd wJYinb";
enhanced_langDropdown.id = "enhanced_langDropdown";
enhanced_langDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">language</i>';
enhanced_langDropdown.style.width = "2.5rem";
enhanced_langDropdown.style.padding = "0";
enhanced_langDropdown.style.cursor = "pointer";
enhanced_langDropdown.style.userSelect = "none";
enhanced_langDropdown.tabIndex = "0";
enhanced_langDropdown.addEventListener("click", function() {
    if (enhanced_langDropContent.style.display === "none") {
        enhanced_langDropContent.style.display = "block";
        enhanced_langDropdown.firstElementChild.style.color = "#ff773d"
    } else {
        enhanced_langDropContent.style.display = "none";
        enhanced_langDropdown.firstElementChild.style.color = ""
    }
});

var enhanced_langDropContent = document.createElement("div");
enhanced_langDropdown.append(enhanced_langDropContent);
enhanced_langDropContent.id = "enhanced_langDropContent";
enhanced_langDropContent.className = "us22N";
enhanced_langDropContent.style.position = "absolute";
enhanced_langDropContent.style.width = "auto";
enhanced_langDropContent.style.top = "4.25rem";
enhanced_langDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_langDropContent.style.zIndex = "20";
enhanced_langDropContent.style.display = "none";

// Language Select - Default
var enhanced_langDefault = document.createElement("div");
enhanced_langDefault.className = "pBvcyf QAAyWd";
enhanced_langDefault.innerHTML = '<span class="mJVLwb">' + enhanced_lang.default+'</span>';
enhanced_langDefault.style.cursor = "pointer";
enhanced_langDefault.style.userSelect = "none";
enhanced_langDefault.style.padding = "0 2rem";
enhanced_langDefault.style.textAlign = "center";
enhanced_langDefault.tabIndex = "0";
enhanced_langDefault.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_langDefault.addEventListener("click", function() {
    enhanced_urlBase = new URL(window.location.href);
    enhanced_urlBase.searchParams.delete('hl')
    history.replaceState(null, null, "?" + enhanced_urlBase.searchParams);
    openStadia("home");
});
enhanced_langDropContent.append(enhanced_langDefault);

// Language Select - English
var enhanced_langEnglish = document.createElement("div");
enhanced_langEnglish.className = "pBvcyf QAAyWd";
enhanced_langEnglish.innerHTML = '<span class="mJVLwb">English</span>';
enhanced_langEnglish.style.cursor = "pointer";
enhanced_langEnglish.style.userSelect = "none";
enhanced_langEnglish.style.padding = "0 2rem";
enhanced_langEnglish.style.textAlign = "center";
enhanced_langEnglish.tabIndex = "0";
enhanced_langEnglish.addEventListener("click", function() {
    enhanced_urlBase = new URL(window.location.href);
    enhanced_urlBase.searchParams.set('hl', 'en')
    history.replaceState(null, null, "?" + enhanced_urlBase.searchParams);
    openStadia("home");
});
enhanced_langDropContent.append(enhanced_langEnglish);

// Language Select - Spanish
var enhanced_langSpanish = document.createElement("div");
enhanced_langSpanish.className = "pBvcyf QAAyWd";
enhanced_langSpanish.innerHTML = '<span class="mJVLwb">Spanish</span>';
enhanced_langSpanish.style.cursor = "pointer";
enhanced_langSpanish.style.userSelect = "none";
enhanced_langSpanish.style.padding = "0 2rem";
enhanced_langSpanish.style.textAlign = "center";
enhanced_langSpanish.tabIndex = "0";
enhanced_langSpanish.addEventListener("click", function() {
    enhanced_urlBase = new URL(window.location.href);
    enhanced_urlBase.searchParams.set('hl', 'es')
    history.replaceState(null, null, "?" + enhanced_urlBase.searchParams);
    openStadia("home");
});
enhanced_langDropContent.append(enhanced_langSpanish);

// Language Select - French
var enhanced_langFrench = document.createElement("div");
enhanced_langFrench.className = "pBvcyf QAAyWd";
enhanced_langFrench.innerHTML = '<span class="mJVLwb">French</span>';
enhanced_langFrench.style.cursor = "pointer";
enhanced_langFrench.style.userSelect = "none";
enhanced_langFrench.style.padding = "0 2rem";
enhanced_langFrench.style.textAlign = "center";
enhanced_langFrench.tabIndex = "0";
enhanced_langFrench.addEventListener("click", function() {
    enhanced_urlBase = new URL(window.location.href);
    enhanced_urlBase.searchParams.set('hl', 'fr')
    history.replaceState(null, null, "?" + enhanced_urlBase.searchParams);
    openStadia("home");
});
enhanced_langDropContent.append(enhanced_langFrench);
secureInsert(enhanced_langContainer, ".ZECEje", 1)

enhanced_langDropdown.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        enhanced_langDropdown.click();
    }
});

window.addEventListener("click", function(e) {
    if (e.target != enhanced_langDropdown && enhanced_langDropdown.contains(e.target) === false) {
        enhanced_langDropContent.style.display = "none";
        enhanced_langDropdown.firstElementChild.style.color = ""
    }
});

// Settings Dropdown - Adds a dropdown menu for quick access
var enhanced_SettingsContainer = document.createElement("li");
enhanced_SettingsContainer.className = "OfFb0b";
enhanced_SettingsContainer.id = "enhanced_SettingsContainer";
var enhanced_SettingsDropdown = document.createElement("div");
enhanced_SettingsContainer.appendChild(enhanced_SettingsDropdown);
enhanced_SettingsDropdown.className = "ROpnrd QAAyWd wJYinb";
enhanced_SettingsDropdown.id = "enhanced_SettingsDropdown";
enhanced_SettingsDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">menu</i>';
enhanced_SettingsDropdown.style.cursor = "pointer";
enhanced_SettingsDropdown.style.width = "2.5rem";
enhanced_SettingsDropdown.style.padding = "0";
enhanced_SettingsDropdown.style.userSelect = "none";
enhanced_SettingsDropdown.tabIndex = "0";
enhanced_SettingsDropdown.addEventListener("click", function(e) {
    if (document.querySelector(".X1asv.ahEBEd.LJni0").style.opacity == "1") {
        document.querySelector(".hBNsYe.QAAyWd.wJYinb.YySNWc").click();
    }
    if (e.path.indexOf(enhanced_settingsFrame) == -1) {
        if (enhanced_settingsFrame.style.display === "none") {
            enhanced_settingsFrame.style.display = "flex";
            enhanced_SettingsDropdown.firstElementChild.style.color = "#ff773d"
        } else {
            enhanced_settingsFrame.style.display = "none";
            enhanced_settingsContent.innerHTML = ""
            enhanced_settingsContent.append(enhanced_settingsShortcut)
            enhanced_SettingsDropdown.firstElementChild.style.color = ""
        }
    }
});

enhanced_SettingsDropdown.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        enhanced_SettingsDropdown.click();
    }
});

// Settings - Frame
var enhanced_settingsFrame = document.createElement("div")
enhanced_settingsFrame.style.display = "none"
enhanced_settingsFrame.style.position = "fixed"
enhanced_settingsFrame.style.top = "4rem"
enhanced_settingsFrame.style.right = "1.5rem"
enhanced_settingsFrame.style.width = "40rem"
enhanced_settingsFrame.style.maxWidth = "calc(100% - 3rem)"
enhanced_settingsFrame.style.height = "19.8rem"
enhanced_settingsFrame.style.color = "rgba(255,255,255,.9)"
enhanced_settingsFrame.style.borderRadius = "0.5rem"
enhanced_settingsFrame.style.overflow = "hidden"
enhanced_settingsFrame.style.boxShadow = "0 0.125rem 0.75rem rgb(0 0 0 / 32%), 0 0.0625rem 0.375rem rgb(0 0 0 / 18%)"

// Settings - Navigation
var enhanced_settingsNav = document.createElement("div")
enhanced_settingsNav.className = "us22N";
enhanced_settingsNav.style.display = "flex"
enhanced_settingsNav.style.width = "12rem"
enhanced_settingsNav.style.flexDirection = "column"
enhanced_settingsNav.style.alignItems = "stretch"
enhanced_settingsNav.style.flexWrap = "nowrap"
enhanced_settingsNav.style.borderRadius = "0"
enhanced_settingsNav.style.background = "#212224"
enhanced_settingsNav.style.borderRight = "1px solid rgba(255, 255, 255, 0.06)"
enhanced_settingsFrame.append(enhanced_settingsNav)

// Settings - Content
var enhanced_settingsContent = document.createElement("div")
enhanced_settingsContent.className = "us22N";
enhanced_settingsContent.style.width = "100%"
enhanced_settingsContent.style.cursor = "default"
enhanced_settingsContent.style.overflowY = "auto"
enhanced_settingsContent.style.overflowX = "hidden"
enhanced_settingsContent.style.background = "#2d2e30"
enhanced_settingsContent.style.borderRadius = "0"
enhanced_settingsFrame.append(enhanced_settingsContent)

enhanced_SettingsDropdown.append(enhanced_settingsFrame);
secureInsert(enhanced_SettingsContainer, ".ZECEje", 1)

// Settings - Groups
var enhanced_settingsShortcut = document.createElement("div");
var enhanced_settingsStream = document.createElement("div");
var enhanced_settingsGeneral = document.createElement("div");
var enhanced_settingsMessages = document.createElement("div");
var enhanced_settingsComFeat = document.createElement("div");
var enhanced_settingsEnhanced = document.createElement("div");
enhanced_settingsContent.appendChild(enhanced_settingsShortcut);

// Navigation - Shortcuts
var enhanced_settingsShortcutTitle = document.createElement("div");
enhanced_settingsShortcutTitle.className = "pBvcyf QAAyWd";
enhanced_settingsShortcutTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.quickaccess + '</span>';
enhanced_settingsShortcutTitle.style.cursor = "pointer";
enhanced_settingsShortcutTitle.style.userSelect = "none";
enhanced_settingsShortcutTitle.style.textAlign = "center";
enhanced_settingsShortcutTitle.style.padding = "0 1rem"
enhanced_settingsShortcutTitle.style.borderBottom = "1px solid rgba(255, 255, 255, 0)"
enhanced_settingsShortcutTitle.addEventListener("click", function() {
    enhanced_settingsContent.innerHTML = ""
    enhanced_settingsContent.scrollTop = 0;
    enhanced_settingsContent.append(enhanced_settingsShortcut)
});
enhanced_settingsNav.append(enhanced_settingsShortcutTitle);

// Navigation - Streaming
var enhanced_settingsStreamTitle = document.createElement("div");
enhanced_settingsStreamTitle.className = "pBvcyf QAAyWd";
enhanced_settingsStreamTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.stream + '</span>';
enhanced_settingsStreamTitle.style.cursor = "pointer";
enhanced_settingsStreamTitle.style.userSelect = "none";
enhanced_settingsStreamTitle.style.textAlign = "center";
enhanced_settingsStreamTitle.style.padding = "0 1rem"
enhanced_settingsStreamTitle.style.borderBottom = "1px solid rgba(255, 255, 255, 0)"
enhanced_settingsStreamTitle.addEventListener("click", function() {
    enhanced_settingsContent.innerHTML = ""
    enhanced_settingsContent.scrollTop = 0;
    enhanced_settingsContent.append(enhanced_settingsStream)
});
enhanced_settingsNav.append(enhanced_settingsStreamTitle);

// Navigation - Interface
var enhanced_settingsGeneralTitle = document.createElement("div");
enhanced_settingsGeneralTitle.className = "pBvcyf QAAyWd";
enhanced_settingsGeneralTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.interface + '</span>';
enhanced_settingsGeneralTitle.style.cursor = "pointer";
enhanced_settingsGeneralTitle.style.userSelect = "none";
enhanced_settingsGeneralTitle.style.textAlign = "center";
enhanced_settingsGeneralTitle.style.padding = "0 1rem"
enhanced_settingsGeneralTitle.style.borderBottom = "1px solid rgba(255, 255, 255, 0)"
enhanced_settingsGeneralTitle.addEventListener("click", function() {
    enhanced_settingsContent.innerHTML = ""
    enhanced_settingsContent.scrollTop = 0;
    enhanced_settingsContent.append(enhanced_settingsGeneral)
});
enhanced_settingsNav.append(enhanced_settingsGeneralTitle);

// Navigation - Messages
var enhanced_settingsMessagesTitle = document.createElement("div");
enhanced_settingsMessagesTitle.className = "pBvcyf QAAyWd";
enhanced_settingsMessagesTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.messages + '</span>';
enhanced_settingsMessagesTitle.style.cursor = "pointer";
enhanced_settingsMessagesTitle.style.userSelect = "none";
enhanced_settingsMessagesTitle.style.textAlign = "center";
enhanced_settingsMessagesTitle.style.padding = "0 1rem"
enhanced_settingsMessagesTitle.style.borderBottom = "1px solid rgba(255, 255, 255, 0)"
enhanced_settingsMessagesTitle.addEventListener("click", function() {
    enhanced_settingsContent.innerHTML = ""
    enhanced_settingsContent.scrollTop = 0;
    enhanced_settingsContent.append(enhanced_settingsMessages)
});
enhanced_settingsNav.append(enhanced_settingsMessagesTitle);

// Navigation - Community Features
var enhanced_settingsComFeatTitle = document.createElement("div");
enhanced_settingsComFeatTitle.className = "pBvcyf QAAyWd";
enhanced_settingsComFeatTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.comfeature + '</span>';
enhanced_settingsComFeatTitle.style.cursor = "pointer";
enhanced_settingsComFeatTitle.style.userSelect = "none";
enhanced_settingsComFeatTitle.style.textAlign = "center";
enhanced_settingsComFeatTitle.style.padding = "0 1rem"
enhanced_settingsComFeatTitle.style.borderBottom = "1px solid rgba(255, 255, 255, 0)"
enhanced_settingsComFeatTitle.addEventListener("click", function() {
    enhanced_settingsContent.innerHTML = ""
    enhanced_settingsContent.scrollTop = 0;
    enhanced_settingsContent.append(enhanced_settingsComFeat)
});
enhanced_settingsNav.append(enhanced_settingsComFeatTitle);

// Navigation - Project Shortcuts
var enhanced_settingsEnhancedTitle = document.createElement("div");
enhanced_settingsEnhancedTitle.className = "pBvcyf QAAyWd";
enhanced_settingsEnhancedTitle.innerHTML = '<span class="mJVLwb">Stadia Enhanced</span>';
enhanced_settingsEnhancedTitle.style.cursor = "pointer";
enhanced_settingsEnhancedTitle.style.userSelect = "none";
enhanced_settingsEnhancedTitle.style.textAlign = "center";
enhanced_settingsEnhancedTitle.style.padding = "0 1rem"
enhanced_settingsEnhancedTitle.style.borderBottom = "1px solid rgba(255, 255, 255, 0)"
enhanced_settingsEnhancedTitle.addEventListener("click", function() {
    enhanced_settingsContent.innerHTML = ""
    enhanced_settingsContent.scrollTop = 0;
    enhanced_settingsContent.append(enhanced_settingsEnhanced)
});
enhanced_settingsNav.append(enhanced_settingsEnhancedTitle);

window.addEventListener("click", function(e) {
    if (e.path.indexOf(enhanced_SettingsDropdown) == -1) {
        enhanced_settingsFrame.style.display = "none";
        enhanced_settingsContent.innerHTML = ""
        enhanced_settingsContent.append(enhanced_settingsShortcut)
        enhanced_SettingsDropdown.firstElementChild.style.color = ""
    }
});

// My Profile - Shortcut to the users profile
var enhanced_UserProfile = document.createElement("div");
enhanced_UserProfile.className = "pBvcyf QAAyWd";
enhanced_UserProfile.id = "enhanced_UserProfile";
enhanced_UserProfile.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb">' + enhanced_lang.userprofile + '</span>';
enhanced_UserProfile.style.cursor = "pointer";
enhanced_UserProfile.style.userSelect = "none";
enhanced_UserProfile.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_UserProfile.tabIndex = "0";
enhanced_UserProfile.addEventListener("click", function() {
    openStadia("profile/" + enhanced_AccountInfo[2]);
});
enhanced_settingsShortcut.append(enhanced_UserProfile);

// Captures - A shortcut to the screenshots & videos of the current user
var enhanced_UserMedia = document.createElement("div");
enhanced_UserMedia.className = "pBvcyf QAAyWd";
enhanced_UserMedia.id = "enhanced_UserMedia";
enhanced_UserMedia.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">camera_alt</i><span class="mJVLwb">' + enhanced_lang.usermedia + '</span>';
enhanced_UserMedia.style.cursor = "pointer";
enhanced_UserMedia.style.userSelect = "none";
enhanced_UserMedia.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_UserMedia.tabIndex = "0";
enhanced_UserMedia.addEventListener("click", function() {
    openStadia("captures");
});
enhanced_settingsShortcut.append(enhanced_UserMedia);

// Speedtest - Shortcut to M-Lab test
var enhanced_speedTest = document.createElement("div");
enhanced_speedTest.className = "pBvcyf QAAyWd";
enhanced_speedTest.id = "enhanced_speedTest";
enhanced_speedTest.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speed</i><span class="mJVLwb">' + enhanced_lang.speedtest + '</span>';
enhanced_speedTest.style.cursor = "pointer";
enhanced_speedTest.style.userSelect = "none";
enhanced_speedTest.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_speedTest.tabIndex = "0";
enhanced_speedTest.addEventListener("click", function() {
    window.open("https://projectstream.google.com/speedtest", "_blank");
});
enhanced_settingsShortcut.append(enhanced_speedTest)

// Community - Shortcut to community page
var enhanced_communityPage = document.createElement("div");
enhanced_communityPage.className = "pBvcyf QAAyWd";
enhanced_communityPage.id = "enhanced_communityPage";
enhanced_communityPage.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">forum</i><span class="mJVLwb">' + enhanced_lang.community + '</span>';
enhanced_communityPage.style.cursor = "pointer";
enhanced_communityPage.style.userSelect = "none";
enhanced_communityPage.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_communityPage.tabIndex = "0";
enhanced_communityPage.addEventListener("click", function() {
    window.open("https://community.stadia.com/", "_blank");
});
enhanced_settingsShortcut.append(enhanced_communityPage)

// GitHub - Shortcut to GitHub project
var enhanced_GitHubLink = document.createElement("div");
enhanced_GitHubLink.className = "pBvcyf QAAyWd";
enhanced_GitHubLink.id = "enhanced_GitHubLink";
enhanced_GitHubLink.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">code</i><span class="mJVLwb">GitHub</span>';
enhanced_GitHubLink.style.cursor = "pointer";
enhanced_GitHubLink.style.userSelect = "none";
enhanced_GitHubLink.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_GitHubLink.tabIndex = "0";
enhanced_GitHubLink.addEventListener("click", function() {
    window.open("https://github.com/ChristopherKlay/StadiaEnhanced", "_blank");
});
enhanced_settingsEnhanced.append(enhanced_GitHubLink);

// Changelog - Shortcut to changelog
var enhanced_ChangelogLink = document.createElement("div");
enhanced_ChangelogLink.className = "pBvcyf QAAyWd";
enhanced_ChangelogLink.id = "enhanced_ChangelogLink";
enhanced_ChangelogLink.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">description</i><span class="mJVLwb">Changelog</span>';
enhanced_ChangelogLink.style.cursor = "pointer";
enhanced_ChangelogLink.style.userSelect = "none";
enhanced_ChangelogLink.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_ChangelogLink.tabIndex = "0";
enhanced_ChangelogLink.addEventListener("click", function() {
    window.open("https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/changelog.md", "_blank");
});
enhanced_settingsEnhanced.append(enhanced_ChangelogLink);

// Bug Report
var enhanced_ReportIssue = document.createElement("div");
enhanced_ReportIssue.className = "pBvcyf QAAyWd";
enhanced_ReportIssue.id = "enhanced_ReportIssue";
enhanced_ReportIssue.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">bug_report</i><span class="mJVLwb">' + enhanced_lang.reportbug + '</span>';
enhanced_ReportIssue.style.cursor = "pointer";
enhanced_ReportIssue.style.userSelect = "none";
enhanced_ReportIssue.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_ReportIssue.tabIndex = "0";
enhanced_ReportIssue.addEventListener("click", function() {
    window.open("https://github.com/ChristopherKlay/StadiaEnhanced/issues", "_blank");
});
enhanced_settingsEnhanced.append(enhanced_ReportIssue);

// BuyMeACoffee - Shortcut to donations
var enhanced_CoffeeLink = document.createElement("div");
enhanced_CoffeeLink.className = "pBvcyf QAAyWd";
enhanced_CoffeeLink.id = "enhanced_ChangelogLink";
enhanced_CoffeeLink.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">coffee</i><span class="mJVLwb">' + enhanced_lang.donations + '</span>';
enhanced_CoffeeLink.style.cursor = "pointer";
enhanced_CoffeeLink.style.userSelect = "none";
enhanced_CoffeeLink.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_CoffeeLink.tabIndex = "0";
enhanced_CoffeeLink.addEventListener("click", function() {
    window.open("https://www.buymeacoffee.com/christopherklay", "_blank");
});
enhanced_settingsEnhanced.append(enhanced_CoffeeLink);

// Codec - Control element for the stream codec
var enhanced_currentCodec = parseInt(localStorage.getItem("enhanced_CodecOption") || 0);
var enhanced_Codec = document.createElement("div");
enhanced_Codec.className = "pBvcyf QAAyWd";
enhanced_Codec.id = "enhanced_Codec";
enhanced_Codec.style.cursor = "pointer";
enhanced_Codec.style.userSelect = "none";
enhanced_Codec.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Codec.tabIndex = "0";
enhanced_Codec.addEventListener("click", function() {
    enhanced_currentCodec = (enhanced_currentCodec + 1) % 3;
    localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
    enhanced_applySettings("codec", enhanced_currentCodec);
});
enhanced_settingsStream.append(enhanced_Codec);

// Resolution - Control element for the stream resolution
localStorage.setItem("enhanced_DeskWidth", window.screen.width);
localStorage.setItem("enhanced_DeskHeight", window.screen.height);
var enhanced_currentRes = parseInt(localStorage.getItem("enhanced_ResOption") || 0);

var enhanced_Resolution = document.createElement("div");
enhanced_Resolution.className = "pBvcyf QAAyWd";
enhanced_Resolution.id = "enhanced_Resolution";
enhanced_Resolution.style.cursor = "pointer";
enhanced_Resolution.style.userSelect = "none";
enhanced_Resolution.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_UserMedia.tabIndex = "0";
enhanced_Resolution.addEventListener("click", function() {
    enhanced_currentRes = (enhanced_currentRes + 1) % 3;
    localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
    enhanced_applySettings("resolution", enhanced_currentRes);
});
enhanced_settingsStream.append(enhanced_Resolution);

var enhanced_resolutionPopup = document.createElement("div");
enhanced_resolutionPopup.id = "enhanced_resolutionPopup";
enhanced_resolutionPopup.className = "HP4yJd heSpB";
enhanced_resolutionPopup.style.cursor = "pointer";
enhanced_resolutionPopup.addEventListener("click", function() {
    enhanced_currentRes = (enhanced_currentRes + 1) % 3;
    localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
    enhanced_applySettings("resolution", enhanced_currentRes);
});

function enhanced_changeResolution() {
    var enhancedinject_currentResolution;
    setInterval(function() {
        var enhancedinject_newResolution = parseInt(localStorage.getItem("enhanced_ResOption"));
        if (enhancedinject_newResolution != enhancedinject_currentResolution) {
            enhancedinject_currentResolution = enhancedinject_newResolution;
            switch (enhancedinject_currentResolution) {
                case 0:
                    var x = parseInt(localStorage.getItem("enhanced_DeskWidth"));
                    var y = parseInt(localStorage.getItem("enhanced_DeskHeight"));
                    break
                case 1:
                    var x = 2560
                    var y = 1440
                    break
                case 2:
                    var x = 3840
                    var y = 2160
                    break
            }

            Object.defineProperty(window.screen, "availWidth", {
                value: x,
                configurable: true
            });
            Object.defineProperty(window.screen, "width", {
                value: x,
                configurable: true
            });
            Object.defineProperty(window.screen, "availHeight", {
                value: y,
                configurable: true
            });
            Object.defineProperty(window.screen, "height", {
                value: y,
                configurable: true
            });
            Object.defineProperty(window.screen, "colorDepth", {
                value: 48
            });
        }
    }, 200);
}
embed(enhanced_changeResolution);

// Stream Monitor Autostart
var enhanced_autostartMonitor = parseInt(localStorage.getItem("enhanced_autostartMonitor") || 0);
var enhanced_monitorStarted = false;
var enhanced_monitorAutostart = document.createElement("div");
enhanced_monitorAutostart.className = "pBvcyf QAAyWd";
enhanced_monitorAutostart.id = "enhanced_monitorAutostart";
enhanced_monitorAutostart.style.cursor = "pointer";
enhanced_monitorAutostart.style.userSelect = "none";
enhanced_monitorAutostart.tabIndex = "0";
enhanced_monitorAutostart.addEventListener("click", function() {
    enhanced_autostartMonitor = (enhanced_autostartMonitor + 1) % 2;
    localStorage.setItem("enhanced_autostartMonitor", enhanced_autostartMonitor);
    enhanced_applySettings("monitorautostart", enhanced_autostartMonitor);
});
enhanced_settingsStream.append(enhanced_monitorAutostart);

// Grid - Control element for the homescreen library grid
var enhanced_GridSize = parseInt(localStorage.getItem("enhanced_GridSize") || 0);
var enhanced_Grid = document.createElement("div");
enhanced_Grid.className = "pBvcyf QAAyWd";
enhanced_Grid.id = "enhanced_Grid";
enhanced_Grid.style.cursor = "pointer";
enhanced_Grid.style.userSelect = "none";
enhanced_Grid.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Grid.tabIndex = "0";
enhanced_Grid.addEventListener("click", function() {
    enhanced_GridSize = (enhanced_GridSize + 1) % 6;
    localStorage.setItem("enhanced_GridSize", enhanced_GridSize);
    enhanced_applySettings("gridsize", enhanced_GridSize)
});
enhanced_settingsGeneral.append(enhanced_Grid);

// Clock - Control element for the clock specific settings
var enhanced_ClockOption = parseInt(localStorage.getItem("enhanced_ClockOption") || 0);
var enhanced_Clock = document.createElement("div");
enhanced_Clock.className = "pBvcyf QAAyWd";
enhanced_Clock.id = "enhanced_Clock";
enhanced_Clock.style.cursor = "pointer";
enhanced_Clock.style.userSelect = "none";
enhanced_Clock.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Clock.tabIndex = "0";
enhanced_Clock.addEventListener("click", function() {
    enhanced_ClockOption = (enhanced_ClockOption + 1) % 4;
    localStorage.setItem("enhanced_ClockOption", enhanced_ClockOption);
    enhanced_applySettings("clock", enhanced_ClockOption);
});
enhanced_settingsGeneral.append(enhanced_Clock);

// Game Filter
var enhanced_filterOption = parseInt(localStorage.getItem("enhanced_filterOption") || 0);
var enhanced_useFilter = document.createElement("div");
enhanced_useFilter.className = "pBvcyf QAAyWd";
enhanced_useFilter.id = "enhanced_useFilter";
enhanced_useFilter.style.cursor = "pointer";
enhanced_useFilter.style.userSelect = "none";
enhanced_useFilter.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_useFilter.tabIndex = "0";
enhanced_useFilter.addEventListener("click", function() {
    enhanced_filterOption = (enhanced_filterOption + 1) % 2;
    localStorage.setItem("enhanced_filterOption", enhanced_filterOption);
    enhanced_applySettings("filter", enhanced_filterOption);
});
enhanced_settingsGeneral.append(enhanced_useFilter)

// Invite Link
var enhanced_InviteURL = "https://stadia.com/link/home?si_rid=" + enhanced_AccountInfo[2];
var enhanced_Invite = document.createElement("div");
enhanced_Invite.className = "pBvcyf QAAyWd";
enhanced_Invite.id = "enhanced_Invite";
enhanced_Invite.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_add</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.invitebase + '</span>';
enhanced_Invite.style.cursor = "pointer";
enhanced_Invite.style.userSelect = "none";
enhanced_Invite.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Invite.tabIndex = "0";
enhanced_Invite.addEventListener("click", function() {
    navigator.clipboard.writeText(enhanced_InviteURL);
    enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb" >' + enhanced_lang.inviteactive + '</span>';
    enhanced_Invite.style.color = "#ff773d";
    setTimeout(function() {
        enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb">' + enhanced_lang.invitebase + '</span>';
        enhanced_Invite.style.color = "";
    }, 1000);
});
enhanced_settingsShortcut.append(enhanced_Invite);

// Reset Settings
var enhanced_resetSettings = document.createElement("div");
enhanced_resetSettings.className = "pBvcyf QAAyWd";
enhanced_resetSettings.id = "enhanced_resetSettings";
enhanced_resetSettings.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings</i><span class="mJVLwb">' + enhanced_lang.resetsettings + '</span>';
enhanced_resetSettings.style.cursor = "pointer";
enhanced_resetSettings.style.userSelect = "none";
enhanced_resetSettings.tabIndex = "0";
enhanced_resetSettings.addEventListener("click", function() {
    if (confirm(enhanced_lang.confirmreset)) {
        enhanced_applySettings("resetall");
    }
});
enhanced_settingsEnhanced.append(enhanced_resetSettings)

// Message Preview
var enhanced_messagePreview = parseInt(localStorage.getItem("enhanced_messagePreview") || 0);
var enhanced_hidePreview = document.createElement("div");
enhanced_hidePreview.className = "pBvcyf QAAyWd";
enhanced_hidePreview.id = "enhanced_hidePreview";
enhanced_hidePreview.style.cursor = "pointer";
enhanced_hidePreview.style.userSelect = "none";
enhanced_hidePreview.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_hidePreview.tabIndex = "0";
enhanced_hidePreview.addEventListener("click", function() {
    enhanced_messagePreview = (enhanced_messagePreview + 1) % 2;
    localStorage.setItem("enhanced_messagePreview", enhanced_messagePreview);
    enhanced_applySettings("messagepreview", enhanced_messagePreview);
});
enhanced_settingsMessages.append(enhanced_hidePreview);

// Quick Reply
var enhanced_useQuickReply = parseInt(localStorage.getItem("enhanced_useQuickReply") || 0);
var enhanced_quickReply = document.createElement("div");
enhanced_quickReply.className = "pBvcyf QAAyWd";
enhanced_quickReply.id = "enhanced_quickReply";
enhanced_quickReply.style.cursor = "pointer";
enhanced_quickReply.style.userSelect = "none";
enhanced_quickReply.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_quickReply.tabIndex = "0";
enhanced_quickReply.addEventListener("click", function() {
    enhanced_useQuickReply = (enhanced_useQuickReply + 1) % 2;
    localStorage.setItem("enhanced_useQuickReply", enhanced_useQuickReply);
    enhanced_applySettings("quickreply", enhanced_useQuickReply);
});
enhanced_settingsMessages.append(enhanced_quickReply);

// In-line image preview
var enhanced_useInlinePreview = parseInt(localStorage.getItem("enhanced_useInlinePreview") || 0);
var enhanced_inlineConvert = document.createElement("div");
enhanced_inlineConvert.className = "pBvcyf QAAyWd";
enhanced_inlineConvert.id = "enhanced_inlineConvert";
enhanced_inlineConvert.style.cursor = "pointer";
enhanced_inlineConvert.style.userSelect = "none";
enhanced_inlineConvert.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_inlineConvert.tabIndex = "0";
enhanced_inlineConvert.addEventListener("click", function() {
    enhanced_useInlinePreview = (enhanced_useInlinePreview + 1) % 2;
    localStorage.setItem("enhanced_useInlinePreview", enhanced_useInlinePreview);
    enhanced_applySettings("inlinepreview", enhanced_useInlinePreview);
});
enhanced_settingsMessages.append(enhanced_inlineConvert);

// Hide: Offline Users
var enhanced_hideOffline = parseInt(localStorage.getItem("enhanced_hideOffline") || 0);
var enhanced_offlineUser = document.createElement("div");
enhanced_offlineUser.className = "pBvcyf QAAyWd";
enhanced_offlineUser.id = "enhanced_lastMessage";
enhanced_offlineUser.style.cursor = "pointer";
enhanced_offlineUser.style.userSelect = "none";
enhanced_offlineUser.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_offlineUser.tabIndex = "0";
enhanced_offlineUser.addEventListener("click", function() {
    enhanced_hideOffline = (enhanced_hideOffline + 1) % 2;
    localStorage.setItem("enhanced_hideOffline", enhanced_hideOffline);
    enhanced_applySettings("offlineusers", enhanced_hideOffline);
});
enhanced_settingsMessages.append(enhanced_offlineUser);

// Hide: Invisible Users
var enhanced_hideInvisible = parseInt(localStorage.getItem("enhanced_hideInvisible") || 0);
var enhanced_invisibleUser = document.createElement("div");
enhanced_invisibleUser.className = "pBvcyf QAAyWd";
enhanced_invisibleUser.id = "enhanced_lastMessage";
enhanced_invisibleUser.style.cursor = "pointer";
enhanced_invisibleUser.style.userSelect = "none";
enhanced_invisibleUser.tabIndex = "0";
enhanced_invisibleUser.addEventListener("click", function() {
    enhanced_hideInvisible = (enhanced_hideInvisible + 1) % 2;
    localStorage.setItem("enhanced_hideInvisible", enhanced_hideInvisible);
    enhanced_applySettings("invisibleusers", enhanced_hideInvisible);
});
enhanced_settingsMessages.append(enhanced_invisibleUser);

// Hide Labels
var enhanced_hideLabel = parseInt(localStorage.getItem("enhanced_hideLabel") || 0);
var enhanced_gameLabel = document.createElement("div");
enhanced_gameLabel.className = "pBvcyf QAAyWd";
enhanced_gameLabel.id = "enhanced_gameLabel";
enhanced_gameLabel.style.cursor = "pointer";
enhanced_gameLabel.style.userSelect = "none";
enhanced_gameLabel.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_gameLabel.tabIndex = "0";
enhanced_gameLabel.addEventListener("click", function() {
    enhanced_hideLabel = (enhanced_hideLabel + 1) % 2;
    localStorage.setItem("enhanced_hideLabel", enhanced_hideLabel);
    enhanced_applySettings("gamelabel", enhanced_hideLabel);
});
enhanced_settingsGeneral.append(enhanced_gameLabel);

// Hide User Media on Homescreen
var enhanced_hideUserMedia = parseInt(localStorage.getItem("enhanced_hideUserMedia") || 0);
var enhanced_mediaPreview = document.createElement("div");
enhanced_mediaPreview.className = "pBvcyf QAAyWd";
enhanced_mediaPreview.id = "enhanced_mediaPreview";
enhanced_mediaPreview.style.cursor = "pointer";
enhanced_mediaPreview.style.userSelect = "none";
enhanced_mediaPreview.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_mediaPreview.tabIndex = "0";
enhanced_mediaPreview.addEventListener("click", function() {
    enhanced_hideUserMedia = (enhanced_hideUserMedia + 1) % 2;
    localStorage.setItem("enhanced_hideUserMedia", enhanced_hideUserMedia);
    enhanced_applySettings("mediapreview", enhanced_hideUserMedia);
});
enhanced_settingsGeneral.append(enhanced_mediaPreview);

// Category Preview
var enhanced_hideCategory = parseInt(localStorage.getItem("enhanced_hideCategory") || 0);
var enhanced_categoryPreview = document.createElement("div");
enhanced_categoryPreview.className = "pBvcyf QAAyWd";
enhanced_categoryPreview.id = "enhanced_categoryPreview";
enhanced_categoryPreview.style.cursor = "pointer";
enhanced_categoryPreview.style.userSelect = "none";
enhanced_categoryPreview.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_categoryPreview.tabIndex = "0";
enhanced_categoryPreview.addEventListener("click", function() {
    enhanced_hideCategory = (enhanced_hideCategory + 1) % 2;
    localStorage.setItem("enhanced_hideCategory", enhanced_hideCategory);
    enhanced_applySettings("categorypreview", enhanced_hideCategory);
});
enhanced_settingsGeneral.append(enhanced_categoryPreview);

// Store-List Split
var enhanced_storeListSize = parseInt(localStorage.getItem("enhanced_storeListSize") || 0);
var enhanced_storeList = document.createElement("div");
enhanced_storeList.className = "pBvcyf QAAyWd";
enhanced_storeList.id = "enhanced_storeList";
enhanced_storeList.style.cursor = "pointer";
enhanced_storeList.style.userSelect = "none";
enhanced_storeList.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_storeList.tabIndex = "0";
enhanced_storeList.addEventListener("click", function() {
    enhanced_storeListSize = (enhanced_storeListSize + 1) % 2;
    localStorage.setItem("enhanced_storeListSize", enhanced_storeListSize);
    enhanced_applySettings("storelist", enhanced_storeListSize);
});
enhanced_settingsGeneral.append(enhanced_storeList);

// Family Sharing Elements
var enhanced_familySharingElements = parseInt(localStorage.getItem("enhanced_familySharingElements") || 0);
var enhanced_hideFamilyElements = document.createElement("div");
enhanced_hideFamilyElements.className = "pBvcyf QAAyWd";
enhanced_hideFamilyElements.id = "enhanced_storeList";
enhanced_hideFamilyElements.style.cursor = "pointer";
enhanced_hideFamilyElements.style.userSelect = "none";
enhanced_hideFamilyElements.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_hideFamilyElements.tabIndex = "0";
enhanced_hideFamilyElements.addEventListener("click", function() {
    enhanced_familySharingElements = (enhanced_familySharingElements + 1) % 2;
    localStorage.setItem("enhanced_familySharingElements", enhanced_familySharingElements);
    enhanced_applySettings("familysharing", enhanced_familySharingElements);
});
enhanced_settingsGeneral.append(enhanced_hideFamilyElements);

// Shortcuts
var enhanced_enableShortcuts = parseInt(localStorage.getItem("enhanced_enableShortcuts") || 0);
var enhanced_showShortcut = document.createElement("div");
enhanced_showShortcut.className = "pBvcyf QAAyWd";
enhanced_showShortcut.id = "enhanced_showShortcut";
enhanced_showShortcut.style.cursor = "pointer";
enhanced_showShortcut.style.userSelect = "none";
enhanced_showShortcut.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_showShortcut.tabIndex = "0";
enhanced_showShortcut.addEventListener("click", function() {
    enhanced_enableShortcuts = (enhanced_enableShortcuts + 1) % 2;
    localStorage.setItem("enhanced_enableShortcuts", enhanced_enableShortcuts);
    enhanced_applySettings("shortcuts", enhanced_enableShortcuts);
});
enhanced_settingsComFeat.append(enhanced_showShortcut);

// StadiaStatsGG
var enhanced_enableStadiaStats = parseInt(localStorage.getItem("enhanced_enableStadiaStats") || 0);
var enhanced_showStadiaStats = document.createElement("div");
enhanced_showStadiaStats.className = "pBvcyf QAAyWd";
enhanced_showStadiaStats.id = "enhanced_showStadiaStats";
enhanced_showStadiaStats.style.cursor = "pointer";
enhanced_showStadiaStats.style.userSelect = "none";
enhanced_showStadiaStats.tabIndex = "0";
enhanced_showStadiaStats.addEventListener("click", function() {
    enhanced_enableStadiaStats = (enhanced_enableStadiaStats + 1) % 2;
    localStorage.setItem("enhanced_enableStadiaStats", enhanced_enableStadiaStats);
    enhanced_applySettings("stadiastats", enhanced_enableStadiaStats);
});
enhanced_settingsComFeat.append(enhanced_showStadiaStats);

// Stream Mode
var enhanced_useStreamMode = parseInt(localStorage.getItem("enhanced_useStreamMode") || 0);
var enhanced_streamMode = document.createElement("div");
enhanced_streamMode.className = "pBvcyf QAAyWd";
enhanced_streamMode.id = "enhanced_streamMode";
enhanced_streamMode.style.cursor = "pointer";
enhanced_streamMode.style.userSelect = "none";
enhanced_streamMode.tabIndex = "0";
enhanced_streamMode.addEventListener("click", function() {
    enhanced_useStreamMode = (enhanced_useStreamMode + 1) % 2;
    localStorage.setItem("enhanced_useStreamMode", enhanced_useStreamMode);
    enhanced_applySettings("streammode", enhanced_useStreamMode);
});
enhanced_settingsGeneral.append(enhanced_streamMode);

// Avatar - Allows the user to set a custom avatar
var enhanced_customAvatar = document.createElement("div");
enhanced_customAvatar.className = "CTvDXd QAAyWd Pjpac GShPJb edaWcd";
enhanced_customAvatar.id = "enhanced_customAvatar";
enhanced_customAvatar.role = "button";
enhanced_customAvatar.innerHTML = '<div class="KEaHo"><span class="X5peoe"><i class="google-material-icons lS1Wre Ce1Y1c xT8eqd" aria-hidden="true">face</i></span><span class="caSJV snByac">' + enhanced_lang.avatar + '</span></div>';
enhanced_customAvatar.tabIndex = "0";
enhanced_customAvatar.addEventListener("click", function() {
    enhanced_avatarURL = prompt(enhanced_lang.avatarpopup)
    if (enhanced_avatarURL != null) {
        if (enhanced_avatarURL.length < 1) {
            enhanced_applySettings("avatar", document.querySelector(".ksZYgc.VGZcUb").style.backgroundImage.replace(/(url\(|\)|")/g, ''));
            localStorage.removeItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"));
        } else {
            localStorage.setItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"), enhanced_avatarURL);
            enhanced_applySettings("avatar", enhanced_avatarURL);
        }
    }
});

// StadiaStatsGG - Profile Link
var enhanced_stadiaStatsProfile = document.createElement("div");
enhanced_stadiaStatsProfile.className = "CTvDXd QAAyWd Pjpac GShPJb edaWcd";
enhanced_stadiaStatsProfile.id = "enhanced_customAvatar";
enhanced_stadiaStatsProfile.role = "button";
enhanced_stadiaStatsProfile.style.display = "none"
enhanced_stadiaStatsProfile.innerHTML = '<div class="KEaHo"><span class="X5peoe"><i class="google-material-icons lS1Wre Ce1Y1c xT8eqd" aria-hidden="true">account_circle</i></span><span class="caSJV snByac">' + enhanced_lang.stadiastats + '</span></div>';
enhanced_stadiaStatsProfile.tabIndex = "0";
enhanced_stadiaStatsProfile.addEventListener("click", function() {
    window.open("https://stadiastats.gg/players/" + enhanced_AccountInfo[2] + "/" + enhanced_AccountInfo[0] + "#" + enhanced_AccountInfo[1], "_blank");
});

// Store Container - Container to display store buttons
var enhanced_StoreContainer = document.createElement("div");
enhanced_StoreContainer.id = "enhanced_ButtonBox";
enhanced_StoreContainer.style.display = "flex";
enhanced_StoreContainer.style.justifyContent = "space-around";
enhanced_StoreContainer.style.gap = "1.5rem";

// Youtube Search
var enhanced_YouTube = document.createElement("div");
enhanced_YouTube.id = "enhanced_YouTube";
enhanced_YouTube.className = "CTvDXd QAAyWd Fjy05d ATH3sf wJYinb rOskPc rpgZzc";
enhanced_YouTube.innerHTML = '<span class="COTyRb">' + enhanced_lang.searchbtnbase + ' YouTube</span>'
enhanced_YouTube.style.cursor = "pointer";
enhanced_YouTube.style.userSelect = "none";
enhanced_YouTube.tabIndex = "0";
enhanced_YouTube.style.backgroundColor = "#c00";
enhanced_YouTube.style.color = "white";
enhanced_YouTube.style.marginTop = "1.5rem";
enhanced_YouTube.addEventListener("click", function() {
    enhanced_GameTitle = document.querySelectorAll(".UG7HXc")[document.querySelectorAll(".UG7HXc").length - 1].textContent;
    window.open("https://www.youtube.com/results?search_query=" + enhanced_GameTitle, "_blank");
});
enhanced_StoreContainer.append(enhanced_YouTube);

// Metacritic Search
var enhanced_Metacritic = document.createElement("div");
enhanced_Metacritic.id = "enhanced_Metacritic";
enhanced_Metacritic.className = "CTvDXd QAAyWd Fjy05d ATH3sf wJYinb rOskPc rpgZzc";
enhanced_Metacritic.innerHTML = '<span class="COTyRb">' + enhanced_lang.searchbtnbase + ' <span style="color: #fc3;">Metacritic</span></span>'
enhanced_Metacritic.style.cursor = "pointer";
enhanced_Metacritic.style.userSelect = "none";
enhanced_Metacritic.tabIndex = "0";
enhanced_Metacritic.style.backgroundColor = "#131416";
enhanced_Metacritic.style.color = "white";
enhanced_Metacritic.style.marginTop = "1.5rem";
enhanced_Metacritic.addEventListener("click", function() {
    enhanced_GameTitle = document.querySelectorAll(".UG7HXc")[document.querySelectorAll(".UG7HXc").length - 1].textContent;
    window.open("https://www.metacritic.com/search/game/" + enhanced_GameTitle + "/results", "_blank");
});
enhanced_StoreContainer.append(enhanced_Metacritic);

// Wishlisting
var enhanced_wishlistContainer = document.createElement("li");
enhanced_wishlistContainer.className = "OfFb0b";
enhanced_wishlistContainer.id = "enhanced_wishlistContainer";
enhanced_wishlistContainer.style.display = "none";
var enhanced_wishlistHeart = document.createElement("div");
enhanced_wishlistContainer.appendChild(enhanced_wishlistHeart);
enhanced_wishlistHeart.className = "ROpnrd QAAyWd wJYinb";
enhanced_wishlistHeart.id = "enhanced_WishlistHeart";
enhanced_wishlistHeart.innerHTML = "";
enhanced_wishlistHeart.style.width = "2.5rem";
enhanced_wishlistHeart.style.padding = "0";
enhanced_wishlistHeart.style.cursor = "pointer";
enhanced_wishlistHeart.style.userSelect = "none";
enhanced_wishlistHeart.tabIndex = "0";
enhanced_wishlistHeart.addEventListener("click", function() {
    var enhanced_wishlist = localStorage.getItem("enhanced_wishlist") || "";
    var enhanced_currentSKU = document.location.href.split("sku/")[1].substring(0, 32);

    if (enhanced_wishlist.includes(enhanced_currentSKU)) {
        enhanced_wishlist = enhanced_wishlist.replace("(" + enhanced_currentSKU + ")", "");
        enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite_border</i>';
        enhanced_wishlistHeart.style.color = "";
    } else {
        enhanced_wishlist += "(" + enhanced_currentSKU + ")";
        enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite</i>';
        enhanced_wishlistHeart.style.color = "#ff773d";
    }
    localStorage.setItem("enhanced_wishlist", enhanced_wishlist);
});
if (document.getElementsByClassName("ZECEje")[0] !== undefined) {
    document.getElementsByClassName("ZECEje")[0].append(enhanced_wishlistContainer);
}

// Account Menu - Changes to the account menu behaviour
enhanced_AccountMenu = document.querySelector(".Zxyh9c");
enhanced_AccountMenu.setAttribute("data-close-if-content-clicked", "false");

// Session Time
var enhanced_sessionTimer = document.createElement("div");
enhanced_sessionTimer.className = "HPX1od";
enhanced_sessionTimer.id = "enhanced_sessionTimer";
enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">00:00:00</span></div>';

// Visibility Filter
var enhanced_showState = false;
enhanced_showAll = document.createElement("span");
enhanced_showAll.id = "enhanced_showAll";
enhanced_showAll.className = 't7ctZ'
enhanced_showAll.innerHTML = '<div role="button" tabindex="0" class="CTvDXd QAAyWd JkRlwc"><i class="material-icons-extended" aria-hidden="true">visibility_off</i></div>';
enhanced_showAll.style.cursor = "pointer";
enhanced_showAll.style.flexGrow = "0"
enhanced_showAll.style.webkitFlexGrow = "0"
enhanced_showAll.addEventListener("click", function() {
    switch (enhanced_showState) {
        case true:
            enhanced_showAll.innerHTML = '<div role="button" style="color: white" tabindex="0" class="CTvDXd QAAyWd JkRlwc"><i class="material-icons-extended" aria-hidden="true">visibility_off</i></div>';
            enhanced_showState = false;
            break
        case false:
            enhanced_showAll.innerHTML = '<div role="button" style="color: #00e0ba" tabindex="0" class="CTvDXd QAAyWd JkRlwc"><i class="material-icons-extended" aria-hidden="true">visibility</i></div>';
            enhanced_showState = true;
            break
    }
});

// List Type Filter
enhanced_activeListFilter = 0;
enhanced_listFilter = document.createElement("div");
enhanced_listFilter.style.display = "flex";

enhanced_listFilterGames = document.createElement("div");
enhanced_listFilterGames.innerHTML = enhanced_lang.games;
enhanced_listFilterGames.className = "Adwm6c";
enhanced_listFilterGames.style.userSelect = "none";
enhanced_listFilterGames.style.marginLeft = "0.75rem";
enhanced_listFilter.append(enhanced_listFilterGames);
enhanced_listFilterGames.addEventListener("click", function() {
    enhanced_switchListFilter(1);
});

enhanced_listFilterAddOns = document.createElement("div");
enhanced_listFilterAddOns.innerHTML = enhanced_lang.addons;
enhanced_listFilterAddOns.className = "Adwm6c";
enhanced_listFilterAddOns.style.userSelect = "none";
enhanced_listFilterAddOns.style.marginLeft = "0.75rem";
enhanced_listFilter.append(enhanced_listFilterAddOns);
enhanced_listFilterAddOns.addEventListener("click", function() {
    enhanced_switchListFilter(2);
});

enhanced_listFilterBundles = document.createElement("div");
enhanced_listFilterBundles.innerHTML = enhanced_lang.bundles;
enhanced_listFilterBundles.className = "Adwm6c";
enhanced_listFilterBundles.style.userSelect = "none";
enhanced_listFilterBundles.style.marginLeft = "0.75rem";
enhanced_listFilter.append(enhanced_listFilterBundles);
enhanced_listFilterBundles.addEventListener("click", function() {
    enhanced_switchListFilter(3);
});

enhanced_listFilterWishlist = document.createElement("div");
enhanced_listFilterWishlist.innerHTML = enhanced_lang.wishlist;
enhanced_listFilterWishlist.className = "Adwm6c";
enhanced_listFilterWishlist.style.userSelect = "none";
enhanced_listFilterWishlist.style.marginLeft = "0.75rem";
enhanced_listFilter.append(enhanced_listFilterWishlist);
enhanced_listFilterWishlist.addEventListener("click", function() {
    enhanced_switchListFilter(4);
});

function enhanced_switchListFilter(type) {
    if (enhanced_activeListFilter != type) {
        switch (type) {
            case 1:
                enhanced_activeListFilter = 1;
                enhanced_listFilterGames.style.color = "white";
                enhanced_listFilterGames.style.textDecoration = "none";
                enhanced_listFilterBundles.style.color = "grey";
                enhanced_listFilterBundles.style.textDecoration = "line-through";
                enhanced_listFilterAddOns.style.color = "grey";
                enhanced_listFilterAddOns.style.textDecoration = "line-through";
                enhanced_listFilterWishlist.style.color = "grey";
                enhanced_listFilterWishlist.style.textDecoration = "line-through";
                enhanced_injectStyle(".h6J22d.undefined.QAAyWd[jslog*='17:2'], .h6J22d.undefined.QAAyWd[jslog*='17:3'], .h6J22d.undefined.QAAyWd[jslog*='17:9'] { display: none }", "enhanced_styleListFilter");
                break
            case 2:
                enhanced_activeListFilter = 2;
                enhanced_listFilterGames.style.color = "grey";
                enhanced_listFilterGames.style.textDecoration = "line-through";
                enhanced_listFilterBundles.style.color = "grey";
                enhanced_listFilterBundles.style.textDecoration = "line-through";
                enhanced_listFilterAddOns.style.color = "white";
                enhanced_listFilterAddOns.style.textDecoration = "none";
                enhanced_listFilterWishlist.style.color = "grey";
                enhanced_listFilterWishlist.style.textDecoration = "line-through";
                enhanced_injectStyle(".h6J22d.undefined.QAAyWd[jslog*='17:1'], .h6J22d.undefined.QAAyWd[jslog*='17:3'] { display: none }", "enhanced_styleListFilter");
                break
            case 3:
                enhanced_activeListFilter = 3;
                enhanced_listFilterGames.style.color = "grey";
                enhanced_listFilterGames.style.textDecoration = "line-through";
                enhanced_listFilterBundles.style.color = "white";
                enhanced_listFilterBundles.style.textDecoration = "none";
                enhanced_listFilterAddOns.style.color = "grey";
                enhanced_listFilterAddOns.style.textDecoration = "line-through";
                enhanced_listFilterWishlist.style.color = "grey";
                enhanced_listFilterWishlist.style.textDecoration = "line-through";
                enhanced_injectStyle(".h6J22d.undefined.QAAyWd[jslog*='17:1'], .h6J22d.undefined.QAAyWd[jslog*='17:2'], .h6J22d.undefined.QAAyWd[jslog*='17:9'] { display: none }", "enhanced_styleListFilter");
                break
            case 4:
                enhanced_activeListFilter = 4;
                enhanced_listFilterGames.style.color = "grey";
                enhanced_listFilterGames.style.textDecoration = "line-through";
                enhanced_listFilterBundles.style.color = "grey";
                enhanced_listFilterBundles.style.textDecoration = "line-through";
                enhanced_listFilterAddOns.style.color = "grey";
                enhanced_listFilterAddOns.style.textDecoration = "line-through";
                enhanced_listFilterWishlist.style.color = "white";
                enhanced_listFilterWishlist.style.textDecoration = "none";
                var enhanced_wishlist = localStorage.getItem("enhanced_wishlist") || "";
                var enhanced_wishlist = enhanced_wishlist.substring(1, enhanced_wishlist.length - 1).split(")(");
                var enhanced_generateStyle = "";

                for (var i = 0; i < enhanced_wishlist.length; i++) {
                    enhanced_generateStyle += 'div[data-sku-id*="' + enhanced_wishlist[i] + '"], '
                }
                enhanced_generateStyle = '.h6J22d.undefined.QAAyWd { display: none; } ' + enhanced_generateStyle.substring(0, enhanced_generateStyle.length - 2) + ' { display: grid !important }';
                enhanced_injectStyle(enhanced_generateStyle, "enhanced_styleListFilter");
        }
    } else {
        enhanced_activeListFilter = 0;
        enhanced_listFilterGames.style.color = "white";
        enhanced_listFilterGames.style.textDecoration = "none";
        enhanced_listFilterBundles.style.color = "white";
        enhanced_listFilterBundles.style.textDecoration = "none";
        enhanced_listFilterAddOns.style.color = "white";
        enhanced_listFilterAddOns.style.textDecoration = "none";
        enhanced_listFilterWishlist.style.color = "white";
        enhanced_listFilterWishlist.style.textDecoration = "none";
        enhanced_injectStyle("", "enhanced_styleListFilter");
    }
}

// Achievements Filter
enhanced_achievementsFilter = document.createElement("div");
enhanced_achievementsFilter.style.display = "flex";

enhanced_unlockedFilter = document.createElement("div");
enhanced_unlockedFilter.state = 0;
enhanced_unlockedFilter.innerHTML = enhanced_lang.show + ": " + enhanced_lang.all;
enhanced_unlockedFilter.className = "Adwm6c";
enhanced_unlockedFilter.style.userSelect = "none";
enhanced_unlockedFilter.style.marginLeft = "0.75rem";
enhanced_unlockedFilter.addEventListener("click", function() {
    if (this.state == 0) {
        enhanced_injectStyle(".h6J22d.cWe8yc.QAAyWd { display: none !important } .h6J22d.cWe8yc.GIh6Af.QAAyWd { display: grid !important }", "unlockedfilter")
        this.state = 1
        this.innerHTML = enhanced_lang.show + ": " + enhanced_lang.locked;
    } else {
        enhanced_injectStyle("", "unlockedfilter")
        this.state = 0
        this.innerHTML = enhanced_lang.show + ": " + enhanced_lang.all;
    }
});
enhanced_achievementsFilter.append(enhanced_unlockedFilter)

// Gamelist Filter
enhanced_gamelistFilter = document.createElement("div");
enhanced_gamelistFilter.style.display = "flex";

enhanced_gameStateFilter = document.createElement("div");
enhanced_gameStateFilter.state = 0;
enhanced_gameStateFilter.innerHTML = enhanced_lang.show + ": " + enhanced_lang.all;
enhanced_gameStateFilter.className = "Adwm6c";
enhanced_gameStateFilter.style.userSelect = "none";
enhanced_gameStateFilter.style.marginLeft = "0.75rem";
enhanced_gameStateFilter.addEventListener("click", function() {
    this.state = (this.state + 1) % 3;
    switch (this.state) {
        case 0:
            this.innerHTML = enhanced_lang.show + ": " + enhanced_lang.all;
            break
        case 1:
            this.innerHTML = enhanced_lang.show + ": " + enhanced_lang.complete;
            break
        case 2:
            this.innerHTML = enhanced_lang.show + ": " + enhanced_lang.incomplete;
            break
    }
});
enhanced_gamelistFilter.append(enhanced_gameStateFilter)

// Shortcut - General
var enhanced_installShortcut = document.createElement("div");
enhanced_installShortcut.className = "CTvDXd QAAyWd Fjy05d ivWUhc wJYinb x8t73b tlZCoe rpgZzc";
enhanced_installShortcut.id = "enhanced_installShortcut";
enhanced_installShortcut.tabIndex = "0";
enhanced_installShortcut.addEventListener("click", function() {
    window.open("https://stadiaicons.web.app/" + enhanced_installShortcut.gameID + "/?fullName=" + encodeURIComponent(enhanced_installShortcut.gameName), "_blank");
});

// Shortcut - Last Played
var enhanced_shortcutLastPlayed = document.createElement("div");
enhanced_shortcutLastPlayed.id = "enhanced_shortcutLastPlayed";
enhanced_shortcutLastPlayed.innerHTML = '<i class="material-icons-extended" aria-hidden="true">get_app</i>';
enhanced_shortcutLastPlayed.tabIndex = "0";
enhanced_shortcutLastPlayed.style.display = "flex";
enhanced_shortcutLastPlayed.style.opacity = "0";
enhanced_shortcutLastPlayed.style.transition = "opacity .23s ease-out";
enhanced_shortcutLastPlayed.style.position = "absolute";
enhanced_shortcutLastPlayed.style.top = "0.5rem";
enhanced_shortcutLastPlayed.style.left = "0.5rem";
enhanced_shortcutLastPlayed.style.background = "#202124";
enhanced_shortcutLastPlayed.style.borderRadius = "50%";
enhanced_shortcutLastPlayed.style.padding = "0.2rem";
enhanced_shortcutLastPlayed.style.cursor = "pointer";
enhanced_shortcutLastPlayed.style.zIndex = "2";
enhanced_shortcutLastPlayed.addEventListener("click", function() {
    window.open("https://stadiaicons.web.app/" + enhanced_shortcutLastPlayed.gameID + "/?fullName=" + encodeURIComponent(enhanced_shortcutLastPlayed.gameName), "_blank");
});

// StadiaStatsGG - Shortcut
var enhanced_stadiaStatsShortcut = document.createElement("div");
enhanced_stadiaStatsShortcut.className = "CTvDXd QAAyWd Fjy05d ivWUhc wJYinb x8t73b tlZCoe rpgZzc";
enhanced_stadiaStatsShortcut.id = "enhanced_stadiaStatsShortcut";
enhanced_stadiaStatsShortcut.innerHTML = enhanced_lang.stadiastatsopen
enhanced_stadiaStatsShortcut.tabIndex = "0";
enhanced_stadiaStatsShortcut.addEventListener("click", function() {
    window.open("https://stadiastats.gg/games/" + enhanced_stadiaStatsShortcut.gameID, "_blank");
});

// Stats Container
var enhanced_statOverview = document.createElement("div");
enhanced_statOverview.className = "MDSsFe URhE4b";
enhanced_statOverview.style.marginBottom = "3.5rem";

// Achievement Statistics
var enhanced_statAchievements = document.createElement("div");
enhanced_statOverview.append(enhanced_statAchievements)

// Playtime Statistics
var enhanced_statPlaytime = document.createElement("div");
enhanced_statOverview.append(enhanced_statPlaytime)

// Capture Filters
var enhanced_activeCapFilter = "none";
enhanced_captureFilters = document.createElement("div");
enhanced_captureFilters.style.display = "flex";

enhanced_captureScreenshot = document.createElement("div");
enhanced_captureScreenshot.id = "enhanced_captureScreenshot";
enhanced_captureScreenshot.className = "ROpnrd QAAyWd wJYinb";
enhanced_captureScreenshot.innerHTML = '<i class="material-icons-extended" aria-hidden="true">image</i>';
enhanced_captureScreenshot.tabIndex = "0";
enhanced_captureScreenshot.style.width = "2.5rem";
enhanced_captureScreenshot.style.padding = "0px";
enhanced_captureScreenshot.style.marginRight = "1rem";
enhanced_captureScreenshot.style.userSelect = "none";
enhanced_captureScreenshot.addEventListener("click", function() {
    if (enhanced_activeCapFilter != "image") {
        enhanced_activeCapFilter = "image";
        enhanced_captureScreenshot.style.color = "#ff773d";
        enhanced_captureClip.style.color = "rgba(255,255,255,.9)";
        enhanced_injectStyle(".MykDQe.QAAyWd.hWAuu.mESdP.d3Yvnc.Lkvyqc.MP0FQb { display: none }", "enhanced_styleCaptureFilter");
    } else {
        enhanced_activeCapFilter = "none";
        enhanced_captureScreenshot.style.color = "rgba(255,255,255,.9)";
        enhanced_injectStyle("", "enhanced_styleCaptureFilter");
    }
});
enhanced_captureFilters.append(enhanced_captureScreenshot);

enhanced_captureClip = document.createElement("div");
enhanced_captureClip.id = "enhanced_captureScreenshot";
enhanced_captureClip.className = "ROpnrd QAAyWd wJYinb";
enhanced_captureClip.innerHTML = '<i class="material-icons-extended" aria-hidden="true">movie</i>';
enhanced_captureClip.tabIndex = "0";
enhanced_captureClip.style.width = "2.5rem";
enhanced_captureClip.style.padding = "0px";
enhanced_captureClip.style.userSelect = "none";
enhanced_captureClip.addEventListener("click", function() {
    if (enhanced_activeCapFilter != "movie") {
        enhanced_activeCapFilter = "movie";
        enhanced_captureScreenshot.style.color = "rgba(255,255,255,.9)";
        enhanced_captureClip.style.color = "#ff773d";
        enhanced_injectStyle(".MykDQe.QAAyWd.hWAuu.mESdP.d3Yvnc.Lkvyqc.GcgHfd { display: none }", "enhanced_styleCaptureFilter");
    } else {
        enhanced_activeCapFilter = "none";
        enhanced_captureClip.style.color = "rgba(255,255,255,.9)";
        enhanced_injectStyle("", "enhanced_styleCaptureFilter");
    }
});
enhanced_captureFilters.append(enhanced_captureClip)

// All Payments
var enhanced_allpayments = document.createElement("span")
enhanced_allpayments.style.position = "absolute"
enhanced_allpayments.style.right = "1.5rem"
enhanced_allpayments.style.color = "rgba(255,255,255,.6)"
enhanced_allpayments.style.fontFamily = "'Google Sans',sans-serif"
enhanced_allpayments.style.fontSize = "1rem"
enhanced_allpayments.style.lineHeight = "1.25rem"
enhanced_allpayments.style.fontWeight = "500"

// Game Count
var enhanced_gameCounter = document.createElement("span")
enhanced_gameCounter.id = "enhanced_gameCounter"
enhanced_gameCounter.style.fontSize = "1rem"
enhanced_gameCounter.style.verticalAlign = "middle"
enhanced_gameCounter.style.transition = "opacity 0.23s ease-out 0s"
enhanced_gameCounter.style.color = "rgba(255,255,255,.6)"

// Total Friend Count
var enhanced_friendCount = document.createElement("span")
enhanced_friendCount.style.color = "rgba(255,255,255,.6)"
enhanced_friendCount.style.marginLeft = "0"

// Letter Box
var enhanced_activeLetter = false
var enhanced_letterBox = document.createElement("div")
enhanced_letterBox.id = "enhanced_letterBox"
enhanced_letterBox.className = "jkwub bJBQjf"
enhanced_letterBox.style.marginRight = "auto"
enhanced_letterBox.style.textIndent = "-0.5rem"
if (!enhanced_supportedLang.includes(enhanced_local)) {
    enhanced_letterBox.style.display = "none"
}

var enhanced_letters = [];
for (var i = 0; i < 26; i++) {
    var el = document.createElement("span")
    el.textContent = String.fromCharCode(65 + i)
    el.letter = i
    el.state = 0
    if (i < 25) {
        el.style.padding = "0 0.5rem"
    } else {
        el.style.padding = "0 0 0 0.5rem"
    }
    el.style.cursor = "pointer"
    el.style.userSelect = "none";
    el.addEventListener("click", function() {
        enhanced_applySettings("letterbox", this.letter + "," + this.state)
    });
    enhanced_letters.push(el)
    enhanced_letterBox.append(el)
}

// Find-a-buddy - Shortcut to stadiastats.gg find-a-buddy service
var enhanced_buddyContainer = document.createElement("li");
enhanced_buddyContainer.className = "OfFb0b";
enhanced_buddyContainer.id = "enhanced_buddyContainer";
enhanced_buddyContainer.style.display = "none"
var enhanced_openBuddy = document.createElement("div");
enhanced_buddyContainer.appendChild(enhanced_openBuddy);
enhanced_openBuddy.className = "ROpnrd QAAyWd wJYinb";
enhanced_openBuddy.id = "enhanced_openBuddy";
enhanced_openBuddy.innerHTML = '<i class="material-icons-extended" aria-hidden="true">group_add</i>';
enhanced_openBuddy.style.width = "2.5rem";
enhanced_openBuddy.style.padding = "0";
enhanced_openBuddy.style.cursor = "pointer";
enhanced_openBuddy.style.userSelect = "none";
enhanced_openBuddy.tabIndex = "0";
enhanced_openBuddy.addEventListener("click", function() {
    window.open('https://stadiastats.gg/find-a-buddy', '_blank');
});
secureInsert(enhanced_buddyContainer, ".ZECEje", 1)

// Favorites
var enhanced_favorite = document.createElement("div");
enhanced_favorite.innerHTML = '<i class="material-icons-extended" aria-hidden="true">star</i>';
enhanced_favorite.id = "enhanced_favorite";
enhanced_favorite.style.position = "absolute";
enhanced_favorite.style.display = "flex";
enhanced_favorite.style.left = "0.5rem"
enhanced_favorite.style.top = "0.5rem"
enhanced_favorite.style.margin = "0.2rem";
enhanced_favorite.style.borderRadius = "50%";
enhanced_favorite.style.padding = "0.2rem";
enhanced_favorite.style.cursor = "pointer";
enhanced_favorite.style.background = "#202124";
enhanced_favorite.style.zIndex = "2";
enhanced_favorite.active = false
enhanced_favorite.addEventListener("click", function() {
    if (this.active) {
        enhanced_favorite.active = false
        enhanced_favorite.style.color = ""
    } else {
        enhanced_favorite.active = true
        enhanced_favorite.style.color = "#00e0ba"
    }
    enhanced_applySettings("favorite", this.sku);
});

// Show/Hide Filter
var enhanced_gameFilter = localStorage.getItem("enhanced_gameFilter") || "";
var enhanced_visibility = document.createElement("div");
enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
enhanced_visibility.id = "enhanced_visibility";
enhanced_visibility.style.position = "absolute";
enhanced_visibility.style.display = "flex";
enhanced_visibility.style.left = "3rem"
enhanced_visibility.style.top = "0.5rem"
enhanced_visibility.style.margin = "0.2rem";
enhanced_visibility.style.borderRadius = "50%";
enhanced_visibility.style.padding = "0.2rem";
enhanced_visibility.style.cursor = "pointer";
enhanced_visibility.style.background = "#202124";
enhanced_visibility.style.zIndex = "2";
enhanced_visibility.active = false
enhanced_visibility.addEventListener("click", function() {
    if (this.active) {
        this.active = false
        this.style.color = ""
        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>'
    } else {
        this.active = true
        this.style.color = "#FF7070"
        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>'
    }

    enhanced_gameFilter = localStorage.getItem("enhanced_gameFilter") || "";
    if (enhanced_gameFilter.includes(this.sku)) {
        enhanced_gameFilter = enhanced_gameFilter.replace("(" + this.sku + ")", "")
        this.title = enhanced_lang.hide + " " + this.name;
        localStorage.setItem("enhanced_gameFilter", enhanced_gameFilter);
    } else {
        enhanced_gameFilter += "(" + this.sku + ")";
        this.title = enhanced_lang.show + " " + this.name;
        localStorage.setItem("enhanced_gameFilter", enhanced_gameFilter);
    }
});

// Load stored settings
if (localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")) !== null) {
    enhanced_applySettings("avatar", localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")));
}

// Apply settings
enhanced_applySettings("updateall");

// After Setup
var enhanced_timerLoadEnd = window.performance.now() - enhanced_timerLoadStart;
console.log("%cStadia Enhanced" + "%c ⏲️ - Start Up: Loaded in " + enhanced_timerLoadEnd.toFixed(2) + "ms.", enhanced_consoleEnhanced, "")
console.groupEnd();
var enhanced_loopCount = 0;
var enhanced_loopTotal = 0;
var enhanced_timerLoopTotal = 0;
var enhanced_sessionStart = 0;
var enhanced_wrappers = [];

// Main Loop
setInterval(function() {
    // Location - Home & Library
    if (document.location.href.indexOf("/home") != -1 || document.location.href.indexOf("/library") != -1) {

        // Game List
        var enhanced_gameList = document.getElementsByClassName("GqLi4d");
        var enhanced_favlist = localStorage.getItem("enhanced_favlist") || "";

        // Resolution change on pop-ups
        secureInsert(enhanced_resolutionPopup, ".EcfBLd", 3);

        // StadiaStatsGG
        if (enhanced_enableStadiaStats == 1) {
            //Shortcut
            if (document.getElementById(enhanced_stadiaStatsShortcut) === null && document.querySelector(".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc")) {
                if (enhanced_stadiaStatsShortcut.gameName != document.querySelector(".Wq73hb").textContent) {
                    enhanced_stadiaStatsShortcut.gameName = document.querySelector(".Wq73hb").textContent
                    enhanced_stadiaStatsShortcut.gameID = document.querySelector(".h1uihb > c-wiz").getAttribute("data-app-id");
                }
                secureInsert(enhanced_stadiaStatsShortcut, 'div[jsaction="JIbuQc:qgRaKd;"]', 0);
                enhanced_stadiaStatsShortcut.style.display = "inline-flex";
            }
        } else {
            enhanced_stadiaStatsShortcut.style.display = "none";
        }

        // Shortcuts
        if (enhanced_enableShortcuts == 1) {
            enhanced_installShortcut.style.display = "inline-flex";
            enhanced_shortcutLastPlayed.style.display = "flex";

            // Popup
            if (document.getElementById(enhanced_installShortcut) === null && document.querySelector(".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc")) {
                if (enhanced_installShortcut.gameName != document.querySelector(".Wq73hb").textContent) {
                    enhanced_installShortcut.gameName = document.querySelector(".Wq73hb").textContent;
                    enhanced_installShortcut.gameID = document.querySelector(".h1uihb > c-wiz").getAttribute("data-app-id");
                    enhanced_installShortcut.innerHTML = '<div class="tYJnXb">' + enhanced_lang.shortcuttitle + ' ' + enhanced_installShortcut.gameName + '</div>';
                }
                secureInsert(enhanced_installShortcut, 'div[jsaction="JIbuQc:qgRaKd;"]', 0);
            }

            // Last Played
            var enhanced_selector = document.getElementsByClassName("mGdxHb ltdNmc");
            if (enhanced_selector[enhanced_selector.length - 1] !== undefined) {
                if (enhanced_selector[enhanced_selector.length - 1].contains(enhanced_shortcutLastPlayed) === false) {
                    enhanced_shortcutLastPlayed.gameName = enhanced_selector[enhanced_selector.length - 1].getAttribute("aria-label").split(": ")[1]
                    enhanced_shortcutLastPlayed.gameID = document.querySelector(".UiBYIe > c-wiz").getAttribute("data-app-id");
                    enhanced_shortcutLastPlayed.title = enhanced_lang.shortcuttitle + " " + enhanced_shortcutLastPlayed.gameName;
                    enhanced_selector[enhanced_selector.length - 1].append(enhanced_shortcutLastPlayed);
                }
            }
        } else {
            enhanced_installShortcut.style.display = "none";
            enhanced_shortcutLastPlayed.style.display = "none";
        }
    }

    // Location - Home
    if (document.location.href.indexOf("/home") != -1) {
        // Remove filter elements
        for (var i = 0; i < enhanced_gameList.length; i++) {
            if (enhanced_gameList[i].style.display = "none") {
                enhanced_gameList[i].style.display = ""
            }
            if (enhanced_gameList[i].style.order = "-1") {
                enhanced_gameList[i].style.order = ""
            }
            var enhanced_hasEmbed = enhanced_gameList[i].getElementsByClassName("enhanced_favIcon")
            if (enhanced_hasEmbed.length != 0) {
                enhanced_hasEmbed[0].remove()
            }
        }
    }

    // Location - Library
    if (document.location.href.indexOf("/library") != -1) {

        // Enable grid size option
        enhanced_Grid.style.display = "block";

        // Game Count
        var enhanced_homescreenGrids = document.getElementsByClassName("lEPylf KnM5Wc")
        if (enhanced_homescreenGrids.length > 0) {
            enhanced_homescreenGrids = enhanced_homescreenGrids[enhanced_homescreenGrids.length - 1].querySelectorAll(".GqLi4d").length
            enhanced_gameCounter.textContent = " (" + enhanced_homescreenGrids + ")"
            secureInsert(enhanced_gameCounter, "div[jsname='HXYfLc'] .HZ5mJ", 0)
        }

        // Letter Box
        secureInsert(enhanced_letterBox, ".w83WBe.URhE4b", 1)

        // Add Show-All Button
        secureInsert(enhanced_showAll, ".w83WBe.URhE4b", 0)
        if (enhanced_filterOption == 0) {
            enhanced_showAll.style.display = "none";
            enhanced_showState = false;
        } else {
            enhanced_showAll.style.display = "inline-block";
        }

        // Favorite - Last Played
        if (document.querySelector(".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc")) {
            if (enhanced_favorite.name != document.querySelector(".Wq73hb").textContent) {
                enhanced_favorite.name = document.querySelector(".Wq73hb").textContent
                enhanced_favorite.sku = document.querySelector(".h1uihb > c-wiz").getAttribute("data-sku-id");

                if (enhanced_favlist.includes(enhanced_favorite.sku)) {
                    enhanced_favorite.active = true
                    enhanced_favorite.style.color = "#00e0ba"
                } else {
                    enhanced_favorite.active = false
                    enhanced_favorite.style.color = ""
                }
            }
            secureInsert(enhanced_favorite, 'div[jsaction="JIbuQc:qgRaKd;"]', 0);
        }

        // Show/Hide Filter - Last Played
        enhanced_gameFilter = localStorage.getItem("enhanced_gameFilter") || "";
        if (document.querySelector(".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc") && enhanced_filterOption == 1) {
            if (enhanced_visibility.sku != document.querySelector(".h1uihb > c-wiz").getAttribute("data-sku-id")) {
                enhanced_visibility.sku = document.querySelector(".h1uihb > c-wiz").getAttribute("data-sku-id");
                enhanced_visibility.name = document.querySelector(".Wq73hb").textContent

                if (enhanced_gameFilter.includes(enhanced_visibility.sku)) {
                    enhanced_visibility.active = true
                    enhanced_visibility.style.color = "#FF7070"
                    enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>'
                } else {
                    enhanced_visibility.active = false
                    enhanced_visibility.style.color = ""
                    enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>'
                }
            }
            secureInsert(enhanced_visibility, 'div[jsaction="JIbuQc:qgRaKd;"]', 0);
        }

        // Loop through game tiles
        for (var i = 0; i < enhanced_gameList.length; i++) {

            // Favorite - Order
            var enhanced_hasEmbed = enhanced_gameList[i].getElementsByClassName("enhanced_favIcon")
            if (enhanced_favlist.includes(enhanced_gameList[i].getAttribute("jsdata").split(";")[1])) {
                enhanced_gameList[i].style.order = "-1";

                if (enhanced_hasEmbed.length == 0) {
                    var enhanced_favIcon = document.createElement("div")
                    enhanced_favIcon.className = "enhanced_favIcon"
                    enhanced_favIcon.innerHTML = '<i class="google-material-icons" style="transform: scale(.7); vertical-align: middle; color: #202124;" aria-hidden="true">star</i>'
                    enhanced_favIcon.style.display = "inline-flex"
                    enhanced_favIcon.style.position = "absolute"
                    enhanced_favIcon.style.width = "1.125rem"
                    enhanced_favIcon.style.height = "1.125rem"
                    enhanced_favIcon.style.top = "0.5rem"
                    enhanced_favIcon.style.backgroundColor = "rgba(255,255,255,.9)"
                    enhanced_favIcon.style.right = "0.5rem"
                    enhanced_favIcon.style.border = "0.125rem solid rgba(255,255,255,.9)"
                    enhanced_favIcon.style.borderRadius = "50%"
                    enhanced_favIcon.style.boxShadow = "0 0.125rem 0.75rem rgb(0 0 0 / 32%), 0 0.0625rem 0.375rem rgb(0 0 0 / 18%)"
                    enhanced_favIcon.style.alignItems = "center"
                    enhanced_favIcon.style.justifyContent = "center"
                    enhanced_gameList[i].append(enhanced_favIcon)
                }
            } else {
                enhanced_gameList[i].style.order = "";
                if (enhanced_hasEmbed.length != 0) {
                    enhanced_hasEmbed[0].remove()
                }
            }

            // Filter order/visibility
            if (enhanced_gameFilter.includes(enhanced_gameList[i].getAttribute("jsdata").split(";")[1]) && enhanced_showState === false && enhanced_filterOption == 1) {
                enhanced_gameList[i].style.display = "none";
            } else {
                if (enhanced_activeLetter) {
                    enhanced_ariaLabel = enhanced_gameList[i].getAttribute("aria-label")
                    if ('en|sv|fr|it|es|da|ca|pt|no|fi'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.split(" ")[1].charAt(0).toUpperCase()
                    } else if ('pl'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.split(" ")[2].charAt(0).toUpperCase()
                    } else if ('de|hu|nl'.includes(enhanced_local)) {
                        enhanced_ariaLetter = enhanced_ariaLabel.charAt(0).toUpperCase()
                    }

                    if (enhanced_ariaLetter == String.fromCharCode(65 + parseInt(enhanced_activeLetter)).toUpperCase()) {
                        enhanced_gameList[i].style.display = ""
                    } else {
                        enhanced_gameList[i].style.display = "none"
                    }
                } else {
                    enhanced_gameList[i].style.display = ""
                }
            }

            // Set brightness of filtered items
            if (enhanced_gameFilter.includes(enhanced_gameList[i].getAttribute("jsdata").split(";")[1]) && enhanced_filterOption == 1) {
                enhanced_gameList[i].style.filter = "brightness(40%) grayscale(100%)";
            } else {
                enhanced_gameList[i].style.filter = "none";
            }
        }
    } else {
        enhanced_Grid.style.display = "none";
    }

    // Location - In-Game
    if (document.location.href.indexOf("/player/") != -1) {
        enhanced_Windowed.style.display = "flex";
        enhanced_Monitor.style.display = "flex";
        secureInsert(enhanced_Windowed, ".E0Zk9b", 0);
        secureInsert(enhanced_Monitor, ".E0Zk9b", 0);

        // Clock
        if (enhanced_ClockOption == 2 || enhanced_ClockOption == 3) {
            secureInsert(enhanced_ClockOverlay, ".bYYDgf", 0);
            enhanced_ClockOverlay.style.display = "flex";
        }

        // Stream Monitor
        if (enhanced_autostartMonitor == 1 && enhanced_monitorStarted == false) {
            enhanced_monitorStarted = true;
            enhanced_monitorState = 1;
            enhanced_updateMonitor(enhanced_monitorState);
        }

        // Session Time
        if (enhanced_sessionStart == 0) {
            enhanced_sessionStart = new Date().getTime();
        } else {
            var enhanced_sessionDur = new Date().getTime();
            enhanced_sessionDur = enhanced_formatTime((enhanced_sessionDur - enhanced_sessionStart) / 1000);
            enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_sessionDur + '</span></div>';
        }

        // Session Timer
        secureInsert(enhanced_sessionTimer, ".OWVtN", 0);

        // Menu Monitor
        secureInsert(enhanced_menuMonitor, ".OWVtN", 0);
    } else {
        enhanced_Windowed.style.display = "none";
        enhanced_Monitor.style.display = "none";
        enhanced_ClockOverlay.style.display = "none";
        enhanced_monitorStarted = false;
        enhanced_monitorState = 0;
        enhanced_sessionStart = 0;
        enhanced_updateMonitor(enhanced_monitorState);
    }

    // Location - Captures
    if (document.location.href.indexOf("/captures") != -1) {
        // Captures Filter
        secureInsert(enhanced_captureFilters, ".dwGRGd", 0);
    }

    // Location - Profile Details
    if (document.location.href.match("profile.[0-9]+.detail") != null) {
        secureInsert(enhanced_achievementsFilter, ".dwGRGd", 2);
    }

    // Location - Store Details
    if (document.location.href.indexOf("/store/details/") != -1) {

        // Database Infos
        if (enhanced_database) {
            for (var i = 0; i < enhanced_database.length; i++) {
                if (enhanced_database[i].id == document.location.href.split("details/")[1].split('/')[0]) {
                    var enhanced_databaseDetails = '<div class="CVVXfc"><h2 class="HZ5mJ">' + enhanced_lang.extdetail + '</h2></div>'

                    if (enhanced_database[i].maxRes != "") {
                        enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">' + enhanced_lang.maxresolution + '</div><div class="tM4Phe">' + enhanced_database[i].maxRes + '</div></div>'
                    }
                    if (enhanced_database[i].fps4K != "") {
                        enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">' + enhanced_lang.fps4K + '</div><div class="tM4Phe">' + enhanced_database[i].fps4K + '</div></div>'
                    }
                    if (enhanced_database[i].hdr != "") {
                        enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">HDR/SDR</div><div class="tM4Phe">' + enhanced_database[i].hdr + '</div></div>'
                    }
                    if (enhanced_database[i].note != "") {
                        enhanced_databaseDetails += '<div class="gERVd"><div class="BKyVrb">Notes</div><div class="tM4Phe">' + enhanced_database[i].note + '</div></div>'
                    }

                    if (enhanced_extendedDetails.innerHTML != enhanced_databaseDetails) {
                        enhanced_extendedDetails.innerHTML = enhanced_databaseDetails
                    }
                }
                secureInsert(enhanced_extendedDetails, ".Dbr3vb.URhE4b.bqgeJc.wGziQb", 0)
                secureInsert(enhanced_extendedDisclaimer, ".Dbr3vb.URhE4b.bqgeJc.wGziQb", 0)
            }
        }

        // Wishlist Startup
        if (enhanced_wishlistHeart.innerHTML == "") {
            var enhanced_wishlist = localStorage.getItem("enhanced_wishlist") || "";
            var enhanced_currentSKU = document.location.href.split("sku/")[1].split('?')[0];
            if (enhanced_wishlist.includes(enhanced_currentSKU)) {
                enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite</i>';
                enhanced_wishlistHeart.style.color = "#ff773d";
            } else {
                enhanced_wishlistHeart.innerHTML = '<i class="material-icons-extended" aria-hidden="true">favorite_border</i>';
                enhanced_wishlistHeart.style.color = "";
            }
            enhanced_wishlistContainer.style.display = "inline-block";
        }

        secureInsert(enhanced_StoreContainer, ".WjVJKd", 0);
    } else {
        // Reset extended game info
        enhanced_extendedDetails.innerHTML = "";

        // Wishlist Startup
        enhanced_wishlistContainer.style.display = "none";
        enhanced_wishlistHeart.innerHTML = "";
    }

    // Location - Store List
    if (document.location.href.indexOf("/list") != -1) {
        // List Filters
        secureInsert(enhanced_listFilter, ".dwGRGd", 2);
    } else if (enhanced_activeListFilter != 0) {
        enhanced_switchListFilter(enhanced_activeListFilter);
    }

    // Location - Pro Games
    if (document.location.href.indexOf("/store/list/2001") != -1) {

        // UI changes and count of currently unclaimed games
        document.querySelector(".ZECEje > li:nth-child(3) > a").classList.remove("YySNWc");
        enhanced_ProGamesLink.classList.add("YySNWc");
        if (document.querySelector(".alEDLe") !== null) {
            count = document.querySelector(".alEDLe").querySelectorAll('.X5624d').length;
            if (count != 0 && enhanced_ProGames.innerHTML.indexOf(count) == -1) {
                enhanced_ProGamesLink.textContent = 'Pro (' + count + ")";
            }
        }
    } else {
        enhanced_ProGamesLink.classList.remove("YySNWc");
        if (enhanced_ProGamesLink.textContentL != "Pro") {
            enhanced_ProGamesLink.textContent = "Pro";
        }
    }

    // Location - Personal Profile
    if (document.location.href.indexOf("/profile/" + enhanced_AccountInfo[2]) != -1) {

        // Add avatar option on own profile
        secureInsert(enhanced_customAvatar, ".R1HPhd.bYsRUc.bqgeJc.wGziQb .hX4jqb", 0);

        // Add StadiaStatsGG Profile
        if (enhanced_enableStadiaStats == 1) {
            secureInsert(enhanced_stadiaStatsProfile, ".R1HPhd.bYsRUc.bqgeJc.wGziQb .hX4jqb", 0);
            enhanced_stadiaStatsProfile.style.display = "flex"
        } else {
            enhanced_stadiaStatsProfile.style.display = "none"
        }
    }

    // Location - Player Statistics
    if (document.location.href.indexOf("/gameactivities/all") != -1) {

        // Game Statistics
        if (document.querySelector(".MDSsFe") !== null) {

            // Gamelist Filter
            secureInsert(enhanced_gamelistFilter, ".dwGRGd", 2)

            var enhanced_gameListBaseQuery = document.querySelectorAll("div[jsname='jlb53b']")[document.querySelectorAll("div[jsname='jlb53b']").length - 1];
            var enhanced_gameListRatioQuery = enhanced_gameListBaseQuery.querySelectorAll(".kPtFV");

            for (var i = 0; i < enhanced_gameListRatioQuery.length; i++) {
                var enhanced_compRatio = enhanced_gameListRatioQuery[i].querySelector(".bn3lwc").textContent / enhanced_gameListRatioQuery[i].querySelector(".IBMKhc").textContent.substring(1)
                switch (enhanced_gameStateFilter.state) {
                    case 0:
                        enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = "block"
                        break
                    case 1:
                        if (enhanced_compRatio != 1) {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = "none"
                        } else {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = "block"
                        }
                        break
                    case 2:
                        if (enhanced_compRatio == 1) {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = "none"
                        } else {
                            enhanced_gameListRatioQuery[i].closest('c-wiz[jsrenderer="XBSGie"]').style.display = "block"
                        }
                        break
                }
            }

            var enhanced_noAchievements = document.querySelectorAll('c-wiz[jsrenderer="XBSGie"]')
            for (var i = 0; i < enhanced_noAchievements.length; i++) {
                if (enhanced_noAchievements[i].querySelectorAll(".kPtFV").length == 0) {
                    if (enhanced_gameStateFilter.state > 0) {
                        enhanced_noAchievements[i].style.display = "none"
                    } else {
                        enhanced_noAchievements[i].style.display = "block"
                    }
                }
            }

            // Container
            secureInsert(enhanced_statOverview, ".dkZt0b.qRvogc", 2)

            // Playtime Calculation
            var enhanced_statsBaseQuery = document.querySelectorAll("div[jsname='jlb53b']")[document.querySelectorAll("div[jsname='jlb53b']").length - 1];
            var enhanced_timeQuery = enhanced_statsBaseQuery.querySelectorAll(".eUhXn");
            var enhanced_statsPlaytime = 0;
            var enhanced_timesAvailable = false

            for (var i = 0; i < enhanced_timeQuery.length; i++) {
                var split = enhanced_timeQuery[i].textContent.split(/[\s]/)
                if (split.length == 4) {
                    var enhanced_hoursLabel = split[1]
                    var enhanced_minutesLabel = split[3]
                    enhanced_timesAvailable = true
                        //console.log("Hours: [" + enhanced_hoursLabel + "] Minutes: [" + enhanced_minutesLabel + "]")
                    break
                }
            }

            if (enhanced_timesAvailable) {
                for (var i = 0; i < enhanced_timeQuery.length; i++) {
                    var enhanced_titlePlaytime = enhanced_timeQuery[i].textContent.replace(".", "").split(/[\s]/);

                    switch (enhanced_titlePlaytime.length) {
                        case 2:
                            if (enhanced_titlePlaytime[1] == enhanced_minutesLabel) {
                                enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0] * 60);
                            } else if (enhanced_titlePlaytime[1] == enhanced_hoursLabel) {
                                enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0] * 3600);
                            } else {
                                enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0]);
                            }
                            break
                        case 4:
                            enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[0] * 3600);
                            enhanced_statsPlaytime += parseInt(enhanced_titlePlaytime[2] * 60);
                            break
                    }
                }
                enhanced_statsPlaytime = enhanced_secondsToHms(enhanced_statsPlaytime)

                var enhanced_loadStats = '\
                    <div class="xsbfy" style="margin-bottom: 1rem;">\
                        <div class="qKSMec">\
                            <i class="google-material-icons QxsLuc" aria-hidden="true">schedule</i>\
                            <div class="kPtFV">\
                                <span class="bn3lwc">' + enhanced_statsPlaytime[0] + " " + enhanced_hoursLabel + '</span>\
                                <span class="IBMKhc">/' + enhanced_statsPlaytime[1] + " " + enhanced_minutesLabel + ' ' + enhanced_lang.totalPlayTime + '</span>\
                            </div>\
                        </div>\
                    </div>'

                if (enhanced_statPlaytime.innerHTML != enhanced_loadStats) {
                    enhanced_statPlaytime.innerHTML = enhanced_loadStats;
                }
            }

            // Achievements
            var enhanced_statsBaseQuery = document.querySelectorAll("div[jsname='jlb53b']")[document.querySelectorAll("div[jsname='jlb53b']").length - 1];
            var enhanced_statsOwned = enhanced_statsBaseQuery.childElementCount;
            var enhanced_statsAchievementQuery = enhanced_statsBaseQuery.querySelectorAll(".kPtFV");

            if (enhanced_statsAchievementQuery.length > 0) {
                var enhanced_statsUnlock = 0;
                var enhanced_statsTotal = 0;
                var enhanced_statsFinished = 0;
                for (var i = 0; i < enhanced_statsAchievementQuery.length; i++) {
                    var enhanced_statsTitleUnlock = parseInt(enhanced_statsAchievementQuery[i].firstChild.textContent);
                    var enhanced_statsTitleTotal = parseInt(enhanced_statsAchievementQuery[i].lastChild.textContent.substring(1));
                    if (enhanced_statsTitleUnlock == enhanced_statsTitleTotal) {
                        enhanced_statsFinished++;
                    }
                    enhanced_statsUnlock += enhanced_statsTitleUnlock;
                    enhanced_statsTotal += enhanced_statsTitleTotal;

                }
                var enhanced_statsUnlockRate = (enhanced_statsUnlock * 100) / enhanced_statsTotal;
                var enhanced_statsFinishRate = (enhanced_statsFinished * 100) / enhanced_statsOwned;

                var enhanced_loadStats = '\
                    <div class="HZ5mJ">Statistics</div>\
                    <div class="xsbfy" style="margin-bottom: 1rem;">\
                        <div class="qKSMec">\
                            <i class="google-material-icons QxsLuc" aria-hidden="true">stars</i>\
                            <div class="kPtFV">\
                                <span class="bn3lwc">' + enhanced_statsFinished + '</span>\
                                <span class="IBMKhc">/' + enhanced_statsOwned + ' ' + enhanced_lang.gamesfinished + '</span>\
                            </div>\
                        </div>\
                        <div class="WTRpgf">\
                            <div class="d50Cgd VwFGMb">\
                                <div class="hPTRZ Jc3yuc">\
                                    <div class="FxJ5Tc y2VB6d" style="width: ' + enhanced_statsFinishRate + '%;"></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="xsbfy" style="margin-bottom: 1rem;">\
                        <div class="qKSMec">\
                            <i class="google-material-icons QxsLuc" aria-hidden="true">trophy</i>\
                            <div class="kPtFV">\
                                <span class="bn3lwc">' + enhanced_statsUnlock + '</span>\
                                <span class="IBMKhc">/' + enhanced_statsTotal + ' ' + enhanced_lang.achievementsunlocked + '</span>\
                            </div>\
                        </div>\
                        <div class="WTRpgf">\
                            <div class="d50Cgd VwFGMb">\
                                <div class="hPTRZ Jc3yuc">\
                                    <div class="FxJ5Tc y2VB6d" style="width: ' + enhanced_statsUnlockRate + '%;"></div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>'
                if (enhanced_statAchievements.innerHTML != enhanced_loadStats) {
                    enhanced_statAchievements.innerHTML = enhanced_loadStats;
                }
            }
        }
    }

    // Location - Stadia Menu
    if (document.querySelector(".X1asv.ahEBEd.LJni0").style.opacity == "1") {

        // Offline Users
        var enhanced_statusList = document.querySelectorAll(".eXdFqc .rtsndf.WTetv .DfyMcd");
        for (var i = 0; i < enhanced_statusList.length; i++) {
            if (parseInt(localStorage.getItem("enhanced_hideOffline") || 0) == 1) {
                enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: none !important");
            } else {
                enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: flex");
            }
        }

        // Invisible Users
        var enhanced_statusList = document.querySelectorAll(".eXdFqc .UxR5ob.m8Kzt");
        for (var i = 0; i < enhanced_statusList.length; i++) {
            if (enhanced_statusList[i].childElementCount == 1) {
                if (parseInt(localStorage.getItem("enhanced_hideInvisible") || 0) == 1) {
                    enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: none !important");
                } else {
                    enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: flex");
                }
            }
        }

        // Total Friend Count
        var i = document.getElementsByClassName("Y1rZWd  PuD06d").length
        if (i > 0) {
            var enhanced_friendStatus = document.querySelector(".VE7aje")
            if (enhanced_friendStatus.textContent.slice(-1) == ")") {
                enhanced_friendStatus.textContent = enhanced_friendStatus.textContent.slice(0, -1)
            }

            enhanced_friendCount.textContent = ", " + i + " " + enhanced_lang.total.toLowerCase() + ")"
            secureInsert(enhanced_friendCount, ".VE7aje", 2)
        }

        // Links 2 Images
        if (enhanced_useInlinePreview == 1) {
            var enhanced_linkedURL = document.querySelectorAll(".lwvtBe a");
            for (var i = 0; i < enhanced_linkedURL.length; i++) {
                if (enhanced_linkedURL[i].href.match(/\.(jpeg|jpg|gif|png)$/) != null && enhanced_linkedURL[i].childElementCount == 0) {
                    var enhanced_imagePreview = document.createElement("img");
                    enhanced_imagePreview.src = enhanced_linkedURL[i].href;
                    enhanced_imagePreview.style.width = "100%";
                    var enhanced_imagePrevLink = document.createElement("a");
                    enhanced_imagePrevLink.href = enhanced_linkedURL[i].href;
                    enhanced_imagePrevLink.target = "_blank";
                    enhanced_imagePrevLink.append(enhanced_imagePreview);

                    if (enhanced_linkedURL[i].parentNode.textContent.replace(enhanced_linkedURL[i].href, "") != "") {
                        enhanced_imagePreview.style.borderRadius = "0.5rem";
                        enhanced_linkedURL[i].innerHTML = enhanced_imagePreview.outerHTML;
                    } else {
                        enhanced_imagePreview.style.borderRadius = "0.5rem 0.5rem 0 0.5rem";
                        enhanced_linkedURL[i].closest(".wJVlXc").prepend(enhanced_imagePrevLink);
                        enhanced_linkedURL[i].closest(".FPgvD").remove();
                    }
                }
            }
        }

        // Emoji Picker
        secureInsert(enhanced_emojiswitch, ".IRyDt", 0);
        secureInsert(enhanced_emojiPicker, ".pwUBOe.t7snHe", 2);

        // Clock
        secureInsert(enhanced_ClockFriends, ".hxhAyf.OzUE7e.XY6ZL", 0);
    }

    // Location - Settings
    if (document.location.href.indexOf("/settings") != -1) {

        // Resolution - Enable "Up to 4K" option
        var enhanced_selector = document.getElementsByClassName("sx2eZe QAAyWd aKIhz OWB6Me")
        if (enhanced_selector.length != 0) {
            enhanced_selector[0].setAttribute("data-disabled", "false");
            enhanced_selector[0].classList.remove("OWB6Me");
        }

        // Total Payments
        var enhanced_purchaseList = document.getElementsByClassName("kgmzdc")[document.getElementsByClassName("kgmzdc").length - 1]
        if (enhanced_purchaseList) {
            var enhanced_purchaseEntries = enhanced_purchaseList.getElementsByClassName('l6cQMc')
            if (enhanced_purchaseEntries.length != 0) {
                var enhanced_currency = enhanced_purchaseEntries[0].querySelector('.o2NwGe').textContent.replace(/[0-9].*[0-9]/, 'CUR')
                var enhanced_payments = [];

                for (var i = 0; i < enhanced_purchaseEntries.length; i++) {
                    if (enhanced_purchaseEntries[i].querySelector(".v3rApc.Wh3gGb") == null) {
                        var enhanced_purchaseAmount = enhanced_purchaseEntries[i].querySelector('.o2NwGe')
                        if (enhanced_purchaseAmount.textContent.match(/[,].*[.]/)) {
                            enhanced_payments.push(parseFloat(enhanced_purchaseAmount.textContent.replace(/[^0-9,. ]+/, '').replace(",", "")))
                        } else {
                            enhanced_payments.push(parseFloat(enhanced_purchaseAmount.textContent.replace(/[^0-9,. ]+/, '').replace(",", ".")))
                        }
                    }
                }

                var enhanced_paytotal = enhanced_payments.reduce((a, b) => a + b, 0).toFixed(2)
                enhanced_paytotal = enhanced_lang.total + " " + enhanced_currency.replace('CUR', enhanced_paytotal)

                enhanced_allpayments.textContent = enhanced_paytotal
                secureInsert(enhanced_allpayments, ".Ca4K1", 0)
            }
        }
    }


    // Location - Always active

    // StadiaStatsGG - Find-a-buddy
    if (enhanced_enableStadiaStats == 1) {
        enhanced_buddyContainer.style.display = "inline-block"
    } else {
        enhanced_buddyContainer.style.display = "none"
    }

    // Codec - Set codec preference
    switch (parseInt(localStorage.getItem("enhanced_CodecOption") || 0)) {
        case 0:
            if (document.location.href.indexOf("/home") != -1) {
                localStorage.removeItem("video_codec_implementation_by_codec_key");
            }
            break
        case 1:
            localStorage.setItem("video_codec_implementation_by_codec_key", '{"vp9":"ExternalDecoder"}');
            localStorage.setItem("video_codec_implementation_by_codec_key_using_local_check", '{"vp9":"ExternalDecoder"}');
            localStorage.setItem("video_codec_implementation_by_codec_key_using_media_capabilities", '{"vp9":"ExternalDecoder"}');
            break
        case 2:
            localStorage.setItem("video_codec_implementation_by_codec_key", '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}');
            localStorage.setItem("video_codec_implementation_by_codec_key_using_local_check", '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}');
            localStorage.setItem("video_codec_implementation_by_codec_key_using_media_capabilities", '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}');
            break
    }

    // Clock Widget - Update to current time / display option
    var enhanced_Date = new Date();
    switch (enhanced_ClockMode) {
        case 0:
            var enhanced_CurrentTime = enhanced_Date.toLocaleTimeString('en-GB');
            break
        case 1:
            var enhanced_CurrentTime = enhanced_Date.toLocaleTimeString('en-US');
            break
    }
    enhanced_ClockFriends.innerHTML = '<i class="material-icons-extended" aria-hidden="true" style="margin-right: 0.5rem;">schedule</i>' + enhanced_CurrentTime;
    enhanced_ClockOverlay.innerHTML = enhanced_CurrentTime;
}, 200);

function enhanced_applySettings(set, opt) {
    switch (set) {
        case "codec":
            switch (opt) {
                case 0:
                    enhanced_Codec.style.color = "";
                    enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.codec + ': ' + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'Automatic'.", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_Codec.style.color = "#00e0ba";
                    enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.codec + ': VP9<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'VP9'.", enhanced_consoleEnhanced, "");
                    break
                case 2:
                    enhanced_currentRes = 0;
                    localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
                    enhanced_applySettings("resolution", enhanced_currentRes);
                    enhanced_Codec.style.color = "#00e0ba";
                    enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.codec + ': H264<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'H264'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "resolution":
            switch (opt) {
                case 0:
                    enhanced_Resolution.style.color = "";
                    enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.resolution + ': ' + enhanced_lang.native + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>';
                    enhanced_resolutionPopup.innerHTML = '<div class="oOMRTd"><i class="material-icons-extended STPv1" aria-hidden="true" style="vertical-align: bottom;">monitor</i></div><div class="zvRH1b">' + enhanced_lang.resolution + ': ' + enhanced_lang.native + '</div>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to 'Native'.", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_currentCodec = 1;
                    localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
                    enhanced_applySettings("codec", enhanced_currentCodec);
                    enhanced_Resolution.style.color = "#00e0ba";
                    enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.resolution + ': 1440p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>';
                    enhanced_resolutionPopup.innerHTML = '<div class="oOMRTd"><i class="material-icons-extended STPv1" aria-hidden="true" style="vertical-align: bottom;">monitor</i></div><div class="zvRH1b">' + enhanced_lang.resolution + ': 1440p</div>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '2560x1440'.", enhanced_consoleEnhanced, "");
                    break
                case 2:
                    enhanced_currentCodec = 1;
                    localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
                    enhanced_applySettings("codec", enhanced_currentCodec);
                    enhanced_Resolution.style.color = "#00e0ba";
                    enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.resolution + ': 2160p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>';
                    enhanced_resolutionPopup.innerHTML = '<div class="oOMRTd"><i class="material-icons-extended STPv1" aria-hidden="true" style="vertical-align: bottom;">monitor</i></div><div class="zvRH1b">' + enhanced_lang.resolution + ': 2160p</div>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '3840x2160'.", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "monitorautostart":
            switch (opt) {
                case 0:
                    enhanced_monitorAutostart.style.color = "";
                    enhanced_monitorAutostart.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.streammon + ": " + enhanced_lang.manual + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Monitor Start: Set to 'Manual'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_monitorAutostart.style.color = "#00e0ba";
                    enhanced_monitorAutostart.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.streammon + ": " + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Monitor Start: Set to 'Auto'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "gridsize":
            switch (opt) {
                case 0:
                    enhanced_Grid.style.color = "";
                    enhanced_CSS = ""
                    break;
                case 1:
                    enhanced_Grid.style.color = "#00e0ba";
                    enhanced_CSS = ".lEPylf.KnM5Wc { grid-template-columns: repeat(15,minmax(auto,7.8125rem)) !important; }"
                    break;
                case 2:
                    enhanced_Grid.style.color = "#00e0ba";
                    enhanced_CSS = ".lEPylf.KnM5Wc { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; }"
                    break;
                case 3:
                    enhanced_Grid.style.color = "#00e0ba";
                    enhanced_CSS = ".lEPylf.KnM5Wc { grid-template-columns: repeat(21,minmax(auto,7.8125rem)) !important; }"
                    break;
                case 4:
                    enhanced_Grid.style.color = "#00e0ba";
                    enhanced_CSS = ".lEPylf.KnM5Wc { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; }"
                    break;
                case 5:
                    enhanced_Grid.style.color = "#00e0ba";
                    enhanced_CSS = ".lEPylf.KnM5Wc { grid-template-columns: repeat(12,minmax(auto,7.8125rem)) !important; }"
                    enhanced_CSS += "@media (min-width: 1280px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(15,minmax(auto,7.8125rem)) !important; } }"
                    enhanced_CSS += "@media (min-width: 1920px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; } }"
                    enhanced_CSS += "@media (min-width: 2560px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(21,minmax(auto,7.8125rem)) !important; } }"
                    enhanced_CSS += "@media (min-width: 3840px) { .lEPylf.KnM5Wc { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; } }"
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleGrid");

            if (opt < 1) {
                enhanced_gridOption = enhanced_lang.default
            } else if (opt < 5) {
                enhanced_gridOption = enhanced_GridSize + 4
            } else {
                enhanced_gridOption = enhanced_lang.responsive
            }

            enhanced_Grid.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_comfy</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.gridsize + ': ' + enhanced_gridOption + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.griddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': 4</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Library Grid Size: Set to " + enhanced_gridOption + ".", enhanced_consoleEnhanced, "");
            break
        case "clock":
            switch (opt) {
                case 0:
                    enhanced_Clock.style.color = "";
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    enhanced_ClockFriends.style.display = "none";
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_Clock.style.color = "#00e0ba";
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.friendslist + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    enhanced_ClockFriends.style.display = "flex";
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Friendlist'", enhanced_consoleEnhanced, "");
                    break
                case 2:
                    enhanced_Clock.style.color = "#00e0ba";
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.igoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    enhanced_ClockFriends.style.display = "none";
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'In-Game Overlay'", enhanced_consoleEnhanced, "");
                    break
                case 3:
                    enhanced_Clock.style.color = "#00e0ba";
                    enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.listoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    enhanced_ClockFriends.style.display = "flex";
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Menu & Overlay'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "filter":
            switch (opt) {
                case 0:
                    enhanced_useFilter.style.color = "";
                    enhanced_useFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_useFilter.style.color = "#00e0ba";
                    enhanced_useFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Enabled'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "messagepreview":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_hidePreview.style.color = "";
                    enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Message Preview: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".lzIqJf .DvD76d { display: none; } .lzIqJf .xzJkDf { display: none; }"
                    enhanced_hidePreview.style.color = "#00e0ba";
                    enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Message Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleMsgPreview");
            break
        case "quickreply":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_quickReply.style.color = "";
                    enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Quick Reply: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".bbVL5c { display: none !important; }"
                    enhanced_quickReply.style.color = "#00e0ba";
                    enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Quick Reply: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleQuickReply");
            break
        case "inlinepreview":
            switch (opt) {
                case 0:
                    enhanced_inlineConvert.style.color = "";
                    enhanced_inlineConvert.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">insert_photo</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.inlineimage + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.inlinedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - In-line Image Preview: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_inlineConvert.style.color = "#00e0ba";
                    enhanced_inlineConvert.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">insert_photo</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.inlineimage + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.inlinedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - In-line Image Preview: Set to 'Enabled'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "offlineusers":
            switch (opt) {
                case 0:
                    enhanced_offlineUser.style.color = "";
                    enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Offline Users: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_offlineUser.style.color = "#00e0ba";
                    enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Offline Users: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "invisibleusers":
            switch (opt) {
                case 0:
                    enhanced_invisibleUser.style.color = "";
                    enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Invisible Users: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_invisibleUser.style.color = "#00e0ba";
                    enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Invisible Users: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "gamelabel":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_gameLabel.style.color = "";
                    enhanced_gameLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.gamelabel + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.gamelabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Game Labels: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".lEPylf.YOW9Fd .a1l9D, .X9cRic, .lEPylf.YOW9Fd .D01DPc, .lEPylf.KnM5Wc .a1l9D, .lEPylf.KnM5Wc .D01DPc { display: none; }"
                    enhanced_gameLabel.style.color = "#00e0ba";
                    enhanced_gameLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.gamelabel + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.gamelabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Game Labels: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleGameLabel");
            break
        case "mediapreview":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_mediaPreview.style.color = "";
                    enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Media Preview: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".ctThpb.lEPylf { display: none; }"
                    enhanced_mediaPreview.style.color = "#00e0ba";
                    enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Media Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleMediaPreview");
            break
        case "categorypreview":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_categoryPreview.style.color = "";
                    enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Category Preview: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".lEPylf.YOW9Fd .ssR8Bc { display: none !important; }"
                    enhanced_categoryPreview.style.color = "#00e0ba";
                    enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Category Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleCategoryPreview");
            break
        case "storelist":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_storeList.style.color = "";
                    enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Split Store Lists: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".alEDLe.URhE4b .h6J22d { float: left; width: calc(50% - 1rem); margin: 0.5rem; }"
                    enhanced_storeList.style.color = "#00e0ba";
                    enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Split Store Lists: Set to 'Enabled'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleStoreSplit");
            break
        case "familysharing":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_hideFamilyElements.style.color = "";
                    enhanced_hideFamilyElements.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">family_restroom</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.familyelements + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.familyelementsdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Family Sharing Elements: Set to 'Visible'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".HP4yJd.heSpB, .HP4yJd.AQVgjb, .oYqfsf.heSpB, .lEPylf.qtpabb { display: none; } #enhanced_resolutionPopup { display: flex !important; }"
                    enhanced_hideFamilyElements.style.color = "#00e0ba";
                    enhanced_hideFamilyElements.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">family_restroom</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.familyelements + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.familyelementsdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Family Sharing Elements: Set to 'Hidden'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleFamilyElements");
            break
        case "shortcuts":
            switch (opt) {
                case 0:
                    enhanced_showShortcut.style.color = "";
                    enhanced_showShortcut.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">get_app</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.shortcut + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.shortcutdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Shortcuts: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_showShortcut.style.color = "#00e0ba";
                    enhanced_showShortcut.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">get_app</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.shortcut + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.shortcutdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Shortcuts: Set to 'Enabled'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "stadiastats":
            switch (opt) {
                case 0:
                    enhanced_showStadiaStats.style.color = "";
                    enhanced_showStadiaStats.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">analytics</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.stadiastats + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.stadiastatsdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - StadiaStatsGG: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_showStadiaStats.style.color = "#00e0ba";
                    enhanced_showStadiaStats.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">analytics</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.stadiastats + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.stadiastatsdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - StadiaStatsGG: Set to 'Enabled'", enhanced_consoleEnhanced, "");
                    break
            }
            break
        case "streammode":
            switch (opt) {
                case 0:
                    enhanced_CSS = ""
                    enhanced_streamMode.style.color = "";
                    enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Mode: Set to 'Disabled'", enhanced_consoleEnhanced, "");
                    break
                case 1:
                    enhanced_CSS = ".lzIqJf .Y1rZWd, .gI3hkd, .Uwaqdf, .KW2hBe, .DlMyQd.cAx65e, .DlMyQd.KPQoWd, .kBJKIf span, .CVhnkf, .h6J22d.BM7p1d.QAAyWd > .zRamU { filter: blur(0.25rem) brightness(1.2); text-shadow: 0.5rem 0px; }"
                    enhanced_streamMode.style.color = "#00e0ba";
                    enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: calc(90% - 3rem); white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
                    console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Mode: Set to 'Enabled'", enhanced_consoleEnhanced, "");
                    break
            }
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleStreamMode");
            break
        case "letterbox":
            var opt = opt.split(",")
            for (var i = 0; i < enhanced_letters.length; i++) {
                if (opt[1] < 2) {
                    if (i == opt[0]) {
                        enhanced_letters[i].style.color = ""
                        enhanced_letters[i].state = 2
                        enhanced_activeLetter = opt[0]
                    } else {
                        enhanced_letters[i].style.color = "rgba(255,255,255,.2)"
                        enhanced_letters[i].state = 1
                    }
                } else {
                    enhanced_letters[i].style.color = ""
                    enhanced_letters[i].state = 0
                    enhanced_activeLetter = false
                }
            }
            break
        case "avatar":
            enhanced_CSS = '.ksZYgc.VGZcUb { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.rybUIf { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.dOyvbe { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.RUdg0d { background-image: url("' + opt + '") !important; }' // Livestream Overview
            enhanced_CSS += '.Nv1Sab[alt$="' + enhanced_AccountInfo[0] + '"] { content: url("' + opt + '") !important; }'
            enhanced_CSS += 'c-wiz[data-p*="' + enhanced_AccountInfo[2] + '"] .XZRzG { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.SAPaEd.bYsRUc div[jsdata*="' + enhanced_AccountInfo[2] + '"] .PwtJse { background-image: url("' + opt + '") !important; }'
            enhanced_CSS += '.Tidcwc > .Y1rZWd.mZLJyd .Fnd1Pd.rnWGL { background-image: url("' + opt + '") !important; }' // Group Avatar
            enhanced_CSS += '.mcaxA.ZmeF9 div:first-child { background-image: url("' + opt + '") !important; }'
            enhanced_injectStyle(enhanced_CSS, "enhanced_styleAvatar");
            console.log("%cStadia Enhanced" + "%c ⚙️ - Avatar changed to: " + opt, enhanced_consoleEnhanced, "");
            break
        case "favorite":
            var enhanced_favlist = localStorage.getItem("enhanced_favlist") || "";
            if (enhanced_favlist.includes(opt)) {
                enhanced_favlist = enhanced_favlist.replace("(" + opt + ")", "");
            } else {
                enhanced_favlist += "(" + opt + ")";
            }
            localStorage.setItem("enhanced_favlist", enhanced_favlist);
            break
        case "resetall":
            Object.keys(localStorage).forEach(function(key) {
                if (key.includes("enhanced")) {
                    console.log(localStorage.removeItem(key));
                }
            });
            location.reload();
            break
        case "updateall":
            enhanced_updateMonitor(0)
            enhanced_applySettings("gridsize", enhanced_GridSize);
            enhanced_applySettings("clock", enhanced_ClockOption);
            enhanced_applySettings("filter", enhanced_filterOption);
            enhanced_applySettings("resolution", enhanced_currentRes);
            enhanced_applySettings("codec", enhanced_currentCodec);
            enhanced_applySettings("messagepreview", enhanced_messagePreview);
            enhanced_applySettings("gamelabel", enhanced_hideLabel);
            enhanced_applySettings("quickreply", enhanced_useQuickReply);
            enhanced_applySettings("offlineusers", enhanced_hideOffline);
            enhanced_applySettings("invisibleusers", enhanced_hideInvisible);
            enhanced_applySettings("usermedia", enhanced_hideUserMedia);
            enhanced_applySettings("streammode", enhanced_useStreamMode);
            enhanced_applySettings("categorypreview", enhanced_hideCategory);
            enhanced_applySettings("monitorautostart", enhanced_autostartMonitor);
            enhanced_applySettings("storelist", enhanced_storeListSize);
            enhanced_applySettings("shortcuts", enhanced_enableShortcuts);
            enhanced_applySettings("stadiastats", enhanced_enableStadiaStats);
            enhanced_applySettings("inlinepreview", enhanced_useInlinePreview);
            enhanced_applySettings("familysharing", enhanced_familySharingElements);
            enhanced_applySettings("mediapreview", enhanced_hideUserMedia);
            break
    }
}

function enhanced_injectStyle(content, id) {
    if (content) {
        if (document.getElementById(id)) {
            var el = document.getElementById(id);
        } else {
            var el = document.createElement('style');
            document.head.appendChild(el);
        }
        el.type = 'text/css';
        el.id = id;
        if (el.innerHTML != content) {
            el.innerHTML = content;
        }
    } else {
        if (document.getElementById(id)) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        }
    }
}

function openStadia(url) {
    // Keep hl parameter
    enhanced_urlBase = document.querySelector("head > base").getAttribute("href")
    enhanced_urlHL = new URL(window.location.href).searchParams.get('hl')
    if (enhanced_urlHL) {
        enhanced_urlBase = new URL(enhanced_urlBase + url);
        enhanced_urlBase.searchParams.set('hl', enhanced_urlHL)
        window.open(enhanced_urlBase, "_self");
    } else {
        window.open(enhanced_urlBase + url, "_self");
    }
}

// Embed scripts to execute on the websites layer
function embed(fn, enhanced_sessionActive = true) {
    const script = document.createElement("script");
    if (enhanced_sessionActive === true) {
        script.text = `(${fn.toString()})();`;
    } else {
        script.text = `${fn.toString()}`;
    }
    document.documentElement.appendChild(script);
}

function secureInsert(el, sel, opt = 0) {
    var selector = document.querySelectorAll(sel)
    var target = selector[selector.length - 1];
    if (target && el) {
        switch (opt) {
            case 0: // Append
                if (el.parentNode != target) {
                    target.append(el);
                }
                break
            case 1: // Prepend
                if (el.parentNode != target) {
                    target.prepend(el);
                }
                break
            case 2: // Insert After
                if (target.parentNode != el.parentNode) {
                    target.parentNode.insertBefore(el, target.nextSibling);
                }
                break
            case 3: // Insert Before
                if (target.parentNode != el.parentNode) {
                    target.parentNode.insertBefore(el, target);
                }
                break
        }
    }
}

function enhanced_loadDatabase(csv) {
    // Load and process data
    var result = [];
    var data = csv.split("\n")
    for (var i = 1; i < data.length; i++) {
        split = data[i].split(",")
        var json = {
            name: split[0],
            maxRes: split[1],
            fps4K: split[2],
            hdr: split[3],
            id: split[4],
            note: split[5]
                .replace("Specs confirmed by devs/pubs", enhanced_lang.noteOne)
                .replace("Pixel Count", enhanced_lang.noteTwo)
                .replace("60FPS in 1080p mode", enhanced_lang.noteThree)
                .replace("30FPS in 1080p mode", enhanced_lang.noteFour)
                .replace("Performance/Quality toggle", enhanced_lang.noteFive)
                .replace("No HDR settings", enhanced_lang.noteSix)
                .replace("Not compatible with 4K mode", enhanced_lang.noteSeven)
                .replaceAll(" | ", ", ")
        }
        result.push(json)
    }
    enhanced_database = result
}

function enhanced_formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds);
}

function enhanced_loadUserInfo() {
    var enhanced_scriptLoad = document.querySelectorAll("script[nonce]");
    var info = [];
    for (var i = 0; i < enhanced_scriptLoad.length; i++) {
        if (enhanced_scriptLoad[i].text.includes("AF_initDataCallback({key: 'ds:1'")) {
            var nametag = enhanced_scriptLoad[i].text.split('[["').pop().split('"]')[0].split('","');
            var id = enhanced_scriptLoad[i].text.split('false,null,"').pop().split('"')[0];
            info.push(nametag[0]);
            info.push(nametag[1]);
            info.push(id);
            return info;
        }
    }
}

// Convert Time
function enhanced_secondsToHms(sec) {
    var h = Math.floor(sec / 3600);
    var m = Math.floor(sec % 3600 / 60);
    var s = Math.floor(sec % 3600 % 60);
    return [h, m, s];
}

// Dragable Objects
function enhanced_dragElement(el) {
    var pos = [0, 0, 0, 0];
    if (document.getElementById(el.id)) {
        document.getElementById(el.id).onmousedown = enhanced_dragMouseDown;
    } else {
        el.onmousedown = enhanced_dragMouseDown;
    }

    function enhanced_dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos[2] = e.clientX;
        pos[3] = e.clientY;
        document.onmouseup = enhanced_closeDragElement;
        document.onmousemove = enhanced_elementDrag;
    }

    function enhanced_elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos[0] = pos[2] - e.clientX;
        pos[1] = pos[3] - e.clientY;
        pos[2] = e.clientX;
        pos[3] = e.clientY;
        el.style.top = Math.min(Math.max(el.offsetTop - pos[1], 0), screen.availHeight - el.offsetHeight) + "px";
        el.style.left = Math.min(Math.max(el.offsetLeft - pos[0], 0), screen.availWidth - el.offsetWidth) + "px";
    }

    function enhanced_closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Debugging - Call via "debugEnhanced(); on Stadia
function debugEnhanced(opt) {
    var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
    switch (opt) {
        case "translation":
            // Translations
            console.groupCollapsed("Stadia Enhanced: Translation Output");
            var languages = ["fr", "nl", "sv", "pt", "ca", "da", "it", "es", "de", "ru", "hu", "en"];
            for (var i = 0; i < languages.length; i++) {
                debug_load = enhancedTranslate(languages[i], true);
            }
            console.groupEnd();
            break
    }
}
embed(debugEnhanced, 0);

// Translation
function enhancedTranslate(lang, log = false) {
    // Debug
    var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
    var lang_load = window.performance.now();

    // Load defaults
    var translation = {
        default: 'Default',
        native: 'Native',
        hide: 'Hide',
        show: 'Show',
        total: 'Total',
        visible: 'Visible',
        hidden: 'Hidden',
        enabled: 'Enabled',
        disabled: 'Disabled',
        auto: 'Automatic',
        manual: 'Manual',
        all: 'All',
        locked: 'Locked',
        complete: 'Complete',
        incomplete: 'Incomplete',
        games: 'Games',
        allgames: 'All Games',
        leavepro: 'Leaving Pro',
        bundles: 'Bundles',
        addons: 'Add-ons',
        wishlist: 'Wishlist',
        responsive: 'Responsive',
        windowed: 'Windowed Mode',
        fullscreen: 'Fullscreen',
        onsale: 'On Sale',
        prodeals: 'Pro Deals',
        userprofile: 'My Profile',
        usermedia: 'Captures & game states',
        searchbtnbase: 'Search on',
        avatarpopup: 'New avatar URL (empty for default):',
        sessiontime: 'Session time',
        codec: 'Codec',
        resolution: 'Resolution',
        hardware: 'Hardware',
        software: 'Software',
        trafficsession: 'Session traffic',
        trafficcurrent: 'Current traffic',
        trafficaverage: 'Average traffic',
        packetloss: 'Packets lost',
        framedrop: 'Frames dropped',
        latency: 'Latency',
        jitter: 'Jitter Buffer',
        decodetime: 'Decoding Time',
        compression: 'Compression',
        streammon: 'Stream Monitor',
        stream: 'Stream',
        extdetail: 'Extended Details',
        maxresolution: 'Maximum Resolution',
        fps4K: 'Framerate @ 4K',
        datadiscl: 'This is the maximum framerate achieved when playing a game in 4K mode (must be a Pro subscriber).\
                    On games with a resolution/framerate toggle, resolution was picked. \
                    This data is provided by <a href="https://twitter.com/OriginaIPenguin" target="_blank">@OriginaIPenguin</a> \
                    and the full database can be found <a href="https://airtable.com/shr32bmiOThVvSGar/tblAeJTnP2bzZyews" target="_blank">here</a>.',
        noteOne: 'Specs confirmed by devs/pubs',
        noteTwo: 'Pixel Count',
        noteThree: '60FPS in 1080p mode',
        noteFour: '30FPS in 1080p mode',
        noteFive: 'Performance/Quality toggle',
        noteSix: 'No HDR settings',
        noteSeven: 'Not compatible with 4K mode',
        community: 'Community',
        speedtest: 'Speedtest',
        quickaccess: 'Quick Access',
        messages: 'Messages',
        comfeature: "Community Features",
        avatar: 'Avatar',
        interface: 'Interface',
        shortcut: 'StadiaIcons',
        shortcuttitle: 'Install a shortcut for',
        shortcutdesc: 'Allows you to install a shortcut for a game on your device.',
        stadiastats: 'StadiaStats',
        stadiastatsopen: 'View on StadiaStats.GG',
        stadiastatsdesc: 'Enables direct shortcuts to game statistics, link to your profile and the find-a-buddy system on stadiastats.gg.',
        gridsize: 'Grid Size',
        griddesc: 'Changes the amount of games per row in the library.',
        clock: 'Clock',
        clockdesc: 'Displays the current time on the friends list, as a in-game overlay, or both.',
        friendslist: 'Friends List',
        igoverlay: 'In-Game Overlay',
        listoverlay: 'List & Overlay',
        filter: 'Game Filter',
        filterdesc: 'Allows you to sort your library by hiding games. The filter can be toggled via the symbol, top-right above your games in the library.',
        invitebase: 'Copy invite link',
        inviteactive: 'Copied!',
        gamelabel: 'Game Labels',
        gamelabeldesc: 'Removes labels like "Pro" from games on the homescreen.',
        homegallery: 'User Gallery',
        homegallerydesc: 'Hides the "Captures" area at the bottom of the homescreen.',
        quickprev: 'Message Preview',
        quickprevdesc: 'Hides the message preview in the friends list.',
        quickrep: 'Quick Reply',
        quickrepdesc: 'Hides the quick reply option in chats.',
        offlinefriend: 'Offline Friends',
        offlinefrienddesc: 'Hides offline friends in the friends list.',
        invisiblefriend: 'Invisible Friends',
        invisiblefrienddesc: 'Hides friends with unknown online status in the friends list.',
        streammode: 'Streaming Mode',
        streammodedesc: 'Enable to make certain elements (i.e. the friends list) unreadable while streaming (via tools like OBS / Discord).',
        catprev: 'Category Preview',
        catprevdesc: 'Hides the category tags when hovering over a game.',
        streammondesc: 'Activate to start the monitor whenever a game starts.',
        resolutiondesc: 'The targeted resolution for game streams. 1440p and 2160p require VP9.',
        codecdesc: 'The codec used for game streams.',
        confirmreset: 'Are you sure you want to reset the settings?',
        gamesfinished: 'Games Finished',
        achievementsunlocked: 'Achievements Unlocked',
        totalPlayTime: 'Total Playtime',
        splitstore: 'Split Store Lists',
        splitstoredesc: 'Splits store lists into two columns for a better overview.',
        inlineimage: 'Image Preview',
        inlinedesc: 'Replaces image links for common file formats (jpg/gif/png) with a clickable preview.',
        familyelements: 'Family-sharing options',
        familyelementsdesc: 'Hides the "Share this game with family" options.',
        donations: 'Donations',
        reportbug: 'Report a bug',
        resetsettings: 'Reset Settings'
    }

    // Load translation
    var translate_load = {};
    switch (lang) {
        case 'de': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/13
            translate_load = {
                default: 'Standard',
                native: 'Nativ',
                hide: 'Verstecke',
                show: 'Zeige',
                total: 'Gesamt',
                visible: 'Sichtbar',
                hidden: 'Versteckt',
                enabled: 'Aktiviert',
                disabled: 'Deaktiviert',
                auto: 'Automatisch',
                manual: 'Manuell',
                all: 'Alle',
                locked: "Gesperrt",
                complete: 'Vollständig',
                incomplete: 'Unvollständig',
                games: 'Spiele',
                allgames: 'Alle Spiele',
                leavepro: 'Verlässt Pro',
                bundles: 'Bundles',
                addons: 'Add-ons',
                wishlist: 'Wunschliste',
                responsive: 'Responsiv',
                windowed: 'Fenster Modus',
                fullscreen: 'Vollbild',
                onsale: 'Im Angebot',
                prodeals: 'Pro Angebote',
                userprofile: 'Mein Profil',
                usermedia: 'Aufnahmen und Spielstatus',
                searchbtnbase: 'Suche auf',
                avatarpopup: 'Neue Avatar URL (keine für Zurücksetzung):',
                sessiontime: 'Sitzungszeit',
                codec: 'Codec',
                resolution: 'Auflösung',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Sitzungs-Traffic',
                trafficcurrent: 'Derzeitiger Traffic',
                trafficaverage: 'Durchschnittlicher Traffic',
                packetloss: 'Paketverlust',
                framedrop: 'Verlorene Frames',
                latency: 'Latenz',
                jitter: 'Jitter-Puffer',
                decodetime: 'Dekodierungs Zeit',
                compression: 'Kompression',
                streammon: 'Stream Monitor',
                stream: 'Stream',
                extdetail: 'Erweiterte Details',
                maxresolution: 'Maximale Auflösung',
                fps4K: 'Framerate @ 4K',
                datadiscl: 'Dies ist die im 4K Modus (Stadia Pro benötigt) maximal erreichbare Framerate.\
                            In Spielen mit Qualität/Performance Option, wurde Qualität gewählt. \
                            Diese Daten werden durch <a href="https://twitter.com/OriginaIPenguin" target="_blank">@OriginaIPenguin</a> bereitgestellt, \
                            die vollständige Ansicht befindet sich <a href="https://airtable.com/shr32bmiOThVvSGar/tblAeJTnP2bzZyews" target="_blank">hier</a>.',
                noteOne: 'Spezifikationen von Entwickler/Publisher bestätigt',
                noteTwo: 'Pixel Zählung',
                noteThree: '60 FPS im 1080p Modus',
                noteFour: '30 FPS im 1080p Modus',
                noteFive: 'Leistung / Qualität umschaltbar',
                noteSix: 'Keine HDR Einstellungen',
                noteSeven: 'Nicht kompatibel mit 4K Modus',
                community: 'Community',
                speedtest: 'Geschwindigkeitstest',
                quickaccess: 'Schnellzugriff',
                messages: 'Nachrichten',
                comfeature: "Community Funktionen",
                avatar: 'Avatar',
                interface: 'Oberfläche',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Installiere eine Verknüpfung für',
                shortcutdesc: 'Erlaubt das Erstellen einer Verknüpfung von Spielen auf dem Gerät.',
                stadiastats: 'StadiaStats',
                stadiastatsopen: 'Auf StadiaStats.GG ansehen',
                stadiastatsdesc: 'Stellt Statistiken für Spiele, eine Verknüpfung zum Profil und einen Weg Mitspieler zu finden via stadiastats.gg bereit.',
                gridsize: 'Rastergröße',
                griddesc: 'Ändert die Anzahl der Spiele pro Reihe in der Übersicht der Mediathek.',
                clock: 'Uhr',
                clockdesc: 'Zeigt die Uhrzeit in der Freundesliste, als Einblendung im Spiel, oder beides.',
                friendslist: 'Freundesliste',
                igoverlay: 'Spiel Einblendung',
                listoverlay: 'Liste & Einblendung',
                filter: 'Spiele Filter',
                filterdesc: 'Erlaubt das Sortieren der Mediathek durch Verstecken von Spielen.',
                invitebase: 'Einladungslink kopieren',
                inviteactive: 'Kopiert!',
                gamelabel: 'Spiele Beschriftung',
                gamelabeldesc: 'Entfernt Beschriftungen wie "Pro" von Spielen auf dem Startbildschirm.',
                homegallery: 'Nutzer Galerie',
                homegallerydesc: 'Versteckt den "Aufnahmen" Bereich am unteren Ende des Startbildschirmes.',
                quickprev: 'Nachrichten Vorschau',
                quickprevdesc: 'Versteckt die Vorschau der letzten Nachricht in der Freundesliste.',
                quickrep: 'Schnellantwort',
                quickrepdesc: 'Versteckt die Antwortvorschläge in Chats.',
                inlineimage: 'Bilder Vorschau',
                inlinedesc: 'Ersetzt Links zu Bildern wenn möglich mit einer klickbaren Vorschau.',
                offlinefriend: 'Offline Freunde',
                offlinefrienddesc: 'Versteckt offline Freunde in der Freundesliste.',
                invisiblefriend: 'Unsichtbare Freunde',
                invisiblefrienddesc: 'Versteckt Freunde ohne bekannten online Status in der Freundesliste.',
                streammode: 'Streaming Modus',
                streammodedesc: 'Aktivieren um bestimmte Elemente (z.B. die Freundesliste) während des Streamens (über z.B. OBS / Discord) unleserlich zu machen.',
                catprev: 'Kategorie Vorschau',
                catprevdesc: 'Entfernt die Anzeige der Kategorien bei Spielen auf dem Startbildschirm.',
                streammondesc: 'Aktivieren um den Streaming Monitor beim Starten von Spielen automatisch zu starten.',
                resolutiondesc: 'Die angezielte Auflösung für Spiele. 1440p und 2160p benötigen VP9.',
                codecdesc: 'Der für Spiele genutzte Codec.',
                confirmreset: 'Möchtest du die Einstellungen sicher zurücksetzen?',
                gamesfinished: 'Spiele Abgeschlossen',
                achievementsunlocked: 'Erfolge Freigeschaltet',
                totalPlayTime: 'Gesamtspielzeit',
                splitstore: 'Store Listen teilen',
                splitstoredesc: 'Teilt Listen im Store für eine bessere Übersicht in zwei Spalten.',
                inlineimage: 'Vorschau für Bilder',
                inlinedesc: 'Ersetzt Bilder in gängigen Formaten (jpg/gif/png) mit einer klickbaren Vorschau.',
                familyelements: 'Familienfreigabe Optionen',
                familyelementsdesc: 'Versteckt die "Dieses Spiel für die Familie freigeben" Elemente.',
                donations: 'Spenden',
                reportbug: 'Melde einen Fehler',
                resetsettings: 'Einstellungen zurücksetzen'
            }
            break
        case 'hu': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/97
            translate_load = {
                default: 'Alapértelmezett',
                native: 'Eredeti',
                hide: 'Elrejt',
                show: 'Mutat',
                total: 'Összesen',
                visible: 'Látható',
                hidden: 'Rejtett',
                enabled: 'Engedélyezve',
                disabled: 'Tiltva',
                auto: 'Automatikus',
                manual: 'Manuális',
                all: undefined,
                locked: undefined,
                complete: undefined,
                incomplete: undefined,
                games: 'Játékok',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Csomagok',
                addons: 'Kiegészítők',
                wishlist: 'Kívánságlista',
                responsive: 'Reszponzív',
                windowed: 'Ablakban',
                fullscreen: 'Teljes képernyő',
                onsale: 'Akciók',
                prodeals: 'Pro Ajánlatok',
                userprofile: 'Saját fiók',
                usermedia: 'Képernyőképek és Videók',
                searchbtnbase: 'Keresés',
                avatarpopup: 'Új avatar URL (alapból üres):',
                sessiontime: 'Kapcsolat ideje',
                codec: 'Videó kódolás',
                resolution: 'Felbontás',
                hardware: 'Hardver',
                software: 'Szoftver',
                trafficsession: 'Kapcsolat forgalma',
                trafficcurrent: 'Jelenlegi sebesség',
                trafficaverage: 'Átlag sebesség',
                packetloss: 'Elveszett csomagok',
                framedrop: 'Eldobott képkockák',
                latency: 'Késleltetés',
                jitter: 'Jitter puffer',
                decodetime: 'Dekódolási idő',
                compression: 'Tömörítés',
                streammon: 'Stream Monitor',
                stream: 'Stream',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: undefined,
                noteTwo: undefined,
                noteThree: undefined,
                noteFour: undefined,
                noteFive: undefined,
                noteSix: undefined,
                noteSeven: undefined,
                community: 'Közösség',
                speedtest: 'Sebesség teszt',
                quickaccess: 'Gyors elérés',
                messages: 'Üzenetek',
                comfeature: undefined,
                avatar: 'Avatar',
                interface: 'Megjelenítés',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Hivatkozás telepítése:',
                shortcutdesc: 'Parancsikon létrehozása közvetlen játék indításhoz',
                stadiastats: undefined,
                stadiastatsopen: undefined,
                stadiastatsdesc: undefined,
                gridsize: 'Rács méret',
                griddesc: undefined,
                clock: 'Óra',
                clockdesc: 'Az aktuális idő megjelenítése az ismerősök listáján vagy a játékban.',
                friendslist: 'Ismerősök listája',
                igoverlay: 'Játékon belüli Overlay',
                listoverlay: 'Ismerősök listája és Játékon belüli Overlay',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Meghívási hivatkozás másolása',
                inviteactive: 'Vágólapra másolva!',
                gamelabel: 'Játek Címkék',
                gamelabeldesc: 'A kezdőlapon eltávolítja a címkéket a játékokról. Pl.: "pro"',
                homegallery: 'Felvételek és játékállások',
                homegallerydesc: 'Elrejti a kezdőlap alján található "Felvételek és játékállások" területet.',
                quickprev: 'Üzenet Előnézet',
                quickprevdesc: 'Üzenet Előnézetek megjelenítése az ismerősök listáján.',
                quickrep: 'Gyors Válasz',
                quickrepdesc: 'A gyors válasz opciót elrejti a csevegésekben.',
                offlinefriend: 'Offline Ismerősök',
                offlinefrienddesc: 'Elrejti az offline ismerősöket a listából.',
                invisiblefriend: 'Láthatatlan Ismerősök',
                invisiblefrienddesc: 'Elrejti az ismeretlen státuszú ismerősöket a listán.',
                streammode: 'Streaming Mód',
                streammodedesc: 'Stream-elés közben olvashatatlanná tesz bizonyos elemeket. (pl.: ismerősök listája - OBS vagy Discord használatakor)',
                catprev: 'Kategória megjelenítés',
                catprevdesc: 'A kategória címkék elrejtése, amikor egy játék fölé viszed az egeret.',
                streammondesc: 'Stream Monitor bekapcsolása játék indításánál.',
                resolutiondesc: 'Streameléshez beállított felbontás. 1440p és 2160p beállításhoz VP9 videó kódolás támogatás szükséges.',
                codecdesc: 'A stream-hez használt videó kódoló eljárás.',
                confirmreset: 'Biztosan vissza akarod állítani a beállításokat?',
                gamesfinished: 'Vége a játéknak',
                achievementsunlocked: 'Megszerzett jutalom',
                totalPlayTime: 'Total Playtime',
                splitstore: 'Áruház oszlopos megjelenítés',
                splitstoredesc: 'Az Áruház 2 oszlopos megjelenítése a jobb láthatóság miatt.',
                inlineimage: 'Képek előnézete',
                inlinedesc: 'Gyakori képformátum (jpg/gif/png) linkek helyettesítése kattintható előnézeti képekkel.',
                familyelements: 'Családi megosztás',
                familyelementsdesc: 'Elrejti "A játék megosztása a családdal" lehetőséget a játékoknál, ha már létrehoztál családi csoportot.',
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Beállítások alaphelyzetbe állítása'
            }
            break
        case 'nl': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/9
            translate_load = {
                default: 'Standaard',
                native: 'Native',
                hide: 'Verbergen',
                show: 'Tonen',
                total: 'Totaal',
                visible: 'Zichtbaar',
                hidden: 'Verborgen',
                enabled: 'Ingeschakeld',
                disabled: 'Uitgeschakeld',
                auto: 'Automatisch',
                manual: 'Handmatig',
                all: undefined,
                locked: undefined,
                complete: undefined,
                incomplete: undefined,
                games: 'Games',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Bundels',
                addons: 'Add-ons',
                wishlist: 'Verlanglijst',
                responsive: 'Responsief',
                windowed: 'Venster Modus',
                fullscreen: 'Volledig Scherm',
                onsale: 'In de Uitverkoop',
                prodeals: 'Pro Deals',
                userprofile: 'Mijn Profiel',
                usermedia: 'Screenshots & Videos',
                searchbtnbase: 'Zoek verder',
                avatarpopup: 'Nieuwe avatar URL (laat leeg voor standaard):',
                sessiontime: 'Sessie tijd',
                codec: 'Codec',
                resolution: 'Resolutie',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Sessie traffic',
                trafficcurrent: 'Huidige traffic',
                trafficaverage: 'Gemiddelde traffic',
                packetloss: 'Verloren pakketten',
                framedrop: 'Frames dropped',
                latency: 'Vertraging',
                jitter: 'Jitter Buffer',
                decodetime: 'Decodeer Tijd',
                compression: 'Compressie',
                streammon: 'Stream Monitor',
                stream: 'Stream',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: 'Specificaties bevestigd door Ontwikkelaar/Uitgever',
                noteTwo: 'Aantal pixels',
                noteThree: '60FPS in 1080p modus',
                noteFour: '30FPS in 1080p modus',
                noteFive: 'Prestatie/Kwaliteit optie',
                noteSix: 'Geen HDR instellingen',
                noteSeven: 'Ondersteunt geen 4K modus',
                community: 'Gemeenschap',
                speedtest: 'Snelheidstest',
                quickaccess: 'Snelle Toegang',
                messages: 'Berichten',
                comfeature: undefined,
                avatar: 'Avatar',
                interface: 'Interface',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Installeer een snelkoppeling voor',
                shortcutdesc: 'Laat je een snelkoppeling voor een game installeren op je apparaat',
                stadiastats: undefined,
                stadiastatsopen: undefined,
                stadiastatsdesc: undefined,
                gridsize: 'Rooster Grootte',
                griddesc: undefined,
                clock: 'Klok',
                clockdesc: 'Geef de huidige tijd weer in je vriendenlijst, als in-game overlay of allebei.',
                friendslist: 'Vriendenlijst',
                igoverlay: 'In-Game Overlay',
                listoverlay: 'Lijst & Overlay',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Kopiëer uitnodigingslink',
                inviteactive: 'Gekopiëerd!',
                gamelabel: 'Game Labels',
                gamelabeldesc: 'Verwijderd labels zoals "Pro" van games op het homescreen.',
                homegallery: 'Gebruikers Gallerij',
                homegallerydesc: 'Verbergt het "Captures" deel onderaan het thuisscherm.',
                quickprev: 'Berichtvoorbeeld',
                quickprevdesc: 'Verbergt het berichtvoorbeeld in de vriendenlijst.',
                quickrep: 'Snelantwoord',
                quickrepdesc: 'Verbergt de snelantwoord optie in chats.',
                offlinefriend: 'Offline Vrienden',
                offlinefrienddesc: 'Verbergt offline vrienden in de vriendenlijst.',
                invisiblefriend: 'Onzichtbare Vrienden',
                invisiblefrienddesc: 'Vergbergt vrienden met onbekend online status in de vriendenlijst.',
                streammode: 'Streaming Modus',
                streammodedesc: 'Schakel in om bepaalde elementen (zoals de vriendenlijst) onleesbaar te maken tijdens het streamen (via tools als OBS / Discord).',
                catprev: 'Categorievoorbeeld',
                catprevdesc: 'Verbergt de categorie tags bij het bewegen over een game.',
                streammondesc: 'Activeer om de monitor te starten bij het starten van een game.',
                resolutiondesc: 'De beoogde resolutio voor games. 1440p en 2160p vereisen VP9.',
                codecdesc: 'De codec gebruikt voor games.',
                confirmreset: 'Weet je zeker dat je de instellingen wilt resetten?',
                gamesfinished: 'Games Voltooid',
                achievementsunlocked: 'Achievements Vrijgespeeld',
                totalPlayTime: 'Total Playtime',
                splitstore: 'Splits Winkel Lijsten',
                splitstoredesc: 'Splits de winkel lijsten in twee kolommen voor een beter overzicht.',
                inlineimage: 'Voorvertoningsafbeelding',
                inlinedesc: 'Vervang afbeelding links voor veelvoorkomende formaten (jpg/gif/png) door een klikbare voorvertoning.',
                familyelements: 'Opties voor delen met gezin',
                familyelementsdesc: 'Verbergt de "Delen met gezin"-opties.',
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Reset Instellingen'
            }
            break
        case 'es': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/67
            translate_load = {
                default: 'Por defecto',
                native: 'Nativa',
                hide: 'Ocultar',
                show: 'Mostrar',
                total: 'Total',
                visible: 'Visible',
                hidden: 'Oculto',
                enabled: 'Activado',
                disabled: 'Desactivado',
                auto: 'Automático',
                manual: 'Manual',
                all: undefined,
                locked: undefined,
                complete: undefined,
                incomplete: undefined,
                games: 'Juegos',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Paquetes',
                addons: 'Complementos',
                wishlist: undefined,
                responsive: 'Adaptativo',
                windowed: 'Modo Ventana',
                fullscreen: 'Pantalla Completa',
                onsale: 'En Oferta',
                prodeals: 'En Oferta (Pro)',
                userprofile: undefined,
                usermedia: 'Capturas de pantalla y Vídeos',
                searchbtnbase: 'Buscar en',
                avatarpopup: 'URL del nuevo avatar (vacío por defecto):',
                sessiontime: 'Duración de la sesión',
                codec: 'Códec',
                resolution: 'Resolución',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Tráfico de la sesión',
                trafficcurrent: 'Tráfico actual',
                trafficaverage: 'Tráfico promedio',
                packetloss: 'Paquetes perdidos',
                framedrop: 'Imágenes perdidas',
                latency: 'Latencia',
                jitter: 'Jitter Buffer',
                decodetime: 'Tiempo de decodificación',
                compression: 'Compresión',
                streammon: 'Monitor de retransmisión',
                stream: 'Retransmisión',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: 'Especificaciones confirmadas por desarrolladores y/o editores',
                noteTwo: 'Cuenta de píxeles',
                noteThree: '60FPS en modo 1080p',
                noteFour: '30FPS en modo 1080p',
                noteFive: 'Selección Rendimiento/gráficos',
                noteSix: 'Sin soporte para HDR',
                noteSeven: 'No es compatible con modo 4K',
                community: 'Comunidad',
                speedtest: 'Test de Velocidad',
                quickaccess: 'Acceso Rápido',
                messages: 'Mensajes',
                comfeature: undefined,
                avatar: 'Avatar',
                interface: 'Interfaz',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Instala un acceso directo para',
                shortcutdesc: 'Permite instalar un acceso directo de un juego en tu dispositivo.',
                stadiastats: undefined,
                stadiastatsopen: undefined,
                stadiastatsdesc: undefined,
                gridsize: 'Tamaño de la cuadrícula',
                griddesc: undefined,
                clock: 'Reloj',
                clockdesc: 'Muestra la hora actual en la lista de amigos, como superposición dentro del juego o ambas cosas.',
                friendslist: 'Lista de amigos',
                igoverlay: 'Superposición dentro del juego',
                listoverlay: 'Lista y Superposición',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Copiar el enlace de invitación',
                inviteactive: '¡Copiado!',
                gamelabel: 'Game Labels',
                gamelabeldesc: 'Removes labels like "Pro" from games on the homescreen.',
                homegallery: 'Galería de Capturas',
                homegallerydesc: 'Oculta el área de "Capturas" de la parte inferior de la pantalla de inicio.',
                quickprev: 'Previsualización de Mensajes',
                quickprevdesc: 'Oculta la previsualización de mensajes de la lista de amigos.',
                quickrep: 'Respuesta Rápida',
                quickrepdesc: 'Oculta la opción de respuesta rápida del chat.',
                offlinefriend: 'Amigos Desconectados',
                offlinefrienddesc: 'Oculta los amigos desconectados de la lista de amigos.',
                invisiblefriend: 'Amigos Invisibles',
                invisiblefrienddesc: 'Oculta los amigos con un estado en línea desconocido de la lista de amigos.',
                streammode: 'Modo Retransmisión',
                streammodedesc: 'Permite ocultar ciertos elementos (por ejemplo: la lista de amigos) mientras retransmites (a través de un programa externo como OBS o Discord).',
                catprev: 'Previsualización de Categorías',
                catprevdesc: 'Oculta las etiquetas de categoría cuando el cursor pasa sobre un juego de la página de inicio.',
                streammondesc: 'Activa automáticamente el monitor de retransmisión al ejecutar un juego.',
                resolutiondesc: 'Máxima resolución a la que pueden alcanzar los juegos. Para resoluciones 1440p (Quad HD) o 2160p (4K UHD) es necesario el códec VP9.',
                codecdesc: 'El códec usado por los juegos.',
                confirmreset: '¿Estás seguro de querer restablecer los ajustes?',
                gamesfinished: 'Juegos Completados',
                achievementsunlocked: 'Logros Desbloqueados',
                totalPlayTime: undefined,
                splitstore: 'Tienda a Doble Columna',
                splitstoredesc: 'Divide la lista de la tienda en dos columnas para una mayor legibilidad.',
                inlineimage: undefined,
                inlinedesc: undefined,
                familyelements: undefined,
                familyelementsdesc: undefined,
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Restablecer los ajustes'
            }
            break
        case 'it': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/7
            translate_load = {
                default: 'Predefinito',
                native: 'Nativo',
                hide: 'Nascondi',
                show: 'Mostra',
                total: 'Totale',
                visible: 'Visibile',
                hidden: 'Nascosto',
                enabled: 'Abilitato',
                disabled: 'Disabilitato',
                auto: 'Automatico',
                manual: 'Manuale',
                all: 'Tutti',
                locked: 'Bloccati',
                complete: 'Completati',
                incomplete: 'Incompleti',
                games: 'Giochi',
                allgames: 'Tutti i Giochi',
                leavepro: 'Ultimi giorni su Stadia Pro',
                bundles: 'Bundles',
                addons: 'Contenuti aggiuntivi',
                wishlist: 'Lista dei desideri',
                responsive: 'Reattivo',
                windowed: 'Modalità Finestra',
                fullscreen: 'Schermo Intero',
                onsale: 'In Offerta',
                prodeals: 'Offerte del Pro',
                userprofile: 'Profilo',
                usermedia: 'Screenshot & Video',
                searchbtnbase: 'Cerca su',
                avatarpopup: 'Nuovo URL avatar (vuoto per impostazione predefinita):',
                sessiontime: 'Tempo sessione',
                codec: 'Codec',
                resolution: 'Risoluzione',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Traffico sessione',
                trafficcurrent: 'Traffico corrente',
                trafficaverage: 'Traffico medio',
                packetloss: 'Pacchetti persi',
                framedrop: 'Fotogrammi persi',
                latency: 'Latenza',
                jitter: 'Buffer Jitter',
                decodetime: 'Tempo di Decodifica',
                compression: 'Compressione',
                streammon: 'Monitor Stream',
                stream: 'Stream',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: 'Specifiche confermate dagli sviluppatori/editori',
                noteTwo: 'Conto dei pixel',
                noteThree: '60 FPS in modalità 1080p',
                noteFour: '30 FPS in modalità 1080p',
                noteFive: 'Alterna Prestazioni/Qualità',
                noteSix: 'Nessuna impostazione HDR',
                noteSeven: 'Non compatibile con la modalità 4K',
                community: 'Comunità',
                speedtest: 'Speedtest',
                quickaccess: 'Accesso Veloce',
                messages: 'Messaggi',
                comfeature: 'Features della Comunità',
                avatar: 'Avatar',
                interface: 'Interfaccia',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Installa una scorciatoia per',
                shortcutdesc: 'Ti permette di installare una scorciatoia per un gioco sul tuo dispositivo',
                stadiastats: 'StadiaStats',
                stadiastatsopen: 'Visualizza su StadiaStats.GG',
                stadiastatsdesc: 'Abilita scorciatoie dirette alle statistiche di gioco, link al tuo profilo e al sistema trova un amico su stadiastats.gg.',
                gridsize: 'Dimensione Griglia',
                griddesc: 'Modifica la quantità di giochi per riga nella libreria.',
                clock: 'Orologio',
                clockdesc: 'Visualizza l\'ora corrente nell\'elenco degli amici, come un overlay di gioco o entrambi.',
                friendslist: 'Lista Amici',
                igoverlay: 'Overlay In-Gioco',
                listoverlay: 'Lista & Overlay',
                filter: 'Filtro Giochi',
                filterdesc: 'Ti permette di ordinare la tua libreria, nascondendo i giochi. Il filtro può essere attivato/disattivato tramite il simbolo, in alto a destra sopra i tuoi giochi nella libreria.',
                invitebase: 'Copia link invito',
                inviteactive: 'Copiato!',
                gamelabel: 'Etichette Giochi',
                gamelabeldesc: 'Rimuove le etichette "Pro" dai giochi nella schermata home.',
                homegallery: 'Galleria Utente',
                homegallerydesc: 'Nasconde l\'area "Acquisizioni" nella parte inferiore della schermata home.',
                quickprev: 'Anteprima Messaggio',
                quickprevdesc: 'Nasconde l\'anteprima dei messaggi nella lista amici.',
                quickrep: 'Risposta Veloce',
                quickrepdesc: 'Nasconde l\'opzione di risposta rapida nelle chat.',
                offlinefriend: 'Amici Offline',
                offlinefrienddesc: 'Nasconde gli amici offline nella lista amici.',
                invisiblefriend: 'Amici Invisibili',
                invisiblefrienddesc: 'Nasconde gli amici con stato online sconosciuto nella lista amici.',
                streammode: 'Modalità Streaming',
                streammodedesc: 'Abilita per rendere illeggibili alcuni elementi (ad esempio l\'elenco degli amici) durante lo streaming (tramite strumenti come OBS / Discord).',
                catprev: 'Anteprima Categoria',
                catprevdesc: 'Nasconde i tag di categoria quando si passa con il mouse su un gioco.',
                streammondesc: 'Attiva per avviare il monitor ogni volta che apri un gioco.',
                resolutiondesc: 'La risoluzione impostata per i giochi. 1440p e 2160p richiedono VP9.',
                codecdesc: 'Il codec utilizzato per i giochi.',
                confirmreset: 'Sei sicuro di voler ripristinare le impostazioni?',
                gamesfinished: 'Giochi Completati',
                achievementsunlocked: 'Obiettivi Sbloccati',
                totalPlayTime: 'Tempo di gioco totale',
                splitstore: 'Dividi Liste Store',
                splitstoredesc: 'Divide le liste nello store in due colonne per una migliore panoramica.',
                inlineimage: 'Anteprima Immagine',
                inlinedesc: 'Sostituisce i collegamenti alle immagini per i formati di file comuni (jpg / gif / png) con un\'anteprima cliccabile.',
                familyelements: 'Opzioni Gruppo-famiglia',
                familyelementsdesc: 'Nasconde l\'opzione "Condividi questo gioco con la famiglia".',
                donations: 'Donazioni',
                reportbug: 'Segnala un bug',
                resetsettings: 'Ripristina Impostazioni'
            }
            break
        case 'da': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/81
            translate_load = {
                default: 'Standard',
                native: 'Hjemmehørende',
                hide: 'Skjul',
                show: 'Vs',
                total: 'Total',
                visible: 'Synlig',
                hidden: 'Skjult',
                enabled: 'Aktiveret',
                disabled: 'Deaktiveret',
                auto: 'Automatisk',
                manual: 'Manuelt',
                all: undefined,
                locked: undefined,
                complete: undefined,
                incomplete: undefined,
                games: 'Spil',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Bundter',
                addons: 'Tilføjelser',
                wishlist: undefined,
                responsive: 'Lydhør',
                windowed: 'Vindue-tilstand',
                fullscreen: 'Fuld skærm',
                onsale: 'På Udsalg',
                prodeals: 'Pro Tilbud',
                userprofile: undefined,
                usermedia: 'Skærmbilleder og videoer',
                searchbtnbase: 'Søg videre',
                avatarpopup: 'Ny avatar-URL (tom for standard):',
                sessiontime: 'Sessionstid',
                codec: 'Codec',
                resolution: 'Opløsning',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Sessionstrafik',
                trafficcurrent: 'Nuværende trafik',
                trafficaverage: 'Gennemsnitlig trafik',
                packetloss: 'Tabte pakke',
                framedrop: 'Rammer tabt',
                latency: 'Netværksventetid',
                jitter: 'Jitter Buffer',
                decodetime: 'Afkodningstid',
                compression: 'Kompression',
                streammon: 'Overvågning af strøm',
                stream: 'Strøm',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: undefined,
                noteTwo: undefined,
                noteThree: undefined,
                noteFour: undefined,
                noteFive: undefined,
                noteSix: undefined,
                noteSeven: undefined,
                community: 'Fællesskab',
                speedtest: 'Hastighedstest',
                quickaccess: 'Hurtig adgang',
                messages: 'Beskeder',
                comfeature: undefined,
                avatar: 'Inkarnation',
                interface: 'Brugerflade',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Installer en genvej for',
                shortcutdesc: 'Giver dig mulighed for at installere en genvej til et spil på din enhed',
                stadiastats: undefined,
                stadiastatsopen: undefined,
                stadiastatsdesc: undefined,
                gridsize: 'Gitterstørrelse',
                griddesc: undefined,
                clock: 'Ur',
                clockdesc: 'Viser det aktuelle tidspunkt på vennelisten',
                friendslist: 'Venneliste',
                igoverlay: 'Overlay i spillet',
                listoverlay: 'Liste & Overlay',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Kopier invitationslink',
                inviteactive: 'Kopieret!',
                gamelabel: undefined,
                gamelabeldesc: undefined,
                homegallery: 'Brugergalleri',
                homegallerydesc: 'Skjuler området "Optager" nederst på startskærmen.',
                quickprev: 'Eksempel på besked',
                quickprevdesc: 'Skjuler beskedeksemplet på vennelisten.',
                quickrep: 'Hurtigt svar',
                quickrepdesc: 'Skjuler hurtigsvaret i chats.',
                offlinefriend: 'Offline venner',
                offlinefrienddesc: 'Skjuler offline venner på vennelisten.',
                invisiblefriend: 'Usynlige venner',
                invisiblefrienddesc: 'Skjuler venner med ukendt onlinestatus på vennelisten.',
                streammode: 'Streaming Tilstand',
                streammodedesc: 'Aktiver for at gøre visse elementer (dvs. vennelisten) ulæselige under streaming (via værktøjer som OBS / Discord).',
                catprev: 'Eksempel på kategori',
                catprevdesc: 'Skjuler kategoritags, når du svæver over et spil.',
                streammondesc: 'Aktiver for at starte skærmen, når et spil starter.',
                resolutiondesc: 'Den målrettede opløsning til spil. 1440p og 2160p kræver VP9.',
                codecdesc: 'Den codec, der bruges til spil.',
                confirmreset: 'Er du sikker på, at du vil nulstille indstillingerne?',
                gamesfinished: 'Gennemførte spil',
                achievementsunlocked: 'Oplåste Præstationer',
                totalPlayTime: undefined,
                splitstore: 'Opdel butikslister',
                splitstoredesc: 'Opdeler butikslister i to kolonner for at få et bedre overblik.',
                inlineimage: undefined,
                inlinedesc: undefined,
                familyelements: undefined,
                familyelementsdesc: undefined,
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Nulstil indstillingerne'
            }
            break
        case 'ca': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/60
            translate_load = {
                default: 'Per defecte',
                native: 'Nativa',
                hide: 'Amaga',
                show: 'Mostra',
                total: 'Total',
                visible: 'Visible',
                hidden: 'Amagat',
                enabled: 'Activat',
                disabled: 'Desactivat',
                auto: 'Automàtic',
                manual: 'Manual',
                all: 'Tots',
                locked: 'Bloquejats',
                complete: 'Complet',
                incomplete: 'Incomplet',
                games: 'Jocs',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Paquets',
                addons: 'Complements',
                wishlist: 'Llista de desitjos',
                responsive: 'Responsiu',
                windowed: 'Mode de finestra',
                fullscreen: 'Pantalla completa',
                onsale: 'En venda',
                prodeals: 'Ofertes Pro',
                userprofile: 'El meu perfil',
                usermedia: 'Captures i vídeos',
                searchbtnbase: 'Cerca a',
                avatarpopup: 'URL de l\'avatar  nou (buit per defecte):',
                sessiontime: 'Temps de sessió',
                codec: 'Còdec',
                resolution: 'Resolució',
                hardware: 'Maquinari',
                software: 'Programari',
                trafficsession: 'Trànsit de sessió',
                trafficcurrent: 'Trànsit actual',
                trafficaverage: 'Trànsit mitjà',
                packetloss: 'Paquets perduts',
                framedrop: 'Fotogrames perduts',
                latency: 'Latència',
                jitter: 'Jitter Buffer',
                decodetime: 'Temps de descodificació',
                compression: 'Compressió',
                streammon: 'Monitor de retransmissió',
                stream: 'Retransmissió',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: undefined,
                noteTwo: undefined,
                noteThree: undefined,
                noteFour: undefined,
                noteFive: undefined,
                noteSix: undefined,
                noteSeven: undefined,
                community: 'Comunitat',
                speedtest: 'Prova de velocitat',
                quickaccess: 'Accés ràpid',
                messages: 'Missatges',
                comfeature: 'Funcions de la comunitat',
                avatar: 'Avatar',
                interface: 'Interfície',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Instal·la una drecera per a',
                shortcutdesc: 'Permet instal·lar una drecera per a un joc al dispositiu',
                stadiastats: 'StadiaStats',
                stadiastatsopen: 'Veure a StadiaStats.GG',
                stadiastatsdesc: 'Permet les dreceres directes a les estadístiques dels jocs, l\'enllaç al vostre perfil i el sistema de cerca d\'altres jugadors/es a stadiastats.gg.',
                gridsize: 'Tamany de la quadrícula',
                griddesc: undefined,
                clock: 'Rellotge',
                clockdesc: 'Mostra l\'hora actual a la llista d\'amics, com a superposició del joc, o ambdues coses.',
                friendslist: 'Llista d\'amics',
                igoverlay: 'Superposició dins del joc',
                listoverlay: 'Llista i superposició',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Copia l\'enllaç d\'invitació',
                inviteactive: 'Copiat!',
                gamelabel: 'Etiquetes de joc',
                gamelabeldesc: 'Elimina etiquetes com "Pro" dels jocs del menú principal.',
                homegallery: 'Galeria d\'usuari',
                homegallerydesc: 'Amaga l\'àrea "Captures i estats del joc" de la part inferior de la pantalla d\'inici.',
                quickprev: 'Vista prèvia del missatge',
                quickprevdesc: 'Amaga la previsualització del missatge a la llista d\'amics.',
                quickrep: 'Resposta ràpida',
                quickrepdesc: 'Amaga l\'opció de resposta ràpida als xats.',
                offlinefriend: 'Amics fora de línia',
                offlinefrienddesc: 'Amaga els amics fora de línia a la llista d\'amics.',
                invisiblefriend: 'Amics invisibles',
                invisiblefrienddesc: 'Amaga els amics amb estat en línia desconegut a la llista d\'amics.',
                streammode: 'Mode de d\'emissió en directe',
                streammodedesc: 'Permet fer que alguns elements (com ara la llista d\'amics) no es puguin llegir durant l\'emissió en directe (mitjançant eines com OBS / Discord).',
                catprev: 'Vista prèvia de la categoria',
                catprevdesc: 'Amaga les etiquetes de categoria quan es passa el cursor per sobre d\'un joc.',
                streammondesc: 'Activa-ho per iniciar el monitor sempre que comenci un joc.',
                resolutiondesc: 'La resolució específica per als jocs. 1440p i 2160p requereixen VP9.',
                codecdesc: 'El còdec utilitzat per als jocs.',
                confirmreset: 'Segur que vols restablir la configuració?',
                gamesfinished: 'Jocs acabats',
                achievementsunlocked: 'Assoliments desbloquejats',
                totalPlayTime: 'Total Playtime',
                splitstore: 'Divideix les llistes de la botiga',
                splitstoredesc: 'Divideix les llistes de la botiga en dues columnes per obtenir una millor visió.',
                inlineimage: 'Vista prèvia de la imatge',
                inlinedesc: 'Substitueix els enllaços d\'imatge per a formats de fitxer habituals (jpg/gif/png) amb una vista prèvia.',
                familyelements: 'Opcions de compartició familiar',
                familyelementsdesc: 'Amaga les opcions "Comparteix aquest joc amb la família."',
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Restableix la configuració'
            }
            break
        case 'pt': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/91
            translate_load = {
                default: 'Padrão',
                native: 'Nativo',
                hide: 'Esconder',
                show: 'Mostrar',
                total: 'Total',
                visible: 'Visivel',
                hidden: 'Escondido',
                enabled: 'Ativado',
                disabled: 'Desativado',
                auto: 'Automático',
                manual: 'Manual',
                all: 'Todos',
                locked: 'Bloqueado',
                complete: 'Completo',
                incomplete: 'Incompleto',
                games: 'Jogos',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Pacotes',
                addons: 'Suplementos',
                wishlist: 'Lista de Desejos',
                responsive: 'Responsivo',
                windowed: 'Modo Janela',
                fullscreen: 'Ecrã Completo',
                onsale: 'Em Promoção',
                prodeals: 'Promoções Pro',
                userprofile: 'Meu Perfil',
                usermedia: 'Capturas e Vídeos',
                searchbtnbase: 'Pesquisar em',
                avatarpopup: 'Novo URL para avatar (vazio para o padrão):',
                sessiontime: 'Tempo de sessão',
                codec: 'Codec',
                resolution: 'Resolução',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Tráfego da sessão',
                trafficcurrent: 'Tráfego atual',
                trafficaverage: 'Tráfego médio',
                packetloss: 'Pacotes perdidos',
                framedrop: 'Frames perdidos',
                latency: 'Latencia',
                jitter: 'Buffer de Jitter',
                decodetime: 'Tempo de descodificação',
                compression: 'Compressão',
                streammon: 'Monitor de Streaming',
                stream: 'Stream',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: undefined,
                noteTwo: undefined,
                noteThree: undefined,
                noteFour: undefined,
                noteFive: undefined,
                noteSix: undefined,
                noteSeven: undefined,
                community: 'Comunidade',
                speedtest: 'Teste de velocidade',
                quickaccess: 'Acesso Rápido',
                messages: 'Mensagens',
                comfeature: 'Ferramentas da Comunidade',
                avatar: 'Avatar',
                interface: 'Interface',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Instalar atalho para',
                shortcutdesc: 'Permite-te instalar um atalho para um jogo no teu dispositivo',
                stadiastats: 'StadiaStats',
                stadiastatsopen: 'Ver em StadiaStats.gg',
                stadiastatsdesc: 'Ativa atalhos para estatísticas de jogos, link para o perfil e um sistema para encontrar amigos em StadiaStats.gg',
                gridsize: 'Tamanho da Grelha',
                griddesc: 'Muda a quantidade de jogos em cada linha na biblioteca',
                clock: 'Relógio',
                clockdesc: 'Mostra a hora atual na lista de amigos, em sobreposição no jogo, ou ambos.',
                friendslist: 'Lista de Amigos',
                igoverlay: 'Sobreposição no jogo',
                listoverlay: 'Lista e Sobreposição',
                filter: 'Filtro de Jogos',
                filterdesc: 'Permite organizar a biblioteca de jogos, escondendo jogos. O filtro pode ser ativado/desativado através do símbolo, no canto superior direito acima dos jogos na biblioteca.',
                invitebase: 'Copiar ligação de Convite',
                inviteactive: 'Copiado!',
                gamelabel: 'Etiquetas de Jogos',
                gamelabeldesc: 'Remove as Etiquetas como por exemplo "Pro" dos jogos da página inicial.',
                homegallery: 'Galeria do Utilizador',
                homegallerydesc: 'Esconde a área "Capturas" no fundo do ecrã inicial.',
                quickprev: 'Pré-visualização de mensagens',
                quickprevdesc: 'Esconde a pré-visualização de mensagens na tua lista de amigos.',
                quickrep: 'Resposta Rápida',
                quickrepdesc: 'Esconde a opção de resposta rápida nas conversas.',
                offlinefriend: 'Amigos Offline',
                offlinefrienddesc: 'Esconde amigos offline na lista de amigos.',
                invisiblefriend: 'Amigos Invisíveis',
                invisiblefrienddesc: 'Esconde amigos com estado desconhecido na lista de amigos.',
                streammode: 'Modo de Streaming',
                streammodedesc: 'Torna certos elementos (p.e. a lista de amigos) não legíveis enquanto estás a fazer streaming (via ferramentas como OBS ou Discord).',
                catprev: 'Pré-visualização da Categoria',
                catprevdesc: 'Esconde a etiqueta da categoria ao passar por cima de um jogo.',
                streammondesc: 'Ativa para iniciar o Monitor quando um jogo começa.',
                resolutiondesc: 'A resolução pretendida para stream de jogos. (1440p e 2160p utilizam o Codec VP9)',
                codecdesc: 'O Codec utilizado para stream de jogos.',
                confirmreset: 'De certeza que queres reiniciar as configurações?',
                gamesfinished: 'Jogo Terminado',
                achievementsunlocked: 'Conquistas Desbloqueadas',
                totalPlayTime: 'Tempo Total de Jogo',
                splitstore: 'Dividir Listas da Loja',
                splitstoredesc: 'Divide as listas da loja em duas colunas para uma melhor visão geral.',
                inlineimage: 'Prévia de imagem',
                inlinedesc: 'Substitui links de imagem para formatos comuns de ficheiros (jpg/gif/png) com uma prévia clicável.',
                familyelements: 'Opções de partilha de família',
                familyelementsdesc: 'Esconder a opção "Partilhar este jogo com a família."',
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Reiniciar Configurações'
            }
            break
        case 'sv': // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/11
            translate_load = {
                default: 'Standard',
                native: 'Inbyggd',
                hide: 'Göm',
                show: 'Visa',
                total: 'Total',
                visible: 'Synligt',
                hidden: 'Gömt',
                enabled: 'Aktiverat',
                disabled: 'Inaktiverat',
                auto: 'Automatisk',
                manual: 'Manuell',
                all: undefined,
                locked: undefined,
                complete: undefined,
                incomplete: undefined,
                games: 'Spel',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Spel-paket',
                addons: 'Tillägg',
                wishlist: undefined,
                responsive: 'Responsiv',
                windowed: 'Fönsterläge',
                fullscreen: 'Fullskärmsläge',
                onsale: 'På Rea',
                prodeals: 'Pro Deals',
                userprofile: undefined,
                usermedia: 'Skärmdumpar & Filmer',
                searchbtnbase: 'Sök på',
                avatarpopup: 'Nytt avatar-URL (lämna tomt för standard):',
                sessiontime: 'Sessionstid',
                codec: 'Kodec',
                resolution: 'Upplösning',
                hardware: 'Hårdvara',
                software: 'Mjukvara',
                trafficsession: 'Sessionstrafik',
                trafficcurrent: 'Nuvarande trafik',
                trafficaverage: 'Genomsnittlig trafik',
                packetloss: 'Tappade paket',
                framedrop: 'Tappade bilder',
                latency: 'Latens',
                jitter: 'Jitter Buffer',
                decodetime: 'Avkodningstid',
                compression: 'Kompression',
                streammon: 'Strömmonitor',
                stream: 'Ström',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: 'Specifikationer bekräftade av utvecklare/utgivare',
                noteTwo: 'Pixelräkning',
                noteThree: '60FPS i 1080p-läge',
                noteFour: '30FPS i 1080p-läge',
                noteFive: 'Prestanda/Grafik-inställning',
                noteSix: 'Ej HDR-inställningar',
                noteSeven: 'Ej kompatibelt med 4K-läge',
                community: 'Gemenskap',
                speedtest: 'Hastighetstest',
                quickaccess: 'Snabbmeny',
                messages: 'Meddelanden',
                comfeature: undefined,
                avatar: 'Avatar',
                interface: 'Gränssnitt',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Installera en genväg för',
                shortcutdesc: 'Låter dig installera en genväg för ett spel på din enhet',
                stadiastats: undefined,
                stadiastatsopen: undefined,
                stadiastatsdesc: undefined,
                gridsize: 'Rutnätsstorlek',
                griddesc: undefined,
                clock: 'Klocka',
                clockdesc: 'Visar den nuvarande tiden på vänlistan, som en spel-overlay eller båda.',
                friendslist: 'Vänner',
                igoverlay: 'Spelöverlägg',
                listoverlay: 'Lista & Överlägg',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Kopiera inbjudningslänk',
                inviteactive: 'Kopierat!',
                gamelabel: undefined,
                gamelabeldesc: 'Removes labels like "Pro" from games on the homescreen.',
                homegallery: 'Användargalleri',
                homegallerydesc: 'Gömmer "Captures"-sektionen längst ner på hemskärmen.',
                quickprev: 'Förhandsvisning av Meddelande',
                quickprevdesc: 'Gömmer förhandsvisningen av meddelanden i vänlistan.',
                quickrep: 'Snabbsvar',
                quickrepdesc: 'Gömmer snabbsvarsfunktionen i vänlistan',
                offlinefriend: 'Offline-vänner',
                offlinefrienddesc: 'Gömmer offline-vänner i vänlistan',
                invisiblefriend: 'Osynliga Vänner',
                invisiblefrienddesc: 'Gömmer vänner med okänd online-status i vänlistan',
                streammode: 'Streamer-läge',
                streammodedesc: 'Aktivera för att göra vissa delar (bl.a vänlistan) oläsbar medan du streamar (genom verktyg som OBS / Discord)',
                catprev: 'Kategori-förhandsvisning',
                catprevdesc: 'Gömmer kategori-taggarna när du har muspekaren över ett spel.',
                streammondesc: 'Aktivera för att starta en monitor så fort du öppnar ett spel.',
                resolutiondesc: 'Målupplösningen för spel. 1440p och 2160p kräver VP9.',
                codecdesc: 'Det kodec som används för spel.',
                confirmreset: 'Är du säker på att du vill återställa inställningarna?',
                gamesfinished: 'Färdiga Spel',
                achievementsunlocked: 'Prestationer Uppnådda',
                totalPlayTime: undefined,
                splitstore: 'Dela Butikslistor',
                splitstoredesc: 'Delar butikslistor i två kolumner för en bättre överblick.',
                inlineimage: 'Image Preview',
                inlinedesc: undefined,
                familyelements: undefined,
                familyelementsdesc: undefined,
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Återställ Inställningar'
            }
            break
        case 'fr': //https://github.com/ChristopherKlay/StadiaEnhanced/discussions/8
            translate_load = {
                default: 'Par Défaut',
                native: 'Natif',
                hide: 'Masquer',
                show: 'Afficher',
                total: 'Total',
                visible: 'Visible',
                hidden: 'Masqué',
                enabled: 'Activé',
                disabled: 'Désactivé',
                auto: 'Automatique',
                manual: 'Manuel',
                all: 'Tous',
                locked: 'Verrouillés',
                complete: 'Terminés',
                incomplete: 'En Cours',
                games: 'Jeux',
                allgames: 'Tous les Jeux',
                leavepro: 'Jeux Quittant Pro',
                bundles: 'Lots',
                addons: 'Extensions',
                wishlist: 'Liste d\'Envies',
                responsive: 'Responsive',
                windowed: 'Mode Fenêtré',
                fullscreen: 'Plein Écran',
                onsale: 'En Promotion',
                prodeals: 'Offres Stadia Pro',
                userprofile: 'Mon Profil',
                usermedia: 'Captures & Vidéos',
                searchbtnbase: 'Rechercher sur',
                avatarpopup: 'URL du nouvel avatar (vide = par défaut):',
                sessiontime: 'Durée de la session',
                codec: 'Codec',
                resolution: 'Résolution',
                hardware: 'Hardware',
                software: 'Software',
                trafficsession: 'Trafic de la session',
                trafficcurrent: 'Trafic actuel',
                trafficaverage: 'Trafic moyen',
                packetloss: 'Paquets perdus',
                framedrop: 'Images perdues',
                latency: 'Latence',
                jitter: 'Tampon de gigue',
                decodetime: 'Decoding Time',
                compression: 'Compression',
                streammon: 'Moniteur de Stream',
                stream: 'Stream',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: undefined,
                noteTwo: undefined,
                noteThree: undefined,
                noteFour: undefined,
                noteFive: undefined,
                noteSix: undefined,
                noteSeven: undefined,
                community: 'Communauté',
                speedtest: 'Test de Débit',
                quickaccess: 'Accès Rapide',
                messages: 'Messages',
                comfeature: 'Outils de la Communauté',
                avatar: 'Avatar',
                interface: 'Interface',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Installer un raccourcis pour',
                shortcutdesc: 'Permet d\'installer des raccourcis individuels pour vos jeux sur votre ordinateur',
                stadiastats: 'StadiaStats',
                stadiastatsopen: 'Voir sur StadiaStats.GG',
                stadiastatsdesc: 'Ajoute des liens stadiastats.gg vers votre profil, des statistiques pour chaque jeux et le système de recherche de joueurs "find-a-buddy".',
                gridsize: 'Taille de la Grille',
                griddesc: 'Change le nombre de colonnes de jeux affichées sur la page d\'accueil.',
                clock: 'Horloge',
                clockdesc: 'Affiche l\'heure dans la liste d\'amis et/ou dans le menu en-jeu.',
                friendslist: 'Liste d\'amis',
                igoverlay: 'Menu en-jeu',
                listoverlay: 'Liste & Menu',
                filter: 'Jeux masqués',
                filterdesc: 'Permet de masquer des jeux sur la page d\'accueil. Le système peut être activé/désactivé en utilisant l\'icône en haut à droite de la liste de jeux de la page d\'accueil.',
                invitebase: 'Copier le lien d\'invitation',
                inviteactive: 'Copié!',
                gamelabel: 'Étiquettes des Jeux',
                gamelabeldesc: 'Retire les étiquettes des jeux telles que l(étiquette "Pro" dans la page d\'accueil.',
                homegallery: 'Galerie des Captures',
                homegallerydesc: 'Masque la section "Captures" en bas de la page d\'accueil.',
                quickprev: 'Prévisualisation des Messages',
                quickprevdesc: 'Masque la prévisualisation des messages dans la liste d\'amis.',
                quickrep: 'Réponse Rapide',
                quickrepdesc: 'Masque les options de réponse rapide dans le chat.',
                offlinefriend: 'Amis Hors-Ligne',
                offlinefrienddesc: 'Masque les amis hors-ligne dans la liste d\'amis.',
                invisiblefriend: 'Amis Invisibles',
                invisiblefrienddesc: 'Masque les amis dont le status en-ligne est inconnu dans la liste d\'amis.',
                streammode: 'Mode Streaming',
                streammodedesc: 'Permet de rendre certains éléments (ex : la liste d\'amis) invisibles lorsque vous streamez (via un logiciel externe comme OBS ou Discord).',
                catprev: 'Prévisualisation des Catégories',
                catprevdesc: 'Masque la liste des catégories présente lorsque le curseur passe sur un jeu dans la grille de l\'accueil.',
                streammondesc: 'Si activé, le moniteur de stream démarrera automatiquement au lancement d\'un jeu.',
                resolutiondesc: 'La résolution cible pour le stream de jeux. Les résolutions 1440p et 2160p nécessitent le codec VP9.',
                codecdesc: 'Le codec utilisé pour le stream de jeux.',
                confirmreset: 'Êtes-vous certain de vouloir réinitialiser les paramètres ?',
                gamesfinished: 'Jeux Terminés',
                achievementsunlocked: 'Succès Débloqués',
                totalPlayTime: 'Total Playtime',
                splitstore: 'Store à 2 Colonnes',
                splitstoredesc: 'Divise les listes du store en deux colonnes pour une meilleur lisibilité.',
                inlineimage: 'Prévisualisation d\'Images',
                inlinedesc: 'Remplace les liens vers des images avec un format standard (jpg/gif/png) avec une prévisualisation cliquable.',
                familyelements: 'Options de partage familial',
                familyelementsdesc: 'Masque l\'option "Partager ce jeu avec la famille".',
                donations: 'Dons',
                reportbug: 'Signaler un bug',
                resetsettings: 'Réinitialiser les Paramètres'
            }
            break
        case 'ru':
            translate_load = {
                default: 'Стандарт',
                native: 'Нативное',
                hide: 'Спрятать',
                show: 'Показать',
                total: 'Всего',
                visible: 'Видимый',
                hidden: 'Спрятан',
                enabled: 'Включён',
                disabled: 'Отключён',
                auto: 'Автоматический',
                manual: 'Ручной',
                all: undefined,
                locked: undefined,
                complete: undefined,
                incomplete: undefined,
                games: 'Игры',
                allgames: undefined,
                leavepro: undefined,
                bundles: 'Бандлы',
                addons: 'Дополнения',
                wishlist: 'Список желаемого',
                responsive: 'Отзыв',
                windowed: 'Оконный режим',
                fullscreen: 'Полноэкранный режим',
                onsale: 'На распродаже',
                prodeals: 'Эксклюзивные скидки',
                userprofile: 'Мой профиль',
                usermedia: 'Скриншоты и Видео',
                searchbtnbase: 'Найти на',
                avatarpopup: 'Ссылка на новый аватар (изначатьно пусто):',
                sessiontime: 'Время сессии',
                codec: 'Кодек',
                resolution: 'Разрешение',
                hardware: 'Аппаратный',
                software: 'Программный',
                trafficsession: 'Трафик сессии',
                trafficcurrent: 'Данный трафик',
                trafficaverage: 'Средний трафик',
                packetloss: 'Порерянных пакетов',
                framedrop: 'Потерянных кадров',
                latency: 'Задежка',
                jitter: 'Задежка буфера',
                decodetime: 'Время декодирования',
                compression: 'Сжатие',
                streammon: 'Монитор',
                stream: 'Поток',
                extdetail: undefined,
                maxresolution: undefined,
                fps4K: undefined,
                datadiscl: undefined,
                noteOne: undefined,
                noteTwo: undefined,
                noteThree: undefined,
                noteFour: undefined,
                noteFive: undefined,
                noteSix: undefined,
                noteSeven: undefined,
                community: 'Сообщество',
                speedtest: 'Проверка скорости',
                quickaccess: 'Быстрый доступ',
                messages: 'Сообщения',
                comfeature: undefined,
                avatar: 'Аватар',
                interface: 'Интерфейс',
                shortcut: 'StadiaIcons',
                shortcuttitle: 'Установить скриншот на',
                shortcutdesc: 'Разрешить делать скриншоты в играх',
                stadiastats: undefined,
                stadiastatsopen: undefined,
                stadiastatsdesc: undefined,
                gridsize: 'Размер сетки',
                griddesc: undefined,
                clock: 'Часы',
                clockdesc: 'Отображать время на списке друзей, как наложение или с боку.',
                friendslist: 'Список друзей',
                igoverlay: 'Игровой оверлей',
                listoverlay: 'Список и наложение',
                filter: undefined,
                filterdesc: undefined,
                invitebase: 'Скопировать реферальную ссылку',
                inviteactive: 'Скопированно!',
                gamelabel: 'Названия игр',
                gamelabeldesc: 'Убирает яркие надписи "pro: " с главного экрана.',
                homegallery: 'Галлерея пользователя',
                homegallerydesc: 'Прячет галлерею под низ главного экрана.',
                quickprev: 'Предпросмотр сообщения',
                quickprevdesc: 'Прячет превью сообжений из чата.',
                quickrep: 'Быстрый ответ',
                quickrepdesc: 'Прячет вариант быстрого ответа в чатах.',
                offlinefriend: 'Друзья офлайн',
                offlinefrienddesc: 'Прячет оффлайн друзей из списка.',
                invisiblefriend: 'Невидимые друзья',
                invisiblefrienddesc: 'Прячет друзей с неизвестным статусом из списка.',
                streammode: 'Режим стриминга',
                streammodedesc: 'Сделать личные эллементы невидимыми для программ вроде Obs или Twitch Studio',
                catprev: 'Категория превью',
                catprevdesc: 'Прячет теги категорий при наведении курсора на игру.',
                streammondesc: 'Активировать монитор при старте игры.',
                resolutiondesc: 'Целевое разрешенеие. 1440p и 2160p требуют VP9.',
                codecdesc: 'Кодек используемый для игры.',
                confirmreset: 'Вы уверенны что хотите сбросить настройки?',
                gamesfinished: 'Игр пройденно',
                achievementsunlocked: 'Достижений открыто',
                totalPlayTime: undefined,
                splitstore: 'Разделить списки магазинов',
                splitstoredesc: 'Разделить списки магазинов на две колонны.',
                inlineimage: 'Предпросмотр фото',
                inlinedesc: 'Заменяет ссылки на изображения для распространенных форматов файлов (jpg/gif/png) на предварительный просмотр.',
                familyelements: 'Семейные настройки',
                familyelementsdesc: 'Прячеть опцию "поделится играми " из настроек.',
                donations: undefined,
                reportbug: undefined,
                resetsettings: 'Сбросить настройки'
            }
            break
    }

    // Merge fix entries
    var lang_filled = 0;
    if (Object.keys(translate_load).length != 0) {
        Object.entries(translate_load).forEach(([key, value]) => {
            if (value != undefined) {
                translation[key] = translate_load[key]
            } else {
                lang_filled++
            }
        });
    }

    lang_load = window.performance.now() - lang_load

    if (log) {
        console.log("%cStadia Enhanced" + "%c ⚙️ - Loading translation '" + lang + "' - " + Object.keys(translate_load).length + " keys in " + lang_load.toFixed(2) + "ms, " + lang_filled + " strings defaulting to 'en'.", enhanced_consoleEnhanced, "");
    }
    return translation
}