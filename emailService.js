// emailService.js

const { ProviderA, ProviderB } = require("./providers");

class EmailService {
  constructor(providers = [new ProviderA(), new ProviderB()]) {
    this.providers = providers;
    this.sentMessages = new Set(); // for idempotency
    this.statusMap = new Map();    // for tracking
    this.rateLimit = 5;            // max emails per window
    this.windowTime = 60000;       // 1 minute
    this.queue = [];
    this.sentCount = 0;

    // Reset rate counter every window
    setInterval(() => {
      this.sentCount = 0;
      this.processQueue();
    }, this.windowTime);
  }

  async sendEmail(email) {
    const { messageId } = email;

    if (this.sentMessages.has(messageId)) {
      return { status: "duplicate", provider: null };
    }

    if (this.sentCount >= this.rateLimit) {
      this.queue.push(email);
      return { status: "queued", provider: null };
    }

    for (const provider of this.providers) {
      try {
        const result = await provider.send(email);
        this.sentMessages.add(messageId);
        this.statusMap.set(messageId, { status: "success", provider: provider.name });
        this.sentCount++;
        return { status: "success", provider: provider.name };
      } catch (err) {
        console.log(`⚠️ ${provider.name} failed. Trying next...`);
      }
    }

    this.statusMap.set(messageId, { status: "failed", provider: null });
    return { status: "failed", provider: null };
  }

  async processQueue() {
    while (this.queue.length > 0 && this.sentCount < this.rateLimit) {
      const email = this.queue.shift();
      await this.sendEmail(email);
    }
  }
}

module.exports = EmailService;
