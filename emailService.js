// emailService.js

const { ProviderA, ProviderB } = require("./providers");

class EmailService {
  constructor(providers) {
    this.providers = providers;
    this.idempotencyMap = new Map();
    this.rateLimitCount = 0;
    this.rateLimitMax = 5;
    this.rateLimitWindow = 10000;
    this.queue = [];
    this.circuitBreaker = new Map();

    setInterval(() => this.resetRateLimit(), this.rateLimitWindow);
  }

  resetRateLimit() {
    this.rateLimitCount = 0;
    this.processQueue();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendEmail(email) {
    if (this.idempotencyMap.has(email.idempotencyKey)) {
      return this.idempotencyMap.get(email.idempotencyKey);
    }

    if (this.rateLimitCount >= this.rateLimitMax) {
      this.queue.push(email);
      return { status: "pending", attempts: 0 };
    }

    this.rateLimitCount++;
    const status = { status: "failed", attempts: 0 };

    for (let provider of this.providers) {
      const breaker = this.circuitBreaker.get(provider.name);

      if (breaker?.open && Date.now() < breaker.retryAfter) {
        continue;
      }

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          status.attempts++;
          const sent = await provider.send(email);
          if (sent) {
            status.status = "sent";
            status.lastProvider = provider.name;
            this.idempotencyMap.set(email.idempotencyKey, status);
            return status;
          }
        } catch (err) {
          status.error = err.message;
          await this.delay(2 ** attempt * 100);
        }
      }

      this.circuitBreaker.set(provider.name, {
        open: true,
        retryAfter: Date.now() + 60000,
      });
    }

    this.idempotencyMap.set(email.idempotencyKey, status);
    return status;
  }

  async processQueue() {
    while (this.queue.length > 0 && this.rateLimitCount < this.rateLimitMax) {
      const email = this.queue.shift();
      if (email) await this.sendEmail(email);
    }
  }
}

module.exports = EmailService;
