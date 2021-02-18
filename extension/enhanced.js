// Start Up
var enhanced_timerLoadStart = window.performance.now();
var enhanced_StartTimer = new Date().getTime();
var enhanced_local = document.querySelector("html").getAttribute("lang");
var enhanced_lang = loadLanguages(enhanced_local);
var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
var enhanced_AccountInfo = enhanced_loadUserInfo();
console.log("%cStadia Enhanced" + "%c ⚙️ - User: " + enhanced_AccountInfo[0] + "#" + enhanced_AccountInfo[1] + " (" + enhanced_AccountInfo[2] + ") (" + enhanced_local + ")", enhanced_consoleEnhanced, "");

// CSS Changes - Global styles and overwrites
enhanced_CSS = ".lTHVjf { padding: 0rem 1.5rem 0 1.5rem !important; }" // Remove padding above avatar
enhanced_CSS += ".DGX7fe { display: none }" // Hide the invite menu
enhanced_CSS += "#enhanced_showAll > i { font-size: 1.5rem; }" // Change "Show All" size
enhanced_CSS += ".E0Zk9b { justify-content: flex-start !important; flex-flow: row wrap; }" // Wrap menu items
enhanced_CSS += ".hxhAyf.fi8Jxd .TZ0BN { min-height: auto !important; }" // Adjust menu height
enhanced_CSS += ".GqLi4d.XUBkDd .a1l9D { margin: 0 0 .5rem .5rem !important; }" // Less padding on "Pro" labels
enhanced_CSS += "#enhanced_wrapper > .GqLi4d.Llx2qd, #enhanced_wrapper > .lSXaid.RjcqTc { transform: none !important; }" // Remove popup effect on game tiles
enhanced_CSS += ".tlZCoe { margin-right: .5rem; }" // Allow for multiple buttons on popup
enhanced_CSS += ".ozpmIc.lEPylf.sfe1Ff { padding: 4.25rem 0 4.5rem 0 !important; }" // Fix store list padding for scrollbars
enhanced_CSS += ".mGdxHb.ltdNmc:hover #enhanced_shortcutLastPlayed { opacity: 1 !important; }" // Show last-played shortcut on hover only
enhanced_CSS += "#enhanced_SettingsDropContent::-webkit-scrollbar { width: 1rem; }" // Settings menu scrollbar width
enhanced_CSS += "#enhanced_SettingsDropContent::-webkit-scrollbar-thumb { background-color: #202124; border-radius: 1rem; border: 3px solid #2d2e30; }" // Settings menu scrollbar style
enhanced_injectStyle(enhanced_CSS, "enhanced_styleGeneral");

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
    var enhanced_lang = loadLanguages(enhanced_local);

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
            enhanced_streamMonitor.innerHTML = "Waiting for game detection.";
        } else if (peerConnections.length >= 3) {
            if (!enhanced_sessionActive) {
                enhanced_sessionStart = new Date();
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
embed(loadLanguages, false);
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
    document.getElementById("enhanced_streamMonitor").style.top = "1rem";
    document.getElementById("enhanced_streamMonitor").style.left = "1rem";
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
enhanced_ProGames.className = "OfFb0b";
enhanced_ProGames.id = "enhanced_ProGames";
var enhanced_ProGamesLink = document.createElement("a");
enhanced_ProGames.appendChild(enhanced_ProGamesLink);
enhanced_ProGamesLink.className = "ROpnrd QAAyWd wJYinb";
enhanced_ProGamesLink.textContent = 'Pro';
enhanced_ProGamesLink.addEventListener("click", function() {
    openStadia("store/list/2001")
});

if (document.querySelectorAll(".ZECEje")[0] !== undefined) {
    document.querySelectorAll(".ZECEje")[0].append(enhanced_ProGames);
}

// Store Search - Adds a search bar to the Stadia store
var enhanced_SearchBox = document.createElement("li");
enhanced_SearchBox.className = "OfFb0b";
enhanced_SearchBox.id = "enhanced_SearchBox";
var enhanced_StoreSearch = document.createElement("input");
enhanced_SearchBox.appendChild(enhanced_StoreSearch);
enhanced_StoreSearch.className = "ROpnrd QAAyWd wJYinb";
enhanced_StoreSearch.id = "enhanced_StoreSearch";
enhanced_StoreSearch.placeholder = enhanced_lang.searchstore;
enhanced_StoreSearch.style.border = "none";
enhanced_StoreSearch.style.textAlign = "left";
enhanced_StoreSearch.style.paddingLeft = "3rem";
enhanced_StoreSearch.style.background = "url('" + chrome.runtime.getURL("media/svg/search.svg") + "') 1rem center / 24px 24px no-repeat, rgba(255,255,255,.06)"
enhanced_StoreSearch.style.display = "none";
enhanced_StoreSearch.addEventListener("keypress", function() {
    if (event.keyCode == 13 && enhanced_StoreSearch.value != "") {
        openStadia("store/list/3?search=" + enhanced_StoreSearch.value);
    }
});
if (document.querySelectorAll(".ZECEje")[0] !== undefined) {
    document.querySelectorAll(".ZECEje")[0].append(enhanced_SearchBox);
}

// Store Dropdown - Adds a dropdown menu for quick access
var enhanced_StoreContainer = document.createElement("li");
enhanced_StoreContainer.className = "OfFb0b";
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
if (document.querySelectorAll(".ZECEje")[0] !== undefined) {
    document.querySelectorAll(".ZECEje")[0].append(enhanced_StoreContainer);
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

if (document.querySelectorAll(".eMobNd")[0] !== undefined) {
    document.querySelectorAll(".eMobNd")[0].append(enhanced_StoreContainer);
}

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

// All games - Quick access to a list of all games currently available on Stadia
var enhanced_AllGames = document.createElement("div");
enhanced_AllGames.className = "pBvcyf QAAyWd";
enhanced_AllGames.id = "enhanced_AllGames";
enhanced_AllGames.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">list</i><span class="mJVLwb">' + enhanced_lang.allgames + '</span>';
enhanced_AllGames.style.cursor = "pointer";
enhanced_AllGames.style.userSelect = "none";
enhanced_AllGames.style.paddingRight = "2rem";
enhanced_AllGames.tabIndex = "0";
enhanced_AllGames.addEventListener("click", function() {
    openStadia("store/list/3");
});
enhanced_StoreDropContent.append(enhanced_AllGames);

// Settings Dropdown - Adds a dropdown menu for quick access
var enhanced_SettingsContainer = document.createElement("li");
enhanced_SettingsContainer.className = "OfFb0b";
enhanced_SettingsContainer.id = "enhanced_SettingsContainer";
var enhanced_SettingsDropdown = document.createElement("div");
enhanced_SettingsContainer.appendChild(enhanced_SettingsDropdown);
enhanced_SettingsDropdown.className = "ROpnrd QAAyWd wJYinb";
enhanced_SettingsDropdown.id = "enhanced_SettingsDropdown";
enhanced_SettingsDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_SettingsDropdown.style.cursor = "pointer";
enhanced_SettingsDropdown.style.width = "2.5rem";
enhanced_SettingsDropdown.style.padding = "0";
enhanced_SettingsDropdown.style.userSelect = "none";
enhanced_SettingsDropdown.tabIndex = "0";
enhanced_SettingsDropdown.addEventListener("click", function(e) {
    if (document.querySelector(".X1asv.ahEBEd.LJni0").style.opacity == "1") {
        document.querySelector(".hBNsYe.QAAyWd.wJYinb.YySNWc").click();
    }
    if (e.path.indexOf(enhanced_SettingsDropContent) == -1) {
        if (enhanced_SettingsDropContent.style.display === "none") {
            enhanced_SettingsDropContent.style.display = "flex";
        } else {
            enhanced_SettingsDropContent.style.display = "none";
        }
    }
});

enhanced_SettingsDropdown.addEventListener("keyup", function(e) {
    if (e.keyCode === 13) {
        enhanced_SettingsDropdown.click();
    }
});

// Settings - Dropdown
var enhanced_SettingsDropContent = document.createElement("div");
enhanced_SettingsDropdown.append(enhanced_SettingsDropContent);
enhanced_SettingsDropContent.id = "enhanced_SettingsDropContent";
enhanced_SettingsDropContent.className = "us22N";
enhanced_SettingsDropContent.style.position = "fixed";
enhanced_SettingsDropContent.style.width = "30rem";
enhanced_SettingsDropContent.style.top = "4rem";
enhanced_SettingsDropContent.style.left = "auto";
enhanced_SettingsDropContent.style.right = "1.5rem";
enhanced_SettingsDropContent.style.bottom = "1rem";
enhanced_SettingsDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_SettingsDropContent.style.zIndex = "20";
enhanced_SettingsDropContent.style.flexFlow = "column";
enhanced_SettingsDropContent.style.display = "none";
enhanced_SettingsDropContent.style.borderRadius = "0.5rem";
enhanced_SettingsDropContent.style.overflowY = "auto";
enhanced_SettingsDropContent.style.overflowX = "hidden";
if (document.querySelectorAll(".ZECEje")[1] !== undefined) {
    document.querySelectorAll(".ZECEje")[1].prepend(enhanced_SettingsContainer);
}

// Settings - Shortcut
var enhanced_settingsShortcut = document.createElement("div");
enhanced_SettingsDropContent.appendChild(enhanced_settingsShortcut);

var enhanced_settingsShortcutTitle = document.createElement("div");
enhanced_settingsShortcutTitle.className = "pBvcyf QAAyWd";
enhanced_settingsShortcutTitle.id = "enhanced_settingsShortcutTitle";
enhanced_settingsShortcutTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.quickaccess + '</span>';
enhanced_settingsShortcutTitle.style.cursor = "default";
enhanced_settingsShortcutTitle.style.userSelect = "none";
enhanced_settingsShortcutTitle.style.background = "#202124";
enhanced_settingsShortcutTitle.style.textAlign = "center";
enhanced_settingsShortcut.append(enhanced_settingsShortcutTitle);

// Settings - Stream
var enhanced_settingsStream = document.createElement("div");
enhanced_SettingsDropContent.appendChild(enhanced_settingsStream);

var enhanced_settingsStreamTitle = document.createElement("div");
enhanced_settingsStreamTitle.className = "pBvcyf QAAyWd";
enhanced_settingsStreamTitle.id = "enhanced_settingsStreamTitle";
enhanced_settingsStreamTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.stream + '</span>';
enhanced_settingsStreamTitle.style.cursor = "default";
enhanced_settingsStreamTitle.style.userSelect = "none";
enhanced_settingsStreamTitle.style.background = "#202124";
enhanced_settingsStreamTitle.style.textAlign = "center";
enhanced_settingsStream.append(enhanced_settingsStreamTitle);

// Settings - Interface
var enhanced_settingsGeneral = document.createElement("div");
enhanced_SettingsDropContent.appendChild(enhanced_settingsGeneral);

var enhanced_settingsGeneralTitle = document.createElement("div");
enhanced_settingsGeneralTitle.className = "pBvcyf QAAyWd";
enhanced_settingsGeneralTitle.id = "enhanced_settingsGeneralHead";
enhanced_settingsGeneralTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.interface + '</span>';
enhanced_settingsGeneralTitle.style.cursor = "default";
enhanced_settingsGeneralTitle.style.userSelect = "none";
enhanced_settingsGeneralTitle.style.background = "#202124";
enhanced_settingsGeneralTitle.style.textAlign = "center";
enhanced_settingsGeneral.append(enhanced_settingsGeneralTitle);

// Settings - Messages
var enhanced_settingsMessages = document.createElement("div");
enhanced_SettingsDropContent.appendChild(enhanced_settingsMessages);

var enhanced_settingsMessagesTitle = document.createElement("div");
enhanced_settingsMessagesTitle.className = "pBvcyf QAAyWd";
enhanced_settingsMessagesTitle.id = "enhanced_settingsMessagesTitle";
enhanced_settingsMessagesTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.messages + '</span>';
enhanced_settingsMessagesTitle.style.cursor = "default";
enhanced_settingsMessagesTitle.style.userSelect = "none";
enhanced_settingsMessagesTitle.style.background = "#202124";
enhanced_settingsMessagesTitle.style.textAlign = "center";
enhanced_settingsMessages.append(enhanced_settingsMessagesTitle);

window.addEventListener("click", function(e) {
    if (e.path.indexOf(enhanced_SettingsDropdown) == -1) {
        enhanced_SettingsDropContent.style.display = "none";
    }
});

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
    enhanced_changeCodec(enhanced_currentCodec);
});
enhanced_settingsStream.append(enhanced_Codec);

function enhanced_changeCodec(c) {
    switch (c) {
        case 0:
            enhanced_Codec.style.color = "";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.codec + ': ' + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'Automatic'.", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_Codec.style.color = "#00e0ba";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.codec + ': VP9<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'VP9'.", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_currentRes = 0;
            localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
            enhanced_updateResolution(enhanced_currentRes)
            enhanced_Codec.style.color = "#00e0ba";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.codec + ': H264<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.auto + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'H264'", enhanced_consoleEnhanced, "");
            break
    }
}

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
    enhanced_updateResolution(enhanced_currentRes)
});
enhanced_settingsStream.append(enhanced_Resolution);

