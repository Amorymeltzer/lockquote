# lock-quote

**Quickly change the login window/lock screen message on your Mac to a random quote**
`lock-quote` needs to be run with `sudo` since the underlying `defaults write` command requires it.

There are a bunch of quotes provided as a fallback, but you can pass your own quotes file; items should be one quote per line, without any fancy characters.  To do so, you can set the path to the file in `$LOCK_SCREEN_QUOTES` in your shell's environment, or simply pass the path using `-f path/to/file`.

I recommend running it with cron, since doing so means regular changes and keeps you interested; use root's crontab, i.e. `sudo crontab -e`.  Something simple like:

>`42 * * * * path/to/lock-quote -f quotes.txt`

Should do the trick, running once every hour; check out <https://crontab.guru> for easy crontab help.  If you want to be irregularly surprised, you can alias `sudo` itself (or some other semi-common hook), e.g. `alias sudo='sudo lock-quote && sudo -E '`.

You can read the current lock quote without sudo via `defaults read /Library/Preferences/com.apple.loginwindow.plist LoginwindowText`.

## Todo

- Format lines if too long, center them
- Display current quote
- Display a random quote but don't set it
