/* eslint-disable no-unused-vars */
import type {Boom} from '@hapi/boom';
import type {APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2} from 'aws-lambda';
import type {ValidationError} from 'joi';

export interface Endpoint<O, P extends unknown[]> {
    validator?: P extends []
        ? undefined
        : (event: APIGatewayProxyEventV2) => Promise<P>;
    handler: (event: APIGatewayProxyEventV2, ...parameters: P) => Promise<O>;
}

export type Router = Record<string, Endpoint<any, any>>;
export type ApiResult = APIGatewayProxyStructuredResultV2;

export type ApiLambdaError =
    | ValidationError
    | Boom
    | Error
    | TypeError
    | ReferenceError
    | RangeError
    | URIError
    | AggregateError
