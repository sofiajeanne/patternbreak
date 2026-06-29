# patternbreak

Placeholder homepage for [patternbreak.social](https://patternbreak.social/).

## Files

- `index.html` — one-page placeholder homepage and signup form
- `styles.css` — responsive visual styling
- `submit.js` — form submission behavior
- `config.js` — live Google Apps Script endpoint placeholder
- `config.example.js` — example endpoint format
- `google-apps-script/Code.gs` — Google Sheet + email notification backend
- `google-apps-script/README.md` — setup instructions

## Local preview

```bash
python3 -m http.server 5173
open http://127.0.0.1:5173/
```

## Activating the form

The form needs a deployed Google Apps Script web app URL before it can receive signups. See `google-apps-script/README.md`.
