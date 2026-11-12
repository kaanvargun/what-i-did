# what-i-did
> [Türkçe](README.tr.md)

A Claude Code plugin that writes **WHAT-I-DID.md** to your project root when a project is done, so that
someone with little technical background can explain the project to others: completely, with the right
terms, and honestly. Works for web apps, game ports, APK modding, reverse engineering, Raspberry Pi /
device setups and more.

## Install
In a terminal (or inside Claude Code with a leading `/`):
```bash
claude plugin marketplace add kaanvargun/what-i-did
claude plugin install what-i-did@what-i-did
```
Open a new session and type `/what-i-did`. By default the plugin is active in every project on this
computer; add `--scope project` to enable it for one project only.

Uninstall:
```bash
claude plugin uninstall what-i-did@what-i-did
claude plugin marketplace remove what-i-did
```
Update: `claude plugin marketplace update what-i-did`

## Usage
```
/what-i-did                 # current folder
/what-i-did apps/MyProject  # another folder
/what-i-did --dil=tr        # force a language (default: the language you talk to Claude in)
/what-i-did --kisa          # read fewer notes on very large projects
```
If WHAT-I-DID.md already exists it is not rewritten; only sections affected by files changed since the
last write are updated.

## Document sections (fixed order)
1 In one sentence · 2 What we built · 3 How it works (diagram) · 4 File map · 5 End-to-end flow ·
6 Glossary (only terms used in the project) · 7 Likely questions and answers · 8 Honest limits
(mandatory: built with AI / Claude Code and the user's role, what was not tested, what is estimated) ·
9 Sources and licenses · 10 Commands (rebuild / publish)

## Why it is cheap on tokens
- The model does **not** read your code. `skills/what-i-did/scripts/ozet.mjs` scans the folder locally
  (no tokens) and prints one short digest: project type guess, git history, TODO/CLAUDE/MAP/README notes,
  a collapsed file tree, license files, and **only the glossary entries that match the project**.
- The glossary files are never sent whole; the script picks matching lines.
- Only the relevant project-type template is read (web, cihaz = device, apk, re, oyun = game).
- Updates edit only the affected sections.
- Fixed cost per session: the skill's one-line description. The hook is off by default.
- Example: a ~1300-file project produced a ~16 KB digest; the main cost is writing the document itself.

## Optional reminder (OFF by default)
If files were edited in a session, shows one line once per session: "WHAT-I-DID güncellensin mi?"
(update WHAT-I-DID?). Nothing is sent to the model (0 tokens). Enable in `~/.claude/settings.json`:
```json
{ "env": { "WHAT_I_DID_HATIRLAT": "1" } }
```

## Layout
```
.claude-plugin/plugin.json        plugin manifest
.claude-plugin/marketplace.json   marketplace catalog (install from GitHub or a local folder)
commands/what-i-did.md            /what-i-did command (calls the skill)
skills/what-i-did/SKILL.md        instructions
skills/what-i-did/scripts/ozet.mjs  local digest builder (needs Node.js)
skills/what-i-did/templates/      skeleton + per-type templates (section hints, FAQs)
skills/what-i-did/glossary/       glossary (genel=general, web, linux, android, re, oyun=game)
hooks/hooks.json, hatirlat.mjs    optional reminder
```
Templates and glossary are written in Turkish; Claude translates them when the document language is
different. Contributions in other languages are welcome.

## Adding a glossary term
One line in `glossary/<topic>.md`:
```
- Term | key1,key2,.ext | One or two plain sentences. | Analogy.
```
Keys starting with `.` are file extensions; others are searched (lower-case) in file names and contents.

## Requirements
Node.js 18+ (for the digest script and the hook).

## License
MIT
