// Database - Extended Details
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "extdatabase") {
            var url = "https://raw.githubusercontent.com/ChristopherKlay/StadiaEnhanced/master/include/extdatabase.csv"
            fetch(url)
                .then(response => response.text())
                .then(result => sendResponse(result))
            return true;
        }
    });

// Discord RPC
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "presencedata") {
            var url = "https://raw.githubusercontent.com/ChristopherKlay/StadiaEnhanced/master/include/presence.json"
            fetch(url)
                .then(response => response.text())
                .then(result => sendResponse(JSON.parse(result)))
            return true;
        }
    });


chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    if (request.action == "presence") {
        chrome.tabs.sendMessage(request.tab, request.info, function(response) {
            sendResponse(response);
        });
    }
    return true;
});