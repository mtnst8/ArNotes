# ArNotes

Simple notes that live in **your own Google Drive**: each note is a Google Doc, tags and the note list live in a Google Sheet, and attachments sit in a Drive folder. ArNotes is an installable web app (phone or computer) with an Inbox for new notes, a Cabinet for filed ones, nested tags, search, batch actions, and a Drop folder that turns any file into a note.

**App:** https://mtnst8.github.io/ArNotes/

## Using ArNotes

1. Open the app link above on your phone or computer.
2. Paste your **pairing link** (or enter your server address and key) and tap **Connect**.
3. Install it:
   - **Android (Chrome):** ⋮ → *Install app* / *Add to Home screen*. Once installed, you can share photos and files from other apps straight into ArNotes (Share → ArNotes).
   - **iPhone (Safari):** Share → *Add to Home Screen*.
   - **Computer (Chrome/Edge):** the install icon in the address bar.

To add another device, open **Settings → Devices → Copy pairing link** in ArNotes and open that link on the new device. Anyone with the pairing link can open your notes, so keep it private. To cut off every device, run `apiRotateKey` in your server's script editor and pair again.

### Saving web pages and bookmarks

- **Android phone:** in Chrome open the page, then ⋮ → **Share → ArNotes**.
- **Computer:** in ArNotes open **Settings → Getting things in → Save to ArNotes button** and drag the **📌 Save to ArNotes** button to your bookmarks bar (Ctrl+Shift+B shows the bar; do it once per Chrome profile). Click it on any page to save it; select text first to keep it with the page.
- **Anywhere:** email the link to your ArNotes address.

A note that is just a link gets the page's title, a short description and its picture. Some big store sites block this; those notes are named after the address.

### Home

Home is a set of boxes: Tasks, Notes, Scratch pad, Pinned note, Inbox, Shortcuts and Tags. Drag a box by its title to move it (on a phone, press and hold the title first). Each device remembers its own layout; **Reset box layout** at the bottom puts it back.

### Receipts: billed

