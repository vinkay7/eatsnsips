// =============================================================================
//  api/contact.js  —  Vercel Serverless Function
//  Handles the contact form: sends a notification to the host and a
//  confirmation receipt to the visitor.
// =============================================================================
//
//  ── HOW TO SET ENVIRONMENT VARIABLES ON VERCEL ──────────────────────────────
//
//  1. Open your project in the Vercel dashboard.
//  2. Go to  Project → Settings → Environment Variables.
//  3. Add the following two variables (all environments: Production, Preview,
//     Development):
//
//     Name          Value
//     ──────────    ────────────────────────────────────────────────────────────
//     EMAIL_USER    The Gmail address Nodemailer will send FROM.
//                   e.g.  yourname@gmail.com
//
//     EMAIL_PASS    A Gmail App Password (NOT your regular Google password).
//                   Steps to generate one:
//                     a) Enable 2-Step Verification on your Google account at
//                        https://myaccount.google.com/security
//                     b) Visit https://myaccount.google.com/apppasswords
//                     c) Create an app password (e.g. name it "Vercel Nodemailer")
//                     d) Paste the 16-character code as the value here.
//
//  4. Re-deploy after saving the variables so the function picks them up.
// =============================================================================

'use strict';

const nodemailer = require('nodemailer');
const fs         = require('fs');
const path       = require('path');

// The address that receives new-message notifications.
const HOST_EMAIL = 'eatsnsipsafrica@gmail.com';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Reads an HTML template file and replaces every {{key}} token found in the
 * `replacements` map.  All occurrences are replaced (not just the first).
 *
 * @param {string} templatePath  Absolute path to the .html template file.
 * @param {Object} replacements  { token_name: 'replacement value', … }
 * @returns {string}             Populated HTML string.
 */
function buildEmailHtml(templatePath, replacements) {
  let html = fs.readFileSync(templatePath, 'utf-8');

  for (const [key, value] of Object.entries(replacements)) {
    // Escape any regex special chars in the value before inserting
    const safeValue = String(value).replace(/&/g, '&amp;')
                                   .replace(/</g, '&lt;')
                                   .replace(/>/g, '&gt;');
    html = html.split(`{{${key}}}`).join(safeValue);
  }

  return html;
}

/**
 * Returns a human-readable, timezone-aware date/time string.
 * Example: "Saturday, 4 July 2026 at 11:32 AM WAT"
 *
 * @returns {string}
 */
function formatSubmissionDate() {
  return new Date().toLocaleString('en-GB', {
    weekday:    'long',
    year:       'numeric',
    month:      'long',
    day:        'numeric',
    hour:       '2-digit',
    minute:     '2-digit',
    timeZoneName: 'short',
  });
}

// ── Main handler ─────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { visitor_name, visitor_email, visitor_message } = req.body || {};

  // Validate that all three fields are present and non-empty
  if (!visitor_name || !visitor_email || !visitor_message) {
    return res.status(400).json({
      error: 'Missing required fields: visitor_name, visitor_email, visitor_message',
    });
  }

  const submission_date = formatSubmissionDate();

  const replacements = {
    visitor_name,
    visitor_email,
    visitor_message,
    submission_date,
  };

  // Vercel sets process.cwd() to the project root, so templates placed at the
  // project root are always reachable via this path pattern.
  const projectRoot        = process.cwd();
  const hostTemplatePath   = path.join(projectRoot, 'host_email.html');
  const visitorTemplatePath = path.join(projectRoot, 'visitor_email.html');

  // Build HTML bodies — catch missing template files before we hit the network
  let hostHtml, visitorHtml;
  try {
    hostHtml    = buildEmailHtml(hostTemplatePath, replacements);
    visitorHtml = buildEmailHtml(visitorTemplatePath, replacements);
  } catch (err) {
    console.error('[contact] Failed to read email templates:', err.message);
    return res.status(500).json({ error: 'Failed to load email templates.' });
  }

  // Create a Nodemailer transporter backed by Gmail + App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // ── Email 1: Host notification ───────────────────────────────────────────
    await transporter.sendMail({
      from:    `"Eats N Sips Contact Form" <${process.env.EMAIL_USER}>`,
      to:      HOST_EMAIL,
      subject: `📬 New Message from ${visitor_name}`,
      html:    hostHtml,
      // Plain-text fallback for mail clients that block HTML
      text: [
        `New contact form submission`,
        `───────────────────────────`,
        `Name   : ${visitor_name}`,
        `Email  : ${visitor_email}`,
        `Date   : ${submission_date}`,
        ``,
        `Message:`,
        visitor_message,
      ].join('\n'),
    });

    // ── Email 2: Visitor confirmation ────────────────────────────────────────
    await transporter.sendMail({
      from:    `"Eats N Sips" <${process.env.EMAIL_USER}>`,
      to:      visitor_email,
      subject: `✅ We received your message, ${visitor_name}!`,
      html:    visitorHtml,
      text: [
        `Hi ${visitor_name},`,
        ``,
        `Thank you for reaching out to Eats N Sips!`,
        `We've received your message and will get back to you soon.`,
        ``,
        `Your message:`,
        `"${visitor_message}"`,
        ``,
        `Received: ${submission_date}`,
        ``,
        `With warmth & good food vibes,`,
        `The Eats N Sips Team`,
        `https://eatsnsips.vercel.app`,
      ].join('\n'),
    });

    return res.status(200).json({
      success: true,
      message: 'Emails sent successfully.',
    });

  } catch (err) {
    console.error('[contact] Failed to send email:', err.message);
    return res.status(500).json({
      error: 'Failed to send emails. Please try again later.',
    });
  }
};
