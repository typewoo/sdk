# @typewoo/sdk

A modern, TypeScript-first SDK for integrating with the **WooCommerce Store API**. Build headless or decoupled WooCommerce storefronts with full type safety.

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
Typewoo.init({
  baseUrl: 'https://your-store.com',
});

// Access store services
const products = await sdk.store.products.getProducts();
const cart = await sdk.store.cart.get();
```
