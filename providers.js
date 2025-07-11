// providers.js

class ProviderA {
  constructor() {
    this.name = "ProviderA";
  }

  async send({ to, subject, body }) {
    // Simulate random failure
    if (Math.random() < 0.2) throw new Error("ProviderA failed");
    return true;
  }
}

class ProviderB {
  constructor() {
    this.name = "ProviderB";
  }

  async send({ to, subject, body }) {
    // Simulate random failure
    if (Math.random() < 0.2) throw new Error("ProviderB failed");
    return true;
  }
}

module.exports = { ProviderA, ProviderB };
