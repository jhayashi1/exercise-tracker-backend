import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {putDynamoDb} from '../../shared/dynamo';
import {getUserDetailsFromEvent} from '../../shared/utils';
import {generateGuid} from '../../shared/generate-guid';
import type {StartSessionResp} from './start-session-route-controller';
import {conflict} from '@hapi/boom';
import {getExistingSessions} from '../../shared/ddb-sessions';

export const startSessionRoute = async (event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<StartSessionResp> => {
    const {username} = getUserDetailsFromEvent(event);
    const existingSessions = await getExistingSessions(username);

    if (existingSessions.length) {
        throw conflict('User has existing session');
    }

    const guid = generateGuid();
    const startTimestamp = new Date().toISOString();
    const session = {
        username,
        guid,
        startTimestamp,
    };

    const params = {
        TableName: 'exercise-tracker-sessions',
        Item     : session,
    };

    const _result = await putDynamoDb(params);
    console.log(`successfully created: ${session}`);

    return {
        session: {
            guid,
            startTimestamp,
        },
    };
};
