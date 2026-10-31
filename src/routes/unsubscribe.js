import { Hono } from 'hono';
import { escapeHtml, verifyUnsubscribeToken } from '../utils/reminder-emails.js';

/**
 * Reminder-email unsubscribe.
 *   GET  /unsubscribe?u={userId}&t={token}  -> confirm page with a button
 *   POST /unsubscribe?u={userId}&t={token}  -> sets users.reminder_emails_off = 1
 * The POST takes no CSRF token on purpose so RFC 8058 one-click
 * (List-Unsubscribe-Post) works; the HMAC token is the authorization.
 */
const unsubscribe = new Hono();

/** Strip the query string (user id + token) from /unsubscribe request-log lines. */
export function redactLogLine(line) {
  return String(line).replace(/(\/unsubscribe)\?\S*/g, '$1');
}

function page(title, bodyHtml, status = 200) {
  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>${escapeHtml(title)} - HappyGotchaDays</title>
  <style>
    body { font-family: 'Nunito', Arial, sans-serif; background: #FFF8E7; color: #2D3436; text-align: center; padding: 60px 20px; }
    main { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 32px; }
    button { background: #FF6B6B; color: #fff; border: 0; border-radius: 999px; padding: 12px 28px; font-size: 1rem; font-weight: 700; cursor: pointer; }
    a { color: #E05555; }
  </style>
</head>
<body><main>${bodyHtml}</main></body>
</html>`, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

const invalidPage = () => page(
  'Link not valid',
  `<h1>This link isn't valid</h1>
   <p>The unsubscribe link may be incomplete. Try copying the whole link from the email.</p>
   <p><a href="/">Back to HappyGotchaDays</a></p>`,
  400
);

async function checkToken(c) {
  const userId = c.req.query('u') || '';
  const token = c.req.query('t') || '';
  const ok = await verifyUnsubscribeToken(userId, token, c.env.JWT_SECRET);
  return { ok, userId, token };
}

unsubscribe.get('/', async (c) => {
  const { ok, userId, token } = await checkToken(c);
  if (!ok) return invalidPage();
  const action = `/unsubscribe?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(token)}`;
  return page(
    'Unsubscribe',
    `<h1>Stop gotcha day reminder emails?</h1>
     <p>You won't get reminder emails from HappyGotchaDays any more. Your account and pets stay as they are.</p>
     <form method="POST" action="${escapeHtml(action)}">
       <button type="submit">Unsubscribe</button>
     </form>`
  );
});

unsubscribe.post('/', async (c) => {
  const { ok, userId } = await checkToken(c);
  if (!ok) return invalidPage();

  // One atomic statement; nothing about the request is logged here.
  await c.env.DB.prepare('UPDATE users SET reminder_emails_off = 1 WHERE id = ?').bind(userId).run();

  return page(
    'Unsubscribed',
    `<h1>You're unsubscribed</h1>
     <p>You won't get gotcha day reminder emails any more.</p>
     <p><a href="/">Back to HappyGotchaDays</a></p>`
  );
});

export { unsubscribe as unsubscribeRoutes };
