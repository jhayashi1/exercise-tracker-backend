import {deleteDynamoDb, queryDynamoDb} from './dynamo';

export interface FriendMetadata {
    username: string;
    friendUsername: string;
    createdTimestamp: string;
}

export enum FriendRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
}

export interface FriendRequestMetadata {
    username: string;
    guid: string;
    friendUsername: string;
    status: FriendRequestStatus;
    createdTimestamp: string;
    updatedTimestamp?: string;
}

export const getFriend = async (username: string, friendUsername: string): Promise<string> => {
    const params = {
        TableName                : 'exercise-tracker-friends',
        KeyConditionExpression   : 'username = :username AND friendUsername = :friendUsername',
        ExpressionAttributeValues: {
            ':username'      : username,
            ':friendUsername': friendUsername,
        },
    };

    const result = await queryDynamoDb(params);

    return result.Items?.[0]?.friendUsername ?? '';
};

export const getFriends = async (username: string): Promise<string[]> => {
    const params = {
        TableName                : 'exercise-tracker-friends',
        KeyConditionExpression   : 'username = :username',
        ExpressionAttributeValues: {
            ':username': username,
        },
    };

    const result = await queryDynamoDb(params);

    return result.Items?.map((friend) => friend.friendUsername) ?? [];
};

export const getFriendRequest = async (guid: string): Promise<FriendRequestMetadata> => {
    const params = {
        TableName                : 'exercise-tracker-friend-requests',
        IndexName                : 'guid-index',
        KeyConditionExpression   : 'guid = :guid',
        ExpressionAttributeValues: {
            ':guid': guid,
        },
    };

    const result = await queryDynamoDb(params);

    return result.Items?.[0] as unknown as FriendRequestMetadata ?? {};
};

export const checkPendingRequests = async (username: string, friendUsername: string): Promise<boolean> => {
    const params1 = {
        TableName                : 'exercise-tracker-friend-requests',
        IndexName                : 'friend-username-index',
        KeyConditionExpression   : 'username = :username AND friendUsername = :friendUsername',
        ExpressionAttributeValues: {
            ':friendUsername': friendUsername,
            ':username'      : username,
        },
    };

    const params2 = {
        ...params1,
        ExpressionAttributeValues: {
            ':friendUsername': username,
            ':username'      : friendUsername,
        },
    };

    const result1 = await queryDynamoDb(params1);
    const result2 = await queryDynamoDb(params2);

    const allResults = [...(result1.Items ?? []), ...(result2.Items ?? [])];

    return Boolean(allResults.filter((request) => request.status === 'pending').length);
};

export const getPendingRequests = async (username: string): Promise<FriendRequestMetadata[]> => {
    const params = {
        TableName                : 'exercise-tracker-friend-requests',
        KeyConditionExpression   : 'friendUsername = :friendUsername',
        FilterExpression         : '#status = :status',
        ExpressionAttributeValues: {
            ':friendUsername': username,
            ':status'        : FriendRequestStatus.PENDING,
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };

    const result = await queryDynamoDb(params);

    return result.Items as unknown as FriendRequestMetadata[] ?? [];
};

export const removeFriend = async (username: string, friendUsername: string): Promise<void> => {
    const params1 = {
        TableName: 'exercise-tracker-friends',
        Key      : {
            username      : username,
            friendUsername: friendUsername,
        },
    };

    const params2 = {
        TableName: 'exercise-tracker-friends',
        Key      : {
            username      : friendUsername,
            friendUsername: username,
        },
    };

    await deleteDynamoDb(params1);
    await deleteDynamoDb(params2);
};
