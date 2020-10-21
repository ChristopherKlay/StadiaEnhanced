# Changelog

## Version 1.5.0
* Added the option to show/hide games on the homescreen
* Added setting to switch between "Toggle" and "Quick" filtering, or disable filtering
* Added a language support system (based on Stadia settings, defaulting to english)
* Added support for german, dutch, french, italian and swedish
* Added a session timer next to the menu while playing
* Reduced the average delay of Enhanced UI elements by ~80%
* Changed UI position for windowed mode and stream monitor
* Fixed incorrect base width/height values for resolution settings
* Fixed dropdown size scaling to content
* Potential fix for wrong counting of unclaimed games

### Version 1.5.1
* Fixed language support breaking the stream monitor
* Removed a console log entry dedicated to debugging
* Fixed outdated changelog in the popup window

### Version 1.5.2
* Fixed layout issues based on recent Stadia changes

### Version 1.5.3
* Updated the invite link with the new referral link
* Less padding on the "Pro" label on games on the homescreen

## Version 1.4.0
* Added a new settings/shortcut menu
* Added overlay clock
* Added option to switch clock settings
* Potential fix for H264 usage
* Fixed being able to select a combination of H264 and 2K/4K
* Fixed styling issues on dropdown menus
* Added "Search on YouTube" to store pages
* Added "Search on Metacritic" to store pages
* Cleaned up the console output

### Version 1.4.1
* Another potential fixe when using H264

### Version 1.4.2
* Changed "Base Deals" to "On Sale", due to newly used categories

## Version 1.3.0
* Added a clock widget to the friends menu
* Added a icon to the search bar
* Added windowed mode support
* Fixed account menu hiding when changing options
* Fixed wrong avatars on friends achievement pages

## Version 1.2.0
* Potential fix for games not starting, due to empty start-up preference
* Custom avatar option (click your icon)
* New shortcuts for base/pro deals
* The stream monitor now only shows when available in-game

### 1.2.1
* Fixed various avatar issues
* Removed achievements shortcut for now, due to content request issues
* Replaced store shortcuts with new menu

### 1.2.2
* Fixed captures shortcut with multiple accounts
* Fixed keyboard navigation support for some shop elements
* Fixed store dropdown menu being unresponsive
* Changed grid options to only be visible on the homescreen
* Moved the version number to be visible when hovering the extensions icon

## Version 1.1.0
* Fixed quick access issues with multiple logged in users
* Moved the codec and resolution options to the settings popup menu
* Stream monitor now hidden outside of games
* Fixed some UI elements not being reachable via tabbing
* Added current version number to the popup window
* Changes to the game library size (hopefully fixing overflows)

## Version 1.0.0
* Converted from userscript to chrome extension
* Fixed the stream monitor blocking voice chat and other features
* Added a search bar to the store
* Added a shortcut to the players achievements page
* Pro Games now shows amount of unclaimed games when visiting (unstable)
* New popup menu, including changelog, quick start and shortcuts
* Changed "Pro Games" to "Pro" for the sake of UI space at 720p
* Fixed multiple issues related to duplicated content ID

## Version 0.3.5
* Added "Pro Games" shortcut
* Code optimisation

### 0.3.5.1
* Fixed class handles due to Stadia update

### 0.3.5.2
* Fixed various bugs with custom grid sizes on navigation

## Version 0.3.4
* Force enabled "4K" option in settings
* Enabled 2K option
* Code optimisation

## Version 0.3.3
* Added missing metadata.
* Enabled updating script via userscript manager
* Added quick access for screenshots & video captures

## Version 0.3.2
* Updated codec function to support switching between H264, VP9 and default
* Added start up timer to the console output
* Beautified code structure

## Version 0.3.0
* First GitHub Release
