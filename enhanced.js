// Start Up
var enhanced_StartTimer = new Date().getTime();
var enhanced_local = document.querySelector("html").getAttribute("lang");
var enhanced_lang = loadLanguages(enhanced_local);
var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
var enhanced_AccountName = document.querySelectorAll(".VY8blf.fSorq")[0].textContent;
var enhanced_AccountID = document.querySelector(".ksZYgc.VGZcUb").getAttribute("data-player-id");
console.log("%cStadia Enhanced" + "%c ⚙️ - User: " + enhanced_AccountName + " (" + enhanced_AccountID + ") (" + enhanced_local + ")", enhanced_consoleEnhanced, "");

// CSS Rules - Global styles and overwrites
enhanced_addGlobalStyle(".lTHVjf { padding: 0rem 1.5rem 0 1.5rem !important; }"); // Remove padding above avatar
enhanced_addGlobalStyle(".DGX7fe { display: none } "); // Hide the invite menu
enhanced_addGlobalStyle("#enhanced_showAll > i { font-size: 1.5rem; }"); // Change "Show All" size
enhanced_addGlobalStyle(".E0Zk9b { justify-content: flex-start !important; flex-flow: row wrap; }") // Wrap menu items

// Stream Monitor by AquaRegia
// Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
function enhanced_RTCMonitor() {
    'use strict';
    var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";

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

    var enhanced_StreamMonitor = document.createElement("div");
    enhanced_StreamMonitor.id = "enhanced_StreamMonitor";
    enhanced_StreamMonitor.innerHTML = "Stadia Enhanced";
    enhanced_StreamMonitor.style.position = "fixed";
    enhanced_StreamMonitor.style.width = "auto";
    enhanced_StreamMonitor.style.zIndex = 1000;
    enhanced_StreamMonitor.style.borderRadius = "1rem";
    enhanced_StreamMonitor.style.background = "linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%)";
    enhanced_StreamMonitor.style.padding = "0.5rem";
    enhanced_StreamMonitor.style.fontSize = "0.8rem";
    enhanced_StreamMonitor.style.display = "none";
    document.body.appendChild(enhanced_StreamMonitor);

    function enhanced_updateMonitor(opt) {
        switch (opt) {
            case 0:
                enhanced_StreamMonitor.style.display = "none";
                break
            case 1:
                enhanced_StreamMonitor.style.top = "1rem";
                enhanced_StreamMonitor.style.right = "";
                enhanced_StreamMonitor.style.bottom = "";
                enhanced_StreamMonitor.style.left = "1rem";
                enhanced_StreamMonitor.style.display = "block";
                break;
            case 2:
                enhanced_StreamMonitor.style.top = "1rem";
                enhanced_StreamMonitor.style.right = "1rem";
                enhanced_StreamMonitor.style.bottom = "";
                enhanced_StreamMonitor.style.left = "";
                enhanced_StreamMonitor.style.display = "block";
                break;
            case 3:
                enhanced_StreamMonitor.style.top = "";
                enhanced_StreamMonitor.style.right = "1rem";
                enhanced_StreamMonitor.style.bottom = "1rem";
                enhanced_StreamMonitor.style.left = "";
                enhanced_StreamMonitor.style.display = "block";
                break;
            case 4:
                enhanced_StreamMonitor.style.top = "";
                enhanced_StreamMonitor.style.right = "";
                enhanced_StreamMonitor.style.bottom = "1rem";
                enhanced_StreamMonitor.style.left = "1rem";
                enhanced_StreamMonitor.style.display = "block";
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

    console.log("%cStadia Enhanced" + "%c ⚙️ - Stream Monitor: Successfully injected.", enhanced_consoleEnhanced, "");

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
            enhanced_StreamMonitor.innerHTML = "Waiting for game detection.";
            localStorage.setItem("enhanced_MonitorState", 0)
            localStorage.setItem("enhanced_MonitorOption", 0)
        } else if (peerConnections.length >= 3) {
            if (!active) {
                sessionStart = new Date();
                active = true;
            }
            peerConnections[2].getStats().then(function(stats) {
                for (var key of stats.keys()) {
                    if (key.indexOf("RTCInboundRTPVideoStream") != -1) {
                        localStorage.setItem("enhanced_MonitorState", 1)

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

                                html += "<center><b>" + time + "</b><br/>" + enhanced_lang.sessiontime + ": " + formatTime(sessionDuration) + "</center>";
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.resolution + ":</b> " + resolution;
                                html += "<br/>";

                                html += "<b>FPS:</b> " + framesReceivedPerSecond.toFixed(1);
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.codec + ":</b> " + codec;
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.trafficsession + ":</b> " + formatBytes(bytesReceived, 2);
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.trafficcurrent + ":</b> " + formatBytes(bytesReceivedPerSecond * 8, 2).slice(0, -1) + "b/s";
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.trafficaverage + ":</b> " + averageData.toFixed(2) + " GB/h";
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.packetloss + ":</b> " + packetsLost + " (" + ((packetsLost / packetsReceived) * 100).toFixed(3) + "%)";
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.framedrop + ":</b> " + framesDropped + " (" + ((framesDropped / framesReceived) * 100).toFixed(3) + "%)";
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.latency + ":</b> " + latency + "ms";
                                html += "<br/>";

                                html += "<b>" + enhanced_lang.jitter + ":</b> " + jitterBuffer + "ms";
                                html += "<br/>";

                                if (codec == "VP9") {
                                    html += "<b>" + enhanced_lang.compression + ":</b> " + compression.toFixed(1);
                                    html += "<br/>";
                                }

                                enhanced_StreamMonitor.innerHTML = html;
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
enhanced_Monitor.className = "R2s0be";
enhanced_Monitor.id = "enhanced_Monitor";
enhanced_Monitor.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">analytics</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.streammon + '</span></div>'
enhanced_Monitor.style.cursor = "pointer";
enhanced_Monitor.style.userSelect = "none";
enhanced_Monitor.tabIndex = "0";
enhanced_Monitor.addEventListener("click", function() {
    localStorage.setItem("enhanced_MonitorOption", (parseInt(localStorage.getItem("enhanced_MonitorOption") || 0) + 1) % 5)
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
enhanced_ClockOverlay.style.display = "flex";
enhanced_ClockOverlay.style.alignItems = "center";
enhanced_ClockOverlay.style.justifyContent = "center";
enhanced_ClockOverlay.style.zIndex = "20";
enhanced_ClockOverlay.addEventListener("click", function() {
    enhanced_ClockMode = (enhanced_ClockMode + 1) % 2;
    localStorage.setItem("enhanced_ClockMode", enhanced_ClockMode);
});

// Pro Games - Adds a quick access to the current list of "Pro" titles on Stadia
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

/*
// Library Search - Adds a search bar filtering your homescreen library
// Current Issue: Keyboard navigation blocking keyboard functionality
var enhanced_LibrarySearch = document.createElement("input");
enhanced_LibrarySearch.className = "CTvDXd QAAyWd soKQKc wJYinb";
enhanced_LibrarySearch.id = "enhanced_LibrarySearch";
enhanced_LibrarySearch.placeholder = "Search library";
enhanced_LibrarySearch.tabIndex = "0";
enhanced_LibrarySearch.style.border = "none";
enhanced_LibrarySearch.style.textAlign = "left";
enhanced_LibrarySearch.style.paddingLeft = "3rem";
enhanced_LibrarySearch.style.background = "url('" + chrome.runtime.getURL("media/svg/search.svg") + "') 1rem center / 24px 24px no-repeat, rgba(255,255,255,.06)"
enhanced_LibrarySearch.style.marginRight = "20px";
enhanced_LibrarySearch.addEventListener("input", function(e) {
    var enhanced_FilterList = document.querySelectorAll(".YM0nee.E3eEyc.H3tvrc.f2eaLc")[document.querySelectorAll(".YM0nee.E3eEyc.H3tvrc.f2eaLc").length - 1].querySelectorAll(".GqLi4d");
    var enhanced_FilterTerm = enhanced_LibrarySearch.value

    for (var i = 0; i < enhanced_FilterList.length; i++) {
        if (enhanced_FilterList[i].getAttribute("aria-label").match(new RegExp(enhanced_FilterTerm, 'gi')) === null) {
            enhanced_FilterList[i].style.display = "none";
        } else {
            enhanced_FilterList[i].style.display = "block";
        }
    }
    document.querySelectorAll(".CVVXfc.YYy3Zb")[document.querySelectorAll(".CVVXfc.YYy3Zb").length - 1].scrollIntoView();
});
if (document.querySelectorAll(".YNlByb")[0] !== undefined) {
    document.querySelectorAll(".YNlByb")[0].append(enhanced_LibrarySearch);
}
*/

// Store Search - Adds a search bar to the Stadia store
var enhanced_StoreSearch = document.createElement("input");
enhanced_StoreSearch.className = "CTvDXd QAAyWd soKQKc wJYinb";
enhanced_StoreSearch.id = "enhanced_StoreSearch";
enhanced_StoreSearch.placeholder = enhanced_lang.searchstore;
enhanced_StoreSearch.style.border = "none";
enhanced_StoreSearch.style.textAlign = "left";
enhanced_StoreSearch.style.paddingLeft = "3rem";
enhanced_StoreSearch.style.background = "url('" + chrome.runtime.getURL("media/svg/search.svg") + "') 1rem center / 24px 24px no-repeat, rgba(255,255,255,.06)"
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

// Store Dropdown - Adds a dropdown menu for quick access
var enhanced_StoreDropdown = document.createElement("div");
enhanced_StoreDropdown.className = "NfVFqd AH4sJe QAAyWd wJYinb";
enhanced_StoreDropdown.id = "enhanced_StoreDropdown";
enhanced_StoreDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_StoreDropdown.style.marginRight = "20px";
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
enhanced_StoreDropContent.id = "enhanced_StoreDropContent";
enhanced_StoreDropContent.className = "us22N";
enhanced_StoreDropContent.style.position = "absolute";
enhanced_StoreDropContent.style.width = "auto";
enhanced_StoreDropContent.style.top = "4.25rem";
enhanced_StoreDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_StoreDropContent.style.zIndex = "20";
enhanced_StoreDropContent.style.display = "none";

if (document.querySelectorAll(".YNlByb")[0] !== undefined) {
    document.querySelectorAll(".YNlByb")[0].append(enhanced_StoreDropdown);
    enhanced_StoreDropdown.append(enhanced_StoreDropContent);
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
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/14", "_self");
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
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/45", "_self");
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
    window.open(document.querySelector("head > base").getAttribute("href") + "store/list/3", "_self");
});
enhanced_StoreDropContent.append(enhanced_AllGames);

// Settings Dropdown - Adds a dropdown menu for quick access
var enhanced_SettingsDropdown = document.createElement("div");
enhanced_SettingsDropdown.className = "NfVFqd AH4sJe QAAyWd wJYinb";
enhanced_SettingsDropdown.id = "enhanced_SettingsDropdown";
enhanced_SettingsDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_SettingsDropdown.style.marginRight = "20px";
enhanced_SettingsDropdown.style.cursor = "pointer";
enhanced_SettingsDropdown.style.userSelect = "none";
enhanced_SettingsDropdown.tabIndex = "0";
enhanced_SettingsDropdown.addEventListener("click", function(e) {
    if (document.querySelector(".X1asv.ahEBEd.LJni0").style.opacity == "1") {
        document.querySelector(".aiUOwf.QAAyWd.wJYinb").click();
    }
    if (enhanced_SettingsDropContent.contains(e.target) === false && e.target.classList.contains("mJVLwb") === false) {
        if (enhanced_SettingsDropContent.style.display === "none") {
            enhanced_SettingsDropContent.style.display = "block";
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

var enhanced_SettingsDropContent = document.createElement("div");
enhanced_SettingsDropContent.id = "enhanced_SettingsDropContent";
enhanced_SettingsDropContent.className = "us22N";
enhanced_SettingsDropContent.style.position = "absolute";
enhanced_SettingsDropContent.style.width = "auto";
enhanced_SettingsDropContent.style.top = "4.25rem";
enhanced_SettingsDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_SettingsDropContent.style.zIndex = "20";
enhanced_SettingsDropContent.style.display = "none";

if (document.querySelectorAll(".WpnpPe")[0] !== undefined) {
    document.querySelectorAll(".WpnpPe")[0].prepend(enhanced_SettingsDropdown);
    enhanced_SettingsDropdown.append(enhanced_SettingsDropContent);
}

window.addEventListener("click", function(e) {
    if (e.target != enhanced_SettingsDropdown && enhanced_SettingsDropdown.contains(e.target) === false && e.target.classList.contains("mJVLwb") === false) {
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
enhanced_UserMedia.style.paddingRight = "2rem";
enhanced_UserMedia.tabIndex = "0";
enhanced_UserMedia.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_UserMedia.style.borderRadius = "0.5rem 0.5rem 0 0";
enhanced_UserMedia.addEventListener("click", function() {
    window.open(document.querySelector("head > base").getAttribute("href") + "captures", "_self");
});
if (document.querySelectorAll(".WpnpPe")[0] !== undefined) {
    document.querySelectorAll(".WpnpPe")[0].prepend(enhanced_UserMedia);
}
enhanced_SettingsDropContent.append(enhanced_UserMedia);

// Codec - Control element for the stream codec
var enhanced_currentCodec = parseInt(localStorage.getItem("enhanced_CodecOption") || 0);
var enhanced_Codec = document.createElement("div");
enhanced_Codec.className = "pBvcyf QAAyWd";
enhanced_Codec.id = "enhanced_Codec";
enhanced_Codec.style.cursor = "pointer";
enhanced_Codec.style.userSelect = "none";
enhanced_Codec.style.paddingRight = "2rem";
enhanced_Codec.addEventListener("click", function() {
    enhanced_currentCodec = (enhanced_currentCodec + 1) % 3;
    localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
    enhanced_changeCodec(enhanced_currentCodec);
});
enhanced_SettingsDropContent.append(enhanced_Codec);

function enhanced_changeCodec(c) {
    switch (c) {
        case 0:
            enhanced_Codec.style.color = "";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb">' + enhanced_lang.default+'</span>'
            console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'Default'.", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_Codec.style.color = "#00e0ba";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb">VP9</span>'
            console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'VP9'.", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_currentRes = 0;
            localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
            enhanced_updateResolution(enhanced_currentRes)
            enhanced_Codec.style.color = "#00e0ba";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb">H264</span>'
            console.log("%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'H264'", enhanced_consoleEnhanced, "");
            break
    }
}

// Resolution - Control element for the stream resolution
localStorage.setItem("enhanced_DeskWidth", window.screen.width);
localStorage.setItem("enhanced_DeskHeight", window.screen.height);
// Object.defineProperty(window.screen, "colorDepth", { value: 48 });
var enhanced_currentRes = parseInt(localStorage.getItem("enhanced_ResOption") || 0);
var enhanced_Resolution = document.createElement("div");
enhanced_Resolution.className = "pBvcyf QAAyWd";
enhanced_Resolution.id = "enhanced_Resolution";
enhanced_Resolution.innerHTML = enhanced_lang.native;
enhanced_Resolution.style.cursor = "pointer";
enhanced_Resolution.style.userSelect = "none";
enhanced_Resolution.style.paddingRight = "2rem";
enhanced_Resolution.addEventListener("click", function(evt) {
    enhanced_currentRes = (enhanced_currentRes + 1) % 3;
    localStorage.setItem("enhanced_ResOption", enhanced_currentRes);
    enhanced_updateResolution(enhanced_currentRes)
});
enhanced_SettingsDropContent.append(enhanced_Resolution);

function enhanced_updateResolution(res) {
    switch (res) {
        case 0:
            enhanced_Resolution.style.color = "white";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb">' + enhanced_lang.native + '</span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to 'Native'.", enhanced_consoleEnhanced, "");
            break
        case 1:
            var x = 2560
            var y = 1440
            enhanced_currentCodec = 1;
            localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
            enhanced_changeCodec(enhanced_currentCodec)
            enhanced_Resolution.style.color = "#00e0ba";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb">2K</span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '2560x1440'.", enhanced_consoleEnhanced, "");
            break
        case 2:
            var x = 3840
            var y = 2160
            enhanced_currentCodec = 1;
            localStorage.setItem("enhanced_CodecOption", enhanced_currentCodec);
            enhanced_changeCodec(enhanced_currentCodec)
            enhanced_Resolution.style.color = "#00e0ba";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb">4K</span>';
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
                    var x = parseInt(localStorage.getItem("enhanced_DeskWidth") || localStorage.getItem("enhanced_DeskWidth"));
                    var y = parseInt(localStorage.getItem("enhanced_DeskHeight") || localStorage.getItem("enhanced_DeskHeight"));
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
        }
    }, 200);
}
embed(enhanced_changeResolution);

// Grid - Control element for the homescreen library grid
var enhanced_GridSize = parseInt(localStorage.getItem("enhanced_GridSize") || 0);
var enhanced_Grid = document.createElement("div");
enhanced_Grid.className = "pBvcyf QAAyWd";
enhanced_Grid.id = "enhanced_Grid";
enhanced_Grid.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_comfy</i><span class="mJVLwb">' + enhanced_lang.gridsize + ': ' + (enhanced_GridSize + 2) + '</span>';
enhanced_Grid.style.cursor = "pointer";
enhanced_Grid.style.userSelect = "none";
enhanced_Grid.style.paddingRight = "2rem";
enhanced_Grid.tabIndex = "0";
enhanced_Grid.addEventListener("click", function() {
    enhanced_GridSize = (enhanced_GridSize + 1) % 5;
    localStorage.setItem("enhanced_GridSize", enhanced_GridSize);
    enhanced_Grid.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_comfy</i><span class="mJVLwb">' + enhanced_lang.gridsize + ': ' + (enhanced_GridSize + 2) + '</span>';
    enhanced_changeGridSize(enhanced_GridSize)
});
enhanced_SettingsDropContent.append(enhanced_Grid);

function enhanced_changeGridSize(size) {
    switch (size) {
        case 0:
            enhanced_Grid.style.color = "";
            enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(2,auto) !important; }');
            enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: 21.75rem !important; }');
            enhanced_addGlobalStyle('.a1l9D { margin: 0 0 0.5rem 0.5rem !important; }');
            enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1.5rem !important; }');
            break;
        case 1:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(3,auto) !important; }');
            enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.66) !important; }');
            enhanced_addGlobalStyle('.a1l9D { margin: 0 0 0.5rem 0.5rem !important; }');
            enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1.5rem !important; }');
            break;
        case 2:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(4,auto) !important; }');
            enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.5) !important; }');
            enhanced_addGlobalStyle('.a1l9D { margin: 0 0 0.2rem 0.2rem !important; }');
            enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1rem !important; }');
            break;
        case 3:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(5,auto) !important; }');
            enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.4) !important; }');
            enhanced_addGlobalStyle('.a1l9D { margin: 0 0 0.2rem 0.2rem !important; }');
            enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1rem !important; }');
            break;
        case 4:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle('.E3eEyc.H3tvrc { grid-template-columns: repeat(6,auto) !important; }');
            enhanced_addGlobalStyle('.GqLi4d.qu6XL { width: 100% !important; height: calc(21.75rem * 0.33) !important; }');
            enhanced_addGlobalStyle('.a1l9D { margin: 0 0 0.2rem 0.2rem !important; }');
            enhanced_addGlobalStyle('.E3eEyc { grid-gap: 1rem !important; }');
            break;
    }
    console.log("%cStadia Enhanced" + "%c ⚙️ - Library Grid Size: Set to " + (enhanced_GridSize + 2) + ".", enhanced_consoleEnhanced, "");
}

