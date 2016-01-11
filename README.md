### lock-quote

**Quickly change the lockscreen message on your Mac to a random quote.**
- Run with `sudo` (the `defaults write` command requires it).
- Read with `defaults read /Library/Preferences/com.apple.loginwindow.plist LoginwindowText` (no sudo required)

#### Todo
- Probably most useful as part of some other semi-common hook so it appears to change each time.
- Format lines if too long, center them
