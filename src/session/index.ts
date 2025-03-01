import type {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context} from 'aws-lambda';
import {GetSessionRouteController} from './endpoints/get-session-route-controller';
import type {Endpoint} from '../shared/endpoint-types';
import type {Boom} from '@hapi/boom';
import {badRequest} from '@hapi/boom';
import {ValidationError} from 'joi';

export type Router = Record<string, Endpoint<any, any>>;
const router: Router = {
    'GET /session': GetSessionRouteController,
};

export const handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2 | string> => {
    const method = event.requestContext.http.method;
    const [path] = event.rawPath.split('/').reverse();

    const key = event.routeKey in router
        ? event.routeKey
        : `${method} /${path}`;

    const fnc = router[key];

    if (fnc.validator) {
        try {
            await fnc.validator(event);
        } catch (e) {
            const message = e instanceof ValidationError ? e : 'bad request';
            const errorResponse = badRequest<string>(message);
            const {statusCode, ...restBoomOutput} = errorResponse.output.payload;
            return JSON.stringify({
                statusCode,
                body: restBoomOutput,
            }, null, 4);
        }
    }

    return await fnc.handler(event, context);
};
