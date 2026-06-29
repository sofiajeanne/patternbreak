# Pattern Break signup backend

This folder contains the Google Apps Script backend for the placeholder signup form on `patternbreak.social`.

## What it does

When someone submits the homepage form, the script:

1. Appends a row to a Google Sheet named `Signups`.
2. Sends an email notification to Sof.

Collected fields:

- Name
- Email
- Phone number
- Source
- Page URL
- Submission timestamp

## Setup

1. Create a Google Sheet for Pattern Break signups.
2. Copy the spreadsheet ID from its URL:

   ```text
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

3. Create a new Apps Script project:

   https://script.google.com/

4. Paste `Code.gs` into the Apps Script editor.
5. In Apps Script, go to **Project Settings → Script properties** and add:

   - `SHEET_ID`: the spreadsheet ID from step 2
   - `NOTIFICATION_EMAIL`: `sofiajeannecaring@gmail.com`

6. Deploy it:

   - **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - Copy the Web app URL ending in `/exec`

7. Paste that URL into `config.js`:

   ```js
   window.PATTERNBREAK_SIGNUP_ENDPOINT = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```

8. Open the site locally or live, submit a test signup, and confirm:

   - A row appears in the Google Sheet.
   - Sof receives the notification email.

## Notes

- The homepage uses `fetch(..., { mode: "no-cors" })` because Apps Script web apps do not reliably support browser preflight requests from arbitrary static sites.
- The frontend shows an optimistic success message after the request is sent.
- There is a simple honeypot field named `website` to reduce bot spam.
- Do not commit private credentials. The Apps Script Web App URL is okay to publish for this use case, but rotate/redeploy it if spam becomes an issue.
