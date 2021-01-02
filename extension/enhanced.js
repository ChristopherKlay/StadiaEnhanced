// Start Up
var enhanced_StartTimer = new Date().getTime();
var enhanced_local = document.querySelector( "html" ).getAttribute( "lang" );
var enhanced_lang = loadLanguages( enhanced_local );
var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
var enhanced_AccountName = document.querySelectorAll( ".VY8blf.fSorq" )[0].textContent;
var enhanced_AccountID = document.querySelector( ".ksZYgc.VGZcUb" ).getAttribute( "data-player-id" );
console.log( "%cStadia Enhanced" + "%c ⚙️ - User: " + enhanced_AccountName + " (" + enhanced_AccountID + ") (" + enhanced_local + ")", enhanced_consoleEnhanced, "" );

// CSS Changes - Global styles and overwrites
enhanced_appliedCSS = ".lTHVjf { padding: 0rem 1.5rem 0 1.5rem !important; }" // Remove padding above avatar
enhanced_appliedCSS += ".DGX7fe { display: none }" // Hide the invite menu
enhanced_appliedCSS += "#enhanced_showAll > i { font-size: 1.5rem; }" // Change "Show All" size
enhanced_appliedCSS += ".E0Zk9b { justify-content: flex-start !important; flex-flow: row wrap; }" // Wrap menu items
enhanced_appliedCSS += ".hxhAyf.fi8Jxd .TZ0BN { min-height: auto !important; }" // Adjust menu height
enhanced_appliedCSS += ".GqLi4d.XUBkDd .a1l9D { margin: 0 0 .5rem .5rem !important; }" // Less padding on "Pro" labels
enhanced_appliedCSS += "#enhanced_wrapper > .GqLi4d.Llx2qd, #enhanced_wrapper > .lSXaid.RjcqTc { transform: none !important; }" // Remove popup effect on game tiles
enhanced_appliedCSS += ".tlZCoe { margin-right: .5rem; }" // Allow for multiple buttons on popup
enhanced_appliedCSS += "::-webkit-scrollbar { width: 1rem; } ::-webkit-scrollbar-thumb { background-color: #2d2e30; border-radius: 1rem; border: 3px solid #202124; }" // Adjusted scrollbars
enhanced_appliedCSS += ".Z5U6eb[jslog='81272'] { top: 4rem; }" // Fix store offset on scrollbars
enhanced_appliedCSS += ".ozpmIc.lEPylf.sfe1Ff { padding: 4.25rem 0 4.5rem 0 !important; }" // Fix store list padding for scrollbars
enhanced_addGlobalStyle( enhanced_appliedCSS );

// Stream Monitor by AquaRegia
// Source: https://www.reddit.com/r/Stadia/comments/eimw7m/tampermonkey_monitor_your_stream/
var enhanced_monitorState = 0;
var enhanced_monitorMode = parseInt( localStorage.getItem( "enhanced_monitorMode" ) || 0 );
var enhanced_monitorPos = localStorage.getItem( "enhanced_monitorPosition" ) || "1rem|1rem";
var enhanced_streamMonitor = document.createElement( "div" );
enhanced_streamMonitor.id = "enhanced_streamMonitor";
enhanced_streamMonitor.style.position = "fixed";
enhanced_streamMonitor.style.width = "auto";
enhanced_streamMonitor.style.top = enhanced_monitorPos.split( "|" )[0];
enhanced_streamMonitor.style.left = enhanced_monitorPos.split( "|" )[1];
enhanced_streamMonitor.style.zIndex = 1000;
enhanced_streamMonitor.style.borderRadius = "0.5rem";
enhanced_streamMonitor.style.background = "rgba(32,33,36,0.7)";
enhanced_streamMonitor.style.padding = "0.5rem";
enhanced_streamMonitor.style.fontSize = "0.7rem";
enhanced_streamMonitor.style.cursor = "pointer";
enhanced_streamMonitor.style.display = "block";
enhanced_streamMonitor.addEventListener( "dblclick", function ()
{
    enhanced_monitorMode = ( enhanced_monitorMode + 1 ) % 2;
    localStorage.setItem( "enhanced_monitorMode", enhanced_monitorMode );
} );
document.body.appendChild( enhanced_streamMonitor );
enhanced_dragElement( enhanced_streamMonitor );

function enhanced_updateMonitor( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_streamMonitor.style.display = "none";
            break
        case 1:
            enhanced_streamMonitor.style.top = localStorage.getItem( "enhanced_monitorPosition" ).split( "|" )[0] || "1rem"
            enhanced_streamMonitor.style.left = localStorage.getItem( "enhanced_monitorPosition" ).split( "|" )[1] || "1rem"
            enhanced_streamMonitor.style.right = "";
            enhanced_streamMonitor.style.bottom = "";
            enhanced_streamMonitor.style.display = "block";
            break;
    }
}

function enhanced_RTCMonitor()
{
    'use strict';
    var enhanced_streamMonitor = document.getElementById( "enhanced_streamMonitor" );
    var enhanced_consoleEnhanced = "background: linear-gradient(135deg, rgba(255,76,29,0.75) 0%, rgba(155,0,99,0.75) 100%); color: white; padding: 4px 8px;";
    var enhanced_local = document.querySelector( "html" ).getAttribute( "lang" );
    var enhanced_lang = loadLanguages( enhanced_local );

    // RTC Stream Inject
    var peerConnections = [];
    ( function ( original )
    {
        RTCPeerConnection = function ()
        {
            var connection = new original( arguments[0], arguments[1] );
            peerConnections.push( connection );
            return connection;
        };
        RTCPeerConnection.prototype = original.prototype;
    } )( RTCPeerConnection );
    console.log( "%cStadia Enhanced" + "%c ⚙️ - Stream Monitor: Successfully injected.", enhanced_consoleEnhanced, "" );

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
    var enhanced_monitorState = 0;

    function enhanced_formatBytes( a, b )
    {
        if ( 0 == a ) return "0 Bytes";
        var c = 1024,
            d = b || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor( Math.log( a ) / Math.log( c ) );
        return parseFloat( ( a / Math.pow( c, f ) ).toFixed( d ) ) + " " + e[f]
    }

    function enhanced_formatTime( seconds )
    {
        var hours = Math.floor( seconds / 3600 );
        seconds -= hours * 3600;
        var minutes = Math.floor( seconds / 60 );
        seconds -= minutes * 60;
        return ( hours < 10 ? "0" : "" ) + hours + ":" + ( minutes < 10 ? "0" : "" ) + minutes + ":" + ( seconds < 10 ? "0" : "" ) + Math.floor( seconds );
    }

    setInterval( function ()
    {
        if ( document.location.href.indexOf( "/player/" ) == -1 )
        {
            peerConnections = [];
            enhanced_lastBytes = 0;
            enhanced_lastFrames = 0;
            enhanced_sessionActive = false;
            enhanced_streamMonitor.innerHTML = "Waiting for game detection.";
        } else if ( peerConnections.length >= 3 )
        {
            if ( !enhanced_sessionActive )
            {
                enhanced_sessionStart = new Date();
                enhanced_sessionActive = true;
            }
            const openConnections = peerConnections.filter( x => x.connectionState == "connected" );
            openConnections[1].getStats().then( function ( stats )
            {
                for ( var key of stats.keys() )
                {
                    if ( key.indexOf( "RTCIceCandidatePair" ) != -1 )
                    {
                        var tmp4 = stats.get( key );
                    }
                    if ( key.indexOf( "RTCInboundRTPVideoStream" ) != -1 )
                    {
                        var tmp1 = stats.get( key );
                        var tmp2 = stats.get( tmp1.trackId );

                        openConnections[1].getStats( function ( stats )
                        {
                            var tmp3 = stats.result().find( function ( f )
                            {
                                return "ssrc" == f.type && f.id.endsWith( "recv" ) && f.names().includes( "mediaType" ) && "video" == f.stat( "mediaType" );
                            } );

                            var time = new Date();
                            var timeSinceUpdate = ( time - enhanced_lastTime ) / 1000;
                            enhanced_lastTime = time;
                            var sessionDuration = ( time - enhanced_sessionStart ) / 1000;
                            time = new Date( time - time.getTimezoneOffset() * 60 * 1000 ).toISOString().replace( "T", " " ).split( "." )[0];
                            var resolution = tmp2.frameWidth + "x" + tmp2.frameHeight;
                            var framesReceived = tmp2.framesReceived;
                            var framesReceivedPerSecond = ( framesReceived - enhanced_lastFrames ) / timeSinceUpdate;
                            var framesDecoded = tmp2.framesDecoded;
                            var codec = tmp3.stat( "googCodecName" );
                            var bytesReceived = tmp1.bytesReceived;
                            var bytesReceivedPerSecond = ( bytesReceived - enhanced_lastBytes ) / timeSinceUpdate;
                            var averageData = ( ( ( ( bytesReceived / sessionDuration ) * 3600 ) / 1024 ) / 1024 ) / 1024;
                            var packetsLost = tmp1.packetsLost;
                            var packetsReceived = tmp1.packetsReceived;
                            var framesDropped = tmp2.framesDropped;
                            var latency = tmp4.currentRoundTripTime * 1000;
                            if ( latency == "undefined" )
                            {
                                latency = "-";
                            }
                            var jitterBufferDelay = tmp2.jitterBufferDelay * 1000;
                            var jitterBufferEmittedCount = tmp2.jitterBufferEmittedCount;
                            var jitterBuffer = jitterBufferDelay / jitterBufferEmittedCount;

                            if ( codec == "VP9" )
                            {
                                var compression = ( tmp1.qpSum - enhanced_lastQpSum ) / ( framesDecoded - enhanced_lastFramesDecoded );
                            }

                            enhanced_lastFrames = framesReceived;
                            enhanced_lastFramesDecoded = framesDecoded;
                            enhanced_lastBytes = bytesReceived;
                            enhanced_lastBufferDelay = jitterBufferDelay;
                            enhanced_lastBufferEmitted = jitterBufferEmittedCount;
                            enhanced_lastQpSum = tmp1.qpSum;
                            var enhanced_monitorMode = parseInt( localStorage.getItem( "enhanced_monitorMode" ) || 0 );

                            var enhanced_streamData = "Loading stream data.";
                            if ( framesReceived > 0 )
                            {
                                switch ( enhanced_monitorMode )
                                {
                                    case 0:
                                        enhanced_streamData = '<center><svg height="30" width="45" viewBox="0 0 120 80" fill="white"><path d="M1.00857143,23.3413856 C0.362857143,23.8032807 0.00285714286,24.5360402 0,25.2901838 L0,25.2901838 L0,25.3201215 C0.00285714286,25.6380308 0.0685714286,25.9602169 0.204285714,26.2667213 L0.204285714,26.2667213 L11.69,52.2882388 C12.1985714,53.441551 13.5114286,54.0060895 14.7014286,53.5841112 L14.7014286,53.5841112 C22.2214286,50.9025535 48.2628571,42.4187946 65.1157143,46.9949777 L65.1157143,46.9949777 C65.1157143,46.9949777 48.21,47.9729409 32.9228571,59.96083 L32.9228571,59.96083 C32.0614286,60.6379911 31.7742857,61.8155385 32.2157143,62.8163113 L32.2157143,62.8163113 C33.4571429,65.6204709 35.9485714,71.2573021 37.3585714,74.4435231 L37.3585714,74.4435231 L39.3385714,79.0881351 C39.81,80.1901256 41.3157143,80.3227066 41.98,79.3247851 L41.98,79.3247851 C45.5471429,73.9531159 51.5614286,71.2701325 57.3385714,68.927868 L57.3385714,68.927868 C63.2571429,66.5300051 69.4328571,64.7408743 75.7328571,63.6759494 L75.7328571,63.6759494 C82.4457143,62.54117 89.3,62.2375168 96.0842857,62.8376953 L96.0842857,62.8376953 C97.2142857,62.9374875 98.2628571,62.2446448 98.6,61.1640383 L98.6,61.1640383 L103.788571,44.5814332 C104.094286,43.6006188 103.742857,42.528566 102.908571,41.9255362 L102.908571,41.9255362 C97.1228571,37.7342657 74.2042857,23.6564437 33.9014286,29.3118077 L33.9014286,29.3118077 C33.9014286,29.3118077 68.2928571,9.55581202 111.954286,31.2577547 L111.954286,31.2577547 C113.277143,31.916383 114.874286,31.2249659 115.315714,29.8193221 L115.315714,29.8193221 L119.89,15.1954944 C119.961429,14.9688237 119.995714,14.7393017 120,14.512631 L120,14.512631 L120,14.4427765 C119.987143,13.6102248 119.541429,12.8204411 118.784286,12.3913349 L118.784286,12.3913349 C113.304286,9.29065 94.7514286,2.79222317e-07 69.23,2.79222317e-07 L69.23,2.79222317e-07 C49.6685714,-0.00142532301 26.0157143,5.45578001 1.00857143,23.3413856"/></svg><br/>'
                                        enhanced_streamData += "<b>" + time + "</b><br/>" + enhanced_lang.sessiontime + ": " + enhanced_formatTime( sessionDuration ) + "</center><br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.resolution + ":</b> " + resolution + "<br/>";
                                        enhanced_streamData += "<b>FPS:</b> " + framesReceivedPerSecond.toFixed( 1 ) + "<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.codec + ":</b> " + codec + "<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.trafficsession + ":</b> " + enhanced_formatBytes( bytesReceived, 2 ) + "<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.trafficcurrent + ":</b> " + enhanced_formatBytes( bytesReceivedPerSecond * 8, 2 ).slice( 0, -1 ) + "b/s<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.trafficaverage + ":</b> " + averageData.toFixed( 2 ) + " GB/h<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.packetloss + ":</b> " + packetsLost + " (" + ( ( packetsLost / packetsReceived ) * 100 ).toFixed( 3 ) + "%)<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.framedrop + ":</b> " + framesDropped + " (" + ( ( framesDropped / framesReceived ) * 100 ).toFixed( 3 ) + "%)<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.latency + ":</b> " + latency + "ms<br/>";
                                        enhanced_streamData += "<b>" + enhanced_lang.jitter + ":</b> " + jitterBuffer.toPrecision( 4 ) + "ms<br/>";
                                        if ( codec == "VP9" )
                                        {
                                            enhanced_streamData += "<b>" + enhanced_lang.compression + ":</b> " + compression.toFixed( 1 );
                                            enhanced_streamData += "<br/>";
                                        }
                                        break
                                    case 1:
                                        enhanced_streamData = codec + " &ensp;|&ensp;" + resolution + "&ensp;|&ensp;" + framesReceivedPerSecond.toFixed( 1 ) + "fps&ensp;|&ensp;" + latency + "ms"
                                        break
                                }
                            }
                            localStorage.setItem( "enhanced_monitorPosition", enhanced_streamMonitor.style.top + "|" + enhanced_streamMonitor.style.left );
                            enhanced_streamMonitor.innerHTML = enhanced_streamData;
                        } );
                    }
                }

            } );
        }
    }, 1000 );
};
embed( loadLanguages, false );
embed( enhanced_RTCMonitor );

