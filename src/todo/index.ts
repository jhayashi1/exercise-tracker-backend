import type {APIGatewayEventRequestContextV2WithAuthorizer, APIGatewayProxyEventV2WithRequestContext, Context} from 'aws-lambda';
import {GetRouteController} from './endpoints/get-route-controller';

export interface Authorizer {
    authorizer: {
        jwt?: {
            claims: {}
        }
    }
}
export type ApiEvent = APIGatewayProxyEventV2WithRequestContext<APIGatewayEventRequestContextV2WithAuthorizer<Authorizer>>;
export interface Endpoint<O, P extends unknown[]> {
    validator?: P extends []
        ? undefined
        : (event: ApiEvent) => Promise<P>;
    handler: (event: ApiEvent, ...parameters: P) => Promise<O>;
}
export type Router = Record<string, Endpoint<any, any>>;
const router: Router = {
    'GET /todo': GetRouteController,
};

export const handler = async (event: ApiEvent, context: Context): Promise<string> => {
    const method = event.requestContext.http.method;
    const [path] = event.rawPath.split('/').reverse();

    const key = event.routeKey in router
        ? event.routeKey
        : `${method} /${path}`;

    const fnc = router[key];
    return await fnc.handler(event);
};
