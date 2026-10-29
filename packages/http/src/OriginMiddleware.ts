
import type { Middleware, NextHandler, Request, Response } from 'jitar';
import { BadRequest } from 'jitar';

export default class OriginMiddleware implements Middleware
{
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        const origin = this.#getOrigin(request);

        this.#validateOriginValue(origin);
        
        // The origin header is validated and set here for use in other middlewares
        request.setHeader('origin', origin);

        return next();
    }

    #getOrigin(request: Request): string
    {
        const host = request.getHeader('X-Forwarded-Host') ?? request.getHeader('Host');
        const protocol = request.getHeader('X-Forwarded-Proto');

        this.#validateHeaderValues(protocol, host);

        return `${protocol}://${host}`;
    }

    #validateHeaderValues(protocol?: string, host?: string): void
    {
        if (protocol === undefined)
        {
            throw new BadRequest('Missing protocol header');
        }
        
        if (host === undefined)
        {
            throw new BadRequest('Missing host header');
        }
    }

    #validateOriginValue(value: string): void
    {
        if (URL.canParse(value) === false)
        {
            throw new BadRequest('Invalid origin');
        }
    }
}
