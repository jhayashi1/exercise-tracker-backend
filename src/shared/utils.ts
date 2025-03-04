import {badRequest} from '@hapi/boom';
import type {APIGatewayProxyEventV2WithJWTAuthorizer} from 'aws-lambda';

export const getUserDetailsFromEvent = (event: APIGatewayProxyEventV2WithJWTAuthorizer): Record<string, string> => {
    return {
        username : event.requestContext.authorizer.jwt?.claims.username as string ?? '',
        client_id: event.requestContext.authorizer.jwt?.claims.client_id as string ?? '',
    };
};

export const parseEventBody = <T>(event: APIGatewayProxyEventV2WithJWTAuthorizer): T => {
    try {
        return JSON.parse(event.body ?? '{}') as T;
    } catch {
        throw badRequest('Invalid JSON');
    }
};
