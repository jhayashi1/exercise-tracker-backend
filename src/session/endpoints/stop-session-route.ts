import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {updateDynamoDb} from '../../shared/dynamo';
import {getUserDetailsFromEvent} from '../../shared/utils';
import type {StopSessionResp} from './stop-session-route-controller';
import {notFound} from '@hapi/boom';
import {getExistingSessions} from '../../shared/ddb-sessions';
import {ReturnValue} from '@aws-sdk/client-dynamodb';

export const stopSessionRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<StopSessionResp> => {
    const {username} = getUserDetailsFromEvent(event);
    const existingSessions = await getExistingSessions(username);

    if (!existingSessions.length) {
        throw notFound('Existing session not found');
    }

    const {guid, startTimestamp} = existingSessions[0];
    const endTimestamp = new Date().toISOString();

    const params = {
        TableName: 'exercise-tracker-sessions',
        Key      : {
            username,
            guid,
        },
        UpdateExpression         : 'set endTimestamp = :endTimestamp',
        ExpressionAttributeValues: {
            ':endTimestamp': endTimestamp,
        },
        ReturnValues: ReturnValue.ALL_NEW,
    };

    const _result = await updateDynamoDb(params);
    console.log(`successfully stopped session: ${guid}`);

    return {
        session: {
            guid,
            startTimestamp,
            endTimestamp,
        },
    };
};
