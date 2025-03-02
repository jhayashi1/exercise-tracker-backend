import type {APIGatewayProxyEventV2WithJWTAuthorizer} from 'aws-lambda';

export const getUserDetailsFromEvent = (event: APIGatewayProxyEventV2WithJWTAuthorizer): Record<string, string> => {
    return {
        username : event.requestContext.authorizer.jwt?.claims.username as string ?? '',
        client_id: event.requestContext.authorizer.jwt?.claims.client_id as string ?? '',
    };
};
