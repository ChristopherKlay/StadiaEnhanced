// Start Up
var enhanced_startTimer = new Date().getTime();

// Settings - Stream Monitor (Credits to AquaRegia)
// Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
function enhanced_RTCMonitor() {
    'use strict';

    function formatBytes(a, b) {
        if (0 == a) return "0 Bytes";
        var c = 1024,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    function formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds);
    }

    var peerConnections = [];

    (function(original) {
        RTCPeerConnection = function() {
            var connection = new original(arguments[0], arguments[1]);
            peerConnections.push(connection);
            return connection;
        };
        RTCPeerConnection.prototype = original.prototype;
    })(RTCPeerConnection);

    var enhanced_streamMonitor = document.createElement("div");
    enhanced_streamMonitor.id = "enhanced_streamMonitor";
    enhanced_streamMonitor.innerHTML = "Stadia Enhanced";
    enhanced_streamMonitor.style.position = "fixed";
    enhanced_streamMonitor.style.width = "auto";
    enhanced_streamMonitor.style.zIndex = 1000;
    enhanced_streamMonitor.style.borderRadius = "1rem";
    enhanced_streamMonitor.style.background = "linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%)";
    enhanced_streamMonitor.style.padding = "0.5rem";
    enhanced_streamMonitor.style.fontSize = "0.8rem";
    enhanced_streamMonitor.style.display = "none";
    document.body.appendChild(enhanced_streamMonitor);

    function enhanced_updateMonitor(opt) {
        switch (opt) {
            case 0:
            enhanced_streamMonitor.style.display = "none";
            break
            case 1:
            enhanced_streamMonitor.style.top = "1rem";
            enhanced_streamMonitor.style.right = "";
            enhanced_streamMonitor.style.bottom = "";
            enhanced_streamMonitor.style.left = "1rem";
            enhanced_streamMonitor.style.display = "block";
            break;
            case 2:
            enhanced_streamMonitor.style.top = "1rem";
            enhanced_streamMonitor.style.right = "1rem";
            enhanced_streamMonitor.style.bottom = "";
            enhanced_streamMonitor.style.left = "";
            enhanced_streamMonitor.style.display = "block";
            break;
            case 3:
            enhanced_streamMonitor.style.top = "";
            enhanced_streamMonitor.style.right = "1rem";
            enhanced_streamMonitor.style.bottom = "1rem";
            enhanced_streamMonitor.style.left = "";
            enhanced_streamMonitor.style.display = "block";
            break;
            case 4:
            enhanced_streamMonitor.style.top = "";
            enhanced_streamMonitor.style.right = "";
            enhanced_streamMonitor.style.bottom = "1rem";
            enhanced_streamMonitor.style.left = "1rem";
            enhanced_streamMonitor.style.display = "block";
            break;
        }
    } 

    var lastTime = new Date();
    var lastBytes = 0;
    var lastFrames = 0;
    var lastFramesDecoded = 0;
    var lastBufferDelay = 0;
    var lastBufferEmitted = 0;
    var lastQpSum = 0;
    var sessionStart;
    var active = false;

    enhanced_updateMonitor(0)
    var enhanced_MonitorState = 0;
    localStorage.setItem("enhanced_MonitorOption", enhanced_MonitorState)
    localStorage.setItem("enhanced_MonitorState", 0)

    console.log("[Stadia Enhanced] ⚙️ - Stream Monitor: Successfully injected.");

    setInterval(function() {
        var enhanced_MonitorOption = parseInt(localStorage.getItem("enhanced_MonitorOption") || 0);
        if (enhanced_MonitorOption != enhanced_MonitorState) {
            enhanced_MonitorState = enhanced_MonitorOption;
            localStorage.setItem("enhanced_MonitorOption", enhanced_MonitorState)
            enhanced_updateMonitor(enhanced_MonitorState)
        }

        if (document.location.href.indexOf("/player/") == -1) {
            peerConnections = [];
            lastBytes = 0;
            lastFrames = 0;
            active = false;
            enhanced_streamMonitor.innerHTML = "Waiting for game detection.";
            localStorage.setItem("enhanced_MonitorState", 0)
            localStorage.setItem("enhanced_MonitorOption", 0)
        } else if (peerConnections.length >= 3) {
            if (!active) {
                sessionStart = new Date();
                active = true;
                localStorage.setItem("enhanced_MonitorState", 1)
                console.log("[Stadia Enhanced] ⚙️ - Stream Monitor: Monitoring started.");
            }

            peerConnections[2].getStats().then(function(stats) {
                for (var key of stats.keys()) {
                    if (key.indexOf("RTCInboundRTPVideoStream") != -1) {
                        var tmp1 = stats.get(key);
                        var tmp2 = stats.get(tmp1.trackId);

                        peerConnections[2].getStats(function(stats) {
                            var tmp3 = stats.result().find(function(f) {
                                return "ssrc" == f.type && f.id.endsWith("recv") && f.names().includes("mediaType") && "video" == f.stat("mediaType");
                            });

                            var time = new Date();
                            var timeSinceUpdate = (time - lastTime) / 1000;
                            lastTime = time;
                            var sessionDuration = (time - sessionStart) / 1000;
                            time = new Date(time - time.getTimezoneOffset() * 60 * 1000).toISOString().replace("T", " ").split(".")[0];
                            var resolution = tmp2.frameWidth + "x" + tmp2.frameHeight;
                            var framesReceived = tmp2.framesReceived;
                            var framesReceivedPerSecond = (framesReceived - lastFrames) / timeSinceUpdate;
                            var framesDecoded = tmp2.framesDecoded;
                            var codec = tmp3.stat("googCodecName");
                            var bytesReceived = tmp1.bytesReceived;
                            var bytesReceivedPerSecond = (bytesReceived - lastBytes) / timeSinceUpdate;
                            var averageData = ((((bytesReceived / sessionDuration) * 3600) / 1024) / 1024) / 1024;
                            var packetsLost = tmp1.packetsLost;
                            var packetsReceived = tmp1.packetsReceived;
                            var framesDropped = tmp2.framesDropped;
                            var latency = tmp3.stat("googCurrentDelayMs");
                            var jitterBufferDelay = tmp2.jitterBufferDelay * 1000;
                            var jitterBufferEmittedCount = tmp2.jitterBufferEmittedCount;
                            var jitterBuffer = tmp3.stat("googJitterBufferMs");
                            //var jitterBuffer = parseInt((jitterBufferDelay - lastBufferDelay) / (jitterBufferEmittedCount - lastBufferEmitted));

                            if (codec == "VP9") {
                                var compression = (tmp1.qpSum - lastQpSum) / (framesDecoded - lastFramesDecoded);
                            }

                            lastFrames = framesReceived;
                            lastFramesDecoded = framesDecoded;
                            lastBytes = bytesReceived;
                            lastBufferDelay = jitterBufferDelay;
                            lastBufferEmitted = jitterBufferEmittedCount;
                            lastQpSum = tmp1.qpSum;

                            if (framesReceived > 0) {
                                var html = "";

                                html += '<svg height="40" width="220" viewBox="0 0 120 80" fill="white"><path d="M1.00857143,23.3413856 C0.362857143,23.8032807 0.00285714286,24.5360402 0,25.2901838 L0,25.2901838 L0,25.3201215 C0.00285714286,25.6380308 0.0685714286,25.9602169 0.204285714,26.2667213 L0.204285714,26.2667213 L11.69,52.2882388 C12.1985714,53.441551 13.5114286,54.0060895 14.7014286,53.5841112 L14.7014286,53.5841112 C22.2214286,50.9025535 48.2628571,42.4187946 65.1157143,46.9949777 L65.1157143,46.9949777 C65.1157143,46.9949777 48.21,47.9729409 32.9228571,59.96083 L32.9228571,59.96083 C32.0614286,60.6379911 31.7742857,61.8155385 32.2157143,62.8163113 L32.2157143,62.8163113 C33.4571429,65.6204709 35.9485714,71.2573021 37.3585714,74.4435231 L37.3585714,74.4435231 L39.3385714,79.0881351 C39.81,80.1901256 41.3157143,80.3227066 41.98,79.3247851 L41.98,79.3247851 C45.5471429,73.9531159 51.5614286,71.2701325 57.3385714,68.927868 L57.3385714,68.927868 C63.2571429,66.5300051 69.4328571,64.7408743 75.7328571,63.6759494 L75.7328571,63.6759494 C82.4457143,62.54117 89.3,62.2375168 96.0842857,62.8376953 L96.0842857,62.8376953 C97.2142857,62.9374875 98.2628571,62.2446448 98.6,61.1640383 L98.6,61.1640383 L103.788571,44.5814332 C104.094286,43.6006188 103.742857,42.528566 102.908571,41.9255362 L102.908571,41.9255362 C97.1228571,37.7342657 74.2042857,23.6564437 33.9014286,29.3118077 L33.9014286,29.3118077 C33.9014286,29.3118077 68.2928571,9.55581202 111.954286,31.2577547 L111.954286,31.2577547 C113.277143,31.916383 114.874286,31.2249659 115.315714,29.8193221 L115.315714,29.8193221 L119.89,15.1954944 C119.961429,14.9688237 119.995714,14.7393017 120,14.512631 L120,14.512631 L120,14.4427765 C119.987143,13.6102248 119.541429,12.8204411 118.784286,12.3913349 L118.784286,12.3913349 C113.304286,9.29065 94.7514286,2.79222317e-07 69.23,2.79222317e-07 L69.23,2.79222317e-07 C49.6685714,-0.00142532301 26.0157143,5.45578001 1.00857143,23.3413856"/></svg>'

                                html += "<center><b>" + time + "</b><br/>Session time: " + formatTime(sessionDuration) + "</center>";
                                html += "<br/>";

                                html += "<b>Resolution:</b> " + resolution;
                                html += "<br/>";

                                html += "<b>FPS:</b> " + framesReceivedPerSecond.toFixed(1);
                                html += "<br/>";

                                html += "<b>Codec:</b> " + codec;
                                html += "<br/>";

                                html += "<b>Session traffic:</b> " + formatBytes(bytesReceived, 2);
                                html += "<br/>";

                                html += "<b>Current traffic:</b> " + formatBytes(bytesReceivedPerSecond * 8, 2).slice(0, -1) + "b/s";
                                html += "<br/>";

                                html += "<b>Average traffic:</b> " + averageData.toFixed(2) + " GB/h";
                                html += "<br/>";

                                html += "<b>Packets lost:</b> " + packetsLost + " (" + ((packetsLost / packetsReceived) * 100).toFixed(3) + "%)";
                                html += "<br/>";

                                html += "<b>Frames dropped:</b> " + framesDropped + " (" + ((framesDropped / framesReceived) * 100).toFixed(3) + "%)";
                                html += "<br/>";

                                html += "<b>Latency:</b> " + latency + "ms";
                                html += "<br/>";

                                html += "<b>Jitter buffer:</b> " + jitterBuffer + "ms";
                                html += "<br/>";

                                if (codec == "VP9") {
                                    html += "<b>Compression:</b> " + compression.toFixed(1);
                                    html += "<br/>";
                                }

                                enhanced_streamMonitor.innerHTML = html;
                            }
                        });
}
}
});
}
}, 1000);
};
embed(enhanced_RTCMonitor);