Tick the box in the **Billed** column of the Receipts table (or on a receipt's preview card) to mark it billed to the customer today; untick to mark it not billed. Undo works for a few seconds. To bill many at once, tick the rows on the left and press **✓ Mark billed**.

### No doubles

A photo or file shared from your phone is saved straight with the note's attachments, so the 15-minute Drop folder check can never make a second note of it, and a file that is already a note's attachment is never turned into another note. An email is never saved twice, even if its Gmail label is renamed. Phone photos are named with the time to the second (Photo Nov 8, 2026 2:21:05 PM), so pictures taken the same minute don't look like copies.

### Trash

Deleting a note moves it to **Trash** (left menu), with Undo for a few seconds. It waits there 30 days with its tags and filing, then is deleted for good (its Google Doc goes to Google Drive's trash). In Trash, tick notes and press **↩ Restore** to put them back where they were, or **Delete forever**; **Empty trash** clears it. Notes in the Trash stay out of search, tags, receipts and shared links. Deleted photos still go straight to Google Drive's trash.

### Tasks

Put any note on the to-do list with **☑ Add to Tasks** (on the note, its Inbox preview, or the selection bar for several notes); press it again (**✓ In Tasks**) to take it off. Photos too: **☑ Add to Tasks** in the photo viewer, or on the Photos selection bar, makes one task note with the photo(s) in it.

In the **Tasks** box on Home, type a task and press Enter (or **＋ Add task**); the line clears for the next one. Click a task to open it for editing. The box shows 7 tasks at a time; scroll for the rest. Any note tagged **Tasks** (When › Now › Tasks) appears there too. Tap its tag to move it to another When tag, tick it and press **✓ Completed** (moves it to When › Completed), or **🗑 Delete task** (trash, with Undo). The Tasks and Cash tags come with ArNotes.

Every ArNotes starts with four notes in Tasks: **Welcome to ArNotes** (the overview), **1. Install ArNotes on your phone and computer**, **2. Getting started: everything in one place** and **3. How to use ArNotes**. Their links open parts of your own ArNotes. Each update adds a **What's new in ArNotes: Release N** note to Tasks.

The full how-to for users is the **Getting started** guide inside the app (Settings → Help & backup → Getting started).

## Set up your own ArNotes

Each person runs their own small, free "server" in their own Google account, so nobody else can see your notes, including the person who made the app.

1. Create a new Google Sheet (it becomes your note index) → **Extensions → Apps Script**.
2. In the script editor, create files named `Code.gs`, `Batch.gs` and `Index.html`, and paste in the matching files from the [`server/`](server/) folder.
3. Save, pick the function **`setup`** and click **Run**. Approve the permission prompt (Google will say the app is unverified, because it's your own script: *Advanced → Go to …*). This creates an `ArNotes` folder in your Drive with `Notes` and `Attachments` and a starter tag list.
4. Run **`installDropTrigger`**. This creates `ArNotes/Drop`, where any file you put becomes an Inbox note within 15 minutes.
5. Run **`apiSetup`**. The log shows your **private key**.
6. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the **Web app URL**.
7. Open the app, choose **Or enter server address and key**, and paste the URL and key. Then use **Settings → Devices → Copy pairing link** to set up your other devices.

"Who has access: Anyone" only lets the app reach your server. Every request must carry your private key, and anything without it is refused.

### Importing from Evernote

`server/Code.gs` includes an Evernote importer (Sheet menu **ArNotes → Start / resume Evernote import**). It expects an `ArNote-import` folder in Drive with `notes.jsonl` and an `attachments/` folder, produced from your `.enex` export.

## Linked Drive files

Keep files where they are in Drive and still have them in ArNotes:

- **Inbox → 🔗 Link Drive files**: browse My Drive or Shared with me (or search by name), tick files or folders, or paste links.
- Or in Drive (or the Drive phone app): **Organize → Add shortcut → ArNotes › Link**. They show up within 15 minutes.
- A linked **folder** puts every file in it (and its sub-folders) in the Cabinet, tagged with the folder's name. New files are added on each check; stop it in **Settings → Getting things in → Linked Drive folders**.

ArNotes never renames, edits, stars or deletes a linked file. "Remove link" only removes the note.

## Other Google accounts

Linked files are tagged with the Google account that owns them (for example `@brian-mountainstatebrewing`), under the tag **Accounts**. To bring in files from a second account, such as a work account, share its folders from that account with the Google account your ArNotes runs in. Then link them from **🔗 Link Drive files → Shared with me**. Rename account tags like any other tag. **Settings → Getting things in → Google accounts** lists them.

## Sharing a tag with other people

Open a tag and choose **Share…** (or ⋯ → Share… on the Tags page). Type who it's for and **Create link**, then send them the link.

- People with the link see that tag's notes, including sub-tags, read-only. They can search, read, print and download attachments. They don't need a Google account or their own ArNotes.
- Notes you add to the tag later show up for them automatically.
- Give each person or group their own link, so you can **Switch off** or delete one without affecting the others. **Settings → Sharing & people → Shared links** lists them all.
- Renaming the tag keeps its links working. Deleting the tag switches its links off.
- A share link only reaches the notes in that tag. It can't change anything or see the rest of your notes.

## Photos

ArNotes can show photos from a Drive folder without copying them. Put photos in **ArNotes Photos** in your Drive (sub-folders are fine). The **Photos** section then shows:

- a photo inbox to tag and file from
- browsing by tag, by date (year → month) or by folder
- a full-screen viewer with swipe or arrow keys

Only tags and inbox/filed status are stored in ArNotes' Sheet. New photos are picked up every 15 minutes, or press **Check for new**. To bring in an existing library, export it with Google Takeout and copy the folders into ArNotes Photos. To add new phone photos automatically, use a sync app (for example Autosync for Google Drive on Android) pointed at that folder.

## Printing

Select notes and choose **🖨 Print** (or Print on a single note). Google Docs are combined into one PDF; other files come as their own PDFs.

## How it's built

- `index.html`: the whole app (HTML/CSS/JS, no build step). It talks to your server with `fetch` (`{k: key, fn, a: args}`).
- `sw.js`: service worker, which makes the app installable, caches it for fast loading, and receives the Android share sheet.
- `manifest.webmanifest` and `icons/`: install metadata.
- `server/`: the Google Apps Script backend (`doPost` API in `Batch.gs`).

## Planned

- One shared server for several people, plus two-way sharing between ArNotes users.
