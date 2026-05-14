
# HTTP | Jitar Plugins

This package provides plugins for integrating the HTTP protocol in Jitar applications.

It contains two types of middleware:

* **CORS** - configures cross-origin requests.
* **Origin** - ensures the availability of the origin header.

Both can be used independently.

## Installation

```bash
npm install @jitar-plugins/http
```

## Usage

Follow the following steps to configure and use the middleware.

### Step 1 - Configure the middleware

**CORS**

```ts
// src/middleware/corsMiddleware.ts

import { CorsMiddleware } from '@jitar-plugins/http';

const origin = '*'; // allowed origins (optional, default: *)
const headers = '*'; // allowed headers (optional, default: *)

export default new CorsMiddleware(origin, headers);
```

**Origin**

```ts
// src/middleware/originMiddleware.ts

import { OriginMiddleware } from '@jitar-plugins/http';

const options = {
    path: '/', // the path the cookie is valid for (optional, default: '/')
    sameSite: 'None', // the SameSite attribute of the cookie (optional, default: 'Strict')
    secure: true // the Secure attribute of the cookie (optional, default: true)
};

export default new OriginMiddleware(options);
```

### Step 2 - Activate the middleware

With the middleware in place, it needs to be activated by registering it to the proxy / standalone / worker service.

```json
/* services/proxy.json */
{
    "url": "http://example.com:3000",
    "middleware": [ /* add middleware here */
        "./middleware/corsMiddleware",
        "./middleware/originMiddleware"
    ],
    "proxy":
    {
        /* service configuration */
    }
}
```
