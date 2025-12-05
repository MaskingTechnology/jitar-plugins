
# Database | Jitar Plugins

This package provides plugins for integrating the [The Shelf database package](https://github.com/MaskingTechnology/theshelf/tree/main/packages/database) in Jitar applications.

It contains a single health check for checking the database health.

## Installation

```bash
npm install @theshelf/database @jitar-plugins/database
```

## Usage

Follow the following steps to configure and use the provided health check.

### Step 1 - Configure the health check

```ts
// src/health/databaseHealthCheck.ts

import database from '@theshelf/database';
import { DatabaseHealthCheck } from '@jitar-plugins/database';

export default new DatabaseHealthCheck(database);
```

### Step 2 - Activate the health check

With the health check in place, it needs to be activated by registering it to the worker / standalone service.

```json
/* services/some-worker.json */
{
    "url": "http://example.com:3000",
    "healthChecks": [ /* add health checks here */
        "./health/databaseHealthCheck"
    ],
    "worker":
    {
        /* service configuration */
    }
}
```
