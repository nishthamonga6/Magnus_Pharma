// Optional mail sender using nodemailer. Configure via env vars:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM

export async function sendLoginNotification(to: string, name?: string) {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.EMAIL_FROM || user
  if (!host || !port || !user || !pass) {
    // No SMTP configured — skip silently
    console.log('SMTP not configured; skipping login notification')
    return false
  }

  try {
    // dynamic require so app doesn't crash if nodemailer missing
    // (you should run `npm install nodemailer` to enable this)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: { user, pass }
    })

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'New sign-in to Magnus Pharma',
      text: `Hello ${name || ''},\n\nYou have successfully signed in to Magnus Pharma. If this wasn't you, please contact support.`,
      html: `<p>Hello ${name || ''},</p><p>You have <strong>successfully signed in</strong> to Magnus Pharma. If this wasn't you, please contact support.</p>`
    })
    console.log('Login notification sent', info.messageId)
    return true
  } catch (err: any) {
    console.warn('Failed to send login notification:', err?.message || err)
    return false
  }
}
