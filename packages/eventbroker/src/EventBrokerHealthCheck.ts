
import type { HealthCheck } from 'jitar';

import type EventBroker from '@theshelf/eventbroker';

export default class EventBrokerHealthCheck implements HealthCheck
{
    readonly #eventBroker: EventBroker;
    readonly #name = 'database';
    readonly #timeout = 5000;

    constructor(eventBroker: EventBroker)
    {
        this.#eventBroker = eventBroker;
    }

    get name() { return this.#name; }

    get timeout() { return this.#timeout; }

    async isHealthy(): Promise<boolean>
    {
        return this.#eventBroker.connected;
    }
}
