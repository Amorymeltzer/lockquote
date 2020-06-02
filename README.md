### lock-quote

**Quickly change the lockscreen message on your Mac to a random quote.**
Needs to be run with `sudo` since the `defaults write` command requires it.  You could have it run via cron to change regularly, but if you want to (ir)regularly be surprised, you can safely alias `sudo` itself (or some other semi-common hook), e.g. `alias sudo='sudo lock-quote && sudo -E '`

You can read the current lock quote without sudo via `defaults read /Library/Preferences/com.apple.loginwindow.plist LoginwindowText`.

#### Todo
- Format lines if too long, center them
