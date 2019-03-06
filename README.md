![](https://img.shields.io/badge/status-stale-orange.svg)

# High Fidelity: Zone Message

This is a zone client entity script for [High Fidelity](https://highfidelity.com).
It displays a message to users when they enter a zone.

## Building

Call `npm run build`, and the script will be compiled into the `dist/` folder.

## Features

 - [x] Webpack + Babel for latest JavaScript and npm package support
 - [x] Display message to user
 - [x] Display alert icon
 - [ ] Animate in
 - [x] Message timeout
 - [ ] Control script for zone admin
 - [ ] Change in real-time
 - [ ] Layout and position options
 - [ ] Alert sound
 - [ ] Option to show only once
 - [ ] Upload to Marketplace

## Advanced

### Message data

The details of the message to display are taken from the `userData` property of the
zone entity the script is attached to. Example:

```
"userData": {
    "com.jjv360.hf-zone-alert.current": {
        "icon": "info",
        "title": "Hello!",
        "text": "Welcome to my zone!",
        "footer": "Made by jjv360",
        "timeout": 15
    }
}
```
