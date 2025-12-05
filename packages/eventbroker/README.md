
# Event Broker | Jitar Plugins

This package provides plugins for integrating the [The Shelf event broker package](https://github.com/MaskingTechnology/theshelf/tree/main/packages/eventbroker) in Jitar applications.

It contains a single health check for checking the event broker health.

## Installation

```bash
npm install @theshelf/eventbroker @jitar-plugins/eventbroker
```

## Usage

Follow the following steps to configure and use the provided health check.

### Step 1 - Configure the health check

```ts
// src/health/eventBrokerHealthCheck.ts

import eventBroker from '@theshelf/eventbroker';
import { EventBrokerHealthCheck } from '@jitar-plugins/eventbroker';

export default new EventBrokerHealthCheck(eventBroker);
```

### Step 2 - Activate the health check

With the health check in place, it needs to be activated by registering it to the worker / standalone service.

```json
/* services/some-worker.json */
{
    "url": "http://example.com:3000",
    "healthChecks": [ /* add health checks here */
        "./health/eventBrokerHealthCheck"
    ],
    "worker":
    {
        /* service configuration */
    }
}
```
