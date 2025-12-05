
# Notification | Jitar Plugins

This package provides plugins for integrating the [The Shelf notification package](https://github.com/MaskingTechnology/theshelf/tree/main/packages/notification) in Jitar applications.

It contains a single health check for checking the file store health.

## Installation

```bash
npm install @theshelf/notification @jitar-plugins/notification
```

## Usage

Follow the following steps to configure and use the provided health check.

### Step 1 - Configure the health check

```ts
// src/health/notificationHealthCheck.ts

import notificationService from '@theshelf/notification';
import { NotificationHealthCheck } from '@jitar-plugins/notification';

export default new NotificationHealthCheck(notificationService);
```

### Step 2 - Activate the health check

With the health check in place, it needs to be activated by registering it to the worker / standalone service.

```json
/* services/some-worker.json */
{
    "url": "http://example.com:3000",
    "healthChecks": [ /* add health checks here */
        "./health/notificationHealthCheck"
    ],
    "worker":
    {
        /* service configuration */
    }
}
```
