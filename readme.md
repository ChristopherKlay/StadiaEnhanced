# Stadia Enhanced

<p align="center">
  <img src="https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/media/header-mockup.gif"/>
</p>

![](https://img.shields.io/badge/GitHub-1.16.0-green?style=for-the-badge)
![](https://img.shields.io/chrome-web-store/v/ldeakaihfnkjmelifgmbmjlphdfncbfg?style=for-the-badge)
![](https://img.shields.io/chrome-web-store/users/ldeakaihfnkjmelifgmbmjlphdfncbfg?color=blue&style=for-the-badge)

## Features

* Set VP9 or H264 as the preferred codec
* Enable 2K & 4K (requires GPU with support for VP9 decoding)
* Stream Monitor (Displays frame/package loss among other things), via the group menu
* Changeable library size on the home screen, toggle between 2 up to 6 items per row
* Settings for used stream codec and resolution
* Quick access menu for screenshots and video captures, speedtest, the community and more
* Store search bar to quickly find games
* Direct links to a list of Pro titles and games currently on sale
* Many possible adjustments for the user interface, to allow for a cleaner homescreen
* The ability to filter games, or install shortcuts for them on your device
* Slight tweaks to your messaging experience, including emoji support
* Discord presence support via DiscordRPC
* Extended details section on store pages, displaying i.e. resolution and framerate

## Installation & Usage

### Chrome Store
* Install the extension from the official chrome web store [here](https://chrome.google.com/webstore/detail/stadia-enhanced/ldeakaihfnkjmelifgmbmjlphdfncbfg).
* The extensions fits itself into the existing website and it's main menu can be found at the top-right when opening Stadia after installation.

### Manual
1. Download the [newest files of the extension](https://github.com/ChristopherKlay/StadiaEnhanced/tree/master/extension).
2. Open `chrome://extensions`
3. Enable developer mode.
4. Load the downloaded files via the "Load unpacked" option.

Please note that installing the extension this way, removes the automatic update functionality.

## Discord Presence

### Installation
If you want to showcase your currently played game via Discord, Stadia Enhanced supports [DiscordRPC](https://github.com/lolamtisch/Discord-RPC-Extension).

Simply follow these two steps:
1. Install the [DiscordRPC extension](https://chrome.google.com/webstore/detail/discord-rich-presence/agnaejlkbiiggajjmnpmeheigkflbnoo)
2. Get the [DiscordRPC desktop app](https://github.com/lolamtisch/Discord-RPC-Extension/releases/)

### Why DiscordRPC?
Using Discord via your browser directly isn't possible due to multiple limitations, it will require a dedicated desktop app that acts as the middleman for Discord and your browser - the team behind DiscordRPC is providing exactly that, while also allowing you to use the same extension/app combination to display other presences (i.e. for your music), including the management of active (games) vs. passive (music) presences and other things.

**"But, why don't you just develop your own app to do this, or "copy" their work?"**

The reason i'm not developing my own solution for this feature is rather simple; time. Increasing the time i have to spend on the project by adding more and more onto it, would decrease the time available to actually make sure that things are working correctly in the first place. Discord RPC offers a easy to implement solution (that is entirely optional for the user) while taking care of the maintenance at the same time.

I *could* simply copy their work (as in; fork their project and effectively copy the functionality of their extension into mine, while using their desktop app) but that would result in two issues:

1. This is a project for the community and i want to respect the work spend on everything included in it. While it would *legally* be perfectly fine to just implement their work, effectively claiming that i "came up" with this as a solution, for me *personally*, is not.
2. Simply copying their work, would also make it basically impossible for the user to also use DiscordRPC, due to compatibility issues, like the priority management. Using Discords presence system via the browser is only covered by not even a handful of well working projects and i want to avoid cutting that down further - especially if the cost is simply having to run a second, unnoticeable (performance-whise) extension that works as install-and-forget.

## Support this project
[![BuyMeACoffee](https://img.shields.io/badge/BuyMeACoffee-Donate-%23ff813f?style=for-the-badge&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFGklEQVR42r2XA5RjSRSG2z3T7thJj23btm3btm3btm3bnmhsq%2FXvffek1y%2F9dja795wvepWqvy4KXgmGh0wgUYNYT1iJGAL%2FkhjiIbGOqEIEEGx%2FHtxIzCLeEfiPeEPMIPTEXwbfJfpHK2EnbPwZ8fRbzD3irje9eyPugauNzdXOmqiQLYSBRbhcMsvd4J9v%2BmD%2F8iAM7SJDh0ZKNK%2BtQp2KatQsp0Gt8ho0rq5G2wZK9G4tx6qpoXh21leKiClEgCCgJvFWrOGPO97o2UoOpTwKBq0FRfLqUbcSD4guzRTo2FhBAlQoX1SLTGmNUCujUDy%2FDtd3BwA2twLeEhUFAevczf7rLW%2FUrqBBksDkyJDKxIN1ba7AoE4yjOwRiWFdZejdRo4WdVQkRolZw8OhU1swd2QY4EjUC%2FO9XBkKUagT6zF%2FzB8dhnY06%2BL5dMhMM00ZZUZyM4P0JCxvNgMLeXbeF6UK6TCgo0yKAHoVLzVOsKNrkmL9zBBc2h4Ixwk%2FPD7lB%2FtxP9w%2F5I%2B7Bxk46Pvzc754e9mHn9euqEHuLAac3pgEsffdl6iX6EOK3%2BqpITDpLVArOP4804K59KhUQot6ldUUDoY%2FVy6pReHcemRMw3kAWUQUe2fPkiDALi5CXADRkuJajpLr0MqkWDklFDOGhmNIZxnaUyU0rKoWKoBpWE2NDhT%2FYd1kmDksnNvuXRrEydi9hQKw%2FoSA77e9UZFm2r6hEl9ueiNe6MRJOBJq%2FW%2FWCQe3Ye99vObDpUp9cF%2F%2FWEA8LS592sqhUVlQiNwuuLkdiREqYCAl2Pi%2BEZg6KJyhz%2FxbN5qtsE40qaHicMgjo7ha3HnZy10JvqDEWjE5lMutWS0VShbQIVsGI1IlM8FiNMOsZ%2FhzKqqKrOmNnCMqypl0KU2YNyqMk1NCCERFsFu3zAvGhlkhHIqXVGa2Y364vT8AN%2FcKCJ99YDvqg5fnvLkSqpWh1ZG8EGflPqR6QFxEm%2FpKlC%2FmimVCpzYXThXwujHwcRoxFV8f5kTZImr0aycXXwmlC%2BBBeMnNlVmPN9fTAk8LAo%2BzAc8rA%2B%2FGAt%2FPAfHRSLBXd1sgZyYNpgyMAOweEkCbEMVYD%2BulNgA%2BAnFvgfgf%2BKtF48HZGkhp0XP84fCAAJoFL8N6jQEX9tcA8APi9gFndxWFTm3EikmhnhOwc1EQ1Eojdq4sCuA9xO0Jti3JRm1NrhXQQwIubA0kD5iwdGo2AI8ganE3MWdMKhi0Jt47PJYD1qP%2BSJ3ciLljUtAg1yBqP45hcBcTtTXxhuWZKqCSe3PJF3my6jFxgA6IPgRR%2B7oBnZtpqK2B1wNYf1aAyL7Qo5UK%2BLLGTQ7OoDVDIbL%2BSxUgsi80q6mi%2FUCF2HfzIGYxrwbSBqRAq7oqPrhKFRAtIQy8yRTLp8XnZ7MgZp%2BcnejEpMKQLjJJ8SeiBQEPJCQiH0zTp9Lj0a0%2BIsPH4vntRrQhaTF9SLikNYB4wIdSKaU4e0Q4IiMsWDo5FeLfjQC%2Bbga%2B7SX20OeNiH%2FTD2tnmaFTm7FxdrCkEiTmCAKqEm8SC8GT036oQBuSxcAnY3RqqiWMhAEdm2jQqJoSKSwmir8S769IqoDXRNmEi8kMKWGgbZiP252bKvi0Q9sunQ81%2FC7kyJLxoXh10Vdq%2FMcT%2FoIAAT2xRYoIci0fz2LpahZ915svLvROWS%2F1WsasJbR%2Fvh8aiCn%2Fw%2BV0%2FB8G%2F5vreUVigYev5w%2BIOURZ1xi%2F2i9RRJtv89vI7AAAAABJRU5ErkJggg%3D%3D)](https://www.buymeacoffee.com/christopherklay)

[![Stadia Invite](https://img.shields.io/badge/Join%20Stadia-With%20two%20months%20of%20Stadia%20Pro%20for%20free-orange?style=for-the-badge&logo=stadia)](https://stadia.com/link/home?si_rid=15149990823915817151)

## Translation
If the project isn't available in your own language, or incomplete, feel free to check out the [translation info page](https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/translations.md).

## Pull Requests
The main point about this repository is to provide the sourcecode of the current release version of Stadia Enhanced.

Pull requests for new feature implementations will be manually merged into the (non-public) dev version and tested for errors, before being released with the next public version of the extension.

Please post updates to translations in their respective discussions. No content will be pulled directly into the current release version.

## Ideas? Requests? Questions?
Check out the [discussions page](https://github.com/ChristopherKlay/StadiaEnhanced/discussions) and stay in contact with the community.

## Screenshots

![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/media/Screenshot1.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/media/Screenshot2.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/media/Screenshot3.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/media/Screenshot4.png)
![](https://github.com/ChristopherKlay/StadiaEnhanced/blob/master/media/Screenshot5.png)