// Streaming Monitor
var enhanced_Monitor = document.createElement( "div" );
enhanced_Monitor.className = "R2s0be";
enhanced_Monitor.id = "enhanced_Monitor";
enhanced_Monitor.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">analytics</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.streammon + '</span></div>'
enhanced_Monitor.style.cursor = "pointer";
enhanced_Monitor.style.userSelect = "none";
enhanced_Monitor.tabIndex = "0";
enhanced_Monitor.addEventListener( "click", function ()
{
    enhanced_monitorState = ( enhanced_monitorState + 1 ) % 2;
    enhanced_updateMonitor( enhanced_monitorState );
} );
enhanced_Monitor.addEventListener( "dblclick", function ()
{
    document.getElementById( "enhanced_streamMonitor" ).style.top = "1rem";
    document.getElementById( "enhanced_streamMonitor" ).style.left = "1rem";
} );

// Windowed Mode
// Source: Mafrans - https://github.com/Mafrans/StadiaPlus
var enhanced_BlockFullscreen = false;
var enhanced_Windowed = document.createElement( "div" );
enhanced_Windowed.className = "R2s0be";
enhanced_Windowed.id = "enhanced_Windowed";
enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.windowed + '</span></div>'
enhanced_Windowed.style.cursor = "pointer";
enhanced_Windowed.style.userSelect = "none";
enhanced_Windowed.tabIndex = "0";
enhanced_Windowed.addEventListener( "click", function ()
{
    if ( enhanced_BlockFullscreen )
    {
        enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.windowed + '</span></div>'
        enhanced_BlockFullscreen = false;
        document.documentElement.requestFullscreen();
    } else
    {
        enhanced_Windowed.innerHTML = '<div role="button" class="CTvDXd QAAyWd Pjpac zcMYd CPNFX"><span class="X5peoe" jsname="pYFhU"><i class="material-icons-extended" style="font-size: 2rem !important" aria-hidden="true">fullscreen_exit</i></span><span class="caSJV" jsname="V67aGc">' + enhanced_lang.fullscreen + '</span></div>'
        enhanced_BlockFullscreen = true;
        document.exitFullscreen();
    }
} );
window.addEventListener( 'fullscreenchange', function ( event )
{
    if ( enhanced_BlockFullscreen )
    {
        event.stopPropagation();
    }
}, true );

// Emoji Picker
var enhanced_emojiswitch = document.createElement( "div" );
enhanced_emojiswitch.innerHTML = "😃";
enhanced_emojiswitch.style.marginLeft = "1rem";
enhanced_emojiswitch.style.cursor = "pointer";
enhanced_emojiswitch.addEventListener( "click", function ( i )
{
    if ( enhanced_emojiPicker.style.display == "none" )
    {
        enhanced_emojiPicker.style.display = "flex"
    } else
    {
        enhanced_emojiPicker.style.display = "none";
    }
} );

var enhanced_emojiPicker = document.createElement( "div" );
enhanced_emojiPicker.style.width = "auto";
enhanced_emojiPicker.style.height = "10rem";
enhanced_emojiPicker.style.margin = "0 1rem 0.5rem";
enhanced_emojiPicker.style.overflowY = "scroll";
enhanced_emojiPicker.style.overflowX = "hidden";
enhanced_emojiPicker.style.fontSize = "1.4rem";
enhanced_emojiPicker.style.cursor = "pointer";
enhanced_emojiPicker.style.flexWrap = "wrap";
enhanced_emojiPicker.style.justifyContent = "space-between";
enhanced_emojiPicker.style.userSelect = "none";
enhanced_emojiPicker.style.display = "none";

enhanced_emojiPicker.addEventListener( "click", function ( i )
{
    document.querySelector( ".m0BtMe" ).focus();
    document.execCommand( 'insertText', false, i.target.textContent );
} );

window.addEventListener( "click", function ( e )
{
    if ( e.target != enhanced_emojiswitch && e.target != enhanced_emojiPicker && enhanced_emojiPicker.contains( e.target ) === false )
    {
        enhanced_emojiPicker.style.display = "none";
    }
} );

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
for ( var i = 0; i < enhanced_emojiRange.length; i++ )
{
    var range = enhanced_emojiRange[i];
    for ( var x = range[0]; x < range[1]; x++ )
    {
        enhanced_dummy = document.createElement( 'span' );
        enhanced_dummy.value = x;
        enhanced_dummy.innerHTML = "&#" + x + ";";
        enhanced_emojiPicker.appendChild( enhanced_dummy );
    }
}

// Clock Widget - Adds a little clock at the bottom of the friends menu
var enhanced_ClockMode = parseInt( localStorage.getItem( "enhanced_ClockMode" ) || 0 );
var enhanced_ClockFriends = document.createElement( "div" );
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
enhanced_ClockFriends.addEventListener( "click", function ()
{
    enhanced_ClockMode = ( enhanced_ClockMode + 1 ) % 2;
    localStorage.setItem( "enhanced_ClockMode", enhanced_ClockMode );
} );

// Overlay Clock - Adds a overlay clock element to the game stream
var enhanced_ClockOverlay = document.createElement( "div" );
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
enhanced_ClockOverlay.addEventListener( "click", function ()
{
    enhanced_ClockMode = ( enhanced_ClockMode + 1 ) % 2;
    localStorage.setItem( "enhanced_ClockMode", enhanced_ClockMode );
} );

// Pro Games - Adds a quick access to the current list of "Pro" titles on Stadia
var enhanced_ProGames = document.createElement( "li" );
enhanced_ProGames.className = "OfFb0b";
enhanced_ProGames.id = "enhanced_ProGames";
var enhanced_ProGamesLink = document.createElement( "a" );
enhanced_ProGames.appendChild( enhanced_ProGamesLink );
enhanced_ProGamesLink.className = "ROpnrd QAAyWd wJYinb";
enhanced_ProGamesLink.textContent = 'Pro';
enhanced_ProGamesLink.addEventListener( "click", function ()
{
    openStadia( "store/list/2001" )
} );

if ( document.querySelectorAll( ".ZECEje" )[0] !== undefined )
{
    document.querySelectorAll( ".ZECEje" )[0].append( enhanced_ProGames );
}

// Store Search - Adds a search bar to the Stadia store
var enhanced_SearchBox = document.createElement( "li" );
enhanced_SearchBox.className = "OfFb0b";
enhanced_SearchBox.id = "enhanced_ProGames";
var enhanced_StoreSearch = document.createElement( "input" );
enhanced_SearchBox.appendChild( enhanced_StoreSearch );
enhanced_StoreSearch.className = "ROpnrd QAAyWd wJYinb";
enhanced_StoreSearch.id = "enhanced_StoreSearch";
enhanced_StoreSearch.placeholder = enhanced_lang.searchstore;
enhanced_StoreSearch.style.border = "none";
enhanced_StoreSearch.style.textAlign = "left";
enhanced_StoreSearch.style.paddingLeft = "3rem";
enhanced_StoreSearch.style.background = "url('" + chrome.runtime.getURL( "media/svg/search.svg" ) + "') 1rem center / 24px 24px no-repeat, rgba(255,255,255,.06)"
enhanced_StoreSearch.style.display = "none";
enhanced_StoreSearch.addEventListener( "keypress", function ()
{
    if ( event.keyCode == 13 && enhanced_StoreSearch.value != "" )
    {
        openStadia( "store/list/3?search=" + enhanced_StoreSearch.value );
    }
} );
if ( document.querySelectorAll( ".ZECEje" )[0] !== undefined )
{
    document.querySelectorAll( ".ZECEje" )[0].append( enhanced_SearchBox );
}

// Store Dropdown - Adds a dropdown menu for quick access
var enhanced_StoreContainer = document.createElement( "li" );
enhanced_StoreContainer.className = "OfFb0b";
enhanced_StoreContainer.id = "enhanced_StoreContainer";
var enhanced_StoreDropdown = document.createElement( "div" );
enhanced_StoreContainer.appendChild( enhanced_StoreDropdown );
enhanced_StoreDropdown.className = "ROpnrd QAAyWd wJYinb";
enhanced_StoreDropdown.id = "enhanced_StoreDropdown";
enhanced_StoreDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_StoreDropdown.style.width = "2.5rem";
enhanced_StoreDropdown.style.padding = "0";
enhanced_StoreDropdown.style.cursor = "pointer";
enhanced_StoreDropdown.style.userSelect = "none";
enhanced_StoreDropdown.tabIndex = "0";
enhanced_StoreDropdown.addEventListener( "click", function ()
{
    if ( enhanced_StoreDropContent.style.display === "none" )
    {
        enhanced_StoreDropContent.style.display = "block";
    } else
    {
        enhanced_StoreDropContent.style.display = "none";
    }
} );
if ( document.querySelectorAll( ".ZECEje" )[0] !== undefined )
{
    document.querySelectorAll( ".ZECEje" )[0].append( enhanced_StoreContainer );
}

enhanced_StoreDropdown.addEventListener( "keyup", function ( e )
{
    if ( e.keyCode === 13 )
    {
        enhanced_StoreDropdown.click();
    }
} );

window.addEventListener( "click", function ( e )
{
    if ( e.target != enhanced_StoreDropdown && enhanced_StoreDropdown.contains( e.target ) === false )
    {
        enhanced_StoreDropContent.style.display = "none";
    }
} );

var enhanced_StoreDropContent = document.createElement( "div" );
enhanced_StoreDropdown.append( enhanced_StoreDropContent );
enhanced_StoreDropContent.id = "enhanced_StoreDropContent";
enhanced_StoreDropContent.className = "us22N";
enhanced_StoreDropContent.style.position = "absolute";
enhanced_StoreDropContent.style.width = "auto";
enhanced_StoreDropContent.style.top = "4.25rem";
enhanced_StoreDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_StoreDropContent.style.zIndex = "20";
enhanced_StoreDropContent.style.display = "none";

if ( document.querySelectorAll( ".eMobNd" )[0] !== undefined )
{
    document.querySelectorAll( ".eMobNd" )[0].append( enhanced_StoreContainer );
}

// On Sale - Quick access to the list of deals available for "Base" users
var enhanced_OnSale = document.createElement( "div" );
enhanced_OnSale.className = "pBvcyf QAAyWd";
enhanced_OnSale.id = "enhanced_OnSale";
enhanced_OnSale.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">local_offer</i><span class="mJVLwb">' + enhanced_lang.onsale + '</span>';
enhanced_OnSale.style.cursor = "pointer";
enhanced_OnSale.style.userSelect = "none";
enhanced_OnSale.style.paddingRight = "2rem";
enhanced_OnSale.tabIndex = "0";
enhanced_OnSale.addEventListener( "click", function ()
{
    openStadia( "store/list/14" );
} );
enhanced_StoreDropContent.append( enhanced_OnSale );

// Pro Deals - Quick access to the list of deals available for "Pro" users
var enhanced_ProDeals = document.createElement( "div" );
enhanced_ProDeals.className = "pBvcyf QAAyWd";
enhanced_ProDeals.id = "enhanced_ProDeals";
enhanced_ProDeals.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">loyalty</i><span class="mJVLwb">' + enhanced_lang.prodeals + '</span>';
enhanced_ProDeals.style.cursor = "pointer";
enhanced_ProDeals.style.userSelect = "none";
enhanced_ProDeals.style.paddingRight = "2rem";
enhanced_ProDeals.tabIndex = "0";
enhanced_ProDeals.addEventListener( "click", function ()
{
    openStadia( "store/list/45" );
} );
enhanced_StoreDropContent.append( enhanced_ProDeals );

