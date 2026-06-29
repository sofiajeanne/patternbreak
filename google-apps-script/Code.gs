function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const props = PropertiesService.getScriptProperties();
    const sheetId = props.getProperty('SHEET_ID');
    const notificationEmail = props.getProperty('NOTIFICATION_EMAIL') || 'sofiajeannecaring@gmail.com';

    if (!sheetId) {
      throw new Error('Missing SHEET_ID script property.');
    }

    const params = e.parameter || {};
    const now = new Date();
    const name = clean_(params.name);
    const email = clean_(params.email);
    const phone = clean_(params.phone);
    const source = clean_(params.source || 'patternbreak.social');
    const page = clean_(params.page || '');
    const submittedAt = clean_(params.submittedAt || now.toISOString());

    if (!name || !email || !phone) {
      return json_({ ok: false, error: 'Name, email, and phone are required.' }, 400);
    }

    if (params.website) {
      return json_({ ok: true, skipped: true });
    }

    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName('Signups') || spreadsheet.insertSheet('Signups');
    ensureHeader_(sheet);

    sheet.appendRow([
      now,
      submittedAt,
      name,
      email,
      phone,
      source,
      page,
      (e.postData && e.postData.type) || '',
    ]);

    MailApp.sendEmail({
      to: notificationEmail,
      subject: `New Pattern Break signup: ${name}`,
      htmlBody: `
        <p>New Pattern Break signup from <strong>${escapeHtml_(name)}</strong>.</p>
        <ul>
          <li><strong>Name:</strong> ${escapeHtml_(name)}</li>
          <li><strong>Email:</strong> ${escapeHtml_(email)}</li>
          <li><strong>Phone:</strong> ${escapeHtml_(phone)}</li>
          <li><strong>Source:</strong> ${escapeHtml_(source)}</li>
          <li><strong>Page:</strong> ${escapeHtml_(page)}</li>
          <li><strong>Submitted:</strong> ${escapeHtml_(submittedAt)}</li>
        </ul>
      `,
      body: [
        'New Pattern Break signup',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Source: ${source}`,
        `Page: ${page}`,
        `Submitted: ${submittedAt}`,
      ].join('\n'),
    });

    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: String(error) }, 500);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, service: 'patternbreak-signup' });
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    'receivedAt',
    'submittedAt',
    'name',
    'email',
    'phone',
    'source',
    'page',
    'contentType',
  ]);
  sheet.setFrozenRows(1);
}

function clean_(value) {
  return String(value || '').trim().slice(0, 500);
}

function json_(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify({ ...payload, statusCode: statusCode || 200 }))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
