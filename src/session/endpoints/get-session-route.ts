import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import type {GetSessionQuery, GetSessionResp} from './get-session-route-controller';
import {queryDynamoDb} from '../../shared/dynamo';
import {notFound} from '@hapi/boom';

export const getSessionRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<GetSessionResp> => {
    const {guid, username} = event.queryStringParameters as unknown as GetSessionQuery;

    const params = {
        TableName                : 'exercise-tracker-sessions',
        KeyConditionExpression   : 'username = :username AND guid = :guid',
        ExpressionAttributeValues: {
            ':username': username,
            ':guid'    : guid,
        },
    };

    const result = await queryDynamoDb(params);

    if (!result) {
        throw notFound();
    }

    return {session: result};
};