// All games - Quick access to a list of all games currently available on Stadia
var enhanced_AllGames = document.createElement( "div" );
enhanced_AllGames.className = "pBvcyf QAAyWd";
enhanced_AllGames.id = "enhanced_AllGames";
enhanced_AllGames.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">list</i><span class="mJVLwb">' + enhanced_lang.allgames + '</span>';
enhanced_AllGames.style.cursor = "pointer";
enhanced_AllGames.style.userSelect = "none";
enhanced_AllGames.style.paddingRight = "2rem";
enhanced_AllGames.tabIndex = "0";
enhanced_AllGames.addEventListener( "click", function ()
{
    openStadia( "store/list/3" );
} );
enhanced_StoreDropContent.append( enhanced_AllGames );

// Settings Dropdown - Adds a dropdown menu for quick access
var enhanced_SettingsContainer = document.createElement( "li" );
enhanced_SettingsContainer.className = "OfFb0b";
enhanced_SettingsContainer.id = "enhanced_SettingsContainer";
var enhanced_SettingsDropdown = document.createElement( "div" );
enhanced_SettingsContainer.appendChild( enhanced_SettingsDropdown );
enhanced_SettingsDropdown.className = "ROpnrd QAAyWd wJYinb";
enhanced_SettingsDropdown.id = "enhanced_SettingsDropdown";
enhanced_SettingsDropdown.innerHTML = '<i class="material-icons-extended" aria-hidden="true">expand_more</i>';
enhanced_SettingsDropdown.style.cursor = "pointer";
enhanced_SettingsDropdown.style.width = "2.5rem";
enhanced_SettingsDropdown.style.padding = "0";
enhanced_SettingsDropdown.style.userSelect = "none";
enhanced_SettingsDropdown.tabIndex = "0";
enhanced_SettingsDropdown.addEventListener( "click", function ( e )
{
    if ( document.querySelector( ".X1asv.ahEBEd.LJni0" ).style.opacity == "1" )
    {
        document.querySelector( ".hBNsYe.QAAyWd.wJYinb.YySNWc" ).click();
    }
    if ( e.path.indexOf( enhanced_SettingsDropContent ) == -1 )
    {
        if ( enhanced_SettingsDropContent.style.display === "none" )
        {
            enhanced_SettingsDropContent.style.display = "flex";
        } else
        {
            enhanced_SettingsDropContent.style.display = "none";
        }
    }
} );

enhanced_SettingsDropdown.addEventListener( "keyup", function ( e )
{
    if ( e.keyCode === 13 )
    {
        enhanced_SettingsDropdown.click();
    }
} );

// Settings - Dropdown
var enhanced_SettingsDropContent = document.createElement( "div" );
enhanced_SettingsDropdown.append( enhanced_SettingsDropContent );
enhanced_SettingsDropContent.id = "enhanced_SettingsDropContent";
enhanced_SettingsDropContent.className = "us22N";
enhanced_SettingsDropContent.style.position = "fixed";
enhanced_SettingsDropContent.style.width = "30rem";
enhanced_SettingsDropContent.style.inset = "4rem 1.5rem 1.5rem auto"
enhanced_SettingsDropContent.style.boxShadow = "0 0.25rem 2.5rem rgba(0,0,0,0.30), 0 0.125rem 0.75rem rgba(0,0,0,0.4)";
enhanced_SettingsDropContent.style.zIndex = "20";
enhanced_SettingsDropContent.style.flexFlow = "column";
enhanced_SettingsDropContent.style.display = "none";
enhanced_SettingsDropContent.style.borderRadius = "0.5rem";
enhanced_SettingsDropContent.style.overflowY = "auto";
enhanced_SettingsDropContent.style.overflowX = "hidden";
if ( document.querySelectorAll( ".ZECEje" )[1] !== undefined )
{
    document.querySelectorAll( ".ZECEje" )[1].prepend( enhanced_SettingsContainer );
}
enhanced_addGlobalStyle( "#enhanced_SettingsDropContent::-webkit-scrollbar { width: 1rem; }" );
enhanced_addGlobalStyle( "#enhanced_SettingsDropContent::-webkit-scrollbar-thumb { background-color: #202124; border-radius: 1rem; border: 3px solid #2d2e30; }" );

// Settings - Shortcut
var enhanced_settingsShortcut = document.createElement( "div" );
enhanced_SettingsDropContent.appendChild( enhanced_settingsShortcut );

var enhanced_settingsShortcutTitle = document.createElement( "div" );
enhanced_settingsShortcutTitle.className = "pBvcyf QAAyWd";
enhanced_settingsShortcutTitle.id = "enhanced_settingsShortcutTitle";
enhanced_settingsShortcutTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.quickaccess + '</span>';
enhanced_settingsShortcutTitle.style.cursor = "default";
enhanced_settingsShortcutTitle.style.userSelect = "none";
enhanced_settingsShortcutTitle.style.background = "#202124";
enhanced_settingsShortcutTitle.style.textAlign = "center";
enhanced_settingsShortcut.append( enhanced_settingsShortcutTitle );

// Settings - Stream
var enhanced_settingsStream = document.createElement( "div" );
enhanced_SettingsDropContent.appendChild( enhanced_settingsStream );

var enhanced_settingsStreamTitle = document.createElement( "div" );
enhanced_settingsStreamTitle.className = "pBvcyf QAAyWd";
enhanced_settingsStreamTitle.id = "enhanced_settingsStreamTitle";
enhanced_settingsStreamTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.stream + '</span>';
enhanced_settingsStreamTitle.style.cursor = "default";
enhanced_settingsStreamTitle.style.userSelect = "none";
enhanced_settingsStreamTitle.style.background = "#202124";
enhanced_settingsStreamTitle.style.textAlign = "center";
enhanced_settingsStream.append( enhanced_settingsStreamTitle );

// Settings - Interface
var enhanced_settingsGeneral = document.createElement( "div" );
enhanced_SettingsDropContent.appendChild( enhanced_settingsGeneral );

var enhanced_settingsGeneralTitle = document.createElement( "div" );
enhanced_settingsGeneralTitle.className = "pBvcyf QAAyWd";
enhanced_settingsGeneralTitle.id = "enhanced_settingsGeneralHead";
enhanced_settingsGeneralTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.interface + '</span>';
enhanced_settingsGeneralTitle.style.cursor = "default";
enhanced_settingsGeneralTitle.style.userSelect = "none";
enhanced_settingsGeneralTitle.style.background = "#202124";
enhanced_settingsGeneralTitle.style.textAlign = "center";
enhanced_settingsGeneral.append( enhanced_settingsGeneralTitle );

// Settings - Messages
var enhanced_settingsMessages = document.createElement( "div" );
enhanced_SettingsDropContent.appendChild( enhanced_settingsMessages );

var enhanced_settingsMessagesTitle = document.createElement( "div" );
enhanced_settingsMessagesTitle.className = "pBvcyf QAAyWd";
enhanced_settingsMessagesTitle.id = "enhanced_settingsMessagesTitle";
enhanced_settingsMessagesTitle.innerHTML = '<span class="mJVLwb">' + enhanced_lang.messages + '</span>';
enhanced_settingsMessagesTitle.style.cursor = "default";
enhanced_settingsMessagesTitle.style.userSelect = "none";
enhanced_settingsMessagesTitle.style.background = "#202124";
enhanced_settingsMessagesTitle.style.textAlign = "center";
enhanced_settingsMessages.append( enhanced_settingsMessagesTitle );

window.addEventListener( "click", function ( e )
{
    if ( e.path.indexOf( enhanced_SettingsDropdown ) == -1 )
    {
        enhanced_SettingsDropContent.style.display = "none";
    }
} );

// Captures - A shortcut to the screenshots & videos of the current user
var enhanced_UserMedia = document.createElement( "div" );
enhanced_UserMedia.className = "pBvcyf QAAyWd";
enhanced_UserMedia.id = "enhanced_UserMedia";
enhanced_UserMedia.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">camera_alt</i><span class="mJVLwb">' + enhanced_lang.usermedia + '</span>';
enhanced_UserMedia.style.cursor = "pointer";
enhanced_UserMedia.style.userSelect = "none";
enhanced_UserMedia.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_UserMedia.tabIndex = "0";
enhanced_UserMedia.addEventListener( "click", function ()
{
    openStadia( "captures" );
} );
enhanced_settingsShortcut.append( enhanced_UserMedia );

// Speedtest - Shortcut to M-Lab test
var enhanced_speedTest = document.createElement( "div" );
enhanced_speedTest.className = "pBvcyf QAAyWd";
enhanced_speedTest.id = "enhanced_speedTest";
enhanced_speedTest.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speed</i><span class="mJVLwb">' + enhanced_lang.speedtest + '</span>';
enhanced_speedTest.style.cursor = "pointer";
enhanced_speedTest.style.userSelect = "none";
enhanced_speedTest.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_speedTest.tabIndex = "0";
enhanced_speedTest.addEventListener( "click", function ()
{
    window.open( "https://projectstream.google.com/speedtest", "_blank" );
} );
enhanced_settingsShortcut.append( enhanced_speedTest )

// Community - Shortcut to community page
var enhanced_communityPage = document.createElement( "div" );
enhanced_communityPage.className = "pBvcyf QAAyWd";
enhanced_communityPage.id = "enhanced_communityPage";
enhanced_communityPage.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">forum</i><span class="mJVLwb">' + enhanced_lang.community + '</span>';
enhanced_communityPage.style.cursor = "pointer";
enhanced_communityPage.style.userSelect = "none";
enhanced_communityPage.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_communityPage.tabIndex = "0";
enhanced_communityPage.addEventListener( "click", function ()
{
    window.open( "https://community.stadia.com/", "_blank" );
} );
enhanced_settingsShortcut.append( enhanced_communityPage )

// Codec - Control element for the stream codec
var enhanced_currentCodec = parseInt( localStorage.getItem( "enhanced_CodecOption" ) || 0 );
var enhanced_Codec = document.createElement( "div" );
enhanced_Codec.className = "pBvcyf QAAyWd";
enhanced_Codec.id = "enhanced_Codec";
enhanced_Codec.style.cursor = "pointer";
enhanced_Codec.style.userSelect = "none";
enhanced_Codec.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Codec.tabIndex = "0";
enhanced_Codec.addEventListener( "click", function ()
{
    enhanced_currentCodec = ( enhanced_currentCodec + 1 ) % 3;
    localStorage.setItem( "enhanced_CodecOption", enhanced_currentCodec );
    enhanced_changeCodec( enhanced_currentCodec );
} );
enhanced_settingsStream.append( enhanced_Codec );