// Clock - Control element for the clock specific settings
var enhanced_ClockOption = parseInt(localStorage.getItem("enhanced_ClockOption") || 0);
var enhanced_Clock = document.createElement("div");
enhanced_Clock.className = "pBvcyf QAAyWd";
enhanced_Clock.id = "enhanced_Clock";
enhanced_Clock.style.cursor = "pointer";
enhanced_Clock.style.userSelect = "none";
enhanced_Clock.style.paddingRight = "2rem";
enhanced_Clock.tabIndex = "0";
enhanced_Clock.addEventListener("click", function() {
    enhanced_ClockOption = (enhanced_ClockOption + 1) % 4;
    localStorage.setItem("enhanced_ClockOption", enhanced_ClockOption);
    enhanced_changeClock(enhanced_ClockOption);
});
enhanced_SettingsDropContent.append(enhanced_Clock);

function enhanced_changeClock(opt) {
    switch (opt) {
        case 0:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb">' + enhanced_lang.friendslist + '</span>';
            enhanced_ClockFriends.style.display = "flex";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Friendlist'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb">' + enhanced_lang.igoverlay + '</span>';
            enhanced_ClockFriends.style.display = "none";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'In-Game Overlay'", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb">' + enhanced_lang.listoverlay + '</span>';
            enhanced_ClockFriends.style.display = "flex";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Menu & Overlay'", enhanced_consoleEnhanced, "");
            break
        case 3:
            enhanced_Clock.style.color = "";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb">' + enhanced_lang.disabled + '</span>';
            enhanced_ClockFriends.style.display = "none";
            console.log("%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Disabled'", enhanced_consoleEnhanced, "");
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
enhanced_gameFilter.style.paddingRight = "2rem";
enhanced_gameFilter.tabIndex = "0";
enhanced_gameFilter.addEventListener("click", function() {
    enhanced_filterOption = (enhanced_filterOption + 1) % 3;
    localStorage.setItem("enhanced_filterOption", enhanced_filterOption);
    enhanced_changeFilter(enhanced_filterOption);
});
enhanced_SettingsDropContent.append(enhanced_gameFilter);

function enhanced_changeFilter(opt) {
    switch (opt) {
        case 0:
            enhanced_gameFilter.style.color = "#00e0ba";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb">' + enhanced_lang.filtertoggle + '</span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Toggle'", enhanced_consoleEnhanced, "");
            break
        case 1:
            enhanced_gameFilter.style.color = "#00e0ba";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb">' + enhanced_lang.filterquick + '</span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Quick'", enhanced_consoleEnhanced, "");
            break
        case 2:
            enhanced_gameFilter.style.color = "";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb">' + enhanced_lang.disabled + '</span>';
            console.log("%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Disabled'", enhanced_consoleEnhanced, "");
            break
    }
}

