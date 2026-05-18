
import type { Middleware, NextHandler, Request, Response } from 'jitar';
import { BadRequest } from 'jitar';

const ORIGIN_COOKIE_NAME = 'x-client-origin';

type Options = {
    path?: string
    sameSite?: string;
    secure?: boolean
}

export default class OriginMiddleware implements Middleware
{
    #path: string;
    #sameSite: string;
    #secure: boolean;

    constructor(options?: Options)
    {
        this.#path = options?.path ?? '/rpc';
        this.#sameSite = options?.sameSite ?? 'Strict';
        this.#secure = options?.secure ?? true;
    }

    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        let fromCookie = true;

        let origin = this.#getOriginFromCookie(request);

        if (origin === undefined)
        {
            fromCookie = false;

            origin = this.#getOriginFromHeader(request);
        }

        this.#validateOriginValue(origin);

        // The origin header is validated and set here for use in other middlewares
        request.setHeader('origin', origin!);

        const response = await next();

        if (fromCookie === false)
        {
            this.#setOriginCookie(response, origin as string);
        }

        return response;
    }

    #getOriginFromHeader(request: Request): string | undefined
    {
        return request.getHeader('origin');
    }

    #getOriginFromCookie(request: Request): string | undefined
    {
        const header = request.getHeader('cookie');

        if (header === undefined)
        {
            return;
        }

        for (const cookie of header.split(';'))
        {
            const [key, value] = cookie.split('=');

            if (key.trim() === ORIGIN_COOKIE_NAME) 
            {
                return value?.trim();
            }
        }
    }

    #validateOriginValue(value: string | undefined): void
    {
        if (value === undefined)
        {
            throw new BadRequest('Invalid origin');
        }

        try
        {
            new URL(value);
        }
        catch
        {
            throw new BadRequest('Invalid origin');
        }
    }

    #setOriginCookie(response: Response, origin: string): void
    {
        let cookie = `${ORIGIN_COOKIE_NAME}=${origin}; Path=${this.#path}; HttpOnly; SameSite=${this.#sameSite}`;

        if (this.#secure)
        {
            cookie += ' Secure';
        }
        
        response.setHeader('Set-Cookie', cookie);
    }
}
