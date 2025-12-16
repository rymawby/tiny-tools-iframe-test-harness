# iframe-post-message-harness

A tiny, static harness to test `postMessage` interactions between a host page and an embedded iframe. Built quickly with a bit of help from AI.

## What it does
- Lets you load any iframe URL (defaults to the bundled `receiver.html`).
- Send structured messages from the host page to the iframe.
- See acknowledgements from the iframe and inspect payloads in DevTools.

## Run it locally
1. Serve the folder (for example: `python -m http.server 8000`).
2. Open `http://localhost:8000` (or the path your server reports).
3. Set the iframe URL if you want to target another page, then click **Load iframe**.
4. Type a message, set `targetOrigin` (auto-filled for full URLs), and click **Send to iframe**.

## Files
- `index.html` — host UI with message form, iframe loader, and status.
- `receiver.html` — sample iframe that echoes and acknowledges messages.
- `main.js` — wiring for load/send/reset and postMessage handling.
- `styles.css` — light theme aligned with rymawby.com palette.

## Notes
- If Chrome logs `runtime.lastError: The message port closed before a response was received`, it’s usually an extension warning; try incognito with extensions off.
- When loading external iframes, ensure the origin is reachable and set `targetOrigin` appropriately (the loader auto-fills it when parsing the URL).***