// Invite Link
var enhanced_InviteURL = "https://stadia.com/link/home?si_rid=" + enhanced_AccountID;
var enhanced_Invite = document.createElement("div");
enhanced_Invite.className = "pBvcyf QAAyWd";
enhanced_Invite.id = "enhanced_Invite";
enhanced_Invite.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_add</i><span class="mJVLwb">' + enhanced_lang.invitebase + '</span>';
enhanced_Invite.style.cursor = "pointer";
enhanced_Invite.style.userSelect = "none";
enhanced_Invite.style.paddingRight = "2rem";
enhanced_Invite.tabIndex = "0";
enhanced_Invite.style.borderTop = "1px solid rgba(255,255,255,.06)";
enhanced_Invite.style.borderRadius = "0 0 0.5rem 0.5rem";
enhanced_Invite.addEventListener("click", function() {
    navigator.clipboard.writeText(enhanced_InviteURL);
    enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb">' + enhanced_lang.inviteactive + '</span>';
    enhanced_Invite.style.color = "#ff773d";
    setTimeout(function() {
        enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb">' + enhanced_lang.invitebase + '</span>';
        enhanced_Invite.style.color = "";
    }, 1000);
});
enhanced_SettingsDropContent.append(enhanced_Invite);

// Store Cotainer - Container to display store buttons
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