var enhanced_Monitor = document.createElement("div");
enhanced_Monitor.className = "CTvDXd QAAyWd Fjy05d ivWUhc wJYinb QSDHyc rpgZzc RkyH1e";
enhanced_Monitor.id = "enhanced_Monitor";
enhanced_Monitor.innerHTML = "Stream Monitor";
enhanced_Monitor.style.cursor = "pointer";
enhanced_Monitor.style.marginRight = "10px";
enhanced_Monitor.style.userSelect = "none";
enhanced_Monitor.tabIndex = "0";
enhanced_Monitor.addEventListener("click", function() {
    localStorage.setItem("enhanced_MonitorOption", (parseInt(localStorage.getItem("enhanced_MonitorOption") || 0) + 1) % 5)
});

// Settings - Pro Games
var enhanced_ProGames = document.createElement("div");
enhanced_ProGames.className = "CTvDXd QAAyWd soKQKc wJYinb";
enhanced_ProGames.id = "enhanced_ProGames";
enhanced_ProGames.innerHTML = "Pro";
enhanced_ProGames.style.marginRight = "20px";
enhanced_ProGames.style.cursor = "pointer";
enhanced_ProGames.style.userSelect = "none";
enhanced_ProGames.tabIndex = "0";
enhanced_ProGames.addEventListener("click", function() {
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/2001", "_self");
});
if (document.querySelectorAll(".YNlByb")[0] !== undefined) {
    document.querySelectorAll(".YNlByb")[0].append(enhanced_ProGames);
}

