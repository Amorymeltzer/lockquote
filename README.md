### lock-quote

**Quickly change the lockscreen message on your Mac to a random quote.**
- Run with `sudo` (the `defaults write` command requires it).
- Read with `defaults read /Library/Preferences/com.apple.loginwindow.plist LoginwindowText` (no sudo required)
- Probably most useful in a `sudo` alias or some other semi-common hook so it appears to change from time to time.

#### Todo
- Format lines if too long, center them