function enhanced_updateResolution(res) {
    switch (res) {
        case 0:
            enhanced_Resolution.style.color = "";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.resolution + ': ' + enhanced_lang.native + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to 'Native'.", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_currentCodec = 1;
            localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
            enhanced_changeCodec(enhanced_currentCodec)
            enhanced_Resolution.style.color = "#00e0ba";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.resolution + ': 1440p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '2560x1440'.", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_currentCodec = 1;
            localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
            enhanced_changeCodec(enhanced_currentCodec)
            enhanced_Resolution.style.color = "#00e0ba";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.resolution + ': 2160p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.native + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '3840x2160'.", enhanced_consoleEnhanced, "");
            break
    }
}

function enhanced_changeResolution() {
    // Source: https://superuser.com/questions/712461/
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
    enhanced_changeMonitorAutostart(enhanced_autostartMonitor);
});
enhanced_settingsStream.append(enhanced_monitorAutostart);

function enhanced_changeMonitorAutostart(opt) {
    switch (opt) {
        case 0:
            enhanced_monitorAutostart.style.color = "";
            enhanced_monitorAutostart.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.streammon + ": " + enhanced_lang.manual + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Monitor Start: Set to 'Manual'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_monitorAutostart.style.color = "#00e0ba";
            enhanced_monitorAutostart.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.streammon + ": " + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.manual + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Monitor Start: Set to 'Auto'", enhanced_consoleEnhanced, "");
            break
    }
}

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
    enhanced_changeGridSize(enhanced_GridSize)
});
enhanced_settingsGeneral.append(enhanced_Grid);

function enhanced_changeGridSize(size) {
    switch (size) {
        case 0:
            enhanced_Grid.style.color = "";
            enhanced_CSS = ""
            break;
        case 1:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_CSS = ".lEPylf.YOW9Fd { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; }"
            break;
        case 2:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_CSS = ".lEPylf.YOW9Fd { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; }"
            break;
        case 3:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_CSS = ".lEPylf.YOW9Fd { grid-template-columns: repeat(30,minmax(auto,7.8125rem)) !important; }"
            break;
        case 4:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_CSS = ".lEPylf.YOW9Fd { grid-template-columns: repeat(36,minmax(auto,7.8125rem)) !important; }"
            break;
        case 5:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_CSS = ".lEPylf.YOW9Fd { grid-template-columns: repeat(12,minmax(auto,7.8125rem)) !important; }"
            enhanced_CSS += "@media (min-width: 1280px) { .lEPylf.YOW9Fd { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; } }"
            enhanced_CSS += "@media (min-width: 1920px) { .lEPylf.YOW9Fd { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; } }"
            enhanced_CSS += "@media (min-width: 2560px) { .lEPylf.YOW9Fd { grid-template-columns: repeat(30,minmax(auto,7.8125rem)) !important; } }"
            enhanced_CSS += "@media (min-width: 3840px) { .lEPylf.YOW9Fd { grid-template-columns: repeat(36,minmax(auto,7.8125rem)) !important; } }"
    }

    enhanced_injectStyle(enhanced_CSS, "enhanced_styleGrid");

    if (size < 5) {
        enhanced_gridOption = enhanced_GridSize + 2
    } else {
        enhanced_gridOption = enhanced_lang.responsive
    }

    enhanced_Grid.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_comfy</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.gridsize + ': ' + enhanced_gridOption + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.griddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': 2</span></span>';
    console.log("%cStadia Enhanced" + "%c ⚙️ - Library Grid Size: Set to " + enhanced_gridOption + ".", enhanced_consoleEnhanced, "");
}

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
    enhanced_changeClock(enhanced_ClockOption);
});
enhanced_settingsGeneral.append(enhanced_Clock);

function enhanced_changeClock(opt) {
    switch (opt) {
        case 0:
            enhanced_Clock.style.color = "";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "none";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.friendslist + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "flex";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Friendlist'", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.igoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "none";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'In-Game Overlay'", enhanced_consoleEnhanced, "");
            break
        case 3:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.listoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "flex";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Menu & Overlay'", enhanced_consoleEnhanced, "");
            break
    }
}

// Game Filter
var enhanced_filterOption = parseInt(localStorage.getItem("enhanced_filterOption") || 0);
var enhanced_gameFilter = document.createElement("div");
enhanced_gameFilter.className = "pBvcyf QAAyWd";
enhanced_gameFilter.id = "enhanced_gameFilter";
enhanced_gameFilter.style.cursor = "pointer";
enhanced_gameFilter.style.userSelect = "none";
enhanced_gameFilter.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_gameFilter.tabIndex = "0";
enhanced_gameFilter.addEventListener("click", function() {
    enhanced_filterOption = (enhanced_filterOption + 1) % 3;
    localStorage.setItem("enhanced_filterOption", enhanced_filterOption);
    enhanced_changeFilter(enhanced_filterOption);
});
enhanced_settingsGeneral.append(enhanced_gameFilter);

function enhanced_changeFilter(opt) {
    switch (opt) {
        case 0:
            enhanced_gameFilter.style.color = "";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_gameFilter.style.color = "#00e0ba";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.filtertoggle + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Toggle'", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_gameFilter.style.color = "#00e0ba";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.filterquick + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Quick'", enhanced_consoleEnhanced, "");
            break
    }
}

// Invite Link
var enhanced_InviteURL = "https://stadia.com/link/referrals?si_rid=" + enhanced_AccountInfo[2] + "&si_rt=1";
var enhanced_Invite = document.createElement("div");
enhanced_Invite.className = "pBvcyf QAAyWd";
enhanced_Invite.id = "enhanced_Invite";
enhanced_Invite.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_add</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.invitebase + '</span>';
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
        localStorage.removeItem("enhanced_messagePreview");
        localStorage.removeItem("enhanced_hideCategory");
        localStorage.removeItem("enhanced_DeskWidth");
        localStorage.removeItem("enhanced_DeskHeight");
        localStorage.removeItem("enhanced_autostartMonitor");
        localStorage.removeItem("enhanced_hidePopupEffect");
        localStorage.removeItem("enhanced_monitorState");
        localStorage.removeItem("enhanced_CodecOption");
        localStorage.removeItem("enhanced_useQuickReply");
        localStorage.removeItem("enhanced_hideUserMedia");
        localStorage.removeItem("enhanced_useStreamMode");
        localStorage.removeItem("enhanced_gameFilter");
        localStorage.removeItem("enhanced_ClockOption");
        localStorage.removeItem("enhanced_hideLabel");
        localStorage.removeItem("enhanced_monitorMode");
        localStorage.removeItem("enhanced_shortcutsOption");
        localStorage.removeItem("enhanced_hideOffline");
        localStorage.removeItem("enhanced_monitorPosition");
        localStorage.removeItem("enhanced_monitorOption");
        localStorage.removeItem("enhanced_filterOption");
        localStorage.removeItem("enhanced_GridSize");
        localStorage.removeItem("enhanced_ResOption");
        localStorage.removeItem("enhanced_hideInvisible");
        localStorage.removeItem("enhanced_storeListSize");
        console.log("%cStadia Enhanced" + "%c ⚙️ - Settings reverted to default.", enhanced_consoleEnhanced, "");
        location.reload();
    }
});
enhanced_settingsShortcut.append(enhanced_resetSettings)

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
    enhanced_changeMsgPreview(enhanced_messagePreview);
});
enhanced_settingsMessages.append(enhanced_hidePreview);

function enhanced_changeMsgPreview(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_hidePreview.style.color = "";
            enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Message Preview: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = ".lzIqJf .DvD76d { display: none; } .lzIqJf .xzJkDf { display: none; }"
            enhanced_hidePreview.style.color = "#00e0ba";
            enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes_off</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Message Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleMsgPreview");
}

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
    enhanced_changeQuickReply(enhanced_useQuickReply);
});
enhanced_settingsMessages.append(enhanced_quickReply);

function enhanced_changeQuickReply(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_quickReply.style.color = "";
            enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Quick Reply: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = ".bbVL5c { display: none !important; }"
            enhanced_quickReply.style.color = "#00e0ba";
            enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles_off</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Quick Reply: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleQuickReply");
}

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
    enhanced_changeOfflineUser(enhanced_hideOffline);
});
enhanced_settingsMessages.append(enhanced_offlineUser);

function enhanced_changeOfflineUser(opt) {
    switch (opt) {
        case 0:
            enhanced_offlineUser.style.color = "";
            enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Offline Users: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_offlineUser.style.color = "#00e0ba";
            enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Offline Users: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
}

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
    enhanced_changeInvisibleUser(enhanced_hideInvisible);
});
enhanced_settingsMessages.append(enhanced_invisibleUser);

function enhanced_changeInvisibleUser(opt) {
    switch (opt) {
        case 0:
            enhanced_invisibleUser.style.color = "";
            enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Invisible Users: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_invisibleUser.style.color = "#00e0ba";
            enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Invisible Users: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
}

// Pro Labels
var enhanced_hideLabel = parseInt(localStorage.getItem("enhanced_hideLabel") || 0);
var enhanced_proLabel = document.createElement("div");
enhanced_proLabel.className = "pBvcyf QAAyWd";
enhanced_proLabel.id = "enhanced_proLabel";
enhanced_proLabel.style.cursor = "pointer";
enhanced_proLabel.style.userSelect = "none";
enhanced_proLabel.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_proLabel.tabIndex = "0";
enhanced_proLabel.addEventListener("click", function() {
    enhanced_hideLabel = (enhanced_hideLabel + 1) % 2;
    localStorage.setItem("enhanced_hideLabel", enhanced_hideLabel);
    enhanced_changeProLabel(enhanced_hideLabel);
});
enhanced_settingsGeneral.append(enhanced_proLabel);

function enhanced_changeProLabel(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_proLabel.style.color = "";
            enhanced_proLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.prolabel + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.prolabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Pro Labels: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = ".GqLi4d.XUBkDd .a1l9D { display: none; }"
            enhanced_proLabel.style.color = "#00e0ba";
            enhanced_proLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.prolabel + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.prolabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Pro Labels: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleProlabel");
}

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
    enhanced_changeMediaPreview(enhanced_hideUserMedia);
});
enhanced_settingsGeneral.append(enhanced_mediaPreview);

function enhanced_changeMediaPreview(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_mediaPreview.style.color = "";
            enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Media Preview: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = ".ctThpb.lEPylf { display: none; }"
            enhanced_mediaPreview.style.color = "#00e0ba";
            enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Media Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleMediaPreview");
}

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
    enhanced_changeCategoryPreview(enhanced_hideCategory);
});
enhanced_settingsGeneral.append(enhanced_categoryPreview);

function enhanced_changeCategoryPreview(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_categoryPreview.style.color = "";
            enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Category Preview: Set to 'Visible'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = "#enhanced_wrapper .ssR8Bc { display: none !important; }"
            enhanced_categoryPreview.style.color = "#00e0ba";
            enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.visible + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Category Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleCategoryPreview");
}

// Popup on game tiles
var enhanced_hidePopupEffect = parseInt(localStorage.getItem("enhanced_hidePopupEffect") || 0);
var enhanced_gamePopup = document.createElement("div");
enhanced_gamePopup.className = "pBvcyf QAAyWd";
enhanced_gamePopup.id = "enhanced_gamePopup";
enhanced_gamePopup.style.cursor = "pointer";
enhanced_gamePopup.style.userSelect = "none";
enhanced_gamePopup.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_gamePopup.tabIndex = "0";
enhanced_gamePopup.addEventListener("click", function() {
    enhanced_hidePopupEffect = (enhanced_hidePopupEffect + 1) % 2;
    localStorage.setItem("enhanced_hidePopupEffect", enhanced_hidePopupEffect);
    enhanced_changeGamePopup(enhanced_hidePopupEffect);
});
enhanced_settingsGeneral.append(enhanced_gamePopup);

function enhanced_changeGamePopup(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = "#enhanced_wrapper:hover { z-index: 3; transform: scale(1.1); transition: transform .2s cubic-bezier(0.35,0,0.15,1); }"
            enhanced_gamePopup.style.color = "";
            enhanced_gamePopup.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">pageview</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.popup + ": " + enhanced_lang.default+'<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.popupdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.enabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Popup Effect: Set to 'Enabled'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = "#enhanced_wrapper:hover { z-index: unset; transform: none; transition: none; }"
            enhanced_gamePopup.style.color = "#00e0ba";
            enhanced_gamePopup.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">pageview</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.popup + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.popupdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.enabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Popup Effect: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleGamePopup");
}

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
    enhanced_changeStoreList(enhanced_storeListSize);
});
enhanced_settingsGeneral.append(enhanced_storeList);

