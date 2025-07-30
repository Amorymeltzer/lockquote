# lock-quote

## Quickly change the login window/lock screen message on your Mac to a random quote

To change the message, `lock-quote` needs to be run with `sudo` as the underlying `defaults write` command requires it.  Using the dry-run option (`-n`) or reading the current message (`-s`) do not require `sudo`.

I recommend running it with cron, since doing so means regular changes and keeps you interested; use root's crontab, i.e. `sudo crontab -e`.  Something simple like:

>`42 * * * * path/to/lock-quote -f quotes.txt`

Should do the trick, running once every hour; check out <https://crontab.guru> for easy crontab help.  If you want to be irregularly surprised, you can alias `sudo` itself (or some other semi-common hook), e.g. `alias sudo='sudo lock-quote && sudo -E '`.

You can read the current lock quote without sudo via `lock-quote -s`, or just show a random quote from your list with `lock-quote -n`.

### Alternate quotes files

There are a bunch of quotes provided as a fallback, but you can pass your own quotes file; items should be one quote per line, without any fancy characters.  To do so, you can set the path to the file in `$LOCK_SCREEN_QUOTES` in your shell's environment, or simply pass the path using `-f path/to/file`.

### Scriptable widget

[Scriptable](https://scriptable.app) is an iOS app that can create widgets.  Provided here is [Lock-quote.js](/Lock-quote.js), which you can put in Scriptable to have a random quote from this quotes file display on your lock screen.  Derived from <https://gist.github.com/mlschmitt/e06b1d82ddfcf68497d7fe994f7daea3> for [Merlin Mann's Wisdom Project](https://github.com/merlinmann/wisdom).

### Todo

- Format lines if too long, center them
- Prompt for `sudo` if not provided
