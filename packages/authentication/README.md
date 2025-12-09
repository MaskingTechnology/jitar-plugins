
# Authentication | Jitar Plugins

This package provides plugins for integrating the [The Shelf authentication package](https://github.com/MaskingTechnology/theshelf/tree/main/packages/authentication) in Jitar applications.

It contains two types of middleware:

* **Authentication** - server side authentication handling.
* **Requester** - client side authentication handling.

Both are required for the integration.

## Installation

```bash
npm install @theshelf/authentication @jitar-plugins/authentication @jitar-plugins/http
```

## Usage

Follow the following steps to configure and use the provided plugins.

### Step 1 - Configure the middleware

Both types of middleware need to be instantiated with configuration.

The authentication middleware operates on the server side and handles the actual authentication.

```ts
// src/middleware/authenticationMiddleware.ts

import identityProvider from '@theshelf/authentication';
import { AuthenticationMiddleware } from '@jitar-plugins/authentication';

// FQNs to the auth handling procedures
const authProcedures = {
    loginUrl: 'domain/authentication/getLoginUrl',
    login: 'domain/authentication/login',
    logout: 'domain/authentication/logout'
};

// The client path to return to after a succesful login
const redirectPath = '/afterlogin';

const whiteList: string[] = [
    // List of public FQNs
];

export default new AuthenticationMiddleware(identityProvider, authProcedures, redirectPath, whiteList);
```

The requester middleware operates on the client side (web browser) and provides auth informations with every request.

```ts
// src/middleware/requesterMiddleware.ts

import { RequesterMiddleware } from '@jitar-plugins/authentication/client';

// The server provides a session key after login that needs to be captured.
const key = new URLSearchParams(globalThis.location?.search).get('key');
const authorization = key !== undefined ? `Bearer ${key}` : undefined;

export default new RequesterMiddleware(authorization);
```

To make sure the client redirects to the original location after login, we also need a third middleware comming from the http package.

```ts
// src/middleware/originMiddleware.ts

import { OriginMiddleware } from '@jitar-plugins/http';

export default new OriginMiddleware();
```

### Step 2 - Activate the middleware

With the middleware in place, the need to be activated.

For the server side, this means adding the authentication middleware to the service configuration.
This is most likily the proxy / standalone service.

```json
/* services/proxy.json */
{
    "url": "http://example.com:3000",
    "middleware": [ /* add middleware here, in this order */
        "./middleware/originMiddleware",
        "./middleware/authenticationMiddleware"
    ],
    "proxy":
    {
        /* service configuration */
    }
}
```

On the client side, it needs to be added to the Vite configuration.

```ts
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jitar from '@jitar/plugin-vite';

export default defineConfig({
  build: {
    emptyOutDir: false
  },
  plugins: [
    react(),
    jitar({
      sourceDir: 'src',
      targetDir: 'dist',
      jitarDir: 'domain',
      jitarUrl: 'http://localhost:3000',
      segments: [],
      middleware: [ './middleware/requesterMiddleware' ] // Add middleware here
    })
  ]
});
```

### Step 3 - Implement the auth procedures

The authentication middleware refers to three procedures that need to be implemented in the application.

```ts
// src/domain/authentication/getLoginUrl'.ts

export default async function getLoginUrl(): Promise<string>
{
    // The authentication middleware will provide the login url.
    return '';
}
```

```ts
// src/domain/authentication/login'.ts

export default async function login(identity: Identity): Promise<Requester>
{
    // Get the requester data from the given identity.
}
```

```ts
// src/domain/authentication/logout'.ts

export default async function logout(): Promise<void>
{
    // The authentication middleware will handle the logout.
    // Implementent additional logic here.
}
```

### Step 4 - Expose the auth procedures

The procedures need to be exposed publicly to make them acessible.

```json
{
    "./domain/authentication/getLoginUrl": { "default": {  "access": "public" } },
    "./domain/authentication/login": { "default": {  "access": "public" } },
    "./domain/authentication/logout": { "default": {  "access": "public" } }
}
```

### Step 5 - Implement the client redirect path

This path will be called after a succesful login with the session key.

```http
GET http://app.example.com/afterlogin?key=XXXXXX
```

The requester middleware grabs and stores the key, the app can ignore it.
