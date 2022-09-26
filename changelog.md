# Changelog

## Version 1.20

### 1.20.11
* Fixed the speedtest option using a outdated URL [[#252]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/252)

### 1.20.10
* Updated Polish translation [[#246]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/246)
* Fixed "Extended Details" section not being displayed after changes on Stadia's side

### 1.20.9
* Added Polish translation
* Updated Spanish translation
* Updated the settings menu styling
* Fixed Stadia Database loading incorrect table
* Fixed the store split view not working after changes on Stadia's side
* Fixed spacing issues in the library grid using custom columns

### 1.20.8
* Updated Slovak and Spanish translations

### 1.20.7
* Changed event triggers due to the removal of `event.path` in Chrome 105 [[#240]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/240)

### 1.20.6
* Changed the "Pro" shortcut to be displayed in the drop down menu instead
* Fixed store list filters not working after changes on Stadia's side
* Fixed playtime calculations in languages with a `,` number separator

### 1.20.5
* Fixed the extension not loading when directly accessing store pages

### 1.20.4
* Fixed spacing issues on store list filter elements
* Fixed store page related features (extended details, youtube/metacritic links and more) not working with the new layout

### 1.20.3
* Added a direct link to trials in the shortcut dropdown
* Fixed menu monitor position issues when using a controller
* Fixed filter/favorite icons not being added to game popups

### 1.20.2
* Changed the text format to display total playtime
* Fixed the stream monitor not resetting correctly between session
* Fixed the stream monitor not displaying hardware decoding when certain frameworks are being used (i.e. VDA)

### 1.20.1
* Added an achievements shortcut to pop-up windows for games
* General code cleanup for optimization, removing older/unused parts of the project

### 1.20.0
* Added a list of missing keys to the console output for translations
* Added a full/detailed status to be displayed on the monitor toggle
* Added an option to force focus, allowing you to tab out of games (including in windowed mode) without automatically pausing them
* Changed multiple parts of the project's code structure for easier maintenance
* Changed how data for the Stadia Database is imported for faster update times and less possible issues between patches
* Fixed issues with UI elements being targeted incorrectly after changes on Stadia's side [[#224]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/224)
* Fixed the game counter not working correctly in list view [[#225]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/225)

## Version 1.19

### 1.19.3
* Added a "Report a bug" option via the Stadia Database community feature
* Added an enabled/disabled status to be displayed on the filter settings toggle

### 1.19.2
* Added Romanian to the list of language-supported features
* Updated Spanish translation
* Fixed language based filtering breaking on unlisted languages  [[#217]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/217)
* Fixed GitHub paths still using "master" instead of "main" [[#215]](https://github.com/ChristopherKlay/StadiaEnhanced/pull/215)
* Fixed start up logs displaying a incorrect language when no translation exists

### 1.19.1
* Changed the "free" filter to only display on the "Pro Games" page
* Changed the Discord RPC feature to support live game images instead of preloaded assets

### 1.19.0
* Added contributing guidelines to the project page
* Updated all donation options to use Ko-fi
* Updated the extension to use Manifest V3 ([Details](https://developer.chrome.com/docs/extensions/mv3/intro/))
* Updated code structure for better overview/management of the code and manifest V3 restrictions [[#204]](https://github.com/ChristopherKlay/StadiaEnhanced/pull/204)
* Updated italian translation [[7#]](https://github.com/ChristopherKlay/StadiaEnhanced/discussions/7#discussioncomment-1746448)
* Fixed the stream monitor not being visible in new windows [[#206]](https://github.com/ChristopherKlay/StadiaEnhanced/pull/206)

## Version 1.18

### 1.18.6
* Added the request path to the console log for Stadia Hunters
* Changed the padding on injected navigation buttons to match the base buttons
* Fixed the "Invite a friend" functionality not being displayed when opened via the homescreen
* Fixed issues with the founder tag not being replaced when there's a loading issue with Stadia Hunters data

### 1.18.5
* Added a "Free" filter to the list filter options to filter out i.e. unclaimed Pro titles
* Fixed the extension not loading when reloading the page while the library is open

### 1.18.4
* Fixed text spacing issues in the Stadia Hunters pop-up
* Fixed extension loading issues on capture pages

### 1.18.3
* Updated Italian translation
* Fixed a issue with current status detection for the Discord presence

### 1.18.2
* Added translation options for several previously hardcoded texts (i.e. the filter settings)
* Added a check for missing keys (keys not listed as undefined, but used by the extension) to the `debugEnhanced('translation')` command
* Fixed DiscordRPC sometimes displaying the wrong status message
* Fixed multiple styling issues with the split view option for store lists after changes on Stadias side

### 1.18.1
* Updated French and Italian translations
* Added permission delcarations to the readme overview
* Fixed a issue with loading game IDs on detail pages of games with multiple screenshots

### 1.18.0
* Added "StadiaHunters" as a community feature, including level progress, world rank and direct links on detail/achievement pages
* Fixed console logs for the streaming mode being mislabeled
* Fixed a filter related issue with games that display a video instead of a screenshot on the details window
* Fixed issues with game ID detection for the Discord presence and video filter features with multiple logged in users
* Fixed the extension running on unnecessary pages (i.e. the couch/tv dedicated pages)
* Fixed issues with the extension running and no user being logged in
* Removed "StadiaStatsGG" community feature due to inactivity and issues with the service

## Version 1.17

### 1.17.8
* Fixed some UI elements not being visible due to incorrect RegEx filtering [[#192]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/192)

### 1.17.7
* Added a fallback error when no account is logged in
* Changed how UI elements get inserted to improve performance
* Fixed issues with the game ID detection for filtering, favorites, StadiaIcons and StadiaStatsGG

### 1.17.6
* Changed the store filter to work with language based support after changes on Stadia's side
* Changed store filter labels to match Stadias store entry labeling
* Removed the wishlist option (hopefully temp.), due to Stadia removing the ID from store entries [[#190]](https://github.com/ChristopherKlay/StadiaEnhanced/issues/190#issuecomment-955766042)

### 1.17.5
* Changed filter settings for rendering optimization
* Fixed stream details on the Stadia menu not being visible when using a controller
* Fixed multiple refresh issues related to session times

### 1.17.4
* Fixed photo/video filtering options not working after changes to captures by Google
* Fixed issues with playtime calculation in games with over 1000 hours in a single title

### 1.17.3
* Fixed a display issue with "frames lost" in the stream monitor on the Stadia menu

### 1.17.2
* Updated Italian and French translations
* Added support for Stadia features (i.e. Crowd Play) to the extended details

### 1.17.1
* Changed all filter settings to only be applied when not set to default value

### 1.17.0
* Added support for css/svg video filters saved per game/profile
* Added video settings for saturation, contrast, brightness and sharpening
* Added the option remove the dimming effect when opening the Stadia menu during gameplay
* Added a community feature setting for the Stadia Database
* Changed text spacing on language selection
* Changed split store styling to fit Stadia's layout
* Fixed missing translation access for `debugEnhanced("translation")`
* Fixed "date" & "time" not being translated in the stream monitor
* Fixed multiple elements being updated when unchanged
* Fixed position issues with multiple dropdown menus
* Fixed the "split store" option not working due to changes on Google's side

## Version 1.16

### 1.16.7
* Fixed display issues with the pop-up monitor (double-click)
* Fixed total playtime calculations
* Fixed the "default" language option when multiple users are logged in

### 1.16.6
* Added Esperanto translation
* Added Hungarian to the language switcher
* Changed description of framerates in extended details
* Changed stream data to be handled by the content script

### 1.16.5
* Updated Slovak translation
* Updated the extended details section including crossplay support details
* Resolution options for 1440/2160p will from now on include a note highlighting that Stadia Pro is required
* Updated streaming monitor design by [Janca](https://github.com/Janca) (#163)

### 1.16.4
* Fixed resolution options not being applied until the page is refreshed due to a profile error

### 1.16.3
* Changed library count to match page style
* Changed the translation used for "all games" to a dedicated string
* Updated Hungarian translation

### 1.16.2
* Fixed wishlist filter not working
* Fixed some games getting added to the wishlist incorrectly

### 1.16.1
* Fixed profile based issues for accounts with the founder status

### 1.16.0
* Changed settings from being shared across all users via the same browser to a personal profile for each user
* Changed old/unused settings to be automatically discarded from user profiles
* Changed 'Reset all settings' to only reset the current profile instead of all existing settings
* Added the ability to import and export the settings of the current profile
* Added a quick command to display the current profile via `debugEnhanced("profile")`
* Fixed language selection with multiple logged in users resulting in errors
* Fixed the Stadia menu displaying wrong stream infos when a previous session exists
* Heavy code cleanup for consistency and optimization

## Version 1.15

### 1.15.3
* Updated Italian and Slovak translation

### 1.15.2
* Fixed the extended database not loading correctly
* Changed the Discord presence from "passive" back to "active", following DiscordRPC updating to `0.1.6`
* Changed the repository structure and load path for included files to be more clear to the user
* Updated Italian & French translation

### 1.15.1
* Added the ability to directly view the loaded translation data via `debugEnhanced("translation")`
* Added Slovak translation
* Changed DiscordRPC from "active" to "passive" temporarily to avoid activation issues

### 1.15.0
* Added the ability to showcase the currently played title via DiscordRPC
* Added custom display images for over 50 games to the Discord presence
* Updated Portuguese translation
* Fixed the statistic header not being translated

## Version 1.14

### 1.14.1
* Fixed issues related to date & time in the streaming monitor

### 1.14.0
* Updated the streaming monitor with a more refined look
* Added a new notification on updates to the extension
* Changed the pop-up to a simpler, easier to maintain one
* Changed "average traffic" in the stream monitor to display the full bandwidth usage, not just incoming video
* Changed the searchbar to fully display at lower resolutions instead of 1440p and above only
* Fixed possible conflicts with TV/couch related pages
* Fixed the searchbar not responding in minified mode
* Fixed the store split function breaking the layout in smaller windows by adjusting to screen sizes

## Version 1.13

### 1.13.5
* Changed content requests to background fetching to avoid GitHub permission uncertainties
* Fixed playtime not displaying correctly when the user has their playtime set to private

### 1.13.4
* Changed the language picker into a scrollable list and added more options
* Fixed the language picker always loading the home screen
* Updated Catalan translation

### 1.13.3
* Fixed the letterbox filter not accepting inputs anymore

### 1.13.2
* Fixed extended details not loading with multiple accounts

### 1.13.1
* Restricted the extensions access to the projects own GitHub repository only

### 1.13.0
* Added extended game infos (max resolution, framerate @ 4K, HDR, etc.) to store detail pages
* Added a Ubisoft+ shortcut
* Updated the friend invite url to the current standard
* Fixed wishlisting sometimes using the wrong SKU
* Fixed playtime calculation errors when a single title has more than 1000 hours

## Version 1.12

### 1.12.4
* Fixed logo reverting to the old version (oopsie!)
* Fixed the grid size option displaying the wrong default value on smaller screens
* Fixed multiple aspects of the extension on smaller (mobile) screens
* Changed the letterbox filter to be hidden on smaller (mobile) screens

### 1.12.3
* Fixed the game labels function not hiding Ubisoft+ labels correctly

### 1.12.2
* Fixed streaming monitor not updating due to changes on Google's side
* Updated French translation

### 1.12.1
* Adjusted monitor display position and structure next to the Stadia menu
* Fixed errors, typos and issues based on translation strings
* Updated Italian translation

### 1.12.0
* Replaced the settings menu with a new version
* Added stream infos to the Stadia menu during games (alt+tab) for quick and controller supported access
* Added the option to open a new pop-up with the current streaming monitor settings via doubleclick in the Stadia menu
* Added "Leaving Pro" to store shortcut menu
* Added "Stadia Enhanced" menu category featuring GitHub, changelog and other shortcuts
* Changed store shortcuts to always be visible
* Changed stream monitor to automatically reset when outside available screen space
* Optimized the function to reset all settings to include any possible variables set by the extension

## Version 1.11

### 1.11.4
* Fixed wishlisting icon position
* Fixed total payments including refunded/cancelled purchases

### 1.11.3
* Optimized element selection to increase performance
* Fixed letterbox hiding games on homescreen
* Fixed games transferring the "pinned" status to the homescreen
* Updated Portuguese translation

### 1.11.2
* Updated the extension to work with Google's UI changes
* Removed the now by default supported search function
* Switched pin/filter options from game tiles to pop-up window due to compatibility issues with the family quick-select
* Changed styling of pinned item marker and game filter elements
* Updated Italian translation

### 1.11.1
* Fixed shortcuts when using multiple accounts
* Updated Catalan translation

### 1.11.0
* Added a new menu category "Community Features" specifically for features maintained by members of the community
* Added StadiaStatsGG-specific shortcuts for games, profile and find-a-buddy to the community features
* Added a letter-based filter system for quick searching on the homescreen
* Added filter for locked achievements on detail pages
* Added filter option via completion state on the player's game list
* Added total amount of games on homescreen
* Added "total" next to "online" at the top of the friends list
* Added the option to switch between languages (default/English/Spanish/French for now)
* Replaced the translation function with a new, more robust and easier to manage version
* Moved the menu entry for shortcuts via StadiaIcons to community features and changed description
* Fixed custom avatar not showing in livestream overview
* Fixed extension dropdown menu icons not changing color when active
* Fixed some menu entries showing the wrong default values

## Version 1.10

### 1.10.2
* Fixed Italian translation

### 1.10.1
* Changed the statistic overview to display playtime total again
* Updated Italian, Hungarian, Catalan, French, Portuguese and Dutch translation
* Fixed playtime total values returning errors due to localisation issues
* Fixed total payment calculations for some currencies
* Fixed a bug where total payments showed a multiplied total
* Fixed a possible error when opening the settings menu

### 1.10.0
* Added the option to pin games to the start of the grid on the homescreen
* Added total payments displayed under settings/purchases
* Changed the main menu icon to better represent a menu
* Changed "Pro Labels" to "Game Labels" also hiding the family sharing label
* Updated the logo of the extension to a new design
* Updated Portuguese translation
* Fixed overwrites to re-enable codec/resolution switching after Google's changes
* Fixed resolution changing not being visible on family-shared titles
* Fixed items marked as "Add-on-Bundle" not being filtered correctly
* Optimized main loop for better performance
* Optimized settings function for better accessibility and performance

## Version 1.9

### 1.9.1
* Fixed some wishlisted entries not showing up due to SKU differences
* Fixed the family sharing filter missing some elements
* Fixed extension error when viewing the family group
* Updated Italian, Dutch, Hungarian and Catalan translations

### 1.9.0
* Added a shortcut to the users profile
* Added the option to add store items to a wishlist
* Added in-line image preview in messages
* Added the option to hide family sharing options
* Added resolution selector to game pop-ups on the homescreen
* Fixed streaming mode not hiding the friends list after changes to Stadia
* Fixed list filtering being invisible after going back in history

## Version 1.8

### 1.8.11
* Fixed custom avatar not showing in parties
* More precise connection status (blue/perfect > green/good > yellow/some issues > red/heavy issues)
* Connection status bar now on both monitor options

### 1.8.10
* Fixed offline/invisible & statistics functionality/errors after changes to Stadia

### 1.8.9
* Added Hungarian translation

### 1.8.8
* Reduced CPU usage due to optimization of selectors
* Added Dutch translation
* Fixed debugging function ignoring wrong language codes
* Fixed the extension loading on shared captures
* Fixed Portuguese language option loading the wrong language

### 1.8.7
* Removed scrollbar functionality, which is now officially supported

### 1.8.6
* Added Portuguese translation
* Changed changelog to be sorted descending based on main version
* Changed the translation function to fallback to English on errors
* Fixed Catalan translation errors

### 1.8.5
* Added Swedish translation & updated translations
* Fixed a error when using the emoji picker in empty conversations
* Fixed a error causing the wrong language to load

### 1.8.4
* Added Danish translation
* Added the option to filter captures by type (screenshot/clip)
* Added the option to filter lists by type (game/bundle/add-on)
* Added decoding time and type (software/hardware) to the stream monitor
* Fixed the emoji picker not being displayed
* Fixed styling issues when using split store lists

### 1.8.3
* Added a basic connectivity status display (dot) to the minified streaming monitor
* Fixed game tiles not featuring the pop-up effect on default settings
* Fixed latency/compression showing "NaN" instead of placeholder
* Fixed a styling issue where text could clip into nearby elements
* Fixed and updated Spanish translation

### 1.8.2
* Added Spanish and Italian translation
* Optimized the management of style elements added by the extension
* Fixed a styling issue with the menu in Chrome versions below 87

### 1.8.1
* Added a "Responsive" option to the grid size settings
* Added French and Catalan translation
* Added a option to enable/disable the shortcut feature
* Changed the shortcut icon to only show on hover and fixed its tooltip
* Changed the searchbar to auto-hide on small screens to avoid overlapping issues
* Fixed settings reset not including the scrollbar option
* Fixed a possible error when loading the username/tag

### 1.8.0
* Settings menu changed from full-width to scrollable dropdown
* Added descriptions and default values to menu options
* Added statistics to the user's full overview ("See More/All") on profiles
* Added an option to split store lists into two columns
* Added the option to enable scrollbars on the homescreen and store
* Re-enabled the sort function when searching the store
* Changed the extension menu to display all changes instead of just the most recent ones
* Fixed the filter icon being attached to the wrong element if Pro games are claimable
* Fixed styling issues with the streaming monitor on smaller screens
* Temporarily disabled incomplete translations — see GitHub for details

## Version 1.7

### 1.7.8
* Added the ability to reset most settings
* Changed the home screen filter from using the UID to the SKU
* Moved the option to create a shortcut for a game to the pop-up window
* Fixed being unable to switch between full and minified stream monitor

### 1.7.7
* Fixed a possible error when no monitor position is set

### 1.7.6
* Added support to autostart the streaming monitor
* Decreased the delay when switching the monitor on/off drastically
* Temp-fix to stop filtering/shortcuts from breaking the extension in some situations (will be fixed at a later point)

### 1.7.5
* Fixed UID issues with the claim all section

### 1.7.4
* Added the option to hide the category preview on games
* Added the option to disable the pop-up effect on games
* Added "hand" based emojis
* Fixed homescreen grid scaling
* Fixed not being able to hide the user gallery at the bottom of the homescreen
* Fixed homescreen filtering
* Fixed shortcut creation
* Fixed language-based errors with game titles on shortcuts

### 1.7.3
* Updated "On Sale" link to direct to the currently used deals section

### 1.7.2
* Added the option to reset the streaming monitor's position (doubleclick the menu icon)
* Fixed streaming monitor being able to be displayed outside the available screen area

### 1.7.1
* Updated translations
* Fixed a language file error, resulting in the extension not loading in Swedish
* Changed offline/invisible users to no longer also be hidden in messages

### 1.7.0
* Added shortcut integration by ELowry
* Added support for a minified streaming monitor (switch via doubleclick)
* Added the option to personalize (via dragging) the position of the stream monitor
* Added a stream mode (renders certain elements unreadable for privacy during streams)
* Changed the "On Sale" linked category to load the "Featured deals" section
* Fixed Stadia Enhanced not working correctly due to changes on Stadia's end
* Fixed missing status logs & removed logs for debugging

## Version 1.6

### 1.6.0
* New settings menu
* Added a emoji picker to chats
* Added the option to show/hide the "Pro" label on games on the homescreen
* Added the option to show/hide the user media section on the homescreen
* Added the option to show/hide the "last message" in your friends list
* Added the option to show/hide the quick reply function
* Added the option to show/hide offline and/or invisible (online status not shared) friends
* Added shortcuts for the M-Lab based speedtest and community page
* Fixed custom avatar not showing in groups and group chats
* Fixed stream monitor data not loading
* Fixed overlay clock showing after refreshing a game without being enabled
* Fixed language settings via URL parameter (i.e. "?hl=en") being reset

## Version 1.5

### Version 1.5.6
* Fixed various elements due to changes on Stadia's side
* Fixed avatar not showing in "Friends" section of profiles

### Version 1.5.5
* Added custom avatar button to own profile
* Enabled transparent avatar background
* Fixed "Pro" tag spacing on homescreen
* Fixed avatar not changing on profile
* Fixed custom avatar setting blocking profile links
* Potential fix for the stream monitor not showing on first start

### Version 1.5.4
* Adjusted measurements for latency/jitter

### Version 1.5.3
* Updated the invite link with the new referral link
* Less padding on the "Pro" label on games on the homescreen

### Version 1.5.2
* Fixed layout issues based on recent Stadia changes

### Version 1.5.1
* Fixed language support breaking the stream monitor
* Removed a console log entry dedicated to debugging
* Fixed outdated changelog in the pop-up window

### 1.5.0
* Added the option to show/hide games on the homescreen
* Added setting to switch between "Toggle" and "Quick" filtering, or disable filtering
* Added a language support system (based on Stadia settings, defaulting to English)
* Added support for german, dutch, french, italian and swedish
* Added a session timer next to the menu while playing
* Reduced the average delay of Enhanced UI elements by roughly 80%
* Changed UI position for windowed mode and stream monitor
* Fixed incorrect base width/height values for resolution settings
* Fixed dropdown size scaling to content
* Potential fix for wrong counting of unclaimed games

## Version 1.4

### 1.4.2
* Changed "Base Deals" to "On Sale", due to newly used categories

### 1.4.1
* Another potential fixe when using H264

### 1.4.0
* Added a new settings/shortcut menu
* Added overlay clock
* Added option to switch clock settings
* Potential fix for H264 usage
* Fixed being able to select a combination of H264 and 2K/4K
* Fixed styling issues on dropdown menus
* Added "Search on YouTube" to store pages
* Added "Search on Metacritic" to store pages
* Cleaned up the console output

## Version 1.3

### 1.3.0
* Added a clock widget to the friends menu
* Added a icon to the search bar
* Added windowed mode support
* Fixed account menu hiding when changing options
* Fixed wrong avatars on friends achievement pages

## Version 1.2

### 1.2.2
* Fixed captures shortcut with multiple accounts
* Fixed keyboard navigation support for some shop elements
* Fixed store dropdown menu being unresponsive
* Changed grid options to only be visible on the homescreen
* Moved the version number to be visible when hovering the extensions icon

### 1.2.1
* Fixed various avatar issues
* Removed achievements shortcut for now due to content request issues
* Replaced store shortcuts with new menu

### 1.2.0
* Potential fix for games not starting due to empty start-up preference
* Custom avatar option (click your icon)
* New shortcuts for base/pro deals
* The stream monitor now only shows when available in-game

## Version 1.1

### 1.1.0
* Fixed quick access issues with multiple logged-in users
* Moved the codec and resolution options to the settings pop-up menu
* Stream monitor now hidden outside of games
* Fixed some UI elements not being reachable via tabbing
* Added current version number to the pop-up window
* Changes to the game library size (hopefully fixing overflows)

## Version 1

### 1.0.0
* Converted from userscript to Chrome extension
* Fixed the stream monitor blocking voice chat and other features
* Added a search bar to the store
* Added a shortcut to the player's achievements page
* Pro Games now shows amount of unclaimed games when visiting (unstable)
* New pop-up menu including changelog, quick start and shortcuts
* Changed "Pro Games" to "Pro" for the sake of UI space at 720p
* Fixed multiple issues related to duplicated content ID

## Pre-Releases

### 0.3.5.2
* Fixed various bugs with custom grid sizes on navigation

### 0.3.5.1
* Fixed class handles due to Stadia update

### 0.3.5
* Added "Pro Games" shortcut
* Code optimization

### 0.3.4
* Force enabled "4K" option in settings
* Enabled 2K option
* Code optimization

### 0.3.3
* Added missing metadata.
* Enabled updating script via userscript manager
* Added quick access for screenshots & video captures

### 0.3.2
* Updated codec function to support switching between H264, VP9 and default
* Added start up timer to the console output
* Beautified code structure

### 0.3.0
* First GitHub Release