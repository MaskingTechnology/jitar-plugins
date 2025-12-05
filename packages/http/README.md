
# HTTP | Jitar Plugins

This package provides plugins for integrating the HTTP protocol in Jitar applications.

It contains a single middleware for ensuring the avaiability of the origin header.

## Installation

```bash
npm install @jitar-plugins/http
```

## Usage

Follow the following steps to configure and use the provided middleware.

### Step 1 - Configure the middleware

```ts
// src/middleware/originMiddleware.ts

import OriginMiddleware from '@jitar-plugins/http';

export default new OriginMiddleware();
```

### Step 2 - Activate the middleware

With the health check in place, it needs to be activated by registering it to the proxy / standalone / worker service.

```json
/* services/proxy.json */
{
    "url": "http://example.com:3000",
    "middleware": [ /* add middleware here */
        "./middleware/originMiddleware"
    ],
    "proxy":
    {
        /* service configuration */
    }
}
```
