// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: quote-left;

// Derived from the Scriptable code from
// <https://gist.github.com/mlschmitt/e06b1d82ddfcf68497d7fe994f7daea3> for
// Merlin Mann's Wisdom Project: <https://github.com/merlinmann/wisdom>.  Uses
// local file cache, a la
// <https://gist.github.com/Amorymeltzer/71970408acc41494a2e6121dcf94381c>

// Configuration - adjust these as needed
const UPDATE_INTERVAL_HOURS = 168 // Check for updates every week (7 days * 24 hours)
const QUOTES_FILENAME = "lockscreen_quotes.txt"
const REMOTE_URL = "https://raw.githubusercontent.com/Amorymeltzer/lockquote/refs/heads/main/lockscreen_quotes.txt"

let items = await loadItems()
if (config.runsInWidget) {
  let widget = await createWidget(items)
  Script.setWidget(widget)
} else if (config.runsWithSiri) {
  let firstItems = items.slice(0, 5)
  let table = createTable(firstItems)
  await QuickLook.present(table)
} else {
  let table = createTable(items)
  await QuickLook.present(table)
}
Script.complete()

function getQuotesFilePath() {
  let fm = FileManager.iCloud()
  let dirPath = fm.documentsDirectory()
  return fm.joinPath(dirPath, QUOTES_FILENAME)
}

function getLastUpdateFilePath() {
  let fm = FileManager.iCloud()
  let dirPath = fm.documentsDirectory()
  return fm.joinPath(dirPath, "quotes_last_update.txt")
}

async function shouldUpdateFile() {
  let fm = FileManager.iCloud()
  let lastUpdatePath = getLastUpdateFilePath()

  if (!fm.fileExists(lastUpdatePath)) {
    return true // No update file exists, so we should update
  }

  try {
    let lastUpdateStr = fm.readString(lastUpdatePath)
    let lastUpdate = new Date(lastUpdateStr)
    let now = new Date()
    let hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60)

    return hoursSinceUpdate >= UPDATE_INTERVAL_HOURS
  } catch (error) {
    console.log("Error reading last update file: " + error)
    return true // If we can't read the file, update to be safe
  }
}

async function downloadAndSaveQuotes() {
  try {
    console.log("Downloading quotes from remote URL...")
    let req = new Request(REMOTE_URL)
    let rawBody = await req.loadString()

    let fm = FileManager.iCloud()
    let quotesPath = getQuotesFilePath()
    let lastUpdatePath = getLastUpdateFilePath()

    // Save the quotes content
    fm.writeString(quotesPath, rawBody)

    // Save the current timestamp
    let now = new Date().toISOString()
    fm.writeString(lastUpdatePath, now)

    console.log("Quotes file updated successfully")
    return rawBody
  } catch (error) {
    console.log("Error downloading quotes: " + error)
    throw error
  }
}

async function loadLocalQuotes() {
  let fm = FileManager.iCloud()
  let quotesPath = getQuotesFilePath()

  if (!fm.fileExists(quotesPath)) {
    throw new Error("Local quotes file does not exist")
  }

  return fm.readString(quotesPath)
}

async function loadItems() {
  let fm = FileManager.iCloud()
  let quotesPath = getQuotesFilePath()
  let rawBody

  // Check if local file exists and if we should update
  if (!fm.fileExists(quotesPath) || await shouldUpdateFile()) {
    try {
      // Try to download and save
      rawBody = await downloadAndSaveQuotes()
    } catch (error) {
      // If download fails and we have a local file, use it
      if (fm.fileExists(quotesPath)) {
	console.log("Download failed, using local file")
	rawBody = await loadLocalQuotes()
      } else {
	// No local file and download failed - this is a problem
	throw new Error("Cannot download quotes and no local file exists")
      }
    }
  } else {
    // Use local file
    console.log("Using local quotes file")
    rawBody = await loadLocalQuotes()
  }

  // Parse the quotes - much simpler than the wisdom format
  let lines = rawBody.split('\n')

  // Filter out empty lines and clean up
  let quotes = lines
    .map(line => line.trim())
    .filter(line => line.length > 0)

  return quotes
}

async function createWidget(items) {
  // Get random quote
  let item = items[Math.floor(Math.random()*items.length)]

  // Parse quote and source
  let quoteText = ""
  let source = ""

  // Look for the pattern: "quote text" - source
  let match = item.match(/^"(.+?)" - (.+)$/)
  if (match) {
    quoteText = `"${match[1]}"`
    source = `— ${match[2]}`
  } else {
    // Fallback if format doesn't match
    quoteText = item
    source = ""
  }

  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  let gradientOptions = [
    [new Color("#9b59b6"), new Color("#8e44ad")], // purple
    [new Color("#3498db"), new Color("#2980b9")], // blue
    [new Color("#1abc9c"), new Color("#16a085")], // teal
    [new Color("#e67e22"), new Color("#d35400")], // orange
    [new Color("#e74c3c"), new Color("#c0392b")]  // red
  ]
  let targetGradient = gradientOptions[Math.floor(Math.random()*gradientOptions.length)]
  gradient.colors = targetGradient
  let widget = new ListWidget()
  widget.backgroundColor = targetGradient[1]
  widget.backgroundGradient = gradient

  // Add spacer above content to center it vertically.
  widget.addSpacer()

  // Add the quote text
  let quoteElement = widget.addText(quoteText)
  quoteElement.font = Font.boldSystemFont(14)
  quoteElement.textColor = Color.white()
  quoteElement.minimumScaleFactor = 0.4

  // Add source if it exists
  if (source) {
    widget.addSpacer(4) // Small gap between quote and source
    let sourceElement = widget.addText(source)
    sourceElement.font = Font.boldSystemFont(12) // Slightly smaller
    sourceElement.textColor = Color.white()
    sourceElement.minimumScaleFactor = 0.4
    sourceElement.textOpacity = 0.9 // Slightly more subtle
    sourceElement.centerAlignText() // Center the source
  }

  // Add spacing below content to center it vertically.
  widget.addSpacer()
  return widget
}

function createTable(items) {
  let table = new UITable()
  for (item of items) {
    let row = new UITableRow()
    let titleCell = row.addText(item)
    titleCell.minimumScaleFactor = 0.4
    titleCell.widthWeight = 60
    row.height = 80
    row.cellSpacing = 10
    row.onSelect = (idx) => {
      let item = items[idx]
      let alert = new Alert()
      alert.message = item
      alert.presentAlert()
    }
    row.dismissOnSelect = false
    table.addRow(row)
  }
  return table
}
