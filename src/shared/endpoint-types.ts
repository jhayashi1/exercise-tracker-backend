/* eslint-disable no-unused-vars */
import type {APIGatewayProxyEventV2} from 'aws-lambda';

export interface Endpoint<O, P extends unknown[]> {
    validator?: P extends []
        ? undefined
        : (event: APIGatewayProxyEventV2) => Promise<P>;
    handler: (event: APIGatewayProxyEventV2, ...parameters: P) => Promise<O>;
}