function enhanced_changeStoreList(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_storeList.style.color = "";
            enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Split Store Lists: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = ".alEDLe.URhE4b .h6J22d { float: left; width: calc(50% - 1rem); margin: 0.5rem; }"
            enhanced_storeList.style.color = "#00e0ba";
            enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Split Store Lists: Set to 'Enabled'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleStoreSplit");
}

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
    enhanced_changeShortcuts(enhanced_enableShortcuts);
});
enhanced_settingsGeneral.append(enhanced_showShortcut);

function enhanced_changeShortcuts(opt) {
    switch (opt) {
        case 0:
            enhanced_showShortcut.style.color = "";
            enhanced_showShortcut.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">get_app</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.shortcut + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.shortcutdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Shortcuts: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_showShortcut.style.color = "#00e0ba";
            enhanced_showShortcut.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">get_app</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.shortcut + ": " + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.shortcutdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.enabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Shortcuts: Set to 'Enabled'", enhanced_consoleEnhanced, "");
            break
    }
}

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
    enhanced_changeStreamMode(enhanced_useStreamMode);
});
enhanced_settingsGeneral.append(enhanced_streamMode);

function enhanced_changeStreamMode(opt) {
    switch (opt) {
        case 0:
            enhanced_CSS = ""
            enhanced_streamMode.style.color = "";
            enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Mode: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_CSS = ".lzIqJf .Y1rZWd.QAAyWd.PuD06d, .gI3hkd, .Uwaqdf, .KW2hBe, .DlMyQd.cAx65e, .DlMyQd.KPQoWd, .CVhnkf, .h6J22d.BM7p1d.QAAyWd > .zRamU { filter: blur(0.25rem) brightness(1.2); text-shadow: 0.5rem 0px; }"
            enhanced_streamMode.style.color = "#00e0ba";
            enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: 24rem; white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default+': ' + enhanced_lang.disabled + '</span></span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Mode: Set to 'Enabled'", enhanced_consoleEnhanced, "");
            break
    }
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleStreamMode");
}

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
            enhanced_setAvatar(document.querySelector(".ksZYgc.VGZcUb").style.backgroundImage.replace(/(url\(|\)|")/g, ''));
            localStorage.removeItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"));
        } else {
            localStorage.setItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"), enhanced_avatarURL);
            enhanced_setAvatar(enhanced_avatarURL);
        }
    }
});

function enhanced_setAvatar(url) {
    console.log("%cStadia Enhanced" + "%c ⚙️ - Avatar changed to: " + url, enhanced_consoleEnhanced, "");
    enhanced_CSS = '.ksZYgc.VGZcUb { background-image: url("' + url + '") !important; }'
    enhanced_CSS += '.rybUIf { background-image: url("' + url + '") !important; }'
    enhanced_CSS += '.dOyvbe { background-image: url("' + url + '") !important; }'
    enhanced_CSS += '.Nv1Sab[alt$="' + enhanced_AccountInfo[0] + '"] { content: url("' + url + '") !important; }'
    enhanced_CSS += 'c-wiz[data-p*="' + enhanced_AccountInfo[2] + '"] .XZRzG { background-image: url("' + url + '") !important; }'
    enhanced_CSS += '.SAPaEd.bYsRUc div[jsdata*="' + enhanced_AccountInfo[2] + '"] .PwtJse { background-image: url("' + url + '") !important; }'
    enhanced_CSS += '.Tidcwc > .Y1rZWd.mZLJyd .Fnd1Pd.rnWGL { background-image: url("' + url + '") !important; }' // Group Avatar
    enhanced_CSS += '.mcaxA.ZmeF9 div:first-child { background-image: url("' + url + '") !important; }'
    enhanced_injectStyle(enhanced_CSS, "enhanced_styleAvatar");
}

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

// Account Menu - Changes to the account menu behaviour
enhanced_AccountMenu = document.querySelector(".Zxyh9c");
enhanced_AccountMenu.setAttribute("data-close-if-content-clicked", "false");

// Session Time
var enhanced_sessionTimer = document.createElement("div");
enhanced_sessionTimer.className = "HPX1od";
enhanced_sessionTimer.id = "enhanced_sessionTimer";
enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">00:00:00</span></div>';

// Game Filter
var enhanced_showState = false;
enhanced_showAll = document.createElement("div");
enhanced_showAll.id = "enhanced_showAll";
enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
enhanced_showAll.style.cursor = "pointer";
enhanced_showAll.addEventListener("click", function() {
    switch (enhanced_showState) {
        case true:
            enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
            enhanced_showState = false;
            break
        case false:
            enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
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
                enhanced_injectStyle(".h6J22d.undefined.QAAyWd[jslog*='17:2'], .h6J22d.undefined.QAAyWd[jslog*='17:3'] { display: none }", "enhanced_styleListFilter");
                break
            case 2:
                enhanced_activeListFilter = 2;
                enhanced_listFilterGames.style.color = "grey";
                enhanced_listFilterGames.style.textDecoration = "line-through";
                enhanced_listFilterBundles.style.color = "grey";
                enhanced_listFilterBundles.style.textDecoration = "line-through";
                enhanced_listFilterAddOns.style.color = "white";
                enhanced_listFilterAddOns.style.textDecoration = "none";
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
                enhanced_injectStyle(".h6J22d.undefined.QAAyWd[jslog*='17:1'], .h6J22d.undefined.QAAyWd[jslog*='17:2'] { display: none }", "enhanced_styleListFilter");
                break
        }
    } else {
        enhanced_activeListFilter = 0;
        enhanced_listFilterGames.style.color = "white";
        enhanced_listFilterGames.style.textDecoration = "none";
        enhanced_listFilterBundles.style.color = "white";
        enhanced_listFilterBundles.style.textDecoration = "none";
        enhanced_listFilterAddOns.style.color = "white";
        enhanced_listFilterAddOns.style.textDecoration = "none";
        enhanced_injectStyle("", "enhanced_styleListFilter");
    }
}

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

// Game Statistics
var enhanced_statsCheck = 0;
var enhanced_statOverview = document.createElement("div");
enhanced_statOverview.className = "MDSsFe URhE4b";
enhanced_statOverview.style.marginBottom = "3.5rem";

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

