# 📧 Resilient Email Sending Service (JavaScript)

This is a simulated email delivery system built using plain JavaScript. It demonstrates how to build a fault-tolerant service with retry logic, provider fallback, rate limiting, circuit breakers, idempotency, and a basic queue.

---

## 🚀 Features

- ✅ Retry with exponential backoff (3 attempts per provider)
- ✅ Fallback between ProviderA and ProviderB
- ✅ Idempotency using `idempotencyKey`
- ✅ Basic rate limiting (5 emails per 10 seconds)
- ✅ Queue to delay and retry overflowed emails
- ✅ Circuit breaker for unstable providers (60s cooldown)
- ✅ Tracks email sending status and logs it

---

## 📁 Project Structure

