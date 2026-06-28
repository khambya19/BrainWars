const nodemailer = require('nodemailer')
const env = require('../config/env')

function createTransporter() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null // DEV MODE — no transporter; link is logged to console instead
  }

  return nodemailer.createTransport({
    host:   env.SMTP_HOST,
    port:   env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth:   { user: env.SMTP_USER, pass: env.SMTP_PASS },
  })
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const transporter = createTransporter()

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
      <h2 style="color:#FF3D81;margin-bottom:8px">Reset your BrainWars password</h2>
      <p style="color:#6b7488;margin-bottom:24px">
        You requested a password reset. Click the button below within 1 hour.
        If you didn't request this, you can safely ignore this email.
      </p>
      <a href="${resetUrl}"
         style="display:inline-block;background:#FF3D81;color:#fff;font-weight:bold;
                padding:12px 28px;border-radius:12px;text-decoration:none">
        Reset password
      </a>
      <p style="color:#6b7488;font-size:12px;margin-top:24px">
        Or paste this link: <a href="${resetUrl}" style="color:#FF3D81">${resetUrl}</a>
      </p>
    </div>
  `

  if (!transporter) {
    console.log('─────────────────────────────────────────────')
    console.log('[BrainWars/DEV] Password reset link (no SMTP configured):')
    console.log(resetUrl)
    console.log('─────────────────────────────────────────────')
    return
  }

  await transporter.sendMail({
    from:    env.SMTP_FROM,
    to:      toEmail,
    subject: 'Reset your BrainWars password',
    html,
  })
}

module.exports = { sendPasswordResetEmail }
