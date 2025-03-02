import {queryDynamoDb} from './dynamo';

export interface SessionMetadata {
    username: string;
    guid: string;
    startTimestamp: string;
    stopTimestamp?: string;
}

export const getActiveSession = async (username: string): Promise<SessionMetadata | undefined> => {
    const ddbResult = await queryDynamoDb({
        TableName                : 'exercise-tracker-sessions',
        KeyConditionExpression   : 'username = :username',
        FilterExpression         : 'attribute_not_exists(stopTimestamp)',
        ExpressionAttributeValues: {
            ':username': username,
        },
    });

    const result = ddbResult.Items ? ddbResult.Items[0] as unknown as SessionMetadata : undefined;

    return result;
};
