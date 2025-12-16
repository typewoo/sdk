# @typewoo/sdk

A modern, TypeScript-first SDK for integrating with the **WooCommerce Store API**. Build headless or decoupled WooCommerce storefronts with full type safety.

## 📚 Documentation

For full documentation, guides, and API reference, visit **[typewoo.dev](https://typewoo.dev)**.

## ✨ Features

- 📦 Easy-to-use API for WooCommerce Store endpoints (products, cart, checkout, orders)
- 🔐 Supports both guest and authenticated users
- 🔄 Built-in interceptors for nonce, cart token, and JWT authentication
- 🛠️ Fully typed responses powered by TypeScript
- ⚡ Event-driven core with custom EventBus
- ⚙️ Built with modern tooling (Nx, Vitest, Pure ESM)

## 📦 Installation

```bash
npm install @typewoo/sdk axios qs zod
```

## 🚀 Quick Start

```typescript
import { Typewoo } from '@typewoo/sdk';

// Initialize the SDK
const sdk = Typewoo.init({
  baseUrl: 'https://your-store.com',
});

// Access store services
const products = await sdk.store.products.list();
const cart = await sdk.store.cart.get();
```

## 📖 Learn More

- [Getting Started](https://typewoo.dev/getting-started)
- [Configuration](https://typewoo.dev/configuration)
- [Authentication](https://typewoo.dev/authentication)
- [API Reference](https://typewoo.dev/api-reference/client)

## 📄 License

MIT

## ⚠️ Disclaimer

This project is **not affiliated with, endorsed by, or officially connected to WooCommerce, Automattic, or WordPress**. WooCommerce® is a registered trademark of Automattic Inc. This is an independent, community-driven SDK that interacts with the WooCommerce Store API.