// Settings - Store Search
var enhanced_StoreSearch = document.createElement("input");
enhanced_StoreSearch.className = "CTvDXd QAAyWd soKQKc wJYinb";
enhanced_StoreSearch.id = "enhanced_StoreSearch";
enhanced_StoreSearch.placeholder = "Search";
enhanced_StoreSearch.style.border = "none";
enhanced_StoreSearch.style.backgroundColor = "rgba(255,255,255,.06)";
enhanced_StoreSearch.style.outline = "none";
enhanced_StoreSearch.style.marginRight = "20px";
enhanced_StoreSearch.style.display = "none";
enhanced_StoreSearch.addEventListener("keypress", function() {
    if (event.keyCode == 13 && enhanced_StoreSearch.value != "") {
        window.open(document.querySelector("head > base").getAttribute("href") + "store/list/3?search=" + enhanced_StoreSearch.value, "_self");
    }
});
if (document.querySelectorAll(".YNlByb")[0] !== undefined) {
    document.querySelectorAll(".YNlByb")[0].append(enhanced_StoreSearch);
}

// Settings - Store Dropdown
var enhanced_dropContainer = document.createElement("div");
enhanced_dropContainer.className = "NfVFqd cr1oJe QAAyWd wJYinb";
enhanced_dropContainer.id = "enhanced_dropContainer";
enhanced_dropContainer.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_dropContainer.style.marginRight = "20px";
enhanced_dropContainer.style.cursor = "pointer";
enhanced_dropContainer.style.userSelect = "none";
enhanced_dropContainer.tabIndex = "0";
enhanced_dropContainer.addEventListener("click", function() {
    if (enhanced_dropContent.style.display === "none") {
        enhanced_dropContent.style.display = "block";
    } else {
        enhanced_dropContent.style.display = "none";
    }
});

