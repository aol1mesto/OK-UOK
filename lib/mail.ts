import nodemailer from "nodemailer";

type SendMailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
};

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

export async function sendMail(options: SendMailOptions) {
  const from = process.env.SMTP_FROM || "portal@corporate.local";
  const transport = createTransport();
  const recipients = Array.isArray(options.to)
    ? options.to.join(", ")
    : options.to;

  if (!transport || process.env.EMAIL_DEV_FALLBACK === "true") {
    console.info("[mail:dev-fallback]", {
      from,
      to: recipients,
      subject: options.subject,
      text: options.text,
      attachments: options.attachments?.map((item) => item.filename),
    });
    return { accepted: [recipients], messageId: `dev-${Date.now()}` };
  }

  return transport.sendMail({
    from,
    to: recipients,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
  });
}
