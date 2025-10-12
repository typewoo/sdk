# NestJS WordPress Proxy

This NestJS application acts as a proxy between client applications and WordPress WooCommerce Store API endpoints. It forwards requests to the WordPress backend and returns responses without requiring direct access to the WordPress installation.

## Features

- **Complete WooCommerce Store API Proxy**: All Store API endpoints are mapped and proxied
- **Header Forwarding**: Automatically forwards authentication, cart tokens, and other relevant headers
- **Error Handling**: Proper error responses and status codes
- **Environment Configuration**: Configurable WordPress backend URL and timeout settings
- **TypeScript Support**: Fully typed with proper error handling

## Prerequisites

- Node.js 20+
- WordPress with WooCommerce installed
- Store SDK WordPress plugin (optional, for authentication features)

## Installation

1. Copy the environment configuration:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your WordPress URL:

   ```env
   WORDPRESS_BASE_URL=https://your-wordpress-site.com
   HTTP_TIMEOUT=30000
   PORT=3000
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Build the application:

   ```bash
   npx nx build nestjs
   ```

5. Start the application:
   ```bash
   npx nx serve nestjs
   ```

## API Endpoints

The application proxies all WooCommerce Store API endpoints under `/wc/store/v1/`:

### Products

- `GET /wc/store/v1/products` - List products
- `GET /wc/store/v1/products/:id` - Get single product
- `GET /wc/store/v1/products/categories` - List categories
- `GET /wc/store/v1/products/categories/:id` - Get single category
- `GET /wc/store/v1/products/tags` - List product tags
- `GET /wc/store/v1/products/brands` - List product brands
- `GET /wc/store/v1/products/attributes` - List product attributes
- `GET /wc/store/v1/products/attributes/:id/terms` - List attribute terms
- `GET /wc/store/v1/products/reviews` - List product reviews
- `GET /wc/store/v1/products/collection-data` - Get collection metadata

### Cart Management

- `GET /wc/store/v1/cart` - Get current cart
- `POST /wc/store/v1/cart/add-item` - Add item to cart
- `POST /wc/store/v1/cart/update-item` - Update cart item
- `POST /wc/store/v1/cart/remove-item` - Remove cart item
- `GET /wc/store/v1/cart/items` - List cart items
- `GET /wc/store/v1/cart/items/:key` - Get single cart item
- `POST /wc/store/v1/cart/items` - Add cart item
- `PUT /wc/store/v1/cart/items/:key` - Update cart item
- `DELETE /wc/store/v1/cart/items/:key` - Delete cart item

### Cart Coupons

- `GET /wc/store/v1/cart/coupons` - List cart coupons
- `GET /wc/store/v1/cart/coupons/:code` - Get single coupon
- `POST /wc/store/v1/cart/coupons` - Add coupon to cart
- `DELETE /wc/store/v1/cart/coupons/:code` - Remove coupon from cart

### Checkout

- `GET /wc/store/v1/checkout` - Get checkout data
- `PUT /wc/store/v1/checkout` - Update checkout data
- `POST /wc/store/v1/checkout` - Process order and payment
- `POST /wc/store/v1/checkout/:orderId` - Process specific order

### Orders

- `GET /wc/store/v1/order/:orderId` - Get order details

### Batch Operations

- `POST /wc/store/v1/batch` - Perform batch operations

## Usage Examples

### Get Products

```bash
curl http://localhost:3000/wc/store/v1/products?per_page=10
```

### Add Item to Cart

```bash
curl -X POST http://localhost:3000/wc/store/v1/cart/add-item \\
  -H "Content-Type: application/json" \\
  -d '{"id": 123, "quantity": 2}'
```

### Get Cart with Authentication

```bash
curl http://localhost:3000/wc/store/v1/cart \\
  -H "Authorization: Bearer your-jwt-token" \\
  -H "cart-token: your-cart-token"
```

## Header Forwarding

The proxy automatically forwards these headers to WordPress:

- `authorization`
- `cart-token`
- `content-type`
- `accept`
- `user-agent`
- `x-forwarded-for`
- `x-real-ip`

## Error Handling

All errors from the WordPress API are properly forwarded with the correct status codes. If the WordPress backend is unreachable, appropriate error responses are returned.

## Development

### Project Structure

```
src/
├── app/
│   ├── controllers/
│   │   └── store/
│   │       ├── products/        # Product-related controllers
│   │       ├── cart/           # Cart-related controllers
│   │       ├── checkout/       # Checkout controllers
│   │       ├── order.controller.ts
│   │       ├── batch.controller.ts
│   │       └── index.store.controller.ts
│   ├── services/
│   │   └── wordpress-http.service.ts  # HTTP client service
│   ├── app.controller.ts
│   ├── app.module.ts
│   └── app.service.ts
└── main.ts
```

### Adding New Endpoints

1. Create a new controller in the appropriate directory
2. Implement the endpoint methods using the `WordPressHttpService`
3. Register the controller in `app.module.ts`

### Testing

The proxy can be tested with any HTTP client or by using the Store SDK:

```typescript
import { StoreSdk } from '@store-sdk/core';

await StoreSdk.init({
  baseUrl: 'http://localhost:3000', // Point to the NestJS proxy
});

// All Store SDK methods will now use the proxy
const { data: products } = await StoreSdk.store.products.list();
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Configure your production WordPress URL in `WORDPRESS_BASE_URL`
3. Build and run the application:
   ```bash
   npx nx build nestjs --configuration=production
   npx nx serve nestjs --configuration=production
   ```

## Configuration

### Environment Variables

| Variable             | Default                 | Description                     |
| -------------------- | ----------------------- | ------------------------------- |
| `WORDPRESS_BASE_URL` | `http://localhost:8080` | WordPress backend URL           |
| `HTTP_TIMEOUT`       | `30000`                 | Request timeout in milliseconds |
| `PORT`               | `3000`                  | Application port                |
| `NODE_ENV`           | `development`           | Application environment         |

### CORS

The application inherits CORS settings from your WordPress installation. If you need custom CORS settings, configure them in the WordPress Store SDK plugin.
