import type {APIGatewayProxyEventV2, Context} from 'aws-lambda';
import type {ApiLambdaError, ApiResult, Router} from './endpoint-types';
import type {Boom} from '@hapi/boom';
import {badImplementation, badRequest, clientTimeout} from '@hapi/boom';

export const boomApiError = (error: ApiLambdaError): Boom => (
    error.name === 'LambdaTimeoutError' ? clientTimeout()
        : error.name === 'ValidationError' ? badRequest(error.message)
            : 'isBoom' in error ? error
                : badImplementation(error)
);

export const apiGatewayHandler = async (event: APIGatewayProxyEventV2, context: Context, router: Router): Promise<ApiResult> => {
    try {
        const method = event.requestContext.http.method;
        const [path] = event.rawPath.split('/').reverse();

        const key = event.routeKey in router
            ? event.routeKey
            : `${method} /${path}`;

        const fnc = router[key];

        if (fnc.validator) {
            await fnc.validator(event);
        }

        return await fnc.handler(event, context);
    } catch (error) {
        const boomError = boomApiError(error as ApiLambdaError);
        const {statusCode, ...restBoomOutput} = boomError.output.payload;
        return {
            statusCode,
            body: JSON.stringify(restBoomOutput, null, 4),
        };
    }
};
