const nodemailer = require("nodemailer");

function clean(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        message: "Method not allowed"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const heardAbout = clean(body.heardAbout);
    const message = clean(body.message);

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ok: false,
          message: "Please provide name, email, and message."
        })
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE) === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const toEmail = process.env.TO_EMAIL || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `Cream Cali Website <${fromEmail}>`,
      replyTo: email,
      to: toEmail,
      subject: `New Cream Cali inquiry from ${name}`,
      text: [
        "New contact form submission",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "N/A"}`,
        `How they heard about us: ${heardAbout || "N/A"}`,
        "",
        "Message:",
        message
      ].join("\n"),
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>How they heard about us:</strong> ${heardAbout || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        message: "Your message was sent successfully."
      })
    };
  } catch (error) {
    console.error("Netlify contact function error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        message: "We could not send your message right now. Please try again soon."
      })
    };
  }
};
