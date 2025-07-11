// demo.js

const express = require("express");
const bodyParser = require("body-parser");
const EmailService = require("./emailService");

const app = express();
const PORT = process.env.PORT || 3000;

// Required to parse JSON in POST body
app.use(bodyParser.json());

// Initialize your email service
const emailService = new EmailService();

// Correctly define the route
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body, messageId } = req.body;

    if (!to || !subject || !body || !messageId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const result = await emailService.sendEmail({ to, subject, body, messageId });

    return res.status(200).json({
      message: "Email processed",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
