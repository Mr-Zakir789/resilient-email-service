// test.js

const { ProviderA, ProviderB } = require("./providers");
const EmailService = require("./emailService");

const service = new EmailService([new ProviderA(), new ProviderB()]);

(async () => {
  for (let i = 0; i < 10; i++) {
    const email = {
      to: `user${i}@example.com`,
      subject: "Test Email",
      body: "Hello from EmailService",
      idempotencyKey: `email-${i}`,
    };

    const status = await service.sendEmail(email);
    console.log(`Email ${i}:`, status);
  }
})();
