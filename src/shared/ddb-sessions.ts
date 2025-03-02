import {queryDynamoDb} from './dynamo';

export interface SessionMetadata {
    username: string;
    guid: string;
    startTimestamp: string;
    endTimestamp: string;
}

export const getExistingSessions = async (username: string): Promise<SessionMetadata[]> => {
    const ddbResult = await queryDynamoDb({
        TableName                : 'exercise-tracker-sessions',
        KeyConditionExpression   : 'username = :username',
        FilterExpression         : 'attribute_not_exists(endTimestamp)',
        ExpressionAttributeValues: {
            ':username': username,
        },
    });

    return ddbResult.Items as unknown as SessionMetadata;
};