window.onclick = function(event) {
  if (!event.target.matches('#enhanced_dropContainer')) {
    enhanced_dropContent.style.display = "none";
}
}

var enhanced_dropContent = document.createElement("div");
enhanced_dropContent.id = "enhanced_dropContent";
enhanced_dropContent.style.position = "absolute";
enhanced_dropContent.style.width = "15rem";
enhanced_dropContent.style.top = "4.25rem";
enhanced_dropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_dropContent.style.background = "#2d2e30";
enhanced_dropContent.style.borderRadius =  "0.5rem";
enhanced_dropContent.style.zIndex = "20";
enhanced_dropContent.style.display = "none";

if (document.querySelectorAll(".YNlByb")[0] !== undefined) {
    document.querySelectorAll(".YNlByb")[0].append(enhanced_dropContainer);
    enhanced_dropContainer.append(enhanced_dropContent);
}

// Settings - Dropdown > Base Deals
var enhanced_baseDeals = document.createElement("div");
enhanced_baseDeals.className = "pBvcyf QAAyWd";
enhanced_baseDeals.id = "enhanced_baseDeals";
enhanced_baseDeals.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">local_offer</i></span><span class="mJVLwb">Base Deals</span>';
enhanced_baseDeals.style.cursor = "pointer";
enhanced_baseDeals.style.userSelect = "none";
enhanced_baseDeals.tabIndex = "0";
enhanced_baseDeals.addEventListener("click", function() {
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/86", "_self");
});
enhanced_dropContent.append(enhanced_baseDeals);

// Settings - Dropdown > Pro Deals
var enhanced_proDeals = document.createElement("div");
enhanced_proDeals.className = "pBvcyf QAAyWd";
enhanced_proDeals.id = "enhanced_proDeals";
enhanced_proDeals.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">loyalty</i></span><span class="mJVLwb">Pro Deals</span>';
enhanced_proDeals.style.cursor = "pointer";
enhanced_proDeals.style.userSelect = "none";
enhanced_proDeals.tabIndex = "0";
enhanced_proDeals.addEventListener("click", function() {
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/45", "_self");
});
enhanced_dropContent.append(enhanced_proDeals);

// Settings - Dropdown > All games
var enhanced_listAll = document.createElement("div");
enhanced_listAll.className = "pBvcyf QAAyWd";
enhanced_listAll.id = "enhanced_listAll";
enhanced_listAll.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">list</i></span><span class="mJVLwb">All games</span>';
enhanced_listAll.style.cursor = "pointer";
enhanced_listAll.style.userSelect = "none";
enhanced_listAll.tabIndex = "0";
enhanced_listAll.addEventListener("click", function() {
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/3", "_self");
});
enhanced_dropContent.append(enhanced_listAll);

