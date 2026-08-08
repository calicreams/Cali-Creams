const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

function clean(value) {
  return String(value || "").replace(/[<>]/g, "").trim();
}

app.post("/api/contact", async (req, res) => {
  try {
    const name = clean(req.body.name);
    const email = clean(req.body.email);
    const phone = clean(req.body.phone);
    const heardAbout = clean(req.body.heardAbout);
    const message = clean(req.body.message);

    if (!name || !email || !message) {
      return res.status(400).json({
        ok: false,
        message: "Please provide name, email, and message."
      });
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
      from: `Cali Creams Website <${fromEmail}>`,
      replyTo: email,
      to: toEmail,
      subject: `New Cali Creams inquiry from ${name}`,
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

    return res.json({
      ok: true,
      message: "Your message was sent successfully."
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      ok: false,
      message: "We could not send your message right now. Please try again soon."
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Cali Creams is running on http://localhost:${port}`);
});
