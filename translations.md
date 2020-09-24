
# Translations

## Your language is currently not supported?
1. Start up [Stadia](https://stadia.com/).
2. Get your current language code via `document.querySelector("html").getAttribute("lang");` in the console (Ctrl+Shift+I). This will return the language code used by Stadia.
3. Submit a copy of the current template below with the values on the right side translated, together with your language code either via a [issues entry](https://github.com/ChristopherKlay/StadiaEnhanced/issues) (the best option, so we don't get duplicates and/or more refined translations), or a [direct message on Reddit](https://www.reddit.com/user/ChristopherKlay).

Please note that for the sake of simplicity, en-gb/en-us will default to "en" for example.
# Template

## Explanation
The left side of the following code are variables used to defined specific text elements by Stadia Enhanced, while the right side features the specific translation. Most elements are self explained, but i will list some more complicated ones and their use case in detail below.
|Variable|Use Case|
|--|--|
|inviteactive|Shortly displayed after clicking the invite link button|
|searchbtnbase|Used for "Search on" YouTube/Metacritic buttons on game pages
|avatarpopup|The text displayed when setting a custom avatar
|searchheader|Used for "Games including 'searchterm'" when searching the store

## Current Template

    LANG: en
    
    "default":"Default",
    "native":"Native",
    "disabled":"Disabled",
    "windowed":"Windowed Mode",
    "fullscreen":"Fullscreen",
    "searchstore":Search store",
    "onsale":"On Sale",
    "prodeals":"Pro Deals",
    "allgames":"All Games",
    "usermedia":"Screenshots & Videos",
    "gridsize":"Grid Size",
    "friendslist":"Friends List",
    "igoverlay":"In-Game Overlay",
    "listoverlay":"List & Overlay",
    "filtertoggle":"Toggle Filter",
    "filterquick":"Quick Filter",
    "invitebase":"Copy invite link",
    "inviteactive":"Copied!",
    "searchbtnbase":"Search on",
    "avatarpopup":"New avatar URL (empty for default):",
    "searchheader":"Games including",
    "sessiontime":"Session time",
    "codec":"Codec",
    "trafficsession":"Session traffic",
    "trafficcurrent":"Current traffic",
    "trafficaverage":"Average traffic",
    "packetloss":"Packets lost",
    "framedrop":"Frames dropped",
    "latency":"Latency",
    "jitter":"Jitter Buffer",
    "compression":"Compression",
    "streammon":"Stream Monitor"
