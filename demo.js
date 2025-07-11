// demo.js

const express = require("express");
const bodyParser = require("body-parser");
const EmailService = require("./emailService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Initialize email service (no need to pass providers, they're set by default)
const emailService = new EmailService();

// POST /send-email route
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body, messageId } = req.body;

    if (!to || !subject || !body || !messageId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const result = await emailService.sendEmail({ to, subject, body, messageId });

    res.status(200).json({
      message: "Email processed",
      result,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