// Avatar - Allows the user to set a custom avatar
document.querySelector(".PMkDOc").addEventListener("click", function() {
    enhanced_avatarURL = prompt(enhanced_lang.avatarpopup)
    if (enhanced_avatarURL.length < 1) {
        enhanced_setAvatar(document.querySelector(".ksZYgc.VGZcUb").style.backgroundImage.replace(/(url\(|\)|")/g, ''));
        localStorage.removeItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"));
    } else {
        localStorage.setItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href"), enhanced_avatarURL);
        enhanced_setAvatar(enhanced_avatarURL);
    }
});

function enhanced_setAvatar(url) {
    console.log("%cStadia Enhanced" + "%c ⚙️ - Avatar changed to: " + url, enhanced_consoleEnhanced, "");
    enhanced_addGlobalStyle('.ksZYgc.VGZcUb { background-color: #ff773d !important }');
    enhanced_addGlobalStyle('.ksZYgc.VGZcUb { background-image: url("' + url + '") !important; }');
    enhanced_addGlobalStyle('.rybUIf { background-image: url("' + url + '") !important; }');
    enhanced_addGlobalStyle('.dOyvbe { background-image: url("' + url + '") !important; }');
    enhanced_addGlobalStyle('.Nv1Sab[alt$="' + enhanced_AccountName + '"] { content: url("' + url + '") !important; }');
}

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

// Load stored settings
if (localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")) !== null) {
    enhanced_setAvatar(localStorage.getItem("enhanced_avatarURL_" + document.querySelector("head > base").getAttribute("href")));
}
enhanced_changeGridSize(enhanced_GridSize);
enhanced_changeClock(enhanced_ClockOption);
enhanced_changeFilter(enhanced_filterOption);
enhanced_updateResolution(enhanced_currentRes)
enhanced_changeCodec(enhanced_currentCodec);

// After Setup
console.log("%cStadia Enhanced" + "%c ⏲️ - Start Up: Loaded in " + (new Date().getTime() - enhanced_StartTimer) + "ms.", enhanced_consoleEnhanced, "")
var enhanced_loopCount = 0;
var enhanced_loopTotal = 0;
var enhanced_sessionStart = 0;

// Main Loop
setInterval(function() {
    // Loop Start
    var enhanced_loopTimer = new Date().getTime();
    enhanced_loopCount++;

    // Session Time
    if (document.location.href.indexOf("/player/") != -1) {
        document.querySelectorAll(".OWVtN")[document.querySelectorAll(".OWVtN").length - 1].append(enhanced_sessionTimer);
        if (enhanced_sessionStart == 0) {
            enhanced_sessionStart = new Date().getTime();
        } else {
            var enhanced_sessionDur = new Date().getTime();
            enhanced_sessionDur = formatTime((enhanced_sessionDur - enhanced_sessionStart) / 1000);
            enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_sessionDur + '</span></div>';
        }
    } else {
        enhanced_sessionStart = 0;
    }

    // Game Filter
    var enhanced_gameList = document.querySelectorAll(".GqLi4d");
    var enhanced_gameID;
    var enhanced_gameFilter = localStorage.getItem("enhanced_gameFilter") || "";

    // Add "Show All" UI element
    if (document.location.href.indexOf("/home") != -1 && document.querySelectorAll(".CVVXfc.YYy3Zb").length != 0) {
        if (document.querySelectorAll(".CVVXfc.YYy3Zb")[document.querySelectorAll(".CVVXfc.YYy3Zb").length - 1].contains(enhanced_showAll) === false) {
            document.querySelectorAll(".CVVXfc.YYy3Zb")[document.querySelectorAll(".CVVXfc.YYy3Zb").length - 1].append(enhanced_showAll);
            enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
            enhanced_showState = false;
        }
    }
    if (enhanced_filterOption == 2) {
        enhanced_showAll.style.display = "none";
        enhanced_showState = false;
    } else {
        enhanced_showAll.style.display = "flex";
    }

    for (var i = 0; i < enhanced_gameList.length; i++) {
        enhanced_gameID = enhanced_gameList[i].getAttribute("jslog").split("; ")[1].substring(3);

        if (enhanced_gameList[i].parentNode.id != "enhanced_wrapper") {
            // Wrapper Element
            var enhanced_wrapper = document.createElement("div");
            enhanced_wrapper.id = "enhanced_wrapper";
            enhanced_wrapper.style.position = "relative";

            // Visibility
            var enhanced_visibility = document.createElement("div");
            enhanced_visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
            enhanced_visibility.style.position = "absolute";
            enhanced_visibility.style.top = "0.2rem";
            enhanced_visibility.style.right = "0.2rem";
            enhanced_visibility.style.display = "flex";
            enhanced_visibility.style.background = "#202124";
            enhanced_visibility.style.borderRadius = "50%";
            enhanced_visibility.style.padding = "0.2rem";
            enhanced_visibility.style.cursor = "pointer";
            enhanced_visibility.style.zIndex = "2";
            enhanced_visibility.gameid = enhanced_gameID;
            enhanced_visibility.addEventListener("click", function() {
                //alert(this.gameid);
                if (enhanced_gameFilter.includes(this.gameid)) {
                    enhanced_gameFilter = enhanced_gameFilter.replace("(" + this.gameid + ")", "")
                    localStorage.setItem("enhanced_gameFilter", enhanced_gameFilter);
                    this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
                } else {
                    enhanced_gameFilter += "(" + this.gameid + ")";
                    localStorage.setItem("enhanced_gameFilter", enhanced_gameFilter);
                    this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
                }
            });
            enhanced_wrapper.appendChild(enhanced_visibility);

            enhanced_gameList[i].parentNode.appendChild(enhanced_wrapper);
            enhanced_wrapper.appendChild(enhanced_gameList[i]);
        }

        // Apply filter option
        if (enhanced_filterOption != 1 && enhanced_showState === false) {
            enhanced_gameList[i].previousSibling.style.display = "none";
        } else {
            enhanced_gameList[i].previousSibling.style.display = "flex";
        }

        // Set brightness of filtered items
        if (enhanced_gameFilter.includes(enhanced_gameID) && enhanced_filterOption != 2) {
            enhanced_gameList[i].parentNode.style.filter = "brightness(40%)";
        } else {
            enhanced_gameList[i].parentNode.style.filter = "none";
        }

        // Filter items
        if (enhanced_gameFilter.includes(enhanced_gameID) && enhanced_showState === false && enhanced_filterOption != 2) {
            enhanced_gameList[i].parentNode.style.display = "none";
            enhanced_gameList[i].previousSibling.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
        } else {
            enhanced_gameList[i].parentNode.style.display = "block";
        }
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
        var enhanced_SearchTerm = new URLSearchParams(window.location.search).get('search');
        if (enhanced_SearchTerm !== null) {
            var enhanced_SearchResultCount = 0;
            document.querySelector(".TJQxhf").style.display = "none";
            document.getElementsByClassName("h6J22d null QAAyWd");
            enhanced_SearchResults = document.getElementsByClassName("h6J22d null QAAyWd");
            for (var i = 0; i < enhanced_SearchResults.length; i++) {
                if (enhanced_SearchResults[i].getAttribute("aria-label").match(new RegExp(enhanced_SearchTerm, 'gi')) === null) {
                    enhanced_SearchResults[i].style.display = "none";
                } else {
                    enhanced_SearchResultCount += 1;
                }
            }
            document.querySelector(".HZ5mJ").innerHTML = enhanced_lang.searchheader + " '" + enhanced_SearchTerm + "' (" + enhanced_SearchResultCount + ")";
        }
    }

    // Resolution - Change to currently selected resolution
    if (document.location.href.indexOf("/settings") != -1 && document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0] !== undefined) {
        document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0].setAttribute("data-disabled", "false");
        document.querySelectorAll(".sx2eZe.QAAyWd.aKIhz.OWB6Me")[0].classList.remove("OWB6Me");
    }

    // UI Elements - Add controls again when needed
    if (document.location.href.indexOf("/player/") != -1) {
        enhanced_Windowed.style.display = "flex";
        if (document.querySelector("#enhanced_Windowed") === null && document.querySelectorAll(".E0Zk9b")[0] !== undefined) {
            document.querySelectorAll(".E0Zk9b")[0].append(enhanced_Windowed);
        }
    } else {
        enhanced_Windowed.style.display = "none";
    }

    if (parseInt(localStorage.getItem("enhanced_MonitorState")) == 1) {
        enhanced_Monitor.style.display = "flex";
        if (document.querySelector("#enhanced_Monitor") === null && document.querySelectorAll(".E0Zk9b")[0] !== undefined) {
            document.querySelectorAll(".E0Zk9b")[0].append(enhanced_Monitor);
        }
    } else {
        enhanced_Monitor.style.display = "none";
    }

    if (document.querySelector("#enhanced_ClockFriends") === null && document.querySelectorAll(".hxhAyf.OzUE7e.XY6ZL")[0] !== undefined) {
        document.querySelectorAll(".hxhAyf.OzUE7e.XY6ZL")[0].append(enhanced_ClockFriends);
    }

    if (document.location.href.indexOf("/player/") != -1) {
        if (enhanced_ClockOption == 1 || enhanced_ClockOption == 2) {
            console.log(enhanced_ClockOption);
            enhanced_ClockOverlay.style.display = "flex";
        }
        if (document.querySelector("#enhanced_ClockOverlay") === null && document.querySelector(".bYYDgf") !== undefined) {
            document.querySelector(".bYYDgf").append(enhanced_ClockOverlay);
        }
    } else {
        enhanced_ClockOverlay.style.display = "none";
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
        enhanced_GameDescription = document.querySelectorAll(".WjVJKd")[document.querySelectorAll(".WjVJKd").length - 1];
        if (document.querySelector("#enhanced_StoreContainer") === null && enhanced_GameDescription !== undefined) {
            enhanced_GameDescription.append(enhanced_StoreContainer);
        }
    }

    // Pro Games - UI changes and count of currently unclaimed games
    if (document.location.href.indexOf("/store/list/2001") != -1) {
        document.querySelector(".YNlByb.URhE4b.G4fJWe").childNodes[2].classList.remove("YySNWc");
        enhanced_ProGames.style.backgroundColor = "rgba(255,255,255,.06)";
        enhanced_ProGames.style.color = "#ff773d";
        if (document.querySelector(".alEDLe") !== null) {
            count = document.querySelector(".alEDLe").querySelectorAll('.X5624d').length;
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

    // Visibility: Homescreen-only
    if (document.location.href.indexOf("/home") != -1) {
        enhanced_Grid.style.display = "block";
        //enhanced_LibrarySearch.style.display = "flex";
    } else {
        enhanced_Grid.style.display = "none";
        //enhanced_LibrarySearch.style.display = "none";
    }

    // Visibility: Store-only
    if (document.location.href.indexOf("/store") != -1) {
        enhanced_StoreSearch.style.display = "flex";
        enhanced_StoreDropdown.style.display = "flex";
    } else {
        enhanced_StoreSearch.style.display = "none";
        enhanced_StoreDropdown.style.display = "none";
    }

    // Loop End
    enhanced_loopTotal += new Date().getTime() - enhanced_loopTimer;
    if (enhanced_loopCount == 300) {
        console.log("%cStadia Enhanced" + "%c ⏲️ - Loop Time: ~" + enhanced_loopTotal / enhanced_loopCount + "ms.", enhanced_consoleEnhanced, "");
    }
}, 200);

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

function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds);
}

// Translation
function loadLanguages(lang) {
    switch (lang) {
        case "it": // By zMattyPower (https://github.com/zMattyPower)
            var load = `{
                "default":"Predefinito",
                "native":"Nativo",
                "disabled":"Disabilitato",
                "windowed":"Modalità Finestra",
                "fullscreen":"Schermo Intero",
                "searchstore":"Cerca nello store",
                "onsale":"In Offerta",
                "prodeals":"Offerte del Pro",
                "allgames":"Tutti i Giochi",
                "usermedia":"Screenshot & Video",
                "gridsize":"Dimensione Griglia",
                "friendslist":"Lista Amici",
                "igoverlay":"Overlay In-Gioco",
                "listoverlay":"Lista & Overlay",
                "filtertoggle":"Attiva Filtro",
                "filterquick":"Filtro Rapido",
                "invitebase":"Copia link invito",
                "inviteactive":"Copiato!",
                "searchbtnbase":"Cerca su",
                "avatarpopup":"Nuovo URL avatar (vuoto per impostazione predefinita):",
                "searchheader":"Giochi che includono",
                "sessiontime":"Tempo sessione",
                "codec":"Codec",
                "trafficsession":"Traffico sessione",
                "trafficcurrent":"Traffico corrente",
                "trafficaverage":"Traffico medio",
                "packetloss":"Pacchetti persi",
                "framedrop":"Fotogrammi persi",
                "latency":"Latenza",
                "jitter":"Buffer Jitter",
                "compression":"Compressione",
                "streammon":"Monitor Stream"
            }`
            break
        case "sv": // By Mafrans (https://github.com/Mafrans)
            var load = `{
                "default":"Standard",
                "native":"Inbyggd",
                "disabled":"Inaktiverat",
                "windowed":"Fönsterläge",
                "fullscreen":"Fullskärmsläge",
                "searchstore":"Sök i butiken",
                "onsale":"På Rea",
                "prodeals":"Pro Deals",
                "allgames":"Alla Spel",
                "usermedia":"Skärmdumpar & Filmer",
                "gridsize":"Rutnätsstorlek",
                "friendslist":"Vänner",
                "igoverlay":"Spelöverlägg",
                "listoverlay":"Lista & Överlägg",
                "filtertoggle":"Växla Filter",
                "filterquick":"Snabbfilter",
                "invitebase":"Kopiera inbjudningslänk",
                "inviteactive":"Kopierat!",
                "searchbtnbase":"Sök på",
                "avatarpopup":"Nytt avatar-URL (lämna tomt för standard):",
                "searchheader":"Spel inklusive",
                "sessiontime":"Sessionstid",
                "codec":"Kodec",
                "trafficsession":"Sessionstrafik",
                "trafficcurrent":"Nuvarande trafik",
                "trafficaverage":"Genomsnittlig trafik",
                "packetloss":"Tappade paket",
                "framedrop":"Tappade bilder",
                "latency":"Latens",
                "jitter":"Jitter Buffer",
                "compression":"Kompression",
                "streammon":"Strömmonitor"
            }`
            break
        case "fr": // By ELowry (https://github.com/ELowry)
            var load = `{
                "default":"Par Défaut",
                "native":"Natif",
                "disabled":"Désactivé",
                "windowed":"Fenêtré",
                "fullscreen":"Plein Écran",
                "searchstore":"Rechercher dans le Store",
                "onsale":"En promotion",
                "prodeals":"Offres Stadia Pro",
                "allgames":"Tous les jeux",
                "usermedia":"Captures & Vidéos",
                "gridsize":"Taille de la Grille",
                "friendslist":"Liste d'Amis",
                "igoverlay":"Overlay en-jeu",
                "listoverlay":"Liste & Overlay",
                "filtertoggle":"Activer/Désactiver le Filtrage",
                "filterquick":"Filtrage Rapide",
                "invitebase":"Copier le lien d'Invitation",
                "inviteactive":"Copié&nbps;!",
                "searchbtnbase":"Rechercher sur",
                "avatarpopup":"URL du nouvel avatar (vide = par défaut):",
                "searchheader":"Jeux avec",
                "sessiontime":"Durée de la session",
                "codec":"Codec",
                "trafficsession":"Trafic de la session",
                "trafficcurrent":"Trafic actuel",
                "trafficaverage":"Trafic moyen",
                "packetloss":"Paquets perdus",
                "framedrop":"Images perdues",
                "latency":"Latence",
                "jitter":"Tampon de gigue",
                "compression":"Compression",
                "streammon":"Moniteur de Stream"
            }`
            break
        case "nl": // By timewasternl (https://github.com/timewasternl)
            var load = `{
                "default":"Standaard",
                "native":"Native",
                "disabled":"Uitgeschakeld",
                "windowed":"Venster Mode",
                "fullscreen":"Volledig Scherm",
                "searchstore":"Zoek in winkel",
                "onsale":"Aanbieding",
                "prodeals":"Pro Deals",
                "allgames":"Alle Games",
                "usermedia":"Screenshots & Videos",
                "gridsize":"Rastergrootte",
                "friendslist":"Vriendenlijst",
                "igoverlay":"In-Game Overlay",
                "listoverlay":"Lijst & Overlay",
                "filtertoggle":"Filter In-/Uitschakelen",
                "filterquick":"Snel Filter",
                "invitebase":"Kopieer Uitnodigingslink",
                "inviteactive":"Gekopiëerd!",
                "searchbtnbase":"Zoeken op",
                "avatarpopup":"Nieuw avatar URL (laat leeg voor standaard):",
                "searchheader":"Games inclusief",
                "sessiontime":"Sessieduur",
                "codec":"Codec",
                "trafficsession":"Sessie dataoverdracht",
                "trafficcurrent":"Huidige dataoverdracht",
                "trafficaverage":"Gemiddelde dataoverdracht",
                "packetloss":"Packets verloren",
                "framedrop":"Frames overgeslagen",
                "latency":"Vertraging",
                "jitter":"Jitter Buffer",
                "compression":"Compressie",
                "streammon":"Stream Monitor"
            }`
            break
        case "de":
            var load = `{
                "default":"Standard",
                "native":"Nativ",
                "disabled":"Deaktiviert",
                "windowed":"Fenstermodus",
                "fullscreen":"Vollbild",
                "searchstore":"Im Store suchen",
                "onsale":"Im Angebot",
                "prodeals":"Pro Angebote",
                "allgames":"Alle Spiele",
                "usermedia":"Fotos & Videos",
                "gridsize":"Rastergröße",
                "friendslist":"Freundesliste",
                "igoverlay":"Einblendung",
                "listoverlay":"Liste & Einblendung",
                "filtertoggle":"Wechselfilter",
                "filterquick":"Schnellfilter",
                "invitebase":"Einladung kopieren",
                "inviteactive":"Kopiert!",
                "searchbtnbase":"Suche auf",
                "avatarpopup":"Neue Avatar URL (leer für Zurücksetzung):",
                "searchheader":"Spiele beinhalten",
                "sessiontime":"Sitzungs Dauer",
                "codec":"Kodierung",
                "trafficsession":"Sitzungs Traffic",
                "trafficcurrent":"Derzeitiger Traffic",
                "trafficaverage":"Durchschnittlicher Traffic",
                "packetloss":"Packetverlust",
                "framedrop":"Frames dropped",
                "latency":"Latency",
                "jitter":"Jitter-Buffer",
                "compression":"Komprimierung",
                "streammon":"Stream Monitor"
            }`
            break
        default:
            var load = `{
                "default": "Default",
                "native": "Native",
                "disabled": "Disabled",
                "windowed": "Windowed Mode",
                "fullscreen": "Fullscreen",
                "searchstore": "Search store",
                "onsale": "On Sale",
                "prodeals": "Pro Deals",
                "allgames": "All Games",
                "usermedia": "Screenshots & Videos",
                "gridsize": "Grid Size",
                "friendslist": "Friends List",
                "igoverlay": "In-Game Overlay",
                "listoverlay": "List & Overlay",
                "filtertoggle": "Toggle Filter",
                "filterquick": "Quick Filter",
                "invitebase": "Copy invite link",
                "inviteactive": "Copied!",
                "searchbtnbase": "Search on",
                "avatarpopup": "New avatar URL (empty for default):",
                "searchheader": "Games including",
                "sessiontime": "Session time",
                "codec": "Codec",
                "trafficsession": "Session traffic",
                "trafficcurrent": "Current traffic",
                "trafficaverage": "Average traffic",
                "packetloss": "Packets lost",
                "framedrop": "Frames dropped",
                "latency": "Latency",
                "jitter": "Jitter Buffer",
                "compression": "Compression",
                "streammon": "Stream Monitor"
            }`
    }
    return JSON.parse(load);
}