// Settings - Captures
var enhanced_Captures = document.createElement("div");
enhanced_Captures.className = "NfVFqd cr1oJe QAAyWd wJYinb";
enhanced_Captures.id = "enhanced_Captures";
enhanced_Captures.innerHTML = '<i class="material-icons-extended" aria-hidden="true">camera_alt</i>'
enhanced_Captures.style.cursor = "pointer";
enhanced_Captures.style.userSelect = "none";
enhanced_Captures.tabIndex = "0";
enhanced_Captures.addEventListener("click", function() {
    window.open("/captures", "_self");
});
if (document.querySelectorAll(".WpnpPe")[0] !== undefined) {
    document.querySelectorAll(".WpnpPe")[0].prepend(enhanced_Captures);
}

// Settings - Grid
var enhanced_GridSize = parseInt(localStorage.getItem("enhanced_GridSize") || 0);
callenhanced_GridSize(enhanced_GridSize)
var enhanced_Grid = document.createElement("div");
enhanced_Grid.className = "NfVFqd cr1oJe QAAyWd wJYinb";
enhanced_Grid.id = "enhanced_Grid";
enhanced_Grid.innerHTML = '<i class="material-icons-extended" aria-hidden="true">view_comfy</i>'
enhanced_Grid.style.cursor = "pointer";
enhanced_Grid.style.userSelect = "none";
enhanced_Grid.tabIndex = "0";
enhanced_Grid.addEventListener("click", function() {
    enhanced_GridSize = (enhanced_GridSize + 1) % 5;
    localStorage.setItem("enhanced_GridSize", enhanced_GridSize);
    callenhanced_GridSize(enhanced_GridSize)
});
if (document.querySelectorAll(".WpnpPe")[0] !== undefined) {
    document.querySelectorAll(".WpnpPe")[0].prepend(enhanced_Grid);
}

function callenhanced_GridSize(size) {
    switch (size) {
        case 0:
        enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(2,auto) !important; }');
        enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: 21.75rem !important; }');
        enhanced_addGlobalStyle('.a1l9D { margin: 0 0 1.5rem 1.5rem !important; }');
        enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1.5rem !important; }');
        break;
        case 1:
        enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(3,auto) !important; }');
        enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.66) !important; }');
        enhanced_addGlobalStyle('.a1l9D { margin: 0 0 1.5rem 1.5rem !important; }');
        enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1.5rem !important; }');
        break;
        case 2:
        enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(4,auto) !important; }');
        enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.5) !important; }');
        enhanced_addGlobalStyle('.a1l9D { margin: 0 0 1rem 1rem !important; }');
        enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1rem !important; }');
        break;
        case 3:
        enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(5,auto) !important; }');
        enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.4) !important; }');
        enhanced_addGlobalStyle('.a1l9D { margin: 0 0 1rem 1rem !important; }');
        enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1rem !important; }');
        break;
        case 4:
        enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(6,auto) !important; }');
        enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.33) !important; }');
        enhanced_addGlobalStyle('.a1l9D { margin: 0 0 0.2rem 0.2rem !important; }');
        enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1rem !important; }');
        break;
    }
    console.log("[Stadia Enhanced] ⚙️ - Library Grid Size: Set to " + (enhanced_GridSize + 2) + ".");
}

// Settings - Screen
localStorage.setItem("enhanced_DeskWidth", window.screen.width);
localStorage.setItem("enhanced_DeskHeight", window.screen.height);
// Object.defineProperty(window.screen, "colorDepth", { value: 48 });

