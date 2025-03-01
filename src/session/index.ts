import type {APIGatewayProxyEventV2, Context} from 'aws-lambda';
import {GetRouteController} from './endpoints/get-route-controller';
import type {Endpoint} from '../shared/endpoint-types';

export type Router = Record<string, Endpoint<any, any>>;
const router: Router = {
    'GET /todo': GetRouteController,
};

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<string> => {
    const method = event.requestContext.http.method;
    const [path] = event.rawPath.split('/').reverse();

    const key = event.routeKey in router
        ? event.routeKey
        : `${method} /${path}`;

    const fnc = router[key];
    return await fnc.handler(event);
};