// Load stored settings
if (localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")) !== null) {
    enhanced_setAvatar(localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")));
}
updateSettings();

// Apply settings
function updateSettings() {
    enhanced_updateMonitor(0)
    enhanced_changeGridSize(enhanced_GridSize);
    enhanced_changeClock(enhanced_ClockOption);
    enhanced_changeFilter(enhanced_filterOption);
    enhanced_updateResolution(enhanced_currentRes);
    enhanced_changeCodec(enhanced_currentCodec);
    enhanced_changeMsgPreview(enhanced_messagePreview);
    enhanced_changeProLabel(enhanced_hideLabel);
    enhanced_changeQuickReply(enhanced_useQuickReply);
    enhanced_changeOfflineUser(enhanced_hideOffline);
    enhanced_changeInvisibleUser(enhanced_hideInvisible);
    enhanced_changeMediaPreview(enhanced_hideUserMedia);
    enhanced_changeStreamMode(enhanced_useStreamMode);
    enhanced_changeCategoryPreview(enhanced_hideCategory);
    enhanced_changeGamePopup(enhanced_hidePopupEffect);
    enhanced_changeMonitorAutostart(enhanced_autostartMonitor);
    enhanced_changeStoreList(enhanced_storeListSize);
    enhanced_changeShortcuts(enhanced_enableShortcuts);
}

// After Setup
var enhanced_timerLoadEnd = window.performance.now() - enhanced_timerLoadStart;
console.log("%cStadia Enhanced" + "%c ⏲️ - Start Up: Loaded in " + enhanced_timerLoadEnd.toFixed(2) + "ms.", enhanced_consoleEnhanced, "")
var enhanced_loopCount = 0;
var enhanced_loopTotal = 0;
var enhanced_timerLoopTotal = 0;
var enhanced_sessionStart = 0;
var enhanced_wrappers = [];

// Main Loop
setInterval(function() {
    var enhanced_timerLoopStart = window.performance.now();

    // Session Time
    if (document.location.href.indexOf("/player/") != -1) {
        document.querySelectorAll(".OWVtN")[document.querySelectorAll(".OWVtN").length - 1].append(enhanced_sessionTimer);
        if (enhanced_sessionStart == 0) {
            enhanced_sessionStart = new Date().getTime();
        } else {
            var enhanced_sessionDur = new Date().getTime();
            enhanced_sessionDur = enhanced_formatTime((enhanced_sessionDur - enhanced_sessionStart) / 1000);
            enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_sessionDur + '</span></div>';
        }
    } else {
        enhanced_sessionStart = 0;
    }

    // Enhanced Wrapper
    if (document.location.href.indexOf("/home") != -1) {
        var enhanced_gameList = document.querySelectorAll(".GqLi4d");

        for (var i = 0; i < enhanced_gameList.length; i++) {

            if (enhanced_gameList[i].parentNode.id != "enhanced_wrapper") {
                // Wrapper Element
                var enhanced_wrapper = document.createElement("div");
                enhanced_wrapper.id = "enhanced_wrapper";
                enhanced_wrapper.style.position = "relative";
                enhanced_wrapper.style.display = "inherit";
                enhanced_wrapper.style.gridColumn = "span 6/span 6";

                enhanced_wrappers.push({
                    parent: enhanced_gameList[i].parentNode,
                    sku: enhanced_gameList[i].getAttribute("jsdata").split(";")[1],
                    name: enhanced_gameList[i].getElementsByClassName("xmcLFc")[0].textContent,
                    wrapper: enhanced_wrapper,
                    game: enhanced_gameList[i],
                });

                enhanced_gameList[i].parentNode.appendChild(enhanced_wrapper);
                enhanced_wrapper.appendChild(enhanced_gameList[i]);
            }
        }

        // Game Filter
        var enhanced_gameFilter = localStorage.getItem("enhanced_gameFilter") || "";

        // Add "Show All" UI element
        var enhanced_selector = document.querySelectorAll("div[jsname='ZoZH6b'] .CVVXfc.URhE4b.ivS28e.tfyX5");
        if (enhanced_selector.length != 0) {
            if (enhanced_selector[enhanced_selector.length - 1].contains(enhanced_showAll) === false) {
                enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
                enhanced_selector[enhanced_selector.length - 1].append(enhanced_showAll);
                enhanced_showState = false;
            }
        }
        if (enhanced_filterOption == 0) {
            enhanced_showAll.style.display = "none";
            enhanced_showState = false;
        } else {
            enhanced_showAll.style.display = "flex";
        }

        for (var i = 0; i < enhanced_wrappers.length; i++) {

            if (!enhanced_wrappers[i].hasOwnProperty("visibility")) {
                // Visibility
                var enhanced_visibility = document.createElement("div");
                enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
                enhanced_visibility.style.position = "absolute";
                enhanced_visibility.style.margin = "0.2rem";
                enhanced_visibility.style.background = "#202124";
                enhanced_visibility.style.borderRadius = "50%";
                enhanced_visibility.style.padding = "0.2rem";
                enhanced_visibility.style.cursor = "pointer";
                enhanced_visibility.style.zIndex = "2";
                enhanced_visibility.sku = enhanced_wrappers[i].sku;
                enhanced_visibility.name = enhanced_wrappers[i].name;
                enhanced_visibility.title = enhanced_lang.hide + " " + enhanced_visibility.name;
                enhanced_visibility.addEventListener("click", function() {
                    if (enhanced_gameFilter.includes(this.sku)) {
                        enhanced_gameFilter = enhanced_gameFilter.replace("(" + this.sku + ")", "")
                        this.title = enhanced_lang.hide + " " + this.name;
                        localStorage.setItem("enhanced_gameFilter", enhanced_gameFilter);
                        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
                    } else {
                        enhanced_gameFilter += "(" + this.sku + ")";
                        this.title = enhanced_lang.show + " " + this.name;
                        localStorage.setItem("enhanced_gameFilter", enhanced_gameFilter);
                        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
                    }
                });
                if (enhanced_visibility.id != "undefined") {
                    enhanced_wrappers[i].wrapper.appendChild(enhanced_visibility);
                }
                enhanced_wrappers[i].visibility = enhanced_visibility;
            }

            // Apply filter option
            if (enhanced_filterOption != 2 && enhanced_showState === false) {
                enhanced_wrappers[i].visibility.style.display = "none";
            } else {
                enhanced_wrappers[i].visibility.style.display = "flex";
            }

            // Set brightness of filtered items
            if (enhanced_gameFilter.includes(enhanced_wrappers[i].sku) && enhanced_filterOption != 0) {
                enhanced_wrappers[i].game.style.filter = "brightness(40%)";
            } else {
                enhanced_wrappers[i].game.style.filter = "none";
            }

            // Filter items
            if (enhanced_gameFilter.includes(enhanced_wrappers[i].sku) && enhanced_showState === false && enhanced_filterOption != 0) {
                enhanced_wrappers[i].wrapper.style.display = "none";
                enhanced_wrappers[i].visibility.title = enhanced_lang.show + " " + enhanced_wrappers[i].name;
                enhanced_wrappers[i].visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
            } else {
                enhanced_wrappers[i].wrapper.style.display = "inherit";
            }
        }
    }

    // Captures Filter
    if (document.location.href.indexOf("/captures") != -1) {
        secureInsert(enhanced_captureFilters, ".dwGRGd", 0);
    }

    // List Filters
    if (document.location.href.indexOf("/list") != -1) {
        secureInsert(enhanced_listFilter, ".HZ5mJ", 2);
    }

    // Shortcuts
    if (document.location.href.indexOf("/home") != -1) {
        if (enhanced_enableShortcuts == 1) {
            enhanced_installShortcut.style.display = "inline-flex";
            enhanced_shortcutLastPlayed.style.display = "flex";

            // Popup
            if (document.getElementById(enhanced_installShortcut) === null && document.querySelector(".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc")) {
                enhanced_installShortcut.gameName = document.querySelector(".Wq73hb").textContent;
                enhanced_installShortcut.gameID = document.querySelector(".h1uihb > c-wiz").getAttribute("data-app-id");
                enhanced_installShortcut.innerHTML = '<div class="tYJnXb">' + enhanced_lang.shortcuttitle + ' ' + enhanced_installShortcut.gameName + '</div>';
                secureInsert(enhanced_installShortcut, 'div[jsaction="JIbuQc:qgRaKd;"]', 0);
            }

            // Last Played
            var enhanced_selector = document.querySelectorAll(".mGdxHb.ltdNmc");
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

    // Offline / Invisible Users
    var enhanced_statusList = document.querySelectorAll(".eXdFqc .rtsndf.WTetv .DfyMcd");
    for (var i = 0; i < enhanced_statusList.length; i++) {
        if (parseInt(localStorage.getItem("enhanced_hideOffline") || 0) == 1) {
            enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: none !important");
        } else {
            enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: flex");
        }
    }

    var enhanced_statusList = document.querySelectorAll(".eXdFqc .UxR5ob.m8Kzt"); // Invisible Users
    for (var i = 0; i < enhanced_statusList.length; i++) {
        if (enhanced_statusList[i].childElementCount == 1) {
            if (parseInt(localStorage.getItem("enhanced_hideInvisible") || 0) == 1) {
                enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: none !important");
            } else {
                enhanced_statusList[i].closest(".Y1rZWd.PuD06d").setAttribute("style", "display: flex");
            }
        }
    }

    // Game Statistics
    if (document.location.href.indexOf("/gameactivities/all") != -1 && document.querySelector(".MDSsFe") !== null) {
        var enhanced_statsBaseQuery = document.querySelectorAll("div[jsname='jlb53b']")[document.querySelectorAll("div[jsname='jlb53b']").length - 1];
        var enhanced_statsOwned = enhanced_statsBaseQuery.childElementCount;
        var enhanced_statsAchievementQuery = enhanced_statsBaseQuery.querySelectorAll(".kPtFV");

        if (enhanced_statsAchievementQuery.length > 0) {
            // Achievements
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

            if (enhanced_statsCheck != enhanced_statsUnlock) {
                enhanced_statsCheck = enhanced_statsUnlock;

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
                if (enhanced_statOverview.innerHTML != enhanced_loadStats) {
                    enhanced_statOverview.innerHTML = enhanced_loadStats;
                }
            }
        }
        secureInsert(enhanced_statOverview, ".dkZt0b.qRvogc", 2);
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
            break
        case 2:
            localStorage.setItem("video_codec_implementation_by_codec_key", '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}');
            break
    }

    // Store Search
    // Example: /store/list/3?search=NBA
    if (document.location.href.indexOf("/store/list/3?") != -1) {
        var enhanced_SearchParam = new URLSearchParams(window.location.search).get('search');
        if (enhanced_SearchParam !== null) {
            var enhanced_SearchResultCount = 0;
            document.getElementsByClassName("h6J22d null QAAyWd");
            enhanced_SearchResults = document.getElementsByClassName("h6J22d");
            for (var i = 0; i < enhanced_SearchResults.length; i++) {
                if (enhanced_SearchResults[i].getAttribute("aria-label").match(new RegExp(enhanced_SearchParam, 'gi')) === null) {
                    enhanced_SearchResults[i].style.display = "none";
                } else {
                    enhanced_SearchResultCount += 1;
                }
            }
            var enhanced_searchTitle = enhanced_lang.searchheader + " '" + enhanced_SearchParam + "' (" + enhanced_SearchResultCount + ")";
            if (document.querySelector(".HZ5mJ").innerHTML != enhanced_searchTitle) {
                document.querySelector(".HZ5mJ").innerHTML = enhanced_searchTitle;
            }
        }
    }

    // Resolution - Enable "Up to 4K" option
    var enhanced_selector = document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0]
    if (document.location.href.indexOf("/settings") != -1 && enhanced_selector !== undefined) {
        enhanced_selector.setAttribute("data-disabled", "false");
        enhanced_selector.classList.remove("OWB6Me");
    }

    // UI Elements - Add controls again when needed
    if (document.location.href.indexOf("/player/") != -1) {
        enhanced_Windowed.style.display = "flex";
        enhanced_Monitor.style.display = "flex";
        secureInsert(enhanced_Windowed, ".E0Zk9b", 0);
        secureInsert(enhanced_Monitor, ".E0Zk9b", 0);
    } else {
        enhanced_Windowed.style.display = "none";
        enhanced_Monitor.style.display = "none";
    }

    if (document.location.href.indexOf("/player/") != -1) {
        if (enhanced_ClockOption == 2 || enhanced_ClockOption == 3) {
            secureInsert(enhanced_ClockOverlay, ".bYYDgf", 0);
            enhanced_ClockOverlay.style.display = "flex";
        }
    } else {
        enhanced_ClockOverlay.style.display = "none";
    }
    secureInsert(enhanced_ClockFriends, ".hxhAyf.OzUE7e.XY6ZL", 0);

    // Monitor Autostart
    if (document.location.href.indexOf("/player/") != -1) {
        if (enhanced_autostartMonitor == 1 && enhanced_monitorStarted == false) {
            enhanced_monitorStarted = true;
            enhanced_monitorState = 1;
            enhanced_updateMonitor(enhanced_monitorState);
        }
    } else {
        enhanced_monitorStarted = false;
        enhanced_monitorState = 0;
        enhanced_updateMonitor(enhanced_monitorState);
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

    // Add search buttons on store page
    if (document.location.href.indexOf("/store/details/") != -1) {
        secureInsert(enhanced_StoreContainer, ".WjVJKd", 0);
    }

    // Add avatar option on own profile
    if (document.location.href.indexOf("/profile/" + enhanced_AccountInfo[2]) != -1) {
        secureInsert(enhanced_customAvatar, ".R1HPhd.bYsRUc.bqgeJc.wGziQb .hX4jqb", 0);
    }

    // Pro Games - UI changes and count of currently unclaimed games
    if (document.location.href.indexOf("/store/list/2001") != -1) {
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

    // Emoji Picker
    secureInsert(enhanced_emojiswitch, ".IRyDt", 0);
    secureInsert(enhanced_emojiPicker, ".pwUBOe.t7snHe", 2);

    // Visibility: Homescreen-only
    if (document.location.href.indexOf("/home") != -1) {
        enhanced_Grid.style.display = "block";
    } else {
        enhanced_Grid.style.display = "none";
    }

    // Visibility: Store-only
    if (window.innerWidth > 1024 && document.location.href.indexOf("/store") != -1) {
        enhanced_StoreSearch.style.display = "flex";
        enhanced_StoreDropdown.style.display = "flex";
    } else {
        enhanced_StoreSearch.style.display = "none";
        enhanced_StoreDropdown.style.display = "none";
    }

    // Loop End
    enhanced_loopCount++;
    var enhanced_timerLoopEnd = window.performance.now();
    enhanced_timerLoopTotal += enhanced_timerLoopEnd - enhanced_timerLoopStart;
    if (enhanced_loopCount == 300) {
        var enhanced_timerLoopAverage = (enhanced_timerLoopTotal / 300)
        console.log("%cStadia Enhanced" + "%c ⏲️ - Loop Time: ~" + enhanced_timerLoopAverage.toFixed(2) + "ms.", enhanced_consoleEnhanced, "");
    }
}, 200);

function enhanced_injectStyle(content, id) {
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    if (content) {
        if (document.getElementById(id)) {
            var el = document.getElementById(id);
        } else {
            var el = document.createElement('style');
            head.appendChild(el);
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

// Open pages including Stadia specific settings
function openStadia(url) {
    var enhanced_urlBase = document.querySelector("head > base").getAttribute("href");
    var enhanced_urlHL = new URLSearchParams(window.location.search).get('hl');
    var enhanced_url = new URL(enhanced_urlBase + url);
    if (enhanced_urlHL !== null) {
        enhanced_url.searchParams.append('hl', enhanced_urlHL);
    }
    window.open(enhanced_url, "_self");
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
            case 0:
                if (el.parentNode != target) {
                    target.append(el);
                }
                break
            case 1:
                if (el.parentNode != target) {
                    target.prepend(el);
                }
                break
            case 2:
                if (target.parentNode != el.parentNode) {
                    target.parentNode.insertBefore(el, target.nextSibling);
                }
                break
        }
    }
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
        case 0:
            // Translations
            var languages = ["fr", "nl", "sv", "pt", "ca", "da", "it", "es", "de", "hu", "en"];
            for (var i = 0; i < languages.length; i++) {
                console.log("%cStadia Enhanced" + "%c 🛠️ - Loading translation: '" + languages[i] + "'", enhanced_consoleEnhanced, "");
                debug_load = loadLanguages(languages[i]);
                if (debug_load.languagecode != languages[i]) {
                    console.error("%cStadia Enhanced" + "%c 🛠️ - Error loading translation: '" + languages[i] + "' featuring wrong language code: '" + debug_load.languagecode + "'", enhanced_consoleEnhanced, "");
                }
            }
            break
    }
}
embed(debugEnhanced, 0);

// Translation
function loadLanguages(lang) {
    switch (lang) {
        case "fr": //https://github.com/ChristopherKlay/StadiaEnhanced/discussions/8
            var load = `{
                "languagecode": "fr",
                "default": "Par Défaut",
                "native": "Natif",
                "hide": "Masquer",
                "show": "Afficher",
                "visible": "Visible",
                "hidden": "Masqué",
                "enabled": "Activé",
                "disabled": "Désactivé",
                "auto": "Automatique",
                "manual": "Manuel",
                "games": "Jeux",
                "bundles": "Lots",
                "addons": "Extensions",
                "responsive": "Responsive",
                "windowed": "Mode Fenêtré",
                "fullscreen": "Plein Écran",
                "searchstore": "Rechercher dans le Store",
                "onsale": "En Promotion",
                "prodeals": "Offres Stadia Pro",
                "allgames": "Tous les Jeux",
                "usermedia": "Captures & Vidéos",
                "searchbtnbase": "Rechercher sur",
                "avatarpopup": "URL du nouvel avatar (vide = par défaut):",
                "searchheader": "Jeux avec",
                "sessiontime": "Durée de la session",
                "codec": "Codec",
                "resolution": "Résolution",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Trafic de la session",
                "trafficcurrent": "Trafic actuel",
                "trafficaverage": "Trafic moyen",
                "packetloss": "Paquets perdus",
                "framedrop": "Images perdues",
                "latency": "Latence",
                "jitter": "Tampon de gigue",
                "decodetime": "Decoding Time",
                "compression": "Compression",
                "streammon": "Moniteur de Stream",
                "stream": "Stream",
                "community": "Communauté",
                "speedtest": "Test de Débit",
                "quickaccess": "Accès Rapide",
                "messages": "Messages",
                "avatar": "Avatar",
                "interface": "Interface",
                "shortcut": "Raccourcis",
                "shortcuttitle": "Installer un raccourcis pour",
                "shortcutdesc": "Permet d'installer des raccourcis individuels pour vos jeux sur votre ordinateur",
                "gridsize": "Taille de la Grille",
                "griddesc": "Modifie le nombre de jeux affichés sur la grille de l'accueil.",
                "clock": "Horloge",
                "clockdesc": "Affiche l'heure dans la liste d'amis et/ou dans le menu en-jeu.",
                "friendslist": "Liste d'amis",
                "igoverlay": "Menu en-jeu",
                "listoverlay": "Liste & Menu",
                "filter": "Filtre",
                "filterdesc": "Permet de filtrer les jeux à masquer dans l'accueil. Le filtrage peut être basculé en utilisant le symbole en haut à droite de la grille de l'accueil.",
                "filtertoggle": "Mode Bascule",
                "filterquick": "Accès rapide",
                "invitebase": "Copier le lien d'invitation",
                "inviteactive": "Copié!",
                "prolabel": "Vignette Pro",
                "prolabeldesc": "Masque la vignette 'Pro' sur les jeux dans la page d'accueil.",
                "homegallery": "Galerie des Captures",
                "homegallerydesc": "Masque la section 'Captures' en bas de la page d'accueil.",
                "quickprev": "Prévisualisation des Messages",
                "quickprevdesc": "Masque la prévisualisation des messages dans la liste d'amis.",
                "quickrep": "Réponse Rapide",
                "quickrepdesc": "Masque les options de réponse rapide dans le chat.",
                "offlinefriend": "Amis Hors-Ligne",
                "offlinefrienddesc": "Masque les amis hors-ligne dans la liste d'amis.",
                "invisiblefriend": "Amis Invisibles",
                "invisiblefrienddesc": "Masque les amis dont le status en-ligne est inconnu dans la liste d'amis.",
                "streammode": "Mode Streaming",
                "streammodedesc": "Permet de rendre certains éléments (ex : la liste d'amis) invisibles lorsque vous streamez (via un logiciel externe comme OBS ou Discord).",
                "catprev": "Prévisualisation des Catégories",
                "catprevdesc": "Masque la liste des catégories présente lorsque le curseur passe sur un jeu dans la grille de l'accueil.",
                "popup": "Effet d'Agrandissement",
                "popupdesc": "Désactive l'effet d'agrandissement / de zoom qui advient lorsque le curseur passe sur un jeu dans la grille de l'accueil.",
                "streammondesc": "Si activé, le moniteur de stream démarrera automatiquement au lancement d'un jeu.",
                "resolutiondesc": "La résolution cible pour le stream de jeux. Les résolutions 1440p et 2160p nécessitent le codec VP9.",
                "codecdesc": "Le codec utilisé pour le stream de jeux.",
                "confirmreset": "Êtes-vous certain de vouloir réinitialiser les paramètres ?",
                "gamesfinished": "Jeux Terminés",
                "achievementsunlocked": "Succès Débloqués",
                "splitstore": "Store à 2 Colonnes",
                "splitstoredesc": "Divise les listes du store en deux colonnes pour une meilleur lisibilité.",
                "scrollbardesc": "Affiche des barres de défilement dans l'accueil et la boutique.",
                "resetsettings": "Réinitialiser les Paramètres"
            }`
            break
        case "sv": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/11
            var load = `{
                "languagecode": "sv",
                "default": "Standard",
                "native": "Inbyggd",
                "hide": "Göm",
                "show": "Visa",
                "visible": "Synligt",
                "hidden": "Gömt",
                "enabled": "Aktiverat",
                "disabled": "Inaktiverat",
                "auto": "Automatisk",
                "manual": "Manuell",
                "games": "Spel",
                "bundles": "Spel-paket",
                "addons": "Tillägg",
                "responsive": "Responsiv",
                "windowed": "Fönsterläge",
                "fullscreen": "Fullskärmsläge",
                "searchstore": "Sök i butiken",
                "onsale": "På Rea",
                "prodeals": "Pro Deals",
                "allgames": "Alla Spel",
                "usermedia": "Skärmdumpar & Filmer",
                "searchbtnbase": "Sök på",
                "avatarpopup": "Nytt avatar-URL (lämna tomt för standard):",
                "searchheader": "Spel inklusive",
                "sessiontime": "Sessionstid",
                "codec": "Kodec",
                "resolution": "Upplösning",
                "hardware": "Hårdvara",
                "software": "Mjukvara",
                "trafficsession": "Sessionstrafik",
                "trafficcurrent": "Nuvarande trafik",
                "trafficaverage": "Genomsnittlig trafik",
                "packetloss": "Tappade paket",
                "framedrop": "Tappade bilder",
                "latency": "Latens",
                "jitter": "Jitter Buffer",
                "decodetime": "Avkodningstid",
                "compression": "Kompression",
                "streammon": "Strömmonitor",
                "stream": "Ström",
                "community": "Gemenskap",
                "speedtest": "Hastighetstest",
                "quickaccess": "Snabbmeny",
                "messages": "Meddelanden",
                "avatar": "Avatar",
                "interface": "Gränssnitt",
                "shortcut": "Genvägar",
                "shortcuttitle": "Installera en genväg för",
                "shortcutdesc": "Låter dig installera en genväg för ett spel på din enhet",
                "gridsize": "Rutnätsstorlek",
                "griddesc": "Ändrar hur många spel visas per rad på hemskärmen",
                "clock": "Klocka",
                "clockdesc": "Visar den nuvarande tiden på vänlistan, som en spel-overlay eller båda.",
                "friendslist":"Vänner",
                "igoverlay":"Spelöverlägg",
                "listoverlay":"Lista & Överlägg",
                "filter": "Filter",
                "filterdesc": "Låter dig sortera hemskärmen genom att gömma spel. Filtret kan växlas med symbolen uppe till höver ovanför dina spel på hemskärmen.",
                "filtertoggle":"Växla Filter",
                "filterquick":"Snabbfilter",
                "invitebase":"Kopiera inbjudningslänk",
                "inviteactive":"Kopierat!",
                "prolabel": "Pro-Etikett",
                "prolabeldesc": "Gömmer 'Pro'-etiketten från spel på hemskärmen.",
                "homegallery": "Användargalleri",
                "homegallerydesc": "Gömmer 'Captures'-sektionen längst ner på hemskärmen.",
                "quickprev": "Förhandsvisning av Meddelande",
                "quickprevdesc": "Gömmer förhandsvisningen av meddelanden i vänlistan.",
                "quickrep": "Snabbsvar",
                "quickrepdesc": "Gömmer snabbsvarsfunktionen i vänlistan",
                "offlinefriend": "Offline-vänner",
                "offlinefrienddesc": "Gömmer offline-vänner i vänlistan",
                "invisiblefriend": "Osynliga Vänner",
                "invisiblefrienddesc": "Gömmer vänner med okänd online-status i vänlistan",
                "streammode": "Streamer-läge",
                "streammodedesc": "Aktivera för att göra vissa delar (bl.a vänlistan) oläsbar medan du streamar (genom verktyg som OBS / Discord)",
                "catprev": "Kategori-förhandsvisning",
                "catprevdesc": "Gömmer kategori-taggarna när du har muspekaren över ett spel.",
                "popup": "Popup-Effekt",
                "popupdesc": "Tar bort inzoomingseffekten när du har muspekaren över ett spel på hemskärmen.",
                "streammondesc": "Aktivera för att starta en monitor så fort du öppnar ett spel.",
                "resolutiondesc": "Målupplösningen för spel. 1440p och 2160p kräver VP9.",
                "codecdesc": "Det kodec som används för spel.",
                "confirmreset": "Är du säker på att du vill återställa inställningarna?",
                "gamesfinished": "Färdiga Spel",
                "achievementsunlocked": "Prestationer Uppnådda",
                "splitstore": "Dela Butikslistor",
                "splitstoredesc": "Delar butikslistor i två kolumner för en bättre överblick.",
                "scrollbardesc": "Aktiverar scrollistor på hemskärmen och i butiken.",
                "resetsettings": "Återställ Inställningar"
            }`
            break
        case "pt": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/91
            var load = `{
                "languagecode": "pt",
                "default": "Padrão",
                "native": "Nativo",
                "hide": "Esconder",
                "show": "Mostrar",
                "visible": "Visivel",
                "hidden": "Escondido",
                "enabled": "Activado",
                "disabled": "Desactivado",
                "auto": "Automático",
                "manual": "Manual",
                "games": "Jogos",
                "bundles": "Bundles",
                "addons": "Add-ons",
                "responsive": "Responsivo",
                "windowed": "Modo Janela",
                "fullscreen": "Ecrã completo",
                "searchstore": "Pesquisar na loja",
                "onsale": "Em promoção",
                "prodeals": "Promoções Pro",
                "allgames": "Todos os jogos",
                "usermedia": "Screenshots & Videos",
                "searchbtnbase": "Pesquisar em",
                "avatarpopup": "Novo URL para avatar (vazio para o padrão):",
                "searchheader": "Incluindo Jogos",
                "sessiontime": "Tempo de sessão",
                "codec": "Codec",
                "resolution": "Resolução",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Tráfego da sessão",
                "trafficcurrent": "Tráfego instantâneo",
                "trafficaverage": "Tráfego médio",
                "packetloss": "Pacotes perdidos",
                "framedrop": "Frames perdidos",
                "latency": "Latencia",
                "jitter": "Buffer de Jitter",
                "decodetime": "Tempo de descodificação",
                "compression": "Compressão",
                "streammon": "Monitor do Stream",
                "stream": "Stream",
                "community": "Comunidade",
                "speedtest": "Teste de velocidade",
                "quickaccess": "Acesso Rápido",
                "messages": "Mensagens",
                "avatar": "Avatar",
                "interface": "Interface",
                "shortcut": "Atalhos",
                "shortcuttitle": "Instalar atalho para",
                "shortcutdesc": "Permite-te instalar um atalho para um jogo no teu dispositivo",
                "gridsize": "Tamanho da Grelha",
                "griddesc": "Muda o número de jogos por linha no ecrã inicial.",
                "clock": "Relógio",
                "clockdesc": "Mostra a hora actual na lista de amigos, em sobreposição no jogo, ou ambos.",
                "friendslist": "Lista de Amigos",
                "igoverlay": "Sobreposição no jogo",
                "listoverlay": "Lista e Sobreposição",
                "filter": "Filtro",
                "filterdesc": "Permite-te organizar o teu ecrã inicial escondendo jogos. O filtro pode ser alternado pelo simbolo no topo direito, acima dos teus jogos no ecrã inicial.",
                "filtertoggle": "Alternar",
                "filterquick": "Rápido",
                "invitebase": "Copiar ligação de convite",
                "inviteactive": "Copiado!",
                "prolabel": "Etiqueta Pro",
                "prolabeldesc": "Remove a etiqueta 'Pro' dos jogos no ecrã inicial.",
                "homegallery": "Galeria do Utilizador",
                "homegallerydesc": "Esconde a área 'Capturas' no fundo do ecrã inicial.",
                "quickprev": "Pré-visualização de mensagens",
                "quickprevdesc": "Esconde a pré-visualização de mensagens na tua lista de amigos.",
                "quickrep": "Resposta Rápida",
                "quickrepdesc": "Esconde a opção de resposta rápida nas conversas.",
                "offlinefriend": "Amigos Offline",
                "offlinefrienddesc": "Esconde amigos offline na lista de amigos.",
                "invisiblefriend": "Amigos Invisíveis",
                "invisiblefrienddesc": "Esconde amigos com estado desconhecido na lista de amigos.",
                "streammode": "Modo de Streaming",
                "streammodedesc": "Torna certos elementos (p.e. a lista de amigos) não legíveis enquanto estás a fazer streaming (via ferramentas como OBS / Discord).",
                "catprev": "Pré-visualização da Categoria",
                "catprevdesc": "Esconde a etiqueta da categoria ao passar por cima de um jogo.",
                "popup": "Efeito Popup",
                "popupdesc": "Remove o efeito de zoom-in / aumento ao passar por cima de um jogo no ecrã inicial.",
                "streammondesc": "Activa para iniciar o monitor quando um jogo começa.",
                "resolutiondesc": "A resolução pretendida para stream de jogos. 1440p e 2160p requerem VP9.",
                "codecdesc": "O codec utilizado para stream de jogos.",
                "confirmreset": "De certeza que queres reiniciar as configurações?",
                "gamesfinished": "Jogo terminado",
                "achievementsunlocked": "Conquistas desbloqueadas",
                "splitstore": "Dividir Listas da Loja",
                "splitstoredesc": "Divide as listas da loja em duas colunas para uma melhor visão geral.",
                "scrollbardesc": "Activa as scrollbars no ecrã inicial e loja.",
                "resetsettings": "Reiniciar Configurações"
            }`
            break
        case "ca": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/60
            var load = `{
                "languagecode": "ca",
                "default": "Per defecte",
                "native": "Natiu",
                "hide": "Amaga",
                "show": "Mostra",
                "visible": "Visible",
                "hidden": "Amagat",
                "enabled": "Activat",
                "disabled": "Desactivat",
                "auto": "Automàtic",
                "manual": "Manual",
                "games": "Jocs",
                "bundles": "Paquets",
                "addons": "Complements",
                "responsive": "Responsiu",
                "windowed": "Mode finestra",
                "fullscreen": "Pantalla completa",
                "searchstore": "Navega la botiga",
                "onsale": "Ofertes",
                "prodeals": "Ofertes Pro",
                "allgames": "Tots els jocs",
                "usermedia": "Captures de pantalla i vídeos",
                "searchbtnbase": "Cerca a",
                "avatarpopup": "URL d'avatar nou (buit per defecte):",
                "searchheader": "Jocs que incloguin",
                "sessiontime": "Temps de sessió",
                "codec": "Còdec",
                "resolution": "Resolució",
                "hardware": "Maquinari",
                "software": "Programari",
                "trafficsession": "Trànsit de sessió",
                "trafficcurrent": "Trànsit actual",
                "trafficaverage": "Trànsit de mitjana",
                "packetloss": "Paquets perduts",
                "framedrop": "Fotogrames perduts",
                "latency": "Latència",
                "jitter": "Jitter Buffer",
                "decodetime": "Temps de descodificació",
                "compression": "Compressió",
                "streammon": "Monitor de retransmissió",
                "stream": "Retransmissió",
                "community": "Comunitat",
                "speedtest": "Test de velocitat",
                "quickaccess": "Accés ràpid",
                "messages": "Missatges",
                "avatar": "Avatar",
                "interface": "Interfície",
                "shortcut": "Dreceres",
                "shortcuttitle": "Instal·la una drecera per a",
                "shortcutdesc": "Permet instal·lar una drecera per a un joc al dispositiu",
                "gridsize": "Tamany de la quadrícula",
                "griddesc": "Canvia la quantitat de jocs per fila a la pantalla d'inici.",
                "clock": "Rellotge",
                "clockdesc": "Mostra l'hora actual a la llista d'amics, com a superposició del joc, o ambdues coses.",
                "friendslist": "Llista d'amics",
                "igoverlay": "Superposició dins del joc",
                "listoverlay": "Llista i superposició",
                "filter": "Filtre",
                "filterdesc": "Permet ordenar la pantalla d'inici ocultant jocs. El filtre es pot alternar mitjançant el símbol situat a la part superior dreta, a sobre dels jocs, a la pantalla d'inici.",
                "filtertoggle": "Canvia",
                "filterquick": "Ràpid",
                "invitebase": "Copia l'enllaç d'invitació",
                "inviteactive": "Copiat!",
                "prolabel": "Etiqueta Pro",
                "prolabeldesc": "Elimina l'etiqueta 'Pro' dels jocs de la pantalla d'inici.",
                "homegallery": "Galeria d'usuari",
                "homegallerydesc": "Amaga l'àrea 'Captures' de la part inferior de la pantalla d'inici.",
                "quickprev": "Vista prèvia del missatge",
                "quickprevdesc": "Amaga la previsualització del missatge a la llista d'amics.",
                "quickrep": "Resposta ràpida",
                "quickrepdesc": "Amaga l'opció de resposta ràpida als xats.",
                "offlinefriend": "Amics fora de línia",
                "offlinefrienddesc": "Amaga els amics fora de línia a la llista d'amics.",
                "invisiblefriend": "Amics invisibles",
                "invisiblefrienddesc": "Amaga els amics amb estat en línia desconegut a la llista d'amics.",
                "streammode": "Mode de retransmissió",
                "streammodedesc": "Permet fer que alguns elements (com ara la llista d'amics) no es puguin llegir durant la retransmissió (mitjançant eines com OBS / Discord).",
                "catprev": "Vista prèvia de la categoria",
                "catprevdesc": "Amaga les etiquetes de categoria quan es passa el cursor per sobre d'un joc.",
                "popup": "Efecte emergent",
                "popupdesc": "Elimina l’efecte d’ampliació quan es passa el cursor per sobre d’un joc a la pantalla d’inici.",
                "streammondesc": "Activa-ho per iniciar el monitor sempre que comenci un joc.",
                "resolutiondesc": "La resolució específica per als jocs. 1440p i 2160p requereixen VP9.",
                "codecdesc": "El còdec utilitzat per als jocs.",
                "confirmreset": "Segur que vols restablir la configuració?",
                "gamesfinished": "Jocs acabats",
                "achievementsunlocked": "Assoliments desbloquejats",
                "splitstore": "Divideix les llistes de la botiga",
                "splitstoredesc": "Divideix les llistes de la botiga en dues columnes per obtenir una millor visió.",
                "scrollbardesc": "Activa les barres de desplaçament a la pantalla d'inici i la botiga.",
                "resetsettings": "Restableix la configuració"
            }`
            break
        case "da": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/81
            var load = `{
                "languagecode": "da",
                "default": "Standard",
                "native": "Hjemmehørende",
                "hide": "Skjul",
                "show": "Vs",
                "visible": "Synlig",
                "hidden": "Skjult",
                "enabled": "Aktiveret",
                "disabled": "Deaktiveret",
                "auto": "Automatisk",
                "manual": "Manuelt",
                "games": "Spil",
                "bundles": "Bundter",
                "addons": "Tilføjelser",
                "responsive": "Lydhør",
                "windowed": "Vindue-tilstand",
                "fullscreen": "Fuld skærm",
                "searchstore": "Søg i butik",
                "onsale": "På Udsalg",
                "prodeals": "Pro Tilbud",
                "allgames": "Alle spil",
                "usermedia": "Skærmbilleder og videoer",
                "searchbtnbase": "Søg videre",
                "avatarpopup": "Ny avatar-URL (tom for standard):",
                "searchheader": "Spil inkluderet",
                "sessiontime": "Sessionstid",
                "codec": "Codec",
                "resolution": "Opløsning",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Sessionstrafik",
                "trafficcurrent": "Nuværende trafik",
                "trafficaverage": "Gennemsnitlig trafik",
                "packetloss": "Tabte pakke",
                "framedrop": "Rammer tabt",
                "latency": "Netværksventetid",
                "jitter": "Jitter Buffer",
                "decodetime": "Afkodningstid",
                "compression": "Kompression",
                "streammon": "Overvågning af strøm",
                "stream": "Strøm",
                "community": "Fællesskab",
                "speedtest": "Hastighedstest",
                "quickaccess": "Hurtig adgang",
                "messages": "Beskeder",
                "avatar": "Inkarnation",
                "interface": "Brugerflade",
                "shortcut": "Genveje",
                "shortcuttitle": "Installer en genvej for",
                "shortcutdesc": "Giver dig mulighed for at installere en genvej til et spil på din enhed",
                "gridsize": "Gitterstørrelse",
                "griddesc": "Ændrer antallet af spil pr. række på startskærmen.",
                "clock": "Ur",
                "clockdesc": "Viser det aktuelle tidspunkt på vennelisten",
                "friendslist": "Venneliste",
                "igoverlay": "Overlay i spillet",
                "listoverlay": "Liste & Overlay",
                "filter": "Filter",
                "filterdesc": "Giver dig mulighed for at sortere din startskærm ved at skjule spil. Filteret kan skiftes via symbolet",
                "filtertoggle": "Skift",
                "filterquick": "Hurtig",
                "invitebase": "Kopier invitationslink",
                "inviteactive": "Kopieret!",
                "prolabel": "Pro-mærke",
                "prolabeldesc": "Fjerner 'Pro' -mærket fra spil på startskærmen.",
                "homegallery": "Brugergalleri",
                "homegallerydesc": "Skjuler området 'Optager' nederst på startskærmen.",
                "quickprev": "Eksempel på besked",
                "quickprevdesc": "Skjuler beskedeksemplet på vennelisten.",
                "quickrep": "Hurtigt svar",
                "quickrepdesc": "Skjuler hurtigsvaret i chats.",
                "offlinefriend": "Offline venner",
                "offlinefrienddesc": "Skjuler offline venner på vennelisten.",
                "invisiblefriend": "Usynlige venner",
                "invisiblefrienddesc": "Skjuler venner med ukendt onlinestatus på vennelisten.",
                "streammode": "Streaming Tilstand",
                "streammodedesc": "Aktiver for at gøre visse elementer (dvs. vennelisten) ulæselige under streaming (via værktøjer som OBS / Discord).",
                "catprev": "Eksempel på kategori",
                "catprevdesc": "Skjuler kategoritags, når du svæver over et spil.",
                "popup": "Popup-effekt",
                "popupdesc": "Fjerner zoom-in / forstørrelseseffekten, når du svæver over et spil på hjemmemarkedet.",
                "streammondesc": "Aktiver for at starte skærmen, når et spil starter.",
                "resolutiondesc": "Den målrettede opløsning til spil. 1440p og 2160p kræver VP9.",
                "codecdesc": "Den codec, der bruges til spil.",
                "confirmreset": "Er du sikker på, at du vil nulstille indstillingerne?",
                "gamesfinished": "Gennemførte spil",
                "achievementsunlocked": "Oplåste Præstationer",
                "splitstore": "Opdel butikslister",
                "splitstoredesc": "Opdeler butikslister i to kolonner for at få et bedre overblik.",
                "scrollbardesc": "Aktiverer rullebjælker på startskærmen og gem.",
                "resetsettings": "Nulstil indstillingerne"
                }`
            break
        case "it": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/7
            var load = `{
                "languagecode": "it",
                "default": "Predefinito",
                "native": "Nativo",
                "hide": "Nascondi",
                "show": "Mostra",
                "visible": "Visibile",
                "hidden": "Nascosto",
                "enabled": "Abilitato",
                "disabled": "Disabilitato",
                "auto": "Automatico",
                "manual": "Manuale",
                "games": "Giochi",
                "bundles": "Bundles",
                "addons": "Contenuti aggiuntivi",
                "responsive": "Reattivo",
                "windowed": "Modalità Finestra",
                "fullscreen": "Schermo Intero",
                "searchstore": "Cerca nello store",
                "onsale": "In Offerta",
                "prodeals": "Offerte del Pro",
                "allgames": "Tutti i Giochi",
                "usermedia": "Screenshot & Video",
                "searchbtnbase": "Cerca su",
                "avatarpopup": "Nuovo URL avatar (vuoto per impostazione predefinita):",
                "searchheader": "Giochi che includono",
                "sessiontime": "Tempo sessione",
                "codec": "Codec",
                "resolution": "Risoluzione",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Traffico sessione",
                "trafficcurrent": "Traffico corrente",
                "trafficaverage": "Traffico medio",
                "packetloss": "Pacchetti persi",
                "framedrop": "Fotogrammi persi",
                "latency": "Latenza",
                "jitter": "Buffer Jitter",
                "decodetime": "Tempo di Decodifica",
                "compression": "Compressione",
                "streammon": "Monitor Stream",
                "stream": "Stream",
                "community": "Comunità",
                "speedtest": "Speedtest",
                "quickaccess": "Accesso Veloce",
                "messages": "Messaggi",
                "avatar": "Avatar",
                "interface": "Interfaccia",
                "shortcut": "Scorciatoie",
                "shortcuttitle": "Installa una scorciatoia per",
                "shortcutdesc": "Ti permette di installare una scorciatoia per un gioco sul tuo dispositivo",
                "gridsize": "Dimensione Griglia",
                "griddesc": "Modifica la quantità di giochi per riga nella schermata home.",
                "clock": "Orologio",
                "clockdesc": "Visualizza l'ora corrente nell'elenco degli amici, come un overlay di gioco o entrambi.",
                "friendslist": "Lista Amici",
                "igoverlay": "Overlay In-Gioco",
                "listoverlay": "Lista & Overlay",
                "filter": "Filtro",
                "filterdesc": "Ti consente di ordinare la schermata home nascondendo i giochi. Il filtro può essere attivato / disattivato dal simbolo, in alto a destra sopra i tuoi giochi nella schermata home.",
                "filtertoggle": "Attiva Filtro",
                "filterquick": "Filtro Rapido",
                "invitebase": "Copia link invito",
                "inviteactive": "Copiato!",
                "prolabel": "Etichetta Pro",
                "prolabeldesc": "Rimuove l'etichetta 'Pro' dai giochi nella schermata home.",
                "homegallery": "Galleria Utente",
                "homegallerydesc": "Nasconde l'area 'Acquisizioni' nella parte inferiore della schermata home.",
                "quickprev": "Anteprima Messaggio",
                "quickprevdesc": "Nasconde l'anteprima dei messaggi nella lista amici.",
                "quickrep": "Risposta Veloce",
                "quickrepdesc": "Nasconde l'opzione di risposta rapida nelle chat.",
                "offlinefriend": "Amici Offline",
                "offlinefrienddesc": "Nasconde gli amici offline nella lista amici.",
                "invisiblefriend": "Amici Invisibili",
                "invisiblefrienddesc": "Nasconde gli amici con stato online sconosciuto nella lista amici.",
                "streammode": "Modalità Streaming",
                "streammodedesc": "Abilita per rendere illeggibili alcuni elementi (ad esempio l'elenco degli amici) durante lo streaming (tramite strumenti come OBS / Discord).",
                "catprev": "Anteprima Categoria",
                "catprevdesc": "Nasconde i tag di categoria quando si passa con il mouse su un gioco.",
                "popup": "Effetto Popup",
                "popupdesc": "Rimuove l'effetto di zoom-in / ingrandimento quando si passa con il mouse su un gioco nella schermata home.",
                "streammondesc": "Attiva per avviare il monitor ogni volta che apri un gioco.",
                "resolutiondesc": "La risoluzione impostata per i giochi. 1440p e 2160p richiedono VP9.",
                "codecdesc": "Il codec utilizzato per i giochi.",
                "confirmreset": "Sei sicuro di voler ripristinare le impostazioni?",
                "gamesfinished": "Giochi Completati",
                "achievementsunlocked": "Obiettivi Sbloccati",
                "splitstore": "Dividi Liste Store",
                "splitstoredesc": "Divide le liste nello store in due colonne per una migliore panoramica.",
                "scrollbardesc": "Abilita le barre di scorrimento sulla schermata home e store.",
                "resetsettings": "Ripristina Impostazioni"
            }`
            break
        case "es": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/67
            var load = `{
                "languagecode": "es",
                "default": "Por defecto",
                "native": "Nativa",
                "hide": "Ocultar",
                "show": "Mostrar",
                "visible": "Visible",
                "hidden": "Oculto",
                "enabled": "Activado",
                "disabled": "Desactivado",
                "auto": "Automático",
                "manual": "Manual",
                "games": "Juegos",
                "bundles": "Paquetes",
                "addons": "Complementos",
                "responsive": "Adaptativo",
                "windowed": "Modo Ventana",
                "fullscreen": "Pantalla Completa",
                "searchstore": "Buscar en la Tienda",
                "onsale": "En Oferta",
                "prodeals": "En Oferta (Pro)",
                "allgames": "Todos los juegos",
                "usermedia": "Capturas de pantalla y Vídeos",
                "searchbtnbase": "Buscar en",
                "avatarpopup": "URL del nuevo avatar (vacío por defecto):",
                "searchheader": "Juegos que contienen en el título",
                "sessiontime": "Duración de la sesión",
                "codec": "Códec",
                "resolution": "Resolución",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Tráfico de la sesión",
                "trafficcurrent": "Tráfico actual",
                "trafficaverage": "Tráfico promedio",
                "packetloss": "Paquetes perdidos",
                "framedrop": "Imágenes perdidas",
                "latency": "Latencia",
                "jitter": "Jitter Buffer",
                "decodetime": "Tiempo de decodificación",
                "compression": "Compresión",
                "streammon": "Monitor de retransmisión",
                "stream": "Retransmisión",
                "community": "Comunidad",
                "speedtest": "Test de Velocidad",
                "quickaccess": "Acceso Rápido",
                "messages": "Mensajes",
                "avatar": "Avatar",
                "interface": "Interfaz",
                "shortcut": "Accesos Directos",
                "shortcuttitle": "Instala un acceso directo para",
                "shortcutdesc": "Permite instalar un acceso directo de un juego en tu dispositivo.",
                "gridsize": "Tamaño de la cuadrícula",
                "griddesc": "Cambia la cantidad de juegos por fila en la pantalla de inicio.",
                "clock": "Reloj",
                "clockdesc": "Muestra la hora actual en la lista de amigos, como superposición dentro del juego o ambas cosas.",
                "friendslist": "Lista de amigos",
                "igoverlay": "Superposición dentro del juego",
                "listoverlay": "Lista y Superposición",
                "filter": "Filtro",
                "filterdesc": "Permite ocultar juegos de la pantalla de inicio. Activado el filtro, aparecen unos símbolos (ojos); el símbolo general, situado encima de tu colección de juegos en la parte superior derecha, aplica o desaplica los cambios en el filtro; los símbolos específicos de cada juego permiten elegir qué juegos ocultar.",
                "filtertoggle": "Activado (modo normal)",
                "filterquick": "Activado (modo rápido)",
                "invitebase": "Copiar el enlace de invitación",
                "inviteactive": "¡Copiado!",
                "prolabel": "Etiqueta Pro",
                "prolabeldesc": "Elimina la etiqueta 'Pro' de los juegos de la pantalla de inicio.",
                "homegallery": "Galería de Capturas",
                "homegallerydesc": "Oculta el área de 'Capturas' de la parte inferior de la pantalla de inicio.",
                "quickprev": "Previsualización de Mensajes",
                "quickprevdesc": "Oculta la previsualización de mensajes de la lista de amigos.",
                "quickrep": "Respuesta Rápida",
                "quickrepdesc": "Oculta la opción de respuesta rápida del chat.",
                "offlinefriend": "Amigos Desconectados",
                "offlinefrienddesc": "Oculta los amigos desconectados de la lista de amigos.",
                "invisiblefriend": "Amigos Invisibles",
                "invisiblefrienddesc": "Oculta los amigos con un estado en línea desconocido de la lista de amigos.",
                "streammode": "Modo Retransmisión",
                "streammodedesc": "Permite ocultar ciertos elementos (por ejemplo: la lista de amigos) mientras retransmites (a través de un programa externo como OBS o Discord).",
                "catprev": "Previsualización de Categorías",
                "catprevdesc": "Oculta las etiquetas de categoría cuando el cursor pasa sobre un juego de la página de inicio.",
                "popup": "Efecto Zoom",
                "popupdesc": "Desactiva el efecto de ampliación (zoom-in) que se produce cuando el cursor pasa sobre un juego de la página de inicio.",
                "streammondesc": "Activa automáticamente el monitor de retransmisión al ejecutar un juego.",
                "resolutiondesc": "Máxima resolución a la que pueden alcanzar los juegos. Para resoluciones 1440p (Quad HD) o 2160p (4K UHD) es necesario el códec VP9.",
                "codecdesc": "El códec usado por los juegos.",
                "confirmreset": "¿Estás seguro de querer restablecer los ajustes?",
                "gamesfinished": "Juegos Completados",
                "achievementsunlocked": "Logros Desbloqueados",
                "splitstore": "Tienda a Doble Columna",
                "splitstoredesc": "Divide la lista de la tienda en dos columnas para una mayor legibilidad.",
                "scrollbardesc": "Habilita las barras de desplazamiento en la pantalla de inicio y en la tienda.",
                "resetsettings": "Restablecer los ajustes"
            }`
            break
        case "nl": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/9
            var load = `{
                "languagecode": "nl",
                "default": "Standaard",
                "native": "Native",
                "hide": "Verbergen",
                "show": "Tonen",
                "visible": "Zichtbaar",
                "hidden": "Verborgen",
                "enabled": "Ingeschakeld",
                "disabled": "Uitgeschakeld",
                "auto": "Automatisch",
                "manual": "Handmatig",
                "games": "Games",
                "bundles": "Bundels",
                "addons": "Add-ons",
                "responsive": "Responsief",
                "windowed": "Venster Modus",
                "fullscreen": "Volledig Scherm",
                "searchstore": "Zoek in de winkel",
                "onsale": "In de Uitverkoop",
                "prodeals": "Pro Deals",
                "allgames": "Alle Games",
                "usermedia": "Screenshots & Videos",
                "searchbtnbase": "Zoek verder",
                "avatarpopup": "Nieuwe avatar URL (laat leeg voor standaard):",
                "searchheader": "Games inclusief",
                "sessiontime": "Sessie tijd",
                "codec": "Codec",
                "resolution": "Resolutie",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Sessie traffic",
                "trafficcurrent": "Huidige traffic",
                "trafficaverage": "Gemiddelde traffic",
                "packetloss": "Verloren pakketten",
                "framedrop": "Frames dropped",
                "latency": "Vertraging",
                "jitter": "Jitter Buffer",
                "decodetime": "Decodeer Tijd",
                "compression": "Compressie",
                "streammon": "Stream Monitor",
                "stream": "Stream",
                "community": "Gemeenschap",
                "speedtest": "Snelheidstest",
                "quickaccess": "Snelle Toegang",
                "messages": "Berichten",
                "avatar": "Avatar",
                "interface": "Interface",
                "shortcut": "Snelkoppelingen",
                "shortcuttitle": "Installeer een snelkoppeling voor",
                "shortcutdesc": "Laat je een snelkoppeling voor een game installeren op je apparaat",
                "gridsize": "Rooster Grootte",
                "griddesc": "Verander het aantal games per rij op je thuisscherm.",
                "clock": "Klok",
                "clockdesc": "Geef de huidige tijd weer in je vriendenlijst, als in-game overlay of allebei.",
                "friendslist": "Vriendenlijst",
                "igoverlay": "In-Game Overlay",
                "listoverlay": "Lijst & Overlay",
                "filter": "Filter",
                "filterdesc": "Laat je het thuisscherm sorteren door games te verbergen. Dit filter kan in-/uitgeschakeld worden via het symbool, rechtsboven je games op het thuisscherm.",
                "filtertoggle": "Omschakelen",
                "filterquick": "Snel",
                "invitebase": "Kopiëer uitnodigingslink",
                "inviteactive": "Gekopiëerd!",
                "prolabel": "Pro Label",
                "prolabeldesc": "Verwijderd het 'Pro' label van games op het thuisscherm.",
                "homegallery": "Gebruikers Gallerij",
                "homegallerydesc": "Verbergt het 'Captures' deel onderaan het thuisscherm.",
                "quickprev": "Berichtvoorbeeld",
                "quickprevdesc": "Verbergt het berichtvoorbeeld in de vriendenlijst.",
                "quickrep": "Snelantwoord",
                "quickrepdesc": "Verbergt de snelantwoord optie in chats.",
                "offlinefriend": "Offline Vrienden",
                "offlinefrienddesc": "Verbergt offline vrienden in de vriendenlijst.",
                "invisiblefriend": "Onzichtbare Vrienden",
                "invisiblefrienddesc": "Vergbergt vrienden met onbekend online status in de vriendenlijst.",
                "streammode": "Streaming Modus",
                "streammodedesc": "Schakel in om bepaalde elementen (zoals de vriendenlijst) onleesbaar te maken tijdens het streamen (via tools als OBS / Discord).",
                "catprev": "Categorievoorbeeld",
                "catprevdesc": "Verbergt de categorie tags bij het bewegen over een game.",
                "popup": "Popup Effect",
                "popupdesc": "Haal het zoom-in / vergroot effect weg bij het bewegen over een game op het thuisscherm.",
                "streammondesc": "Activeer om de monitor te starten bij het starten van een game.",
                "resolutiondesc": "De beoogde resolutio voor games. 1440p en 2160p vereisen VP9.",
                "codecdesc": "De codec gebruikt voor games.",
                "confirmreset": "Weet je zeker dat je de instellingen wilt resetten?",
                "gamesfinished": "Games Voltooid",
                "achievementsunlocked": "Achievements Vrijgespeeld",
                "splitstore": "Splits Winkel Lijsten",
                "splitstoredesc": "Splits de winkel lijsten in twee kolommen voor een beter overzicht.",
                "scrollbar": "Scrollbalken",
                "scrollbardesc": "Schakel scrollbalken in voor het thuisscherm en de winkel.",
                "resetsettings": "Reset Instellingen"
            }`
            break
        case "hu": //Github
            var load = `{
                "languagecode": "hu",
                "default": "Alapértelmezett",
                "native": "Eredeti",
                "hide": "Elrejt",
                "show": "Mutat",
                "visible": "Látható",
                "hidden": "Rejtett",
                "enabled": "Engedélyezve",
                "disabled": "Tiltva",
                "auto": "Automatikus",
                "manual": "Manuális",
                "games": "Játékok",
                "bundles": "Csomagok",
                "addons": "Kiegészítők",
                "responsive": "Reszponzív",
                "windowed": "Ablakban",
                "fullscreen": "Teljes képernyő",
                "searchstore": "Keresés",
                "onsale": "Akciók",
                "prodeals": "Pro Ajánlatok",
                "allgames": "Összes Játék",
                "usermedia": "Képernyőképek és Videók",
                "searchbtnbase": "Keresés",
                "avatarpopup": "Új avatar URL (alapból üres):",
                "searchheader": "Játékok, amik tartalmazzák:",
                "sessiontime": "Kapcsolat ideje",
                "codec": "Videó kódolás",
                "resolution": "Felbontás",
                "hardware": "Hardver",
                "software": "Szoftver",
                "trafficsession": "Kapcsolat forgalma",
                "trafficcurrent": "Jelenlegi sebesség",
                "trafficaverage": "Átlag sebesség",
                "packetloss": "Elveszett csomagok",
                "framedrop": "Eldobott képkockák",
                "latency": "Késleltetés",
                "jitter": "Jitter puffer",
                "decodetime": "Dekódolási idő",
                "compression": "Tömörítés",
                "streammon": "Stream Monitor",
                "stream": "Stream",
                "community": "Közösség",
                "speedtest": "Sebesség teszt",
                "quickaccess": "Quick Access",
                "messages": "Üzenetek",
                "avatar": "Avatar",
                "interface": "Megjelenítés",
                "shortcut": "Parancsikon",
                "shortcuttitle": "Hivatkozás telepítése:",
                "shortcutdesc": "Parancsikon létrehozása közvetlen játék indításhoz",
                "gridsize": "Rács méret",
                "griddesc": "Megváltoztatja a kezdőlapon a soronkénti játékok mennyiségét",
                "clock": "Óra",
                "clockdesc": "Az aktuális idő megjelenítése az ismerősök listáján vagy a játékban.",
                "friendslist": "Ismerősök listája",
                "igoverlay": "Játékon belüli Overlay",
                "listoverlay": "Ismerősök listája és Játékon belüli Overlay",
                "filter": "Szűrés",
                "filterdesc": "Lehetővé teszi a kezdőlapon a Saját játékkönyvtár rendezését a játékok elrejtésével. A szűrő a kezdőlapon a Saját játékkönyvtár jobb felső sarkában található szimbólummal kapcsolható be.",
                "filtertoggle": "Kapcsoló",
                "filterquick": "Gyors",
                "invitebase": "Meghívási hivatkozás másolása",
                "inviteactive": "Vágólapra másolva!",
                "prolabel": "Pro címke",
                "prolabeldesc": "Eltávolítja a 'Pro' címkét a kezdőlapon megjelenő játékokról.",
                "homegallery": "Felvételek és játékállások",
                "homegallerydesc": "Elrejti a kezdőlap alján található 'Felvételek és játékállások' területet.",
                "quickprev": "Üzenet Előnézet",
                "quickprevdesc": "Üzenet Előnézetek megjelenítése az ismerősök listáján.",
                "quickrep": "Gyors Válasz",
                "quickrepdesc": "A gyors válasz opciót elrejti a csevegésekben.",
                "offlinefriend": "Offline Ismerősök",
                "offlinefrienddesc": "Elrejti az offline ismerősöket a listából.",
                "invisiblefriend": "Láthatatlan Ismerősök",
                "invisiblefrienddesc": "Elrejti az ismeretlen státuszú ismerősöket a listán.",
                "streammode": "Streaming Mód",
                "streammodedesc": "Stream-elés közben olvashatatlanná tesz bizonyos elemeket. (pl.: ismerősök listája - OBS vagy Discord használatakor)",
                "catprev": "Kategória megjelenítés",
                "catprevdesc": "A kategória címkék elrejtése, amikor egy játék fölé viszed az egeret.",
                "popup": "Popup hatás",
                "popupdesc": "Kikapcsolja a Popup effektet (játék képének nagyítása), amikor egy játék fölé viszed az egérmutatót a kezdőlapon",
                "streammondesc": "Stream Monitor bekapcsolása játék indításánál.",
                "resolutiondesc": "A beállított felbontáshoz (1440p, 2160pv) VP9 videó kódolás támogatás szükséges.",
                "codecdesc": "A stream-hez használt videó kódoló eljárás.",
                "confirmreset": "Biztosan vissza akarod állítani a beállításokat?",
                "gamesfinished": "Vége a játéknak",
                "achievementsunlocked": "Megszerzett jutalom",
                "splitstore": "Áruház oszlopos megjelenítés",
                "splitstoredesc": "Az Áruház 2 oszlopos megjelenítése a jobb láthatóság miatt.",
                "scrollbar": "Görgetősáv",
                "scrollbardesc": "Bekapcsolja a görgetősávot az Áruházban és a Kezdőlapon.",
                "resetsettings": "Beállítások alaphelyzetbe állítása"
            }`
            break
        case "de": // https://github.com/ChristopherKlay/StadiaEnhanced/discussions/13
            var load = `{
                "languagecode": "de",
                "default": "Standard",
                "native": "Nativ",
                "hide": "Verstecke",
                "show": "Zeige",
                "visible": "Sichtbar",
                "hidden": "Versteckt",
                "enabled": "Aktiviert",
                "disabled": "Deaktiviert",
                "auto": "Automatisch",
                "manual": "Manuel",
                "games": "Spiele",
                "bundles": "Bundles",
                "addons": "Add-ons",
                "responsive": "Responsiv",
                "windowed": "Fenster Modus",
                "fullscreen": "Vollbild",
                "searchstore": "Im Store suchen",
                "onsale": "Im Angebot",
                "prodeals": "Pro Angebote",
                "allgames": "Alle Spiele",
                "usermedia": "Fotos & Videos",
                "searchbtnbase": "Suche auf",
                "avatarpopup": "Neue Avatar URL (keine für Zurücksetzung):",
                "searchheader": "Spiele beinhalten",
                "sessiontime": "Sitzungszeit",
                "codec": "Codec",
                "resolution": "Auflösung",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Sitzungs-Traffic",
                "trafficcurrent": "Derzeitiger Traffic",
                "trafficaverage": "Durchschnittlicher Traffic",
                "packetloss": "Packetverlust",
                "framedrop": "Verlorene Frames",
                "latency": "Latenz",
                "jitter": "Jitter-Puffer",
                "decodetime": "Dekodierungs Zeit",
                "compression": "Kompression",
                "streammon": "Stream Monitor",
                "stream": "Stream",
                "community": "Community",
                "speedtest": "Speedtest",
                "quickaccess": "Schnellzugriff",
                "messages": "Nachrichten",
                "avatar": "Avatar",
                "interface": "Oberfläche",
                "shortcut": "Verknüpfungen",
                "shortcuttitle": "Installiere eine Verknüpfung für",
                "shortcutdesc": "Erlaubt das erstellen einer Verknüpfung von Spielen auf dem Gerät.",
                "gridsize": "Rastergröße",
                "griddesc": "Ändert die Anzahl der Spiele pro Reihe auf dem Startbildschirm.",
                "clock": "Uhr",
                "clockdesc": "Zeigt die Uhrzeit in der Freundesliste, als Einblendung im Spiel, oder beides.",
                "friendslist": "Freundesliste",
                "igoverlay": "Spiel Einblendung",
                "listoverlay": "Liste & Einblendung",
                "filter": "Filter",
                "filterdesc": "Erlaubt das sortieren des Startbildschirmes durch verstecken von Spielen.",
                "filtertoggle": "Wechsel",
                "filterquick": "Schnell",
                "invitebase": "Einladungslink kopieren",
                "inviteactive": "Kopiert!",
                "prolabel": "Pro Beschriftung",
                "prolabeldesc": "Entfernt die 'Pro' Beschriftung von Spielen auf dem Startbildschirm.",
                "homegallery": "Nutzer Galerie",
                "homegallerydesc": "Versteckt den 'Aufnahmen' Bereich am unteren Ende des Startbildschirmes.",
                "quickprev": "Nachrichten Vorschau",
                "quickprevdesc": "Versteckt die Vorschau der letzten Nachricht in der Freundesliste.",
                "quickrep": "Schnellantwort",
                "quickrepdesc": "Versteckt die Antwortvorschläge in Chats.",
                "offlinefriend": "Offline Freunde",
                "offlinefrienddesc": "Versteckt offline Freunde in der Freundesliste.",
                "invisiblefriend": "Unsichtbare Freunde",
                "invisiblefrienddesc": "Versteckt Freunde ohne bekannten online Status in der Freundesliste.",
                "streammode": "Streaming Modus",
                "streammodedesc": "Aktivieren um bestimmte Elemente (z.B. die Freundesliste) während des streamens (über z.B. OBS / Discord) unleserlich zu machen.",
                "catprev": "Kategorie Vorschau",
                "catprevdesc": "Entfernt die Anzeige der Kategorien bei Spielen auf dem Startbildschirm.",
                "popup": "Popup Effekt",
                "popupdesc": "Entfernt den vergrößern/zoomen Effekt bei Spielen auf dem Startbildschirm.",
                "streammondesc": "Aktivieren um den Streaming Monitor beim starten von Spielen automatisch zu starten.",
                "resolutiondesc": "Die angezielte Auflösung für Spiele. 1440p und 2160p benötigen VP9.",
                "codecdesc": "Der für Spiele genutzte Codec.",
                "confirmreset": "Möchtest du die Einstellungen sicher zurücksetzen?",
                "gamesfinished": "Spiele Abgeschlossen",
                "achievementsunlocked": "Erfolge Freigeschaltet",
                "splitstore": "Store Listen teilen",
                "splitstoredesc": "Teilt Listen im Store für eine bessere Übersicht in zwei Spalten.",
                "scrollbardesc": "Aktiviert Scrollbalken im Store und dem Startbildschirm.",
                "resetsettings": "Einstellungen zurücksetzen"
            }`
            break
        default:
            var load = `{
                "languagecode": "en",
                "default": "Default",
                "native": "Native",
                "hide": "Hide",
                "show": "Show",
                "visible": "Visible",
                "hidden": "Hidden",
                "enabled": "Enabled",
                "disabled": "Disabled",
                "auto": "Automatic",
                "manual": "Manual",
                "games": "Games",
                "bundles": "Bundles",
                "addons": "Add-ons",
                "responsive": "Responsive",
                "windowed": "Windowed Mode",
                "fullscreen": "Fullscreen",
                "searchstore": "Search store",
                "onsale": "On Sale",
                "prodeals": "Pro Deals",
                "allgames": "All Games",
                "usermedia": "Screenshots & Videos",
                "searchbtnbase": "Search on",
                "avatarpopup": "New avatar URL (empty for default):",
                "searchheader": "Games including",
                "sessiontime": "Session time",
                "codec": "Codec",
                "resolution": "Resolution",
                "hardware": "Hardware",
                "software": "Software",
                "trafficsession": "Session traffic",
                "trafficcurrent": "Current traffic",
                "trafficaverage": "Average traffic",
                "packetloss": "Packets lost",
                "framedrop": "Frames dropped",
                "latency": "Latency",
                "jitter": "Jitter Buffer",
                "decodetime": "Decoding Time",
                "compression": "Compression",
                "streammon": "Stream Monitor",
                "stream": "Stream",
                "community": "Community",
                "speedtest": "Speedtest",
                "quickaccess": "Quick Access",
                "messages": "Messages",
                "avatar": "Avatar",
                "interface": "Interface",
                "shortcut": "Shortcuts",
                "shortcuttitle": "Install a shortcut for",
                "shortcutdesc": "Allows you to install a shortcut for a game on your device",
                "gridsize": "Grid Size",
                "griddesc": "Changes the amount of games per row on the homescreen.",
                "clock": "Clock",
                "clockdesc": "Displays the current time on the friends list, as a in-game overlay, or both.",
                "friendslist": "Friends List",
                "igoverlay": "In-Game Overlay",
                "listoverlay": "List & Overlay",
                "filter": "Filter",
                "filterdesc": "Allows you to sort your homescreen by hiding games. The filter can be toggled via the symbol, top-right above your games on the homescreen.",
                "filtertoggle": "Toggle",
                "filterquick": "Quick",
                "invitebase": "Copy invite link",
                "inviteactive": "Copied!",
                "prolabel": "Pro Label",
                "prolabeldesc": "Removes the 'Pro' label from games on the homescreen.",
                "homegallery": "User Gallery",
                "homegallerydesc": "Hides the 'Captures' area at the bottom of the homescreen.",
                "quickprev": "Message Preview",
                "quickprevdesc": "Hides the message preview in the friends list.",
                "quickrep": "Quick Reply",
                "quickrepdesc": "Hides the quick reply option in chats.",
                "offlinefriend": "Offline Friends",
                "offlinefrienddesc": "Hides offline friends in the friends list.",
                "invisiblefriend": "Invisible Friends",
                "invisiblefrienddesc": "Hides friends with unknown online status in the friends list.",
                "streammode": "Streaming Mode",
                "streammodedesc": "Enable to make certain elements (i.e. the friends list) unreadable while streaming (via tools like OBS / Discord).",
                "catprev": "Category Preview",
                "catprevdesc": "Hides the category tags when hovering over a game.",
                "popup": "Popup Effect",
                "popupdesc": "Removes the zoom-in / enlarge effect when hovering over a game on the homesceen.",
                "streammondesc": "Activate to start the monitor whenever a game starts.",
                "resolutiondesc": "The targeted resolution for game streams. 1440p and 2160p require VP9.",
                "codecdesc": "The codec used for game streams.",
                "confirmreset": "Are you sure you want to reset the settings?",
                "gamesfinished": "Games Finished",
                "achievementsunlocked": "Achievements Unlocked",
                "splitstore": "Split Store Lists",
                "splitstoredesc": "Splits store lists into two columns for a better overview.",
                "scrollbardesc": "Enables scrollbars on the homescreen and store.",
                "resetsettings": "Reset Settings"
            }`
    }
    try {
        load = JSON.parse(load);
    } catch (e) {
        console.log("Error in " + lang + " translation.");
        console.log(e);
        return loadLanguages("");
    }
    return load;
}