function enhanced_changeCodec( c )
{
    switch ( c )
    {
        case 0:
            enhanced_Codec.style.color = "";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.codec + ': ' + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.auto + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'Automatic'.", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_Codec.style.color = "#00e0ba";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.codec + ': VP9<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.auto + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'VP9'.", enhanced_consoleEnhanced, "" );
            break
        case 2:
            enhanced_currentRes = 0;
            localStorage.setItem( "enhanced_ResOption", enhanced_currentRes );
            enhanced_updateResolution( enhanced_currentRes )
            enhanced_Codec.style.color = "#00e0ba";
            enhanced_Codec.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">video_settings</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.codec + ': H264<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.codecdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.auto + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Codec Preference: Set to 'H264'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Resolution - Control element for the stream resolution
localStorage.setItem( "enhanced_DeskWidth", window.screen.width );
localStorage.setItem( "enhanced_DeskHeight", window.screen.height );
// Object.defineProperty(window.screen, "colorDepth", { value: 48 });
var enhanced_currentRes = parseInt( localStorage.getItem( "enhanced_ResOption" ) || 0 );
var enhanced_Resolution = document.createElement( "div" );
enhanced_Resolution.className = "pBvcyf QAAyWd";
enhanced_Resolution.id = "enhanced_Resolution";
enhanced_Resolution.style.cursor = "pointer";
enhanced_Resolution.style.userSelect = "none";
enhanced_Resolution.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_UserMedia.tabIndex = "0";
enhanced_Resolution.addEventListener( "click", function ( evt )
{
    enhanced_currentRes = ( enhanced_currentRes + 1 ) % 3;
    localStorage.setItem( "enhanced_ResOption", enhanced_currentRes );
    enhanced_updateResolution( enhanced_currentRes )
} );
enhanced_settingsStream.append( enhanced_Resolution );

function enhanced_updateResolution( res )
{
    switch ( res )
    {
        case 0:
            enhanced_Resolution.style.color = "";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.resolution + ': ' + enhanced_lang.native + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.native + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to 'Native'.", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_currentCodec = 1;
            localStorage.setItem( "enhanced_CodecOption", enhanced_currentCodec );
            enhanced_changeCodec( enhanced_currentCodec )
            enhanced_Resolution.style.color = "#00e0ba";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.resolution + ': 1440p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.native + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '2560x1440'.", enhanced_consoleEnhanced, "" );
            break
        case 2:
            enhanced_currentCodec = 1;
            localStorage.setItem( "enhanced_CodecOption", enhanced_currentCodec );
            enhanced_changeCodec( enhanced_currentCodec )
            enhanced_Resolution.style.color = "#00e0ba";
            enhanced_Resolution.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">monitor</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.resolution + ': 2160p<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.resolutiondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.native + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Resolution: Set to '3840x2160'.", enhanced_consoleEnhanced, "" );
            break
    }
}

function enhanced_changeResolution()
{
    // Source: https://superuser.com/questions/712461/
    var enhancedinject_currentResolution;
    setInterval( function ()
    {
        var enhancedinject_newResolution = parseInt( localStorage.getItem( "enhanced_ResOption" ) );
        if ( enhancedinject_newResolution != enhancedinject_currentResolution )
        {
            enhancedinject_currentResolution = enhancedinject_newResolution;
            switch ( enhancedinject_currentResolution )
            {
                case 0:
                    var x = parseInt( localStorage.getItem( "enhanced_DeskWidth" ) );
                    var y = parseInt( localStorage.getItem( "enhanced_DeskHeight" ) );
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

            Object.defineProperty( window.screen, "availWidth", {
                value: x,
                configurable: true
            } );
            Object.defineProperty( window.screen, "width", {
                value: x,
                configurable: true
            } );
            Object.defineProperty( window.screen, "availHeight", {
                value: y,
                configurable: true
            } );
            Object.defineProperty( window.screen, "height", {
                value: y,
                configurable: true
            } );
        }
    }, 200 );
}
embed( enhanced_changeResolution );

// Stream Monitor Autostart
var enhanced_autostartMonitor = parseInt( localStorage.getItem( "enhanced_autostartMonitor" ) || 0 );
var enhanced_monitorStarted = false;
var enhanced_monitorAutostart = document.createElement( "div" );
enhanced_monitorAutostart.className = "pBvcyf QAAyWd";
enhanced_monitorAutostart.id = "enhanced_monitorAutostart";
enhanced_monitorAutostart.style.cursor = "pointer";
enhanced_monitorAutostart.style.userSelect = "none";
enhanced_monitorAutostart.tabIndex = "0";
enhanced_monitorAutostart.addEventListener( "click", function ()
{
    enhanced_autostartMonitor = ( enhanced_autostartMonitor + 1 ) % 2;
    localStorage.setItem( "enhanced_autostartMonitor", enhanced_autostartMonitor );
    enhanced_changeMonitorAutostart( enhanced_autostartMonitor );
} );
enhanced_settingsStream.append( enhanced_monitorAutostart );

function enhanced_changeMonitorAutostart( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_monitorAutostart.style.color = "";
            enhanced_monitorAutostart.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.streammon + ": " + enhanced_lang.manual + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.manual + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Stream Monitor Start: Set to 'Manual'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_monitorAutostart.style.color = "#00e0ba";
            enhanced_monitorAutostart.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings_power</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.streammon + ": " + enhanced_lang.auto + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammondesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.manual + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Stream Monitor Start: Set to 'Auto'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Grid - Control element for the homescreen library grid
var enhanced_GridSize = parseInt( localStorage.getItem( "enhanced_GridSize" ) || 0 );
var enhanced_Grid = document.createElement( "div" );
enhanced_Grid.className = "pBvcyf QAAyWd";
enhanced_Grid.id = "enhanced_Grid";
enhanced_Grid.style.cursor = "pointer";
enhanced_Grid.style.userSelect = "none";
enhanced_Grid.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Grid.tabIndex = "0";
enhanced_Grid.addEventListener( "click", function ()
{
    enhanced_GridSize = ( enhanced_GridSize + 1 ) % 5;
    localStorage.setItem( "enhanced_GridSize", enhanced_GridSize );
    enhanced_changeGridSize( enhanced_GridSize )
} );
enhanced_settingsGeneral.append( enhanced_Grid );

function enhanced_changeGridSize( size )
{
    switch ( size )
    {
        case 0:
            enhanced_Grid.style.color = "";
            enhanced_addGlobalStyle( ".lEPylf.YOW9Fd { grid-template-columns: repeat(12,minmax(auto,7.8125rem)) !important; }" )
            break;
        case 1:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle( ".lEPylf.YOW9Fd { grid-template-columns: repeat(18,minmax(auto,7.8125rem)) !important; }" )
            break;
        case 2:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle( ".lEPylf.YOW9Fd { grid-template-columns: repeat(24,minmax(auto,7.8125rem)) !important; }" )
            break;
        case 3:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle( ".lEPylf.YOW9Fd { grid-template-columns: repeat(30,minmax(auto,7.8125rem)) !important; }" )
            break;
        case 4:
            enhanced_Grid.style.color = "#00e0ba";
            enhanced_addGlobalStyle( ".lEPylf.YOW9Fd { grid-template-columns: repeat(36,minmax(auto,7.8125rem)) !important; }" )
            break;
    }
    enhanced_Grid.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_comfy</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.gridsize + ': ' + ( enhanced_GridSize + 2 ) + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.griddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': 2</span></span>';
    console.log( "%cStadia Enhanced" + "%c ⚙️ - Library Grid Size: Set to " + ( enhanced_GridSize + 2 ) + ".", enhanced_consoleEnhanced, "" );
}

// Clock - Control element for the clock specific settings
var enhanced_ClockOption = parseInt( localStorage.getItem( "enhanced_ClockOption" ) || 0 );
var enhanced_Clock = document.createElement( "div" );
enhanced_Clock.className = "pBvcyf QAAyWd";
enhanced_Clock.id = "enhanced_Clock";
enhanced_Clock.style.cursor = "pointer";
enhanced_Clock.style.userSelect = "none";
enhanced_Clock.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Clock.tabIndex = "0";
enhanced_Clock.addEventListener( "click", function ()
{
    enhanced_ClockOption = ( enhanced_ClockOption + 1 ) % 4;
    localStorage.setItem( "enhanced_ClockOption", enhanced_ClockOption );
    enhanced_changeClock( enhanced_ClockOption );
} );
enhanced_settingsGeneral.append( enhanced_Clock );

function enhanced_changeClock( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_Clock.style.color = "";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "none";
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Disabled'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.friendslist + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "flex";
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Friendlist'", enhanced_consoleEnhanced, "" );
            break
        case 2:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.igoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "none";
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'In-Game Overlay'", enhanced_consoleEnhanced, "" );
            break
        case 3:
            enhanced_Clock.style.color = "#00e0ba";
            enhanced_Clock.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">schedule</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.clock + ": " + enhanced_lang.listoverlay + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.clockdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            enhanced_ClockFriends.style.display = "flex";
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Clock Option: Set to 'Menu & Overlay'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Game Filter
var enhanced_filterOption = parseInt( localStorage.getItem( "enhanced_filterOption" ) || 0 );
var enhanced_gameFilter = document.createElement( "div" );
enhanced_gameFilter.className = "pBvcyf QAAyWd";
enhanced_gameFilter.id = "enhanced_gameFilter";
enhanced_gameFilter.style.cursor = "pointer";
enhanced_gameFilter.style.userSelect = "none";
enhanced_gameFilter.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_gameFilter.tabIndex = "0";
enhanced_gameFilter.addEventListener( "click", function ()
{
    enhanced_filterOption = ( enhanced_filterOption + 1 ) % 3;
    localStorage.setItem( "enhanced_filterOption", enhanced_filterOption );
    enhanced_changeFilter( enhanced_filterOption );
} );
enhanced_settingsGeneral.append( enhanced_gameFilter );

function enhanced_changeFilter( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_gameFilter.style.color = "";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Disabled'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_gameFilter.style.color = "#00e0ba";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.filtertoggle + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Toggle'", enhanced_consoleEnhanced, "" );
            break
        case 2:
            enhanced_gameFilter.style.color = "#00e0ba";
            enhanced_gameFilter.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">visibility</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.filter + ": " + enhanced_lang.filterquick + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.filterdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Filter Option: Set to 'Quick'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Invite Link
var enhanced_InviteURL = "https://stadia.com/link/referrals?si_rid=" + enhanced_AccountID + "&si_rt=1";
var enhanced_Invite = document.createElement( "div" );
enhanced_Invite.className = "pBvcyf QAAyWd";
enhanced_Invite.id = "enhanced_Invite";
enhanced_Invite.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_add</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.invitebase + '</span>';
enhanced_Invite.style.cursor = "pointer";
enhanced_Invite.style.userSelect = "none";
enhanced_Invite.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_Invite.tabIndex = "0";
enhanced_Invite.addEventListener( "click", function ()
{
    navigator.clipboard.writeText( enhanced_InviteURL );
    enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb" >' + enhanced_lang.inviteactive + '</span>';
    enhanced_Invite.style.color = "#ff773d";
    setTimeout( function ()
    {
        enhanced_Invite.innerHTML = '<span class="p7Os3d"><i class="material-icons-extended" aria-hidden="true">person_add</i></span><span class="mJVLwb">' + enhanced_lang.invitebase + '</span>';
        enhanced_Invite.style.color = "";
    }, 1000 );
} );
enhanced_settingsShortcut.append( enhanced_Invite );

// Reset Settings
var enhanced_resetSettings = document.createElement( "div" );
enhanced_resetSettings.className = "pBvcyf QAAyWd";
enhanced_resetSettings.id = "enhanced_resetSettings";
enhanced_resetSettings.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">settings</i><span class="mJVLwb">' + enhanced_lang.resetsettings + '</span>';
enhanced_resetSettings.style.cursor = "pointer";
enhanced_resetSettings.style.userSelect = "none";
enhanced_resetSettings.tabIndex = "0";
enhanced_resetSettings.addEventListener( "click", function ()
{
    if ( confirm( enhanced_lang.confirmreset ) )
    {
        localStorage.removeItem( "enhanced_messagePreview" );
        localStorage.removeItem( "enhanced_hideCategory" );
        localStorage.removeItem( "enhanced_DeskWidth" );
        localStorage.removeItem( "enhanced_DeskHeight" );
        localStorage.removeItem( "enhanced_autostartMonitor" );
        localStorage.removeItem( "enhanced_hidePopupEffect" );
        localStorage.removeItem( "enhanced_monitorState" );
        localStorage.removeItem( "enhanced_CodecOption" );
        localStorage.removeItem( "enhanced_useQuickReply" );
        localStorage.removeItem( "enhanced_hideUserMedia" );
        localStorage.removeItem( "enhanced_useStreamMode" );
        localStorage.removeItem( "enhanced_gameFilter" );
        localStorage.removeItem( "enhanced_ClockOption" );
        localStorage.removeItem( "enhanced_hideLabel" );
        localStorage.removeItem( "enhanced_monitorMode" );
        localStorage.removeItem( "enhanced_shortcutsOption" );
        localStorage.removeItem( "enhanced_hideOffline" );
        localStorage.removeItem( "enhanced_monitorPosition" );
        localStorage.removeItem( "enhanced_monitorOption" );
        localStorage.removeItem( "enhanced_filterOption" );
        localStorage.removeItem( "enhanced_GridSize" );
        localStorage.removeItem( "enhanced_ResOption" );
        localStorage.removeItem( "enhanced_hideInvisible" );
        localStorage.removeItem( "enhanced_storeListSize" );
        console.log( "%cStadia Enhanced" + "%c ⚙️ - Settings reverted to default.", enhanced_consoleEnhanced, "" );
        location.reload();
    }
} );
enhanced_settingsShortcut.append( enhanced_resetSettings )

// Message Preview
var enhanced_messagePreview = parseInt( localStorage.getItem( "enhanced_messagePreview" ) || 0 );
var enhanced_hidePreview = document.createElement( "div" );
enhanced_hidePreview.className = "pBvcyf QAAyWd";
enhanced_hidePreview.id = "enhanced_hidePreview";
enhanced_hidePreview.style.cursor = "pointer";
enhanced_hidePreview.style.userSelect = "none";
enhanced_hidePreview.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_hidePreview.tabIndex = "0";
enhanced_hidePreview.addEventListener( "click", function ()
{
    enhanced_messagePreview = ( enhanced_messagePreview + 1 ) % 2;
    localStorage.setItem( "enhanced_messagePreview", enhanced_messagePreview );
    enhanced_changeMsgPreview( enhanced_messagePreview );
} );
enhanced_settingsMessages.append( enhanced_hidePreview );

function enhanced_changeMsgPreview( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".lzIqJf .DvD76d { display: flex; }" );
            enhanced_addGlobalStyle( ".lzIqJf .xzJkDf { display: block; }" );
            enhanced_hidePreview.style.color = "";
            enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Message Preview: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".lzIqJf .DvD76d { display: none; }" )
            enhanced_addGlobalStyle( ".lzIqJf .xzJkDf { display: none; }" )
            enhanced_hidePreview.style.color = "#00e0ba";
            enhanced_hidePreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">speaker_notes_off</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.quickprev + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Message Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Quick Reply
var enhanced_useQuickReply = parseInt( localStorage.getItem( "enhanced_useQuickReply" ) || 0 );
var enhanced_quickReply = document.createElement( "div" );
enhanced_quickReply.className = "pBvcyf QAAyWd";
enhanced_quickReply.id = "enhanced_quickReply";
enhanced_quickReply.style.cursor = "pointer";
enhanced_quickReply.style.userSelect = "none";
enhanced_quickReply.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_quickReply.tabIndex = "0";
enhanced_quickReply.addEventListener( "click", function ()
{
    enhanced_useQuickReply = ( enhanced_useQuickReply + 1 ) % 2;
    localStorage.setItem( "enhanced_useQuickReply", enhanced_useQuickReply );
    enhanced_changeQuickReply( enhanced_useQuickReply );
} );
enhanced_settingsMessages.append( enhanced_quickReply );

function enhanced_changeQuickReply( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".bbVL5c { display: flex !important; }" );
            enhanced_quickReply.style.color = "";
            enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Quick Reply: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".bbVL5c { display: none !important; }" )
            enhanced_quickReply.style.color = "#00e0ba";
            enhanced_quickReply.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">subtitles_off</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.quickrep + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.quickrepdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Quick Reply: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Hide: Offline Users
var enhanced_hideOffline = parseInt( localStorage.getItem( "enhanced_hideOffline" ) || 0 );
var enhanced_offlineUser = document.createElement( "div" );
enhanced_offlineUser.className = "pBvcyf QAAyWd";
enhanced_offlineUser.id = "enhanced_lastMessage";
enhanced_offlineUser.style.cursor = "pointer";
enhanced_offlineUser.style.userSelect = "none";
enhanced_offlineUser.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_offlineUser.tabIndex = "0";
enhanced_offlineUser.addEventListener( "click", function ()
{
    enhanced_hideOffline = ( enhanced_hideOffline + 1 ) % 2;
    localStorage.setItem( "enhanced_hideOffline", enhanced_hideOffline );
    enhanced_changeOfflineUser( enhanced_hideOffline );
} );
enhanced_settingsMessages.append( enhanced_offlineUser );

function enhanced_changeOfflineUser( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_offlineUser.style.color = "";
            enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Offline Users: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_offlineUser.style.color = "#00e0ba";
            enhanced_offlineUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.offlinefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.offlinefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Offline Users: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Hide: Invisible Users
var enhanced_hideInvisible = parseInt( localStorage.getItem( "enhanced_hideInvisible" ) || 0 );
var enhanced_invisibleUser = document.createElement( "div" );
enhanced_invisibleUser.className = "pBvcyf QAAyWd";
enhanced_invisibleUser.id = "enhanced_lastMessage";
enhanced_invisibleUser.style.cursor = "pointer";
enhanced_invisibleUser.style.userSelect = "none";
enhanced_invisibleUser.tabIndex = "0";
enhanced_invisibleUser.addEventListener( "click", function ()
{
    enhanced_hideInvisible = ( enhanced_hideInvisible + 1 ) % 2;
    localStorage.setItem( "enhanced_hideInvisible", enhanced_hideInvisible );
    enhanced_changeInvisibleUser( enhanced_hideInvisible );
} );
enhanced_settingsMessages.append( enhanced_invisibleUser );

function enhanced_changeInvisibleUser( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_invisibleUser.style.color = "";
            enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Invisible Users: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_invisibleUser.style.color = "#00e0ba";
            enhanced_invisibleUser.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">person_remove</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.invisiblefriend + ': ' + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.invisiblefrienddesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Invisible Users: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Pro Labels
var enhanced_hideLabel = parseInt( localStorage.getItem( "enhanced_hideLabel" ) || 0 );
var enhanced_proLabel = document.createElement( "div" );
enhanced_proLabel.className = "pBvcyf QAAyWd";
enhanced_proLabel.id = "enhanced_proLabel";
enhanced_proLabel.style.cursor = "pointer";
enhanced_proLabel.style.userSelect = "none";
enhanced_proLabel.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_proLabel.tabIndex = "0";
enhanced_proLabel.addEventListener( "click", function ()
{
    enhanced_hideLabel = ( enhanced_hideLabel + 1 ) % 2;
    localStorage.setItem( "enhanced_hideLabel", enhanced_hideLabel );
    enhanced_changeProLabel( enhanced_hideLabel );
} );
enhanced_settingsGeneral.append( enhanced_proLabel );

function enhanced_changeProLabel( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".GqLi4d.XUBkDd .a1l9D { display: block; }" )
            enhanced_proLabel.style.color = "";
            enhanced_proLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.prolabel + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.prolabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Pro Labels: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".GqLi4d.XUBkDd .a1l9D { display: none; }" )
            enhanced_proLabel.style.color = "#00e0ba";
            enhanced_proLabel.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.prolabel + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.prolabeldesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Pro Labels: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Hide User Media on Homescreen
var enhanced_hideUserMedia = parseInt( localStorage.getItem( "enhanced_hideUserMedia" ) || 0 );
var enhanced_mediaPreview = document.createElement( "div" );
enhanced_mediaPreview.className = "pBvcyf QAAyWd";
enhanced_mediaPreview.id = "enhanced_mediaPreview";
enhanced_mediaPreview.style.cursor = "pointer";
enhanced_mediaPreview.style.userSelect = "none";
enhanced_mediaPreview.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_mediaPreview.tabIndex = "0";
enhanced_mediaPreview.addEventListener( "click", function ()
{
    enhanced_hideUserMedia = ( enhanced_hideUserMedia + 1 ) % 2;
    localStorage.setItem( "enhanced_hideUserMedia", enhanced_hideUserMedia );
    enhanced_changeMediaPreview( enhanced_hideUserMedia );
} );
enhanced_settingsGeneral.append( enhanced_mediaPreview );

function enhanced_changeMediaPreview( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".ctThpb.lEPylf { display: block; }" )
            enhanced_mediaPreview.style.color = "";
            enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Media Preview: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".ctThpb.lEPylf { display: none; }" )
            enhanced_mediaPreview.style.color = "#00e0ba";
            enhanced_mediaPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">image</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.homegallery + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.homegallerydesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Media Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Category Preview
var enhanced_hideCategory = parseInt( localStorage.getItem( "enhanced_hideCategory" ) || 0 );
var enhanced_categoryPreview = document.createElement( "div" );
enhanced_categoryPreview.className = "pBvcyf QAAyWd";
enhanced_categoryPreview.id = "enhanced_categoryPreview";
enhanced_categoryPreview.style.cursor = "pointer";
enhanced_categoryPreview.style.userSelect = "none";
enhanced_categoryPreview.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_categoryPreview.tabIndex = "0";
enhanced_categoryPreview.addEventListener( "click", function ()
{
    enhanced_hideCategory = ( enhanced_hideCategory + 1 ) % 2;
    localStorage.setItem( "enhanced_hideCategory", enhanced_hideCategory );
    enhanced_changeCategoryPreview( enhanced_hideCategory );
} );
enhanced_settingsGeneral.append( enhanced_categoryPreview );

function enhanced_changeCategoryPreview( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( "#enhanced_wrapper .ssR8Bc { display: inline-block !important; }" );
            enhanced_categoryPreview.style.color = "";
            enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.visible + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Category Preview: Set to 'Visible'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( "#enhanced_wrapper .ssR8Bc { display: none !important; }" );
            enhanced_categoryPreview.style.color = "#00e0ba";
            enhanced_categoryPreview.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">label_off</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.catprev + ": " + enhanced_lang.hidden + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.catprevdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.visible + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Category Preview: Set to 'Hidden'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Popup on game tiles
var enhanced_hidePopupEffect = parseInt( localStorage.getItem( "enhanced_hidePopupEffect" ) || 0 );
var enhanced_gamePopup = document.createElement( "div" );
enhanced_gamePopup.className = "pBvcyf QAAyWd";
enhanced_gamePopup.id = "enhanced_gamePopup";
enhanced_gamePopup.style.cursor = "pointer";
enhanced_gamePopup.style.userSelect = "none";
enhanced_gamePopup.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_gamePopup.tabIndex = "0";
enhanced_gamePopup.addEventListener( "click", function ()
{
    enhanced_hidePopupEffect = ( enhanced_hidePopupEffect + 1 ) % 2;
    localStorage.setItem( "enhanced_hidePopupEffect", enhanced_hidePopupEffect );
    enhanced_changeGamePopup( enhanced_hidePopupEffect );
} );
enhanced_settingsGeneral.append( enhanced_gamePopup );

function enhanced_changeGamePopup( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( "#enhanced_wrapper:hover { z-index: 3; transform: scale(1.1); transition: transform .2s cubic-bezier(0.35,0,0.15,1); }" );
            enhanced_gamePopup.style.color = "";
            enhanced_gamePopup.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">pageview</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.popup + ": " + enhanced_lang.default + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.popupdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.enabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Popup Effect: Set to 'Enabled'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( "#enhanced_wrapper:hover { z-index: unset; transform: none; transition: none; }" );
            enhanced_gamePopup.style.color = "#00e0ba";
            enhanced_gamePopup.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">pageview</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.popup + ": " + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.popupdesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.enabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Popup Effect: Set to 'Disabled'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Store-List Split
var enhanced_storeListSize = parseInt( localStorage.getItem( "enhanced_storeListSize" ) || 0 );
var enhanced_storeList = document.createElement( "div" );
enhanced_storeList.className = "pBvcyf QAAyWd";
enhanced_storeList.id = "enhanced_storeList";
enhanced_storeList.style.cursor = "pointer";
enhanced_storeList.style.userSelect = "none";
enhanced_storeList.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_storeList.tabIndex = "0";
enhanced_storeList.addEventListener( "click", function ()
{
    enhanced_storeListSize = ( enhanced_storeListSize + 1 ) % 2;
    localStorage.setItem( "enhanced_storeListSize", enhanced_storeListSize );
    enhanced_changeStoreList( enhanced_storeListSize );
} );
enhanced_settingsGeneral.append( enhanced_storeList );

function enhanced_changeStoreList( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".alEDLe.URhE4b .h6J22d { float: none; width: 100%; } .alEDLe.URhE4b .h6J22d:nth-child(2n) { margin-left: 0; }" );
            enhanced_storeList.style.color = "";
            enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Split Store Lists: Set to 'Disabled'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".alEDLe.URhE4b .h6J22d { float: left; width: calc(50% - 0.5rem); } .alEDLe.URhE4b .h6J22d:nth-child(2n) { margin-left: 1rem; }" );
            enhanced_storeList.style.color = "#00e0ba";
            enhanced_storeList.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">view_column</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.splitstore + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.splitstoredesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Split Store Lists: Set to 'Enabled'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Enable Scrollbars
var enhanced_enableScroll = parseInt( localStorage.getItem( "enhanced_enableScroll" ) || 0 );
var enhanced_forcedScrollbar = document.createElement( "div" );
enhanced_forcedScrollbar.className = "pBvcyf QAAyWd";
enhanced_forcedScrollbar.id = "enhanced_forcedScrollbar";
enhanced_forcedScrollbar.style.cursor = "pointer";
enhanced_forcedScrollbar.style.userSelect = "none";
enhanced_forcedScrollbar.style.borderBottom = "1px solid rgba(255,255,255,.06)";
enhanced_forcedScrollbar.tabIndex = "0";
enhanced_forcedScrollbar.addEventListener( "click", function ()
{
    enhanced_enableScroll = ( enhanced_enableScroll + 1 ) % 2;
    localStorage.setItem( "enhanced_enableScroll", enhanced_enableScroll );
    enhanced_changeScrollbar( enhanced_enableScroll );
} );
enhanced_settingsGeneral.append( enhanced_forcedScrollbar );

function enhanced_changeScrollbar( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".Z5U6eb .qWf7Hd > .h1uihb { overflow-y: auto; height: auto; }" );
            enhanced_forcedScrollbar.style.color = "";
            enhanced_forcedScrollbar.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">unfold_more</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.scrollbar + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.scrollbardesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Scrollbars: Set to 'Disabled'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".Z5U6eb .qWf7Hd > .h1uihb { overflow-y: scroll; height: 100%; }" );
            enhanced_forcedScrollbar.style.color = "#00e0ba";
            enhanced_forcedScrollbar.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">unfold_more</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.scrollbar + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.scrollbardesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Scrollbars: Set to 'Enabled'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Stream Mode
var enhanced_useStreamMode = parseInt( localStorage.getItem( "enhanced_useStreamMode" ) || 0 );
var enhanced_streamMode = document.createElement( "div" );
enhanced_streamMode.className = "pBvcyf QAAyWd";
enhanced_streamMode.id = "enhanced_streamMode";
enhanced_streamMode.style.cursor = "pointer";
enhanced_streamMode.style.userSelect = "none";
enhanced_streamMode.tabIndex = "0";
enhanced_streamMode.addEventListener( "click", function ()
{
    enhanced_useStreamMode = ( enhanced_useStreamMode + 1 ) % 2;
    localStorage.setItem( "enhanced_useStreamMode", enhanced_useStreamMode );
    enhanced_changeStreamMode( enhanced_useStreamMode );
} );
enhanced_settingsGeneral.append( enhanced_streamMode );

function enhanced_changeStreamMode( opt )
{
    switch ( opt )
    {
        case 0:
            enhanced_addGlobalStyle( ".lzIqJf .Y1rZWd.QAAyWd.PuD06d, .gI3hkd, .Uwaqdf, .KW2hBe, .DlMyQd.cAx65e, .DlMyQd.KPQoWd, .CVhnkf, .h6J22d.BM7p1d.QAAyWd > .zRamU { filter: none; text-shadow: none }" );
            enhanced_streamMode.style.color = "";
            enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.disabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Stream Mode: Set to 'Disabled'", enhanced_consoleEnhanced, "" );
            break
        case 1:
            enhanced_addGlobalStyle( ".lzIqJf .Y1rZWd.QAAyWd.PuD06d, .gI3hkd, .Uwaqdf, .KW2hBe, .DlMyQd.cAx65e, .DlMyQd.KPQoWd, .CVhnkf, .h6J22d.BM7p1d.QAAyWd > .zRamU { filter: blur(0.25rem) brightness(1.2); text-shadow: 0.5rem 0px; }" );
            enhanced_streamMode.style.color = "#00e0ba";
            enhanced_streamMode.innerHTML = '<i class="material-icons-extended STPv1" aria-hidden="true">preview</i><span class="mJVLwb" style="width: 25rem; white-space: normal;">' + enhanced_lang.streammode + ': ' + enhanced_lang.enabled + '<br><span style="color: #fff;font-size: 0.7rem;">' + enhanced_lang.streammodedesc + '</span><br><span style="color: rgba(255,255,255,.4);font-size: 0.7rem;">' + enhanced_lang.default + ': ' + enhanced_lang.disabled + '</span></span>';
            console.log( "%cStadia Enhanced" + "%c ⚙️ - Stream Mode: Set to 'Enabled'", enhanced_consoleEnhanced, "" );
            break
    }
}

// Avatar - Allows the user to set a custom avatar
var enhanced_customAvatar = document.createElement( "div" );
enhanced_customAvatar.className = "CTvDXd QAAyWd Pjpac GShPJb edaWcd";
enhanced_customAvatar.id = "enhanced_customAvatar";
enhanced_customAvatar.role = "button";
enhanced_customAvatar.innerHTML = '<div class="KEaHo"><span class="X5peoe"><i class="google-material-icons lS1Wre Ce1Y1c xT8eqd" aria-hidden="true">face</i></span><span class="caSJV snByac">' + enhanced_lang.avatar + '</span></div>';
enhanced_customAvatar.tabIndex = "0";
enhanced_customAvatar.addEventListener( "click", function ()
{
    enhanced_avatarURL = prompt( enhanced_lang.avatarpopup )
    if ( enhanced_avatarURL != null )
    {
        if ( enhanced_avatarURL.length < 1 )
        {
            enhanced_setAvatar( document.querySelector( ".ksZYgc.VGZcUb" ).style.backgroundImage.replace( /(url\(|\)|")/g, '' ) );
            localStorage.removeItem( "enhanced_avatarURL_" + document.querySelector( "head > base" ).getAttribute( "href" ) );
        } else
        {
            localStorage.setItem( "enhanced_avatarURL_" + document.querySelector( "head > base" ).getAttribute( "href" ), enhanced_avatarURL );
            enhanced_setAvatar( enhanced_avatarURL );
        }
    }
} );

function enhanced_setAvatar( url )
{
    console.log( "%cStadia Enhanced" + "%c ⚙️ - Avatar changed to: " + url, enhanced_consoleEnhanced, "" );
    enhanced_addGlobalStyle( '.ksZYgc.VGZcUb { background-image: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( '.rybUIf { background-image: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( '.dOyvbe { background-image: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( '.Nv1Sab[alt$="' + enhanced_AccountName + '"] { content: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( 'c-wiz[data-p*="' + enhanced_AccountID + '"] .XZRzG { background-image: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( '.SAPaEd.bYsRUc div[jsdata*="' + enhanced_AccountID + '"] .PwtJse { background-image: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( '.Tidcwc > .Y1rZWd.QAAyWd.mZLJyd .Fnd1Pd.rnWGL { background-image: url("' + url + '") !important; }' );
    enhanced_addGlobalStyle( '.mcaxA.ZmeF9 div:first-child { background-image: url("' + url + '") !important; }' );
}

// Store Container - Container to display store buttons
var enhanced_StoreContainer = document.createElement( "div" );
enhanced_StoreContainer.id = "enhanced_ButtonBox";
enhanced_StoreContainer.style.display = "flex";
enhanced_StoreContainer.style.justifyContent = "space-around";
enhanced_StoreContainer.style.gap = "1.5rem";

// Youtube Search
var enhanced_YouTube = document.createElement( "div" );
enhanced_YouTube.id = "enhanced_YouTube";
enhanced_YouTube.className = "CTvDXd QAAyWd Fjy05d ATH3sf wJYinb rOskPc rpgZzc";
enhanced_YouTube.innerHTML = '<span class="COTyRb">' + enhanced_lang.searchbtnbase + ' YouTube</span>'
enhanced_YouTube.style.cursor = "pointer";
enhanced_YouTube.style.userSelect = "none";
enhanced_YouTube.tabIndex = "0";
enhanced_YouTube.style.backgroundColor = "#c00";
enhanced_YouTube.style.color = "white";
enhanced_YouTube.style.marginTop = "1.5rem";
enhanced_YouTube.addEventListener( "click", function ()
{
    enhanced_GameTitle = document.querySelectorAll( ".UG7HXc" )[document.querySelectorAll( ".UG7HXc" ).length - 1].textContent;
    window.open( "https://www.youtube.com/results?search_query=" + enhanced_GameTitle, "_blank" );
} );
enhanced_StoreContainer.append( enhanced_YouTube );

// Metacritic Search
var enhanced_Metacritic = document.createElement( "div" );
enhanced_Metacritic.id = "enhanced_Metacritic";
enhanced_Metacritic.className = "CTvDXd QAAyWd Fjy05d ATH3sf wJYinb rOskPc rpgZzc";
enhanced_Metacritic.innerHTML = '<span class="COTyRb">' + enhanced_lang.searchbtnbase + ' <span style="color: #fc3;">Metacritic</span></span>'
enhanced_Metacritic.style.cursor = "pointer";
enhanced_Metacritic.style.userSelect = "none";
enhanced_Metacritic.tabIndex = "0";
enhanced_Metacritic.style.backgroundColor = "#131416";
enhanced_Metacritic.style.color = "white";
enhanced_Metacritic.style.marginTop = "1.5rem";
enhanced_Metacritic.addEventListener( "click", function ()
{
    enhanced_GameTitle = document.querySelectorAll( ".UG7HXc" )[document.querySelectorAll( ".UG7HXc" ).length - 1].textContent;
    window.open( "https://www.metacritic.com/search/game/" + enhanced_GameTitle + "/results", "_blank" );
} );
enhanced_StoreContainer.append( enhanced_Metacritic );

// Account Menu - Changes to the account menu behaviour
enhanced_AccountMenu = document.querySelector( ".Zxyh9c" );
enhanced_AccountMenu.setAttribute( "data-close-if-content-clicked", "false" );

// Session Time
var enhanced_sessionTimer = document.createElement( "div" );
enhanced_sessionTimer.className = "HPX1od";
enhanced_sessionTimer.id = "enhanced_sessionTimer";
enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">00:00:00</span></div>';

// Game Filter
var enhanced_showState = false;
enhanced_showAll = document.createElement( "div" );
enhanced_showAll.id = "enhanced_showAll";
enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
enhanced_showAll.style.cursor = "pointer";
enhanced_showAll.addEventListener( "click", function ()
{
    switch ( enhanced_showState )
    {
        case true:
            enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
            enhanced_showState = false;
            break
        case false:
            enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
            enhanced_showState = true;
            break
    }
} );

// Shortcut - General
var enhanced_installShortcut = document.createElement( "div" );
enhanced_installShortcut.className = "CTvDXd QAAyWd Fjy05d ivWUhc wJYinb x8t73b tlZCoe rpgZzc";
enhanced_installShortcut.id = "enhanced_installShortcut";
enhanced_installShortcut.tabIndex = "0";
enhanced_installShortcut.addEventListener( "click", function ()
{
    window.open( "https://stadiaicons.web.app/" + enhanced_installShortcut.gameID + "/?fullName=" + encodeURIComponent( enhanced_installShortcut.gameName ), "_blank" );
} );

// Shortcut - Last Played
var enhanced_shortcutLastPlayed = document.createElement( "div" );
enhanced_shortcutLastPlayed.id = "enhanced_shortcutLastPlayed";
enhanced_shortcutLastPlayed.innerHTML = '<i class="material-icons-extended" aria-hidden="true">get_app</i>';
enhanced_shortcutLastPlayed.tabIndex = "0";
enhanced_shortcutLastPlayed.style.display = "flex";
enhanced_shortcutLastPlayed.style.position = "absolute";
enhanced_shortcutLastPlayed.style.top = "0.5rem";
enhanced_shortcutLastPlayed.style.left = "0.5rem";
enhanced_shortcutLastPlayed.style.background = "#202124";
enhanced_shortcutLastPlayed.style.borderRadius = "50%";
enhanced_shortcutLastPlayed.style.padding = "0.2rem";
enhanced_shortcutLastPlayed.style.cursor = "pointer";
enhanced_shortcutLastPlayed.style.zIndex = "2";
enhanced_shortcutLastPlayed.addEventListener( "click", function ()
{
    window.open( "https://stadiaicons.web.app/" + enhanced_shortcutLastPlayed.gameID + "/?fullName=" + encodeURIComponent( enhanced_shortcutLastPlayed.gameName ), "_blank" );
} );

// Game Statistics
var enhanced_statsCheck = 0;
var enhanced_statOverview = document.createElement( "div" );
enhanced_statOverview.className = "MDSsFe";
enhanced_statOverview.style.marginBottom = "3.5rem";

// Load stored settings
if ( localStorage.getItem( "enhanced_avatarURL_" + document.querySelector( "head > base" ).getAttribute( "href" ) ) !== null )
{
    enhanced_setAvatar( localStorage.getItem( "enhanced_avatarURL_" + document.querySelector( "head > base" ).getAttribute( "href" ) ) );
}
updateSettings();

// Apply settings
function updateSettings()
{
    enhanced_updateMonitor( 0 )
    enhanced_changeGridSize( enhanced_GridSize );
    enhanced_changeClock( enhanced_ClockOption );
    enhanced_changeFilter( enhanced_filterOption );
    enhanced_updateResolution( enhanced_currentRes );
    enhanced_changeCodec( enhanced_currentCodec );
    enhanced_changeMsgPreview( enhanced_messagePreview );
    enhanced_changeProLabel( enhanced_hideLabel );
    enhanced_changeQuickReply( enhanced_useQuickReply );
    enhanced_changeOfflineUser( enhanced_hideOffline );
    enhanced_changeInvisibleUser( enhanced_hideInvisible );
    enhanced_changeMediaPreview( enhanced_hideUserMedia );
    enhanced_changeStreamMode( enhanced_useStreamMode );
    enhanced_changeCategoryPreview( enhanced_hideCategory );
    enhanced_changeGamePopup( enhanced_hidePopupEffect );
    enhanced_changeMonitorAutostart( enhanced_autostartMonitor );
    enhanced_changeStoreList( enhanced_storeListSize );
    enhanced_changeScrollbar( enhanced_enableScroll );
}

// After Setup
console.log( "%cStadia Enhanced" + "%c ⏲️ - Start Up: Loaded in " + ( new Date().getTime() - enhanced_StartTimer ) + "ms.", enhanced_consoleEnhanced, "" )
var enhanced_loopCount = 0;
var enhanced_loopTotal = 0;
var enhanced_sessionStart = 0;
var enhanced_wrappers = [];

// Main Loop
setInterval( function ()
{
    // Loop Start
    var enhanced_loopTimer = new Date().getTime();
    enhanced_loopCount++;

    // Session Time
    if ( document.location.href.indexOf( "/player/" ) != -1 )
    {
        document.querySelectorAll( ".OWVtN" )[document.querySelectorAll( ".OWVtN" ).length - 1].append( enhanced_sessionTimer );
        if ( enhanced_sessionStart == 0 )
        {
            enhanced_sessionStart = new Date().getTime();
        } else
        {
            var enhanced_sessionDur = new Date().getTime();
            enhanced_sessionDur = enhanced_formatTime( ( enhanced_sessionDur - enhanced_sessionStart ) / 1000 );
            enhanced_sessionTimer.innerHTML = '<div class="Qg73if"><span class="zsXqkb">' + enhanced_lang.sessiontime + '</span><span class="Ce1Y1c qFZbbe">' + enhanced_sessionDur + '</span></div>';
        }
    } else
    {
        enhanced_sessionStart = 0;
    }

    // Enhanced Wrapper
    if ( document.location.href.indexOf( "/home" ) != -1 )
    {
        var enhanced_gameList = document.querySelectorAll( ".GqLi4d" );

        for ( var i = 0; i < enhanced_gameList.length; i++ )
        {

            if ( enhanced_gameList[i].parentNode.id != "enhanced_wrapper" )
            {
                // Wrapper Element
                var enhanced_wrapper = document.createElement( "div" );
                enhanced_wrapper.id = "enhanced_wrapper";
                enhanced_wrapper.style.position = "relative";
                enhanced_wrapper.style.display = "inherit";
                enhanced_wrapper.style.gridColumn = "span 6/span 6";

                enhanced_wrappers.push( {
                    parent: enhanced_gameList[i].parentNode,
                    sku: enhanced_gameList[i].getAttribute( "jsdata" ).split( ";" )[1],
                    name: enhanced_gameList[i].getElementsByClassName( "xmcLFc" )[0].textContent,
                    wrapper: enhanced_wrapper,
                    game: enhanced_gameList[i],
                } );

                enhanced_gameList[i].parentNode.appendChild( enhanced_wrapper );
                enhanced_wrapper.appendChild( enhanced_gameList[i] );
            }
        }

        // Game Filter
        var enhanced_gameFilter = localStorage.getItem( "enhanced_gameFilter" ) || "";

        // Add "Show All" UI element
        if ( document.querySelectorAll( ".CVVXfc.URhE4b.ivS28e.tfyX5" ).length != 0 )
        {
            if ( document.querySelectorAll( "div[jsname='ZoZH6b'] .CVVXfc.URhE4b.ivS28e.tfyX5" )[document.querySelectorAll( "div[jsname='ZoZH6b'] .CVVXfc.URhE4b.ivS28e.tfyX5" ).length - 1].contains( enhanced_showAll ) === false )
            {
                document.querySelectorAll( "div[jsname='ZoZH6b'] .CVVXfc.URhE4b.ivS28e.tfyX5" )[document.querySelectorAll( "div[jsname='ZoZH6b'] .CVVXfc.URhE4b.ivS28e.tfyX5" ).length - 1].append( enhanced_showAll );
                enhanced_showAll.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
                enhanced_showState = false;
            }
        }
        if ( enhanced_filterOption == 0 )
        {
            enhanced_showAll.style.display = "none";
            enhanced_showState = false;
        } else
        {
            enhanced_showAll.style.display = "flex";
        }

        for ( var i = 0; i < enhanced_wrappers.length; i++ )
        {

            if ( !enhanced_wrappers[i].hasOwnProperty( "visibility" ) )
            {
                // Visibility
                var enhanced_visibility = document.createElement( "div" );
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
                enhanced_visibility.addEventListener( "click", function ()
                {
                    if ( enhanced_gameFilter.includes( this.sku ) )
                    {
                        enhanced_gameFilter = enhanced_gameFilter.replace( "(" + this.sku + ")", "" )
                        this.title = enhanced_lang.hide + " " + this.name;
                        localStorage.setItem( "enhanced_gameFilter", enhanced_gameFilter );
                        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility</i>';
                    } else
                    {
                        enhanced_gameFilter += "(" + this.sku + ")";
                        this.title = enhanced_lang.show + " " + this.name;
                        localStorage.setItem( "enhanced_gameFilter", enhanced_gameFilter );
                        this.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
                    }
                } );
                if ( enhanced_visibility.id != "undefined" )
                {
                    enhanced_wrappers[i].wrapper.appendChild( enhanced_visibility );
                }
                enhanced_wrappers[i].visibility = enhanced_visibility;
            }

            // Apply filter option
            if ( enhanced_filterOption != 2 && enhanced_showState === false )
            {
                enhanced_wrappers[i].visibility.style.display = "none";
            } else
            {
                enhanced_wrappers[i].visibility.style.display = "flex";
            }

            // Set brightness of filtered items
            if ( enhanced_gameFilter.includes( enhanced_wrappers[i].sku ) && enhanced_filterOption != 0 )
            {
                enhanced_wrappers[i].game.style.filter = "brightness(40%)";
            } else
            {
                enhanced_wrappers[i].game.style.filter = "none";
            }

            // Filter items
            if ( enhanced_gameFilter.includes( enhanced_wrappers[i].sku ) && enhanced_showState === false && enhanced_filterOption != 0 )
            {
                enhanced_wrappers[i].wrapper.style.display = "none";
                enhanced_wrappers[i].visibility.title = enhanced_lang.show + " " + enhanced_wrappers[i].name;
                enhanced_wrappers[i].visibility.innerHTML = '<i class="material-icons-extended" aria-hidden="true">visibility_off</i>';
            } else
            {
                enhanced_wrappers[i].wrapper.style.display = "inherit";
            }
        }
    }

    // Shortcuts - Popup
    if ( document.querySelector( "#enhanced_installShortcut" ) === null && document.querySelector( ".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc" ) )
    {
        enhanced_installShortcut.gameName = document.querySelector( ".Wq73hb" ).textContent;
        enhanced_installShortcut.gameID = document.querySelector( ".h1uihb > c-wiz" ).getAttribute( "data-app-id" );
        enhanced_installShortcut.innerHTML = '<div class="tYJnXb">' + enhanced_lang.shortcut + ' ' + enhanced_installShortcut.gameName + '</div>';
        document.querySelector( ".CTvDXd.QAAyWd.Fjy05d.ivWUhc.wJYinb.x8t73b.tlZCoe.rpgZzc" ).parentElement.append( enhanced_installShortcut );
    }

    // Shortcuts - Last Played
    if ( document.querySelector( ".mGdxHb.ltdNmc" ) )
    {
        if ( !document.querySelectorAll( ".mGdxHb.ltdNmc" )[document.querySelectorAll( ".mGdxHb.ltdNmc" ).length - 1].contains( enhanced_shortcutLastPlayed ) )
        {
            enhanced_shortcutLastPlayed.gameName = document.querySelector( ".mGdxHb.ltdNmc" ).getAttribute( "aria-label" ).split( ": " )[1]
            enhanced_shortcutLastPlayed.gameID = document.querySelector( ".UiBYIe > c-wiz" ).getAttribute( "data-app-id" );
            document.querySelectorAll( ".mGdxHb.ltdNmc" )[document.querySelectorAll( ".mGdxHb.ltdNmc" ).length - 1].append( enhanced_shortcutLastPlayed );
        }
    }

    // Offline / Invisible Users
    var enhanced_statusList = document.querySelectorAll( ".eXdFqc .Y1rZWd.QAAyWd.PuD06d .DfyMcd" ); // Offline Users
    for ( var i = 0; i < enhanced_statusList.length; i++ )
    {
        if ( parseInt( localStorage.getItem( "enhanced_hideOffline" ) || 0 ) == 1 )
        {
            enhanced_statusList[i].closest( ".Y1rZWd.QAAyWd.PuD06d" ).setAttribute( "style", "display: none !important" );
        } else
        {
            enhanced_statusList[i].closest( ".Y1rZWd.QAAyWd.PuD06d" ).setAttribute( "style", "display: flex" );
        }
    }
    var enhanced_statusList = document.querySelectorAll( ".eXdFqc .UxR5ob.m8Kzt" ); // Invisible Users
    for ( var i = 0; i < enhanced_statusList.length; i++ )
    {
        if ( enhanced_statusList[i].childElementCount == 1 )
        {
            if ( parseInt( localStorage.getItem( "enhanced_hideInvisible" ) || 0 ) == 1 )
            {
                enhanced_statusList[i].closest( ".Y1rZWd.QAAyWd.PuD06d" ).setAttribute( "style", "display: none !important" );
            } else
            {
                enhanced_statusList[i].closest( ".Y1rZWd.QAAyWd.PuD06d" ).setAttribute( "style", "display: flex" );
            }
        }
    }

    // Game Statistics
    if ( document.location.href.indexOf( "/gameactivities/all" ) != -1 && document.querySelector( ".MDSsFe" ) !== null )
    {
        var enhanced_statsBaseQuery = document.querySelectorAll( ".lsY9kc" )[document.querySelectorAll( ".lsY9kc" ).length - 1];
        var enhanced_statsOwned = enhanced_statsBaseQuery.querySelectorAll( ".nyQclf" ).length;
        var enhanced_statsAchievementQuery = enhanced_statsBaseQuery.querySelectorAll( ".kPtFV" );

        if ( enhanced_statsAchievementQuery.length > 0 )
        {
            // Achievements
            var enhanced_statsUnlock = 0;
            var enhanced_statsTotal = 0;
            var enhanced_statsFinished = 0;
            for ( var i = 0; i < enhanced_statsAchievementQuery.length; i++ )
            {
                var enhanced_statsTitleUnlock = parseInt( enhanced_statsAchievementQuery[i].firstChild.textContent );
                var enhanced_statsTitleTotal = parseInt( enhanced_statsAchievementQuery[i].lastChild.textContent.substring( 1 ) );
                if ( enhanced_statsTitleUnlock == enhanced_statsTitleTotal )
                {
                    enhanced_statsFinished++;
                }
                enhanced_statsUnlock += enhanced_statsTitleUnlock;
                enhanced_statsTotal += enhanced_statsTitleTotal;

            }
            var enhanced_statsUnlockRate = ( enhanced_statsUnlock * 100 ) / enhanced_statsTotal;
            var enhanced_statsFinishRate = ( enhanced_statsFinished * 100 ) / enhanced_statsOwned;

            if ( enhanced_statsCheck != enhanced_statsUnlock )
            {
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
                enhanced_statOverview.innerHTML = enhanced_loadStats;
            }
        }

        insertAfter( enhanced_statOverview, document.querySelectorAll( ".dkZt0b.qRvogc" )[document.querySelectorAll( ".dkZt0b.qRvogc" ).length - 1] );
    }

    // Codec - Set codec preference
    switch ( parseInt( localStorage.getItem( "enhanced_CodecOption" ) || 0 ) )
    {
        case 0:
            if ( document.location.href.indexOf( "/home" ) != -1 )
            {
                localStorage.removeItem( "video_codec_implementation_by_codec_key" );
            }
            break
        case 1:
            localStorage.setItem( "video_codec_implementation_by_codec_key", '{"vp9":"ExternalDecoder"}' );
            break
        case 2:
            localStorage.setItem( "video_codec_implementation_by_codec_key", '{"h264":"ExternalDecoder", "vp9":"libvpx", "vp9-profile0":"libvpx"}' );
            break
    }

    // Store Search
    // Example: /store/list/3?search=NBA
    if ( document.location.href.indexOf( "/store/list/3?" ) != -1 )
    {
        var enhanced_SearchTerm = new URLSearchParams( window.location.search ).get( 'search' );
        if ( enhanced_SearchTerm !== null )
        {
            var enhanced_SearchResultCount = 0;
            document.getElementsByClassName( "h6J22d null QAAyWd" );
            enhanced_SearchResults = document.getElementsByClassName( "h6J22d" );
            for ( var i = 0; i < enhanced_SearchResults.length; i++ )
            {
                if ( enhanced_SearchResults[i].getAttribute( "aria-label" ).match( new RegExp( enhanced_SearchTerm, 'gi' ) ) === null )
                {
                    enhanced_SearchResults[i].style.display = "none";
                } else
                {
                    enhanced_SearchResultCount += 1;
                }
            }
            document.querySelector( ".HZ5mJ" ).innerHTML = enhanced_lang.searchheader + " '" + enhanced_SearchTerm + "' (" + enhanced_SearchResultCount + ")";
        }
    }

    // Resolution - Change to currently selected resolution
    if ( document.location.href.indexOf( "/settings" ) != -1 && document.querySelectorAll( ".sx2eZe.QAAyWd.aKIhz.OWB6Me" )[0] !== undefined )
    {
        document.querySelectorAll( ".sx2eZe.QAAyWd.aKIhz.OWB6Me" )[0].setAttribute( "data-disabled", "false" );
        document.querySelectorAll( ".sx2eZe.QAAyWd.aKIhz.OWB6Me" )[0].classList.remove( "OWB6Me" );
    }

    // UI Elements - Add controls again when needed
    if ( document.location.href.indexOf( "/player/" ) != -1 )
    {
        enhanced_Windowed.style.display = "flex";
        if ( document.querySelector( "#enhanced_Windowed" ) === null && document.querySelectorAll( ".E0Zk9b" )[0] !== undefined )
        {
            document.querySelectorAll( ".E0Zk9b" )[0].append( enhanced_Windowed );
        }
        enhanced_Monitor.style.display = "flex";
        if ( document.querySelector( "#enhanced_Monitor" ) === null && document.querySelectorAll( ".E0Zk9b" )[0] !== undefined )
        {
            document.querySelectorAll( ".E0Zk9b" )[0].append( enhanced_Monitor );
        }
    } else
    {
        enhanced_Windowed.style.display = "none";
        enhanced_Monitor.style.display = "none";
    }

    if ( document.querySelector( "#enhanced_ClockFriends" ) === null && document.querySelectorAll( ".hxhAyf.OzUE7e.XY6ZL" )[0] !== undefined )
    {
        document.querySelectorAll( ".hxhAyf.OzUE7e.XY6ZL" )[0].append( enhanced_ClockFriends );
    }

    if ( document.location.href.indexOf( "/player/" ) != -1 )
    {
        if ( enhanced_ClockOption == 2 || enhanced_ClockOption == 3 )
        {
            if ( document.querySelector( "#enhanced_ClockOverlay" ) === null && document.querySelector( ".bYYDgf" ) !== undefined )
            {
                document.querySelector( ".bYYDgf" ).append( enhanced_ClockOverlay );
            }
            enhanced_ClockOverlay.style.display = "flex";
        }
    } else
    {
        enhanced_ClockOverlay.style.display = "none";
    }

    // Monitor Autostart
    if ( document.location.href.indexOf( "/player/" ) != -1 )
    {
        if ( enhanced_autostartMonitor == 1 && enhanced_monitorStarted == false )
        {
            enhanced_monitorStarted = true;
            enhanced_monitorState = 1;
            enhanced_updateMonitor( enhanced_monitorState );
        }
    } else
    {
        enhanced_monitorStarted = false;
        enhanced_monitorState = 0;
        enhanced_updateMonitor( enhanced_monitorState );
    }

    // Clock Widget - Update to current time / display option
    var enhanced_Date = new Date();
    switch ( enhanced_ClockMode )
    {
        case 0:
            var enhanced_CurrentTime = enhanced_Date.toLocaleTimeString( 'en-GB' );
            break
        case 1:
            var enhanced_CurrentTime = enhanced_Date.toLocaleTimeString( 'en-US' );
            break
    }
    enhanced_ClockFriends.innerHTML = '<i class="material-icons-extended" aria-hidden="true" style="margin-right: 0.5rem;">schedule</i>' + enhanced_CurrentTime;
    enhanced_ClockOverlay.innerHTML = enhanced_CurrentTime;

    // Add search buttons on store page
    if ( document.location.href.indexOf( "/store/details/" ) != -1 )
    {
        enhanced_GameDescription = document.querySelectorAll( ".WjVJKd" )[document.querySelectorAll( ".WjVJKd" ).length - 1];
        if ( enhanced_GameDescription )
        {
            enhanced_GameDescription.append( enhanced_StoreContainer );
        }
    }

    // Add avatar option on own profile
    if ( document.location.href.indexOf( "/profile/" + enhanced_AccountID ) != -1 )
    {
        enhanced_profileOptions = document.querySelectorAll( ".R1HPhd.bYsRUc.bqgeJc.wGziQb .hX4jqb" )[document.querySelectorAll( ".R1HPhd.bYsRUc.bqgeJc.wGziQb .hX4jqb" ).length - 1];
        if ( enhanced_profileOptions !== undefined )
        {
            if ( enhanced_profileOptions.contains( enhanced_customAvatar ) === false )
            {
                enhanced_profileOptions.append( enhanced_customAvatar );
            }
        }
    }

    // Pro Games - UI changes and count of currently unclaimed games
    if ( document.location.href.indexOf( "/store/list/2001" ) != -1 )
    {
        document.querySelector( ".ZECEje > li:nth-child(3) > a" ).classList.remove( "YySNWc" );
        enhanced_ProGamesLink.classList.add( "YySNWc" );
        if ( document.querySelector( ".alEDLe" ) !== null )
        {
            count = document.querySelector( ".alEDLe" ).querySelectorAll( '.X5624d' ).length;
            if ( count != 0 && enhanced_ProGames.innerHTML.indexOf( count ) == -1 )
            {
                enhanced_ProGamesLink.textContent = 'Pro (' + count + ")";
            }
        }
    } else
    {
        enhanced_ProGamesLink.classList.remove( "YySNWc" );
        if ( enhanced_ProGamesLink.textContentL != "Pro" )
        {
            enhanced_ProGamesLink.textContent = "Pro";
        }
    }

    // Emoji Picker
    if ( document.querySelector( ".IRyDt" ) && document.querySelector( ".IRyDt" ).contains( enhanced_emojiswitch ) === false )
    {
        document.querySelector( ".IRyDt" ).append( enhanced_emojiswitch );
    }
    if ( document.querySelector( ".fcUT2e.b2r89e.D9Xvwb" ) && document.querySelector( ".fcUT2e.b2r89e.D9Xvwb" ).contains( enhanced_emojiPicker ) === false )
    {
        document.querySelector( ".fcUT2e.b2r89e.D9Xvwb" ).append( enhanced_emojiPicker );
    }

    // Visibility: Homescreen-only
    if ( document.location.href.indexOf( "/home" ) != -1 )
    {
        enhanced_Grid.style.display = "block";
        //enhanced_LibrarySearch.style.display = "flex";
    } else
    {
        enhanced_Grid.style.display = "none";
        //enhanced_LibrarySearch.style.display = "none";
    }

    // Visibility: Store-only
    if ( document.location.href.indexOf( "/store" ) != -1 )
    {
        enhanced_StoreSearch.style.display = "flex";
        enhanced_StoreDropdown.style.display = "flex";
    } else
    {
        enhanced_StoreSearch.style.display = "none";
        enhanced_StoreDropdown.style.display = "none";
    }

    // Loop End
    enhanced_loopTotal += new Date().getTime() - enhanced_loopTimer;
    if ( enhanced_loopCount == 300 )
    {
        console.log( "%cStadia Enhanced" + "%c ⏲️ - Loop Time: ~" + enhanced_loopTotal / enhanced_loopCount + "ms.", enhanced_consoleEnhanced, "" );
    }
}, 200 );

// Source: https://somethingididnotknow.wordpress.com/2013/07/01/
function enhanced_addGlobalStyle( css )
{
    var head, style;
    head = document.getElementsByTagName( 'head' )[0];
    if ( !head )
    {
        return;
    }
    style = document.createElement( 'style' );
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild( style );
}

// Open pages including Stadia specific settings
function openStadia( url )
{
    var enhanced_urlBase = document.querySelector( "head > base" ).getAttribute( "href" );
    var enhanced_urlHL = new URLSearchParams( window.location.search ).get( 'hl' );
    var enhanced_url = new URL( enhanced_urlBase + url );
    if ( enhanced_urlHL !== null )
    {
        enhanced_url.searchParams.append( 'hl', enhanced_urlHL );
    }
    window.open( enhanced_url, "_self" );
}

// Embed scripts to execute on the websites layer
function embed( fn, enhanced_sessionActive = true )
{
    const script = document.createElement( "script" );
    if ( enhanced_sessionActive === true )
    {
        script.text = `(${fn.toString()})();`;
    } else
    {
        script.text = `${fn.toString()}`;
    }
    document.documentElement.appendChild( script );
}

// https://stackoverflow.com/questions/4793604/
function insertAfter( newNode, referenceNode )
{
    if ( referenceNode.parentNode != newNode.parentNode )
    {
        referenceNode.parentNode.insertBefore( newNode, referenceNode.nextSibling );
    }
}

function enhanced_formatTime( seconds )
{
    var hours = Math.floor( seconds / 3600 );
    seconds -= hours * 3600;
    var minutes = Math.floor( seconds / 60 );
    seconds -= minutes * 60;
    return ( hours < 10 ? "0" : "" ) + hours + ":" + ( minutes < 10 ? "0" : "" ) + minutes + ":" + ( seconds < 10 ? "0" : "" ) + Math.floor( seconds );
}

function minute2hour( min )
{
    var hours = ( min / 60 );
    var minutes = Math.round( ( hours - Math.floor( hours ) ) * 60 );
    return [Math.floor( hours ), minutes];
}

// Dragable Objects
function enhanced_dragElement( el )
{
    var pos = [0, 0, 0, 0];
    if ( document.getElementById( el.id ) )
    {
        document.getElementById( el.id ).onmousedown = enhanced_dragMouseDown;
    } else
    {
        el.onmousedown = enhanced_dragMouseDown;
    }

    function enhanced_dragMouseDown( e )
    {
        e = e || window.event;
        e.preventDefault();
        pos[2] = e.clientX;
        pos[3] = e.clientY;
        document.onmouseup = enhanced_closeDragElement;
        document.onmousemove = enhanced_elementDrag;
    }

    function enhanced_elementDrag( e )
    {
        e = e || window.event;
        e.preventDefault();
        pos[0] = pos[2] - e.clientX;
        pos[1] = pos[3] - e.clientY;
        pos[2] = e.clientX;
        pos[3] = e.clientY;
        el.style.top = Math.min( Math.max( el.offsetTop - pos[1], 0 ), screen.availHeight - el.offsetHeight ) + "px";
        el.style.left = Math.min( Math.max( el.offsetLeft - pos[0], 0 ), screen.availWidth - el.offsetWidth ) + "px";
    }

    function enhanced_closeDragElement()
    {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Translation
function loadLanguages( lang )
{
    switch ( lang )
    {
        case "de": //https://github.com/ChristopherKlay/StadiaEnhanced/discussions/13
            var load = `{
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
                "trafficsession": "Sitzungs-Traffic",
                "trafficcurrent": "Derzeitiger Traffic",
                "trafficaverage": "Durchschnittlicher Traffic",
                "packetloss": "Packetverlust",
                "framedrop": "Verlorene Frames",
                "latency": "Latenz",
                "jitter": "Jitter-Puffer",
                "compression": "Kompression",
                "streammon": "Stream Monitor",
                "stream": "Stream",
                "community": "Community",
                "speedtest": "Speedtest",
                "quickaccess": "Schnellzugriff",
                "messages": "Nachrichten",
                "avatar": "Avatar",
                "interface": "Oberfläche",
                "shortcut": "Installiere eine Verknüpfung für",
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
                "scrollbar": "Scrollbalken",
                "scrollbardesc": "Aktiviert Scrollbalken im Store und dem Startbildschirm.",
                "resetsettings": "Einstellungen zurücksetzen"
            }`
            break
        case: "fr": //https://github.com/ChristopherKlay/StadiaEnhanced/discussions/8
            var load = `{
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
	            "windowed": "Mode Fenêtré",
	            "fullscreen": "Plein Écran",
	            "searchstore": "Rechercher dans le Store",
	            "onsale": "En Promotion",
	            "prodeals": "Offres Stadia Pro",
	            "allgames": "Tous les Jeux",
	            "usermedia": "Captures & Vidéos",
	            "searchbtnbase": "Rechercher sur",
	            "avatarpopup":"URL du nouvel avatar (vide = par défaut):",
	            "searchheader":"Jeux avec",
	            "sessiontime":"Durée de la session",
	            "codec":"Codec",
	            "resolution": "Résolution",
	            "trafficsession":"Trafic de la session",
	            "trafficcurrent":"Trafic actuel",
	            "trafficaverage":"Trafic moyen",
	            "packetloss":"Paquets perdus",
	            "framedrop":"Images perdues",
	            "latency":"Latence",
	            "jitter":"Tampon de gigue",
	            "compression":"Compression",
	            "streammon":"Moniteur de Stream"
	            "stream": "Stream",
	            "community": "Communauté",
	            "speedtest": "Test de Débit",
	            "quickaccess": "Accès Rapide",
	            "messages": "Messages",
	            "avatar": "Avatar",
	            "interface": "Interface",
	            "shortcut": "Installer un raccourcis pour",
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
	            "streammodedesc": "Permet de rendre certains éléments (ex : la liste d'amis) invisibles lorsque vous streamez (via un logiciel externe comme OBS ou Discord).",
	            "catprev": "Prévisualisation des Catégories",
	            "catprevdesc": "Masque la liste des catégories présente lorsque le curseur passe sur un jeu dans la grille de l'accueil.",
	            "popup": "Effet d'Agrandissement",
	            "popupdesc": "Désactive l'effet d'agrandissement / de zoom qui advient lorsque le curseur passe sur un jeu dans la grille de l'accueil.",
	            "streammondesc": "Si activé, le moniteur de stream démarrera automatiquement au lancement d'un jeu.",
	            "resolutiondesc": "La résolution cible pour le stream de jeux. Les résolutions 1440p et 2160p nécessitent le codec VP9.",
	            "codecdesc": "Le codec utilisé pour le stream de jeux.",
	            "confirmreset": "Êtes-vous certain de vouloir réinitialiser les paramètres ?",
	            "gamesfinished": "Jeux Terminés",
	            "achievementsunlocked": "Succès Débloqués",
	            "splitstore": "Store à 2 Colonnes",
	            "splitstoredesc": "Divise les listes du store en deux colonnes pour une meilleur lisibilité.",
	            "scrollbar": "Barres de Défilement",
	            "scrollbardesc": "Affiche des barres de défilement dans l'accueil et la boutique.",
	            "resetsettings": "Réinitialiser les Paramètres"
            }`
            break
        default:
            var load = `{
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
                "trafficsession": "Session traffic",
                "trafficcurrent": "Current traffic",
                "trafficaverage": "Average traffic",
                "packetloss": "Packets lost",
                "framedrop": "Frames dropped",
                "latency": "Latency",
                "jitter": "Jitter Buffer",
                "compression": "Compression",
                "streammon": "Stream Monitor",
                "stream": "Stream",
                "community": "Community",
                "speedtest": "Speedtest",
                "quickaccess": "Quick Access",
                "messages": "Messages",
                "avatar": "Avatar",
                "interface": "Interface",
                "shortcut": "Install a shortcut for",
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
                "scrollbar": "Scrollbars",
                "scrollbardesc": "Enables scrollbars on the homescreen and store.",
                "resetsettings": "Reset Settings"
            }`
    }
    return JSON.parse( load );
}
