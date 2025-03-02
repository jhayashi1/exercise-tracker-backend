import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {queryDynamoDb} from '../../shared/dynamo';
import {notFound} from '@hapi/boom';
import type {ListSessionsQuery, ListSessionsResp} from './list-sessions-route-controller';
import {getActiveSession, type SessionMetadata} from '../../shared/ddb-sessions';

const LIMIT = 10;

export const listSessionsRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<ListSessionsResp> => {
    const {username} = event.queryStringParameters as unknown as ListSessionsQuery;
    const activeSession = await getActiveSession(username);

    const params = {
        TableName                : 'exercise-tracker-sessions',
        KeyConditionExpression   : 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        },
        ScanIndexForward: false,
        Limit           : activeSession ? LIMIT - 1 : LIMIT,
    };

    const result = await queryDynamoDb(params);

    if (!result) {
        throw notFound();
    }

    const sessions = result.Items ? result.Items as unknown as SessionMetadata[] : [];

    if (activeSession) {
        sessions.unshift(activeSession);
    }

    return {sessions};
};
