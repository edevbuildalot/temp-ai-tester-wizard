import sgMail from "@sendgrid/mail";

const sendgridApiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

export function sendConfirmationEmail(to: string): void {
  if (!sendgridApiKey || !fromEmail) {
    console.log("[SENDGRID] Skipping email — missing SENDGRID_API_KEY or SENDGRID_FROM_EMAIL");
    return;
  }

  sgMail
    .send({
      to,
      from: fromEmail,
      subject: "You're on the waitlist — Temp AI Tester Wizard",
      text: `Thanks for joining the waitlist!\n\nWe'll let you know as soon as Temp AI Tester Wizard is ready.\n\n— The TATW Team`,
      html: `<p>Thanks for joining the waitlist!</p><p>We'll let you know as soon as Temp AI Tester Wizard is ready.</p><p>— The TATW Team</p>`,
    })
    .then(() => {
      console.log(`[SENDGRID] Confirmation sent to ${to}`);
    })
    .catch((err) => {
      console.error(`[SENDGRID] Failed to send to ${to}:`, err);
    });
}