function enhanced_changeResolution() {
    // Source: https://superuser.com/questions/712461/
    var enhancedinject_currentResolution;
    setInterval(function() {
        var enhancedinject_newResolution = parseInt(localStorage.getItem("enhanced_ResOption"));
        if (enhancedinject_newResolution != enhancedinject_currentResolution) {
            enhancedinject_currentResolution = enhancedinject_newResolution;
            switch (enhancedinject_currentResolution) {
                case 0:
                var x = parseInt(localStorage.getItem("enhanced_DeskWidth") || 1920);
                var y = parseInt(localStorage.getItem("enhanced_DeskHeight") || 1920);
                console.log("[Stadia Enhanced] ⚙️ - Resolution: Set to 'Native'.");
                break
                case 1:
                var x = 2560
                var y = 1440
                console.log("[Stadia Enhanced] ⚙️ - Resolution: Set to '2560x1440'.");
                break
                case 2:
                var x = 3840
                var y = 2160
                console.log("[Stadia Enhanced] ⚙️ - Resolution: Set to '3840x2160'.");
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
        }
    }, 1000);
}
embed(enhanced_changeResolution);

var enhanced_Resolution = document.createElement("div");
enhanced_Resolution.className = "pBvcyf QAAyWd";
enhanced_Resolution.id = "enhanced_Resolution";
enhanced_Resolution.innerHTML = "Native";
var enhanced_currentRes = parseInt(localStorage.getItem("enhanced_ResOption") || 0);
enhanced_updateResolution(enhanced_currentRes)
enhanced_Resolution.style.cursor = "pointer";
enhanced_Resolution.style.userSelect = "none";
enhanced_Resolution.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Resolution.addEventListener("click", function(evt) {
    enhanced_currentRes = (enhanced_currentRes + 1) % 3;
    localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
    enhanced_updateResolution(enhanced_currentRes)
});

function enhanced_updateResolution(res) {
    switch (res) {
        case 0:
        enhanced_Resolution.style.color = "white";
        enhanced_Resolution.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">monitor</i></span><span class="mJVLwb">Native</span>'
        break
        case 1:
        var x = 2560
        var y = 1440
        enhanced_Resolution.style.color = "#00e0ba";
        enhanced_Resolution.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">monitor</i></span><span class="mJVLwb">2K</span>'
        break
        case 2:
        var x = 3840
        var y = 2160
        enhanced_Resolution.style.color = "#00e0ba";
        enhanced_Resolution.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">monitor</i></span><span class="mJVLwb">4K</span>'
        break
    }
}

if (document.querySelectorAll(".crOn3e")[0] !== undefined) {
    document.querySelectorAll(".crOn3e")[0].prepend(enhanced_Resolution);
}

// Settings - VP9
var enhanced_Codec = document.createElement("div");
enhanced_Codec.className = "pBvcyf QAAyWd";
enhanced_Codec.id = "enhanced_Codec";
var enhanced_currentCodec = parseInt(localStorage.getItem("enhanced_CodecOption") || 0);
enhanced_changeCodec(enhanced_currentCodec);
enhanced_Codec.style.cursor = "pointer";
enhanced_Codec.style.userSelect = "none";
enhanced_Codec.addEventListener("click", function() {
    enhanced_currentCodec = (enhanced_currentCodec + 1) % 3;
    localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
    enhanced_changeCodec(enhanced_currentCodec);
});

if (document.querySelectorAll(".crOn3e")[0] !== undefined) {
    document.querySelectorAll(".crOn3e")[0].prepend(enhanced_Codec);
}

function enhanced_changeCodec(c) {
    switch (c) {
        case 0:
        enhanced_Codec.style.color = "white";
        enhanced_Codec.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">video_settings</i></span><span class="mJVLwb">Default</span>'
        console.log("[Stadia Enhanced] ⚙️ - Codec Preference: Set to 'Default'.");
        break
        case 1:
        enhanced_Codec.style.color = "#00e0ba";
        enhanced_Codec.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">video_settings</i></span><span class="mJVLwb">VP9</span>'
        console.log("[Stadia Enhanced] ⚙️ - Codec Preference: Set to 'VP9'.");
        break
        case 2:
        enhanced_Codec.style.color = "#00e0ba";
        enhanced_Codec.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">video_settings</i></span><span class="mJVLwb">H264</span>'
        console.log("[Stadia Enhanced] ⚙️ - Codec Preference: Set to 'H264'");
        break
    }
}

// Settings - Custom Avatar
if (localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")) !== null) {
    enhanced_setAvatar(localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")));
}

document.querySelector(".PMkDOc").addEventListener("click", function() {
    enhanced_avatarURL = prompt("New avatar URL (empty for default):")
    if (enhanced_avatarURL.length < 1) {
        enhanced_setAvatar(document.querySelector(".ksZYgc.VGZcUb").style.backgroundImage.replace(/(url\(|\)|")/g, ''));
        localStorage.removeItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"));
    } else {
        localStorage.setItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"), enhanced_avatarURL);
        enhanced_setAvatar(enhanced_avatarURL);
    }
});

function enhanced_setAvatar(url) {
    console.log("[Stadia Enhanced] ⚙️ - Avatar changed to: " + url);
    enhanced_addGlobalStyle('.ksZYgc.VGZcUb { background-color: #ff773d !important }');
    enhanced_addGlobalStyle('.ksZYgc.VGZcUb { background-image: url("' + url + '") !important; }');
    enhanced_addGlobalStyle('.rybUIf { background-image: url("' + url + '") !important; }');
    enhanced_addGlobalStyle('.Nv1Sab { content: url("' + url + '") !important; }');
    enhanced_addGlobalStyle('.dOyvbe { background-image: url("' + url + '") !important; }');
}


// After Setup
console.log("[Stadia Enhanced] ⏲️ - Start Up: Loaded in " + (new Date().getTime() - enhanced_startTimer) + "ms.")

// Main Loop
setInterval(function() {
    // Loop Start
    //var enhanced_loopTimer = new Date().getTime();

    // Use VP9 if possible
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
        localStorage.setItem("video_codec_implementation_by_codec_key", '{"h264":"FFmpeg"}');
        break
    }

    // Store Features / Search
    // Example: /store/list/3?search=NBA
    if (document.location.href.indexOf("/store") != -1) {
        enhanced_StoreSearch.style.display = "flex";
        enhanced_dropContainer.style.display = "flex";
    } else {
        enhanced_StoreSearch.style.display = "none";
        enhanced_dropContainer.style.display = "none";
    }
    if (document.location.href.indexOf("/store/list/3?") != -1) {
        var enhanced_searchParams = new URLSearchParams(window.location.search).get('search');
        if (enhanced_searchParams !== null) {
            var enhanced_searchCount = 0;
            document.querySelector(".TJQxhf").style.display = "none";
            document.getElementsByClassName("h6J22d null QAAyWd");
            enhanced_gameList = document.getElementsByClassName("h6J22d null QAAyWd");
            for(var i = 0; i < enhanced_gameList.length; i++) {
                if (enhanced_gameList[i].getAttribute("aria-label").match(new RegExp(enhanced_searchParams, 'gi')) === null) {
                    enhanced_gameList[i].style.display="none";
                } else {
                    enhanced_searchCount += 1;
                }
            }
            document.querySelector(".HZ5mJ").innerHTML = "Games including '" + enhanced_searchParams + "' (" + enhanced_searchCount + ")";
        }
    }

    // Force allow 4K in settings
    if (document.location.href.indexOf("/settings") != -1 && document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0] !== undefined) {
        document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0].setAttribute("data-disabled", "false");
        document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0].classList.remove("OWB6Me");
    }

    // Re-prepend monitor control after refresh
    if (parseInt(localStorage.getItem("enhanced_MonitorState")) == 1) {
        enhanced_Monitor.style.display = "flex";
        if (document.getElementById("enhanced_Monitor") === null && document.querySelectorAll(".VCcUVc")[0] !== undefined) {
            document.querySelectorAll(".VCcUVc")[0].prepend(enhanced_Monitor);
        }
    } else {
        enhanced_Monitor.style.display = "none";
    }

    // Pro Games
    if (document.location.href.indexOf("/store/list/2001") != -1) {
        document.querySelector(".YNlByb.URhE4b.G4fJWe").childNodes[2].classList.remove("YySNWc");
        enhanced_ProGames.style.backgroundColor = "rgba(255,255,255,.06)";
        enhanced_ProGames.style.color = "#ff773d";
        if (document.querySelector(".alEDLe") !== null) {
            count = document.querySelector(".alEDLe").querySelectorAll('.X5624d').length;
            count = count / document.querySelectorAll(".alEDLe").length;
            if (count != 0 && enhanced_ProGames.innerHTML.indexOf(count) == -1) {
                enhanced_ProGames.innerHTML = 'Pro (' + count + ")";
            }
        }
    } else {
        enhanced_ProGames.style.backgroundColor = "";
        enhanced_ProGames.style.color = "rgba(255,255,255,.9)";
        if (enhanced_ProGames.innerHTML != "Pro") {
            enhanced_ProGames.innerHTML = "Pro";
        }
    }

    // Loop End
    //console.log("[Stadia Enhanced] ⏲️ - Loop Time: " + (new Date().getTime() - enhanced_loopTimer) + "ms.")
}, 1000);

// Source: https://somethingididnotknow.wordpress.com/2013/07/01/
function enhanced_addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Source: https://stackoverflow.com/questions/12395722/
function embed(fn) {
    const script = document.createElement("script");
    script.text = `(${fn.toString()})();`;
    document.documentElement.appendChild(script);
}
