// providers.js

class ProviderA {
  constructor() {
    this.name = "ProviderA";
  }

  async send(email) {
    if (Math.random() < 0.7) return true;
    throw new Error("ProviderA failed");
  }
}

class ProviderB {
  constructor() {
    this.name = "ProviderB";
  }

  async send(email) {
    if (Math.random() < 0.8) return true;
    throw new Error("ProviderB failed");
  }
}

module.exports = { ProviderA, ProviderB };
