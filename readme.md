# Stadia Enhanced

<p align="center">
  <img src="https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/media/header-mockup.gif"/>
</p>

![](https://img.shields.io/badge/GitHub-1.20.11-green?style=for-the-badge)
![](https://img.shields.io/chrome-web-store/v/ldeakaihfnkjmelifgmbmjlphdfncbfg?style=for-the-badge)
![](https://img.shields.io/chrome-web-store/users/ldeakaihfnkjmelifgmbmjlphdfncbfg?color=blue&style=for-the-badge)
![](https://img.shields.io/chrome-web-store/rating/ldeakaihfnkjmelifgmbmjlphdfncbfg?color=blue&style=for-the-badge)
![](https://img.shields.io/chrome-web-store/rating-count/ldeakaihfnkjmelifgmbmjlphdfncbfg?color=blue&label=REVIEWS&style=for-the-badge)

## Features

- [x] Set VP9 or H264 as the preferred codec
- [x] Enable 2K & 4K (requires GPU with support for VP9 decoding)
- [x] Stream Monitor (Displays frame/package loss among other things), via the group menu
- [x] Set your video settings including brightness, contrast, saturation and sharpness
- [x] Changeable library size on the home screen, toggle between 2 up to 6 items per row
- [x] Settings for used stream codec and resolution
- [x] Quick access menu for screenshots and video captures, speedtest, the community and more
- [x] Direct links to a list of Pro titles and games currently on sale
- [x] Many possible adjustments for the user interface, to allow for a cleaner homescreen
- [x] The ability to filter games, or install shortcuts for them on your device
- [x] Slight tweaks to your messaging experience, including emoji support
- [x] Discord presence support via DiscordRPC
- [x] Extended details section on store pages, displaying i.e. resolution and framerate
- [ ] And more

## Installation & Usage

### Chrome Store
* Install the extension from the official chrome web store [here](https://chrome.google.com/webstore/detail/stadia-enhanced/ldeakaihfnkjmelifgmbmjlphdfncbfg).
* The extensions fits itself into the existing website and it's main menu can be found at the top-right when opening Stadia after installation.

### Manual
1. Download the [newest files of the extension](https://github.com/ChristopherKlay/StadiaEnhanced/tree/main/extension).
2. Open `chrome://extensions`
3. Enable developer mode.
4. Load the downloaded files via the "Load unpacked" option.

Please note that installing the extension this way, removes the automatic update functionality.

## Permissions

* **"Access to your data on stadia.google.com"**: This one should be obvious; The extension has to access the website to work, including your data (i.e. what games you own) and the right to manipulate it (to get the stream data, for example). "Data" in this context simply means the content of the Stadia website.
* **"Access to your browser history"**: The extension **will not read your actual history**. This permission is needed, because the extension uses wildcards to filter the pages it needs to actually run on and the current URL is part of the "browser history" permission. This helps stopping the extension from running on pages like `https://stadia.google.com/couch` that don't make use of the extension, while still loading it on `https://stadia.google.com/home`.

## Ideas? Requests? Questions?
Check out the [discussions page](https://github.com/ChristopherKlay/StadiaEnhanced/discussions) and stay in contact with the community.

## Can i contribute?
Development of the extension is currently not public. For details see the [contributing infos](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/.github/contributing.md).

## Translation
If the project isn't available in your own language, or incomplete, feel free to check out the [translation info page](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/translations.md).

## Community Features
These are features developed by the community, made more accessible via Stadia Enhanced.

<details>
  <summary>Stadia Database - Full details about games, including framerate and resolution.</summary>
  
  ![Stadia Database](https://i.imgur.com/2w2pfdr.png)

  The [Stadia Database](https://linktr.ee/StadiaDatabase) by [OriginaIPenguin](https://twitter.com/OriginaIPenguin) is a full database filled with infos about games on Stadia, including details not accessible via Stadia itself (like resolution, framerate and more).
</details>
<details>
  <summary>Stadia Hunters - Track your progress and climb the leaderboard.</summary>
  
  ![Stadia Hunters](https://i.imgur.com/VSzOn9L.png)

  [Stadia Hunters](https://stadiahunters.com/) is tracking your achievements and provides a nice overview of captures, guides, leaderboards and more, including a level system.
</details>
<details>
  <summary>Stadia Icons - Create shortcuts to your favorite games.</summary>
  
  ![Stadia Icons](https://i.imgur.com/ua7iCCw.png)

  [Stadia Icons](https://elowry.github.io/StadiaIcons/) is a service by [EricLowry](https://www.reddit.com/user/EricLowry) that allows users to create direct shortcuts to their games on Stadia, including custom icons.
</details>


## Support this project
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/B0B079EUW)

## Discord Presence

### Installation
If you want to showcase your currently played game via Discord, Stadia Enhanced supports [DiscordRPC](https://github.com/lolamtisch/Discord-RPC-Extension).

Simply follow these two steps:
1. Install the [DiscordRPC extension](https://chrome.google.com/webstore/detail/discord-rich-presence/agnaejlkbiiggajjmnpmeheigkflbnoo)
2. Get the [DiscordRPC desktop app](https://github.com/lolamtisch/Discord-RPC-Extension/releases/)

<details>
  <summary>Why DiscordRPC? - Full Details</summary>
  
  ### Why DiscordRPC?

  Using Discord via your browser directly isn't possible due to multiple limitations, it will require a dedicated desktop app that acts as the middleman for Discord and your browser - the team behind DiscordRPC is providing exactly that, while also allowing you to use the same extension/app combination to display other presences (i.e. for your music), including the management of active (games) vs. passive (music) presences and other things.

  **"Why don't you just develop your own app to do this, or "copy" their work?"**

  The reason i'm not developing my own solution for this feature is rather simple; time. Increasing the time i have to spend on the project by adding more and more onto it, would decrease the time available to actually make sure that things are working correctly in the first place. Discord RPC offers a easy to implement solution (that is entirely optional for the user) while taking care of the maintenance at the same time.

  I *could* simply copy their work (as in; fork their project and effectively copy the functionality of their extension into mine, while using their desktop app) but that would result in two issues:

  1. This is a project for the community and i want to respect the work spend on everything included in it. While it would *legally* be perfectly fine to just implement their work, effectively claiming that i "came up" with this as a solution, for me *personally*, is not.
  2. Simply copying their work, would also make it basically impossible for the user to also use DiscordRPC, due to compatibility issues, like the priority management. Using Discords presence system via the browser is only covered by not even a handful of well working projects and i want to avoid cutting that down further - especially if the cost is simply having to run a second, unnoticeable (performance-whise) extension that works as install-and-forget.
</details>

## Screenshots

![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/media/Screenshot1.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/media/Screenshot2.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/media/Screenshot3.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/media/Screenshot4.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/main/media/Screenshot5.png)