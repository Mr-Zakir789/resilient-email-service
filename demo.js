// demo.js

const express = require("express");
const bodyParser = require("body-parser");
const EmailService = require("./emailService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Initialize the email service
const emailService = new EmailService();

// Route to handle POST /send-email
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, body, messageId } = req.body;

    // Validate required fields
    if (!to || !subject || !body || !messageId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Send email via EmailService
    const result = await emailService.sendEmail({ to, subject, body, messageId });

    return res.status(200).json({
      message: "Email processed",
      result,
    });
  } catch (error) {
    console.error("❌ Error in /send-email:", error.message);
    return res.status(500).json({
      error: "Failed to process email",
      details: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
