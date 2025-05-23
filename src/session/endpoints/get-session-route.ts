import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import type {GetSessionQuery, GetSessionResp} from './get-session-route-controller';
import {queryDynamoDb} from '../../shared/dynamo';
import {notFound} from '@hapi/boom';
import type {SessionMetadata} from '../../shared/ddb-sessions';

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

    if (!result.Items?.length) {
        throw notFound();
    }

    const session = result.Items[0] as unknown as SessionMetadata;

    return {session};
};
