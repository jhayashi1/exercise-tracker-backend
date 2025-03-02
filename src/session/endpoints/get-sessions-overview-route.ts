import type {APIGatewayProxyEventV2WithJWTAuthorizer, Context} from 'aws-lambda';
import {queryDynamoDb} from '../../shared/dynamo';
import type {SessionMetadata} from '../../shared/ddb-sessions';
import type {GetSessionsOverviewResp} from './get-sessions-overview-route-controller';
import {CognitoIdentityProviderClient, ListUsersCommand} from '@aws-sdk/client-cognito-identity-provider';

const LIMIT = 10;
const cognito = new CognitoIdentityProviderClient({region: 'us-east-1'});

export const listUsers = async (userPoolId: string): Promise<string[]> => {
    const command = new ListUsersCommand({
        UserPoolId: userPoolId,
    });

    const response = await cognito.send(command);
    return response.Users?.map((user) => user.Username ?? '') ?? [];
};

export const getSessionsOverviewRoute = async (_event: APIGatewayProxyEventV2WithJWTAuthorizer, _context: Context): Promise<GetSessionsOverviewResp> => {
    // const {username} = getUserDetailsFromEvent(event);
    const usernames = await listUsers(process.env.COGNITO_POOL_ID!);
    const sessions: SessionMetadata[] = [];

    for (const username of usernames) {
        const params = {
            TableName                : 'exercise-tracker-sessions',
            KeyConditionExpression   : 'username = :username',
            ExpressionAttributeValues: {
                ':username': username,
            },
            ScanIndexForward: false,
            Limit           : LIMIT,
        };

        const result = await queryDynamoDb(params);

        if (result && result.Items) {
            sessions.push(...(result.Items as SessionMetadata[]));
        }
    }

    return {sessions};
};
