
# File Store | Jitar Plugins

This package provides plugins for integrating the [The Shelf file store package](https://github.com/MaskingTechnology/theshelf/tree/main/packages/filestore) in Jitar applications.

It contains a single health check for checking the file store health.

## Installation

```bash
npm install @theshelf/filestore @jitar-plugins/filestore
```

## Usage

Follow the following steps to configure and use the provided health check.

### Step 1 - Configure the health check

```ts
// src/health/fileStoreHealthCheck.ts

import fileStore from '@theshelf/filestore';
import { FileStoreHealthCheck } from '@jitar-plugins/filestore';

export default new FileStoreHealthCheck(fileStore);
```

### Step 2 - Activate the health check

With the health check in place, it needs to be activated by registering it to the worker / standalone service.

```json
/* services/some-worker.json */
{
    "url": "http://example.com:3000",
    "healthChecks": [ /* add health checks here */
        "./health/fileStoreHealthCheck"
    ],
    "worker":
    {
        /* service configuration */
    }
}
```
