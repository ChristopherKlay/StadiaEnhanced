
# Translations

# Important Note
Version `1.11` changed the translation function. All existing and newly submitted languages have been adjusted to the new format. The benefit of this new format is that instead of defaulting to english when a line isn't working or not defined, only those specific lines will now use default values. Which in return means that translations won't be english by default for new values, but "undefied". Updating translations also just became a lot easier, because you can just check what lines still show "undefined" in the current version, instead of having to check which ones are featuring default values.

The command `debugEnhanced("translation")` can also be used via the console on the Stadia website (with Stadia Enhanced installed) to show the loading output of all available translations and the amount of keys that are not defined yet (in other words, defaulting to english).

---

## Available languages
Stadia Enhanced is currently (fully, or partly) available in the following languages:

* English (Default)
* [Catalan](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/60)
* [Danish](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/81)
* [Dutch](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/9)
* [French](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/8)
* [German](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/13)
* [Italian](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/7)
* [Portuguese](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/91)
* [Spanish](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/67)
* [Swedish](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/11)

---

## Your language is currently not supported?
If your language is not currently (partly, or fully) supported, you can help translate the extension by doing the following:

1. While visiting the [Stadia](https://stadia.com/) homepage, open your console (Ctrl+Shift+I).
2. If you have Stadia Enhanced installed, you will see log entries, beginning with an entry for your username, ID and language code.
3. Submit a copy of the current template below with the values on the right side translated together with your language code via a [new entry](https://github.com/ChristopherKlay/StadiaEnhanced/discussions?discussions_q=category%3ATranslations), so we do not get duplicates and/or more refined translations due to access of multiple people.

Before posting a new topic, make sure the translation isn't already being worked on [here](https://github.com/ChristopherKlay/StadiaEnhanced/discussions?discussions_q=category%3ATranslations).

---

# Template
```javascript
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
    bundles: 'Bundles',
    addons: 'Add-ons',
    wishlist: 'Wishlist',
    responsive: 'Responsive',
    windowed: 'Windowed Mode',
    fullscreen: 'Fullscreen',
    searchstore: 'Search store',
    onsale: 'On Sale',
    prodeals: 'Pro Deals',
    userprofile: 'My Profile',
    usermedia: 'Screenshots & Videos',
    searchbtnbase: 'Search on',
    avatarpopup: 'New avatar URL (empty for default):',
    searchheader: 'Games including',
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
    griddesc: 'Changes the amount of games per row on the homescreen.',
    clock: 'Clock',
    clockdesc: 'Displays the current time on the friends list, as a in-game overlay, or both.',
    friendslist: 'Friends List',
    igoverlay: 'In-Game Overlay',
    listoverlay: 'List & Overlay',
    filter: 'Filter',
    filterdesc: 'Allows you to sort your homescreen by hiding games. The filter can be toggled via the symbol, top-right above your games on the homescreen.',
    filtertoggle: 'Toggle',
    filterquick: 'Quick',
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
    popup: 'Popup Effect',
    popupdesc: 'Removes the zoom-in / enlarge effect when hovering over a game on the homesceen.',
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
    resetsettings: 'Reset Settings'
}
```
