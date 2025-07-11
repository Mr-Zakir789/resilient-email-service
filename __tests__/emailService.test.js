const EmailService = require("../emailService");
const { ProviderA, ProviderB } = require("../providers");

describe("EmailService", () => {
  let service;
  let intervalId;

  beforeEach(() => {
    service = new EmailService([new ProviderA(), new ProviderB()]);
  });

afterEach(() => {
    jest.clearAllTimers(); // Clear background timers after each test
  });

  test("should send email successfully using a provider", async () => {
    const email = {
      to: "test@example.com",
      subject: "Hello",
      body: "This is a test",
      idempotencyKey: "test-email-1",
    };

    const result = await service.sendEmail(email);
    expect(result.status).toBe("sent");
    expect(result.attempts).toBeGreaterThan(0);
    expect(result.lastProvider).toBeDefined();
  });

  test("should prevent duplicate sends via idempotency", async () => {
    const email = {
      to: "duplicate@example.com",
      subject: "Test Idempotency",
      body: "Don't resend this.",
      idempotencyKey: "idempotent-test",
    };

    const first = await service.sendEmail(email);
    const second = await service.sendEmail(email);

    expect(second).toEqual(first);
  });

  test("should queue when rate limit is hit", async () => {
    const emails = Array.from({ length: 7 }, (_, i) => ({
      to: `user${i}@mail.com`,
      subject: "Rate Limit",
      body: "Testing",
      idempotencyKey: `email-${i}`,
    }));

    const results = await Promise.all(
      emails.map((email) => service.sendEmail(email))
    );

    const pending = results.filter((r) => r.status === "pending");
    expect(pending.length).toBeGreaterThan(0);
  });
});